using System.Reflection;
using Frotas.API.Application.Common.Marker;

namespace Frotas.API.WebApi.Extensions
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
        .Where(t => t.IsClass && !t.IsAbstract)
        .Where(t => t.GetInterfaces().Any(i => transientServiceType.IsAssignableFrom(i) && i != transientServiceType))
        .SelectMany(t => t.GetInterfaces()
          .Where(i => i != transientServiceType && i != scopedServiceType && i != singletonServiceType && i.Name.StartsWith("I") && i != typeof(object) && transientServiceType.IsAssignableFrom(i))
          .Select(i => new { Service = i, Implementation = t }))
        .Distinct();
      
      // Log para debug - verificar se AbastecimentoService está sendo encontrado
      var abastecimentoTypes = AppDomain.CurrentDomain.GetAssemblies()
        .SelectMany(s => s.GetTypes())
        .Where(t => t.Name.Contains("Abastecimento") && !t.IsAbstract)
        .ToList();
      Console.WriteLine($"🔍 Tipos encontrados com 'Abastecimento': {abastecimentoTypes.Count}");
      foreach (var type in abastecimentoTypes)
      {
        var interfaces = type.GetInterfaces().Where(i => i.Name.StartsWith("I") && i != transientServiceType).ToList();
        Console.WriteLine($"  - {type.Name} (IsClass: {type.IsClass}, Interfaces: {string.Join(", ", interfaces.Select(i => i.Name))})");
      }

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
        // Verificar se a interface do serviço implementa ITransientService (direta ou indiretamente)
        if (transientService.Service != null && transientServiceType.IsAssignableFrom(transientService.Service))
        {
          _ = services.AddTransient(transientService.Service, transientService.Implementation);
          // Log para verificar se IAbastecimentoService está sendo registrado
          if (transientService.Service.Name.Contains("Abastecimento"))
          {
            Console.WriteLine($"✅ Registrado: {transientService.Service.Name} -> {transientService.Implementation.Name}");
          }
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
