using System.Net;
using System.Text;
using GSLP.Application.Common.Wrapper;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Options;

namespace GSLP.WebApi.Middleware
{
  public class RateLimitingMiddleware
  {
    private readonly RequestDelegate _next;
    private readonly IMemoryCache _cache;
    private readonly RateLimitingOptions _options;

    public RateLimitingMiddleware(
      RequestDelegate next,
      IMemoryCache cache,
      IOptions<RateLimitingOptions> options
    )
    {
      _next = next;
      _cache = cache;
      _options = options.Value;
    }

    public async Task InvokeAsync(HttpContext context)
    {
      // Skip rate limiting for certain paths if configured
      if (ShouldSkipRateLimit(context.Request.Path))
      {
        await _next(context);
        return;
      }

      // Get client IP address
      string clientIp = GetClientIpAddress(context);

      // Create cache key based on IP and endpoint
      string cacheKey = $"rate_limit_{clientIp}_{context.Request.Path}";

      // Get or create request count
      if (!_cache.TryGetValue(cacheKey, out RateLimitInfo? rateLimitInfo))
      {
        rateLimitInfo = new RateLimitInfo { RequestCount = 1, WindowStartTime = DateTime.UtcNow };

        var cacheEntryOptions = new MemoryCacheEntryOptions
        {
          AbsoluteExpirationRelativeToNow = TimeSpan.FromSeconds(_options.WindowSeconds),
        };

        _cache.Set(cacheKey, rateLimitInfo, cacheEntryOptions);
      }
      else
      {
        // Check if we're still in the same time window
        TimeSpan elapsed = DateTime.UtcNow - rateLimitInfo.WindowStartTime;
        if (elapsed.TotalSeconds >= _options.WindowSeconds)
        {
          // Reset the window
          rateLimitInfo.RequestCount = 1;
          rateLimitInfo.WindowStartTime = DateTime.UtcNow;
        }
        else
        {
          // Increment request count
          rateLimitInfo.RequestCount++;
        }

        // Update cache with new values
        var cacheEntryOptions = new MemoryCacheEntryOptions
        {
          AbsoluteExpirationRelativeToNow = TimeSpan.FromSeconds(_options.WindowSeconds),
        };
        _cache.Set(cacheKey, rateLimitInfo, cacheEntryOptions);
      }

      // Check if limit exceeded
      if (rateLimitInfo.RequestCount > _options.MaxRequests)
      {
        // Calculate retry after seconds
        TimeSpan remainingWindow =
          TimeSpan.FromSeconds(_options.WindowSeconds)
          - (DateTime.UtcNow - rateLimitInfo.WindowStartTime);
        int retryAfter = (int)Math.Ceiling(remainingWindow.TotalSeconds);

        // Set rate limit headers
        context.Response.Headers.Add("X-RateLimit-Limit", _options.MaxRequests.ToString());
        context.Response.Headers.Add(
          "X-RateLimit-Remaining",
          Math.Max(0, _options.MaxRequests - rateLimitInfo.RequestCount).ToString()
        );
        context.Response.Headers.Add(
          "X-RateLimit-Reset",
          rateLimitInfo.WindowStartTime.AddSeconds(_options.WindowSeconds).ToString("R")
        );
        context.Response.Headers.Add("Retry-After", retryAfter.ToString());

        // Return 429 Too Many Requests
        context.Response.StatusCode = (int)HttpStatusCode.TooManyRequests;
        context.Response.ContentType = "application/json";

        Response response = Response.Fail(
          $"Muitas solicitações. Limite de {_options.MaxRequests} solicitações por {_options.WindowSeconds} segundos. Tente novamente em {retryAfter} segundos."
        );

        await context.Response.WriteAsJsonAsync(response);
        return;
      }

      // Set rate limit headers for successful requests
      context.Response.Headers.Add("X-RateLimit-Limit", _options.MaxRequests.ToString());
      context.Response.Headers.Add(
        "X-RateLimit-Remaining",
        Math.Max(0, _options.MaxRequests - rateLimitInfo.RequestCount).ToString()
      );
      context.Response.Headers.Add(
        "X-RateLimit-Reset",
        rateLimitInfo.WindowStartTime.AddSeconds(_options.WindowSeconds).ToString("R")
      );

      // Continue to next middleware
      await _next(context);
    }

    private bool ShouldSkipRateLimit(PathString path)
    {
      // Skip rate limiting for health checks or other specific paths if needed
      if (_options.ExcludedPaths != null && _options.ExcludedPaths.Any())
      {
        return _options.ExcludedPaths.Any(excludedPath =>
          path.StartsWithSegments(excludedPath, StringComparison.OrdinalIgnoreCase)
        );
      }

      return false;
    }

    private string GetClientIpAddress(HttpContext context)
    {
      // Check for forwarded IP (when behind proxy/load balancer)
      string? forwardedFor = context.Request.Headers["X-Forwarded-For"].FirstOrDefault();
      if (!string.IsNullOrEmpty(forwardedFor))
      {
        // X-Forwarded-For can contain multiple IPs, take the first one
        string[] ips = forwardedFor.Split(',', StringSplitOptions.RemoveEmptyEntries);
        if (ips.Length > 0)
        {
          return ips[0].Trim();
        }
      }

      // Check for real IP header
      string? realIp = context.Request.Headers["X-Real-IP"].FirstOrDefault();
      if (!string.IsNullOrEmpty(realIp))
      {
        return realIp.Trim();
      }

      // Fallback to connection remote IP
      return context.Connection.RemoteIpAddress?.ToString() ?? "unknown";
    }

    private class RateLimitInfo
    {
      public int RequestCount { get; set; }
      public DateTime WindowStartTime { get; set; }
    }
  }

  public class RateLimitingOptions
  {
    public const string SectionName = "RateLimiting";

    /// <summary>
    /// Maximum number of requests allowed per window
    /// </summary>
    public int MaxRequests { get; set; } = 100;

    /// <summary>
    /// Time window in seconds
    /// </summary>
    public int WindowSeconds { get; set; } = 60;

    /// <summary>
    /// Paths to exclude from rate limiting (e.g., health checks)
    /// </summary>
    public List<string>? ExcludedPaths { get; set; }
  }
}
