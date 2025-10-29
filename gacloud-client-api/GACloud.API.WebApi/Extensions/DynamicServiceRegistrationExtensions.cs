using System.Reflection;
using GACloud.API.Application.Common.Marker;

namespace GACloud.API.WebApi.Extensions
{
  public static class DynamicServiceRegistrationExtensions
  {
    // auto registration of services with lifecycles Transient/Scoped
    // -- instead of having to manually register each service, this will find the classes that implement ITransientService or IScopedService interfaces and register them

    public static IServiceCollection AddServices(this IServiceCollection services)
    {
      // Get all loaded assemblies for service scanning
      Assembly[] assemblies = AppDomain.CurrentDomain.GetAssemblies();
      LogLoadedAssemblies(assemblies);

      Type transientServiceType = typeof(ITransientService);
      Type scopedServiceType = typeof(IScopedService);
      Type singletonServiceType = typeof(ISingletonService);

      var transientServices = AppDomain
        .CurrentDomain.GetAssemblies()
        .SelectMany(s => s.GetTypes())
        .Where(transientServiceType.IsAssignableFrom)
        .Where(t => t.IsClass && !t.IsAbstract)
        .Select(t => new { Service = t.GetInterfaces().FirstOrDefault(), Implementation = t })
        .Where(t => t.Service != null);

      var scopedServices = AppDomain
        .CurrentDomain.GetAssemblies()
        .SelectMany(s => s.GetTypes())
        .Where(scopedServiceType.IsAssignableFrom)
        .Where(t => t.IsClass && !t.IsAbstract)
        .Select(t => new { Service = t.GetInterfaces().FirstOrDefault(), Implementation = t })
        .Where(t => t.Service != null);

      var singletonServices = AppDomain
        .CurrentDomain.GetAssemblies()
        .SelectMany(s => s.GetTypes())
        .Where(singletonServiceType.IsAssignableFrom)
        .Where(t => t.IsClass && !t.IsAbstract)
        .Select(t => new { Service = t.GetInterfaces().FirstOrDefault(), Implementation = t })
        .Where(t => t.Service != null);

      foreach (var transientService in transientServices)
      {
        if (transientServiceType.IsAssignableFrom(transientService.Service))
        {
          _ = services.AddTransient(transientService.Service, transientService.Implementation);
        }
      }

      foreach (var scopedService in scopedServices)
      {
        if (scopedServiceType.IsAssignableFrom(scopedService.Service))
        {
          _ = services.AddScoped(scopedService.Service, scopedService.Implementation);
        }
      }

      foreach (var singletonService in singletonServices)
      {
        if (singletonServiceType.IsAssignableFrom(singletonService.Service))
        {
          _ = services.AddSingleton(singletonService.Service, singletonService.Implementation);
        }
      }

      return services;
    }

    private static void LogLoadedAssemblies(Assembly[] assemblies)
    {
      Console.WriteLine($"Total assemblies found: {assemblies.Length}");
      foreach (Assembly assembly in assemblies)
      {
        Console.WriteLine($"Loaded assembly: {assembly.FullName}");
      }
    }
  }
}
