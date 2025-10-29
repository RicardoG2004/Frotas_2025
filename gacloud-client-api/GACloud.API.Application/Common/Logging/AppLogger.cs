using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace GACloud.API.Application.Common.Logging
{
  // This class handles logging based on environment
  public class AppLogger
  {
    private readonly IHostEnvironment _env;
    private readonly ILogger<AppLogger> _logger;

    // Log delegates for various log levels
    public static readonly Action<ILogger, string, Exception?> LogWarning =
      LoggerMessage.Define<string>(LogLevel.Warning, new EventId(1, "Warning"), "{Message}");

    public static readonly Action<ILogger, string, Exception?> LogError =
      LoggerMessage.Define<string>(LogLevel.Error, new EventId(2, "Error"), "{Message}");

    public static readonly Action<ILogger, string, Exception?> LogInfo =
      LoggerMessage.Define<string>(LogLevel.Information, new EventId(3, "Info"), "{Message}");

    public static readonly Action<ILogger, string, Exception?> LogDebug =
      LoggerMessage.Define<string>(LogLevel.Debug, new EventId(4, "Debug"), "{Message}");

    public static readonly Action<ILogger, string, Exception?> LogCritical =
      LoggerMessage.Define<string>(LogLevel.Critical, new EventId(5, "Critical"), "{Message}");

    // Constructor: Injecting ILogger and IHostEnvironment via DI
    public AppLogger(ILogger<AppLogger> logger, IHostEnvironment env)
    {
      _logger = logger;
      _env = env;
    }

    // Log method that determines whether to log with the exception or just the message
    private void LogWithEnvironmentCheck(
      string message,
      Exception? exception,
      Action<ILogger, string, Exception?> logAction
    )
    {
      if (_env.IsDevelopment())
      {
        logAction(_logger, message, exception); // Log full exception in Development
      }
      else
      {
        logAction(_logger, message, null); // Log just the message in non-Development
      }
    }

    // Log Error with environment check (development or non-development)
    public void LogErrorWithException(string message, Exception exception)
    {
      LogWithEnvironmentCheck(message, exception, LogError);
    }

    // Log Warning with environment check
    public void LogWarningWithException(string message, Exception exception)
    {
      LogWithEnvironmentCheck(message, exception, LogWarning);
    }

    // Log Info with environment check
    public void LogInfoWithException(string message, Exception exception)
    {
      LogWithEnvironmentCheck(message, exception, LogInfo);
    }

    // Log Debug with environment check
    public void LogDebugWithException(string message, Exception exception)
    {
      LogWithEnvironmentCheck(message, exception, LogDebug);
    }

    // Log Critical with environment check
    public void LogCriticalWithException(string message, Exception exception)
    {
      LogWithEnvironmentCheck(message, exception, LogCritical);
    }

    // Method for logging success (with just a message)
    public void LogSuccess(string message)
    {
      LogInfoWithMessage(message);
    }

    // Log just a message (without an exception)
    public void LogErrorWithMessage(string message)
    {
      LogWithEnvironmentCheck(message, null, LogError);
    }

    public void LogWarningWithMessage(string message)
    {
      LogWithEnvironmentCheck(message, null, LogWarning);
    }

    public void LogInfoWithMessage(string message)
    {
      LogWithEnvironmentCheck(message, null, LogInfo);
    }

    public void LogDebugWithMessage(string message)
    {
      LogWithEnvironmentCheck(message, null, LogDebug);
    }

    public void LogCriticalWithMessage(string message)
    {
      LogWithEnvironmentCheck(message, null, LogCritical);
    }

    // New method for logging requests (with route, method, and status)
    public void LogRequest(
      string route,
      string method,
      int statusCode,
      string? additionalMessage = null
    )
    {
      string logMessage = $"Request to {route} with method {method} returned status {statusCode}";

      if (!string.IsNullOrEmpty(additionalMessage))
      {
        logMessage += $". Message: {additionalMessage}";
      }

      LogInfoWithMessage(logMessage); // Use Info level for request logging
    }
  }
}
