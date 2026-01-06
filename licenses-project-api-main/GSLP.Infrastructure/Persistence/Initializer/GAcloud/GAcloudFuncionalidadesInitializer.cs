using GSLP.Domain.Entities.Catalog.Application;
using GSLP.Infrastructure.Persistence.Contexts;

namespace GSLP.Infrastructure.Persistence.Initializer.GAcloud
{
  public class GAcloudFuncionalidadesInitializer : IDbInitializer
  {
    public void Initialize(ApplicationDbContext context)
    {
      Funcionalidade[] funcionalidades =
      [
        // Funcionalidades for GAcloud - Base module
        new()
        {
          Id = Guid.Parse("00000003-0002-0000-0001-000000000001"),
          Nome = "Gestão de países",
          Descricao = "Gestão de países",
          Ativo = true,
          CreatedBy = Guid.Parse("1b77edb4-ae80-46b5-a388-d033eeddac1d"),
          CreatedOn = new DateTime(2025, 04, 16, 12, 42, 56, 217, DateTimeKind.Utc).AddTicks(4411),
          ModuloId = Guid.Parse("00000003-0002-0000-0000-000000000001"),
        },
        new()
        {
          Id = Guid.Parse("00000003-0002-0000-0002-000000000001"),
          Nome = "Gestão de distritos",
          Descricao = "Gestão de distritos",
          Ativo = true,
          CreatedBy = Guid.Parse("1b77edb4-ae80-46b5-a388-d033eeddac1d"),
          CreatedOn = new DateTime(2025, 04, 16, 12, 50, 30, 336, DateTimeKind.Utc).AddTicks(4910),
          ModuloId = Guid.Parse("00000003-0002-0000-0000-000000000001"),
        },
        new()
        {
          Id = Guid.Parse("00000003-0002-0000-0003-000000000001"),
          Nome = "Gestão de concelhos",
          Descricao = "Gestão de concelhos",
          Ativo = true,
          CreatedBy = Guid.Parse("1b77edb4-ae80-46b5-a388-d033eeddac1d"),
          CreatedOn = new DateTime(2025, 04, 16, 12, 50, 48, 936, DateTimeKind.Utc).AddTicks(3968),
          ModuloId = Guid.Parse("00000003-0002-0000-0000-000000000001"),
        },
        new()
        {
          Id = Guid.Parse("00000003-0002-0000-0004-000000000001"),
          Nome = "Gestão de freguesias",
          Descricao = "Gestão de freguesias",
          Ativo = true,
          CreatedBy = Guid.Parse("1b77edb4-ae80-46b5-a388-d033eeddac1d"),
          CreatedOn = new DateTime(2025, 04, 16, 13, 28, 40, 588, DateTimeKind.Utc).AddTicks(8632),
          ModuloId = Guid.Parse("00000003-0002-0000-0000-000000000001"),
        },
        new()
        {
          Id = Guid.Parse("00000003-0002-0000-0005-000000000001"),
          Nome = "Gestão de códigos postais",
          Descricao = "Gestão de códigos postais",
          Ativo = true,
          CreatedBy = Guid.Parse("1b77edb4-ae80-46b5-a388-d033eeddac1d"),
          CreatedOn = new DateTime(2025, 04, 17, 08, 01, 25, 829, DateTimeKind.Utc).AddTicks(2394),
          ModuloId = Guid.Parse("00000003-0002-0000-0000-000000000001"),
        },
        new()
        {
          Id = Guid.Parse("00000003-0002-0000-0006-000000000001"),
          Nome = "Gestão de ruas",
          Descricao = "Gestão de ruas",
          Ativo = true,
          CreatedBy = Guid.Parse("1b77edb4-ae80-46b5-a388-d033eeddac1d"),
          CreatedOn = new DateTime(2025, 04, 17, 08, 01, 35, 240, DateTimeKind.Utc).AddTicks(7520),
          ModuloId = Guid.Parse("00000003-0002-0000-0000-000000000001"),
        },
        new()
        {
          Id = Guid.Parse("00000003-0002-0000-0007-000000000001"),
          Nome = "Gestão de épocas",
          Descricao = "Gestão de épocas",
          Ativo = true,
          CreatedBy = Guid.Parse("1b77edb4-ae80-46b5-a388-d033eeddac1d"),
          CreatedOn = new DateTime(2025, 04, 17, 08, 01, 44, 974, DateTimeKind.Utc).AddTicks(7555),
          ModuloId = Guid.Parse("00000003-0002-0000-0000-000000000001"),
        },
        new()
        {
          Id = Guid.Parse("00000003-0002-0000-0008-000000000001"),
          Nome = "Gestão de rubricas",
          Descricao = "Gestão de rubricas",
          Ativo = true,
          CreatedBy = Guid.Parse("1b77edb4-ae80-46b5-a388-d033eeddac1d"),
          CreatedOn = new DateTime(2025, 06, 02, 13, 29, 26, 466, DateTimeKind.Utc).AddTicks(8387),
          ModuloId = Guid.Parse("00000003-0002-0000-0000-000000000001"),
        },
        new()
        {
          Id = Guid.Parse("00000003-0002-0000-0009-000000000001"),
          Nome = "Gestão de estados civis",
          Descricao = "Gestão de estados civis",
          Ativo = true,
          CreatedBy = Guid.Parse("1b77edb4-ae80-46b5-a388-d033eeddac1d"),
          CreatedOn = new DateTime(2025, 06, 16, 10, 36, 20, 368, DateTimeKind.Utc).AddTicks(7912),
          ModuloId = Guid.Parse("00000003-0002-0000-0000-000000000001"),
        },
        new()
        {
          Id = Guid.Parse("00000003-0002-0000-0010-000000000001"),
          Nome = "Gestão de entidades",
          Descricao = "Gestão de entidades",
          Ativo = true,
          CreatedBy = Guid.Parse("1b77edb4-ae80-46b5-a388-d033eeddac1d"),
          CreatedOn = new DateTime(2025, 06, 17, 10, 58, 12, 061, DateTimeKind.Utc).AddTicks(3841),
          ModuloId = Guid.Parse("00000003-0002-0000-0000-000000000001"),
        },
        // Funcionalidades for GAcloud - Cemitérios module
        new()
        {
          Id = Guid.Parse("00000003-0002-0000-0001-000000000002"),
          Nome = "Gestão de cemitérios",
          Descricao = "Gestão de cemitérios",
          Ativo = true,
          CreatedBy = Guid.Parse("1b77edb4-ae80-46b5-a388-d033eeddac1d"),
          CreatedOn = new DateTime(2025, 04, 16, 15, 27, 31, 158, DateTimeKind.Utc).AddTicks(4302),
          ModuloId = Guid.Parse("00000003-0002-0000-0000-000000000002"),
        },
        new()
        {
          Id = Guid.Parse("00000003-0002-0000-0002-000000000002"),
          Nome = "Gestão de zonas de cemitérios",
          Descricao = "Gestão de zonas de cemitérios",
          Ativo = true,
          CreatedBy = Guid.Parse("1b77edb4-ae80-46b5-a388-d033eeddac1d"),
          CreatedOn = new DateTime(2025, 04, 21, 15, 23, 07, 774, DateTimeKind.Utc).AddTicks(2058),
          ModuloId = Guid.Parse("00000003-0002-0000-0000-000000000002"),
        },
        new()
        {
          Id = Guid.Parse("00000003-0002-0000-0003-000000000002"),
          Nome = "Gestão de talhões de cemitérios",
          Descricao = "Gestão de talhões de cemitérios",
          Ativo = true,
          CreatedBy = Guid.Parse("1b77edb4-ae80-46b5-a388-d033eeddac1d"),
          CreatedOn = new DateTime(2025, 05, 05, 12, 57, 24, 740, DateTimeKind.Utc).AddTicks(2255),
          ModuloId = Guid.Parse("00000003-0002-0000-0000-000000000002"),
        },
        new()
        {
          Id = Guid.Parse("00000003-0002-0000-0004-000000000002"),
          Nome = "Gestão de sepulturas",
          Descricao = "Gestão de sepulturas",
          Ativo = true,
          CreatedBy = Guid.Parse("1b77edb4-ae80-46b5-a388-d033eeddac1d"),
          CreatedOn = new DateTime(2025, 06, 05, 10, 22, 34, 431, DateTimeKind.Utc).AddTicks(820),
          ModuloId = Guid.Parse("00000003-0002-0000-0000-000000000002"),
        },
        new()
        {
          Id = Guid.Parse("00000003-0002-0000-0005-000000000002"),
          Nome = "Gestão de tipos de sepultura",
          Descricao = "Gestão de tipos de sepultura",
          Ativo = true,
          CreatedBy = Guid.Parse("1b77edb4-ae80-46b5-a388-d033eeddac1d"),
          CreatedOn = new DateTime(2025, 05, 28, 13, 32, 12, 107, DateTimeKind.Utc).AddTicks(1560),
          ModuloId = Guid.Parse("00000003-0002-0000-0000-000000000002"),
        },
        new()
        {
          Id = Guid.Parse("00000003-0002-0000-0006-000000000002"),
          Nome = "Gestão de descrições de tipos de sepultura",
          Descricao = "Gestão de descrições de tipos de sepultura",
          Ativo = true,
          CreatedBy = Guid.Parse("1b77edb4-ae80-46b5-a388-d033eeddac1d"),
          CreatedOn = new DateTime(2025, 05, 28, 10, 22, 34, 986, DateTimeKind.Utc).AddTicks(7948),
          ModuloId = Guid.Parse("00000003-0002-0000-0000-000000000002"),
        },
        new()
        {
          Id = Guid.Parse("00000003-0002-0000-0007-000000000002"),
          Nome = "Gestão de situações de sepultura",
          Descricao = "Gestão de situações de sepultura",
          Ativo = true,
          CreatedBy = Guid.Parse("1b77edb4-ae80-46b5-a388-d033eeddac1d"),
          CreatedOn = new DateTime(2025, 06, 06, 14, 48, 14, 907, DateTimeKind.Utc).AddTicks(8679),
          ModuloId = Guid.Parse("00000003-0002-0000-0000-000000000002"),
        },
        new()
        {
          Id = Guid.Parse("00000003-0002-0000-0008-000000000002"),
          Nome = "Gestão de estados de sepultura",
          Descricao = "Gestão de estados de sepultura",
          Ativo = true,
          CreatedBy = Guid.Parse("1b77edb4-ae80-46b5-a388-d033eeddac1d"),
          CreatedOn = new DateTime(2025, 06, 06, 16, 02, 08, 182, DateTimeKind.Utc).AddTicks(1564),
          ModuloId = Guid.Parse("00000003-0002-0000-0000-000000000002"),
        },
        new()
        {
          Id = Guid.Parse("00000003-0002-0000-0009-000000000002"),
          Nome = "Gestão de proprietários de sepulttura",
          Descricao = "Gestão de proprietários de sepulttura",
          Ativo = true,
          CreatedBy = Guid.Parse("1b77edb4-ae80-46b5-a388-d033eeddac1d"),
          CreatedOn = new DateTime(2025, 06, 26, 09, 04, 58, 560, DateTimeKind.Utc).AddTicks(1936),
          ModuloId = Guid.Parse("00000003-0002-0000-0000-000000000002"),
        },
        new()
        {
          Id = Guid.Parse("00000003-0002-0000-0010-000000000002"),
          Nome = "Gestão de mapas de cemitério",
          Descricao = "Gestão de mapas de cemitério",
          Ativo = true,
          CreatedBy = Guid.Parse("1b77edb4-ae80-46b5-a388-d033eeddac1d"),
          CreatedOn = new DateTime(2025, 06, 27, 15, 56, 59, 674, DateTimeKind.Utc).AddTicks(8031),
          ModuloId = Guid.Parse("00000003-0002-0000-0000-000000000002"),
        },
        new()
        {
          Id = Guid.Parse("00000003-0002-0000-0011-000000000002"),
          Nome = "Gestão de coveiros",
          Descricao = "Gestão de coveiros",
          Ativo = true,
          CreatedBy = Guid.Parse("1b77edb4-ae80-46b5-a388-d033eeddac1d"),
          CreatedOn = new DateTime(2025, 07, 10, 14, 51, 26, 008, DateTimeKind.Utc).AddTicks(889),
          ModuloId = Guid.Parse("00000003-0002-0000-0000-000000000002"),
        },
        new()
        {
          Id = Guid.Parse("00000003-0002-0000-0012-000000000002"),
          Nome = "Gestão de agências funerárias",
          Descricao = "Gestão de agências funerárias",
          Ativo = true,
          CreatedBy = Guid.Parse("1b77edb4-ae80-46b5-a388-d033eeddac1d"),
          CreatedOn = new DateTime(2025, 10, 10, 14, 56, 12, 821, DateTimeKind.Utc).AddTicks(8114),
          ModuloId = Guid.Parse("00000003-0002-0000-0000-000000000002"),
        },
        new()
        {
          Id = Guid.Parse("00000003-0002-0000-0013-000000000002"),
          Nome = "Gestão de tipos de defunto",
          Descricao = "Gestão de tipos de defunto",
          Ativo = true,
          CreatedBy = Guid.Parse("1b77edb4-ae80-46b5-a388-d033eeddac1d"),
          CreatedOn = new DateTime(2025, 10, 13, 16, 14, 34, 056, DateTimeKind.Utc).AddTicks(5298),
          ModuloId = Guid.Parse("00000003-0002-0000-0000-000000000002"),
        },
        new()
        {
          Id = Guid.Parse("00000003-0002-0000-0014-000000000002"),
          Nome = "Gestão de defuntos",
          Descricao = "Gestão de defuntos",
          Ativo = true,
          CreatedBy = Guid.Parse("1b77edb4-ae80-46b5-a388-d033eeddac1d"),
          CreatedOn = new DateTime(2025, 10, 13, 16, 14, 45, 530, DateTimeKind.Utc).AddTicks(6632),
          ModuloId = Guid.Parse("00000003-0002-0000-0000-000000000002"),
        },
        new()
        {
          Id = Guid.Parse("00000003-0002-0000-0015-000000000002"),
          Nome = "Gestão de transferências",
          Descricao = "Gestão de transferências",
          Ativo = true,
          CreatedBy = Guid.Parse("1b77edb4-ae80-46b5-a388-d033eeddac1d"),
          CreatedOn = new DateTime(2025, 12, 23, 14, 26, 45, 530, DateTimeKind.Utc).AddTicks(6632),
          ModuloId = Guid.Parse("00000003-0002-0000-0000-000000000002"),
        },
        new()
        {
          Id = Guid.Parse("00000003-0002-0000-0016-000000000002"),
          Nome = "Gestão de transladações",
          Descricao = "Gestão de transladações",
          Ativo = true,
          CreatedBy = Guid.Parse("1b77edb4-ae80-46b5-a388-d033eeddac1d"),
          CreatedOn = new DateTime(2025, 12, 23, 14, 26, 45, 530, DateTimeKind.Utc).AddTicks(6632),
          ModuloId = Guid.Parse("00000003-0002-0000-0000-000000000002"),
        },
        new()
        {
          Id = Guid.Parse("00000003-0002-0000-0017-000000000002"),
          Nome = "Gestão de exumações",
          Descricao = "Gestão de exumações",
          Ativo = true,
          CreatedBy = Guid.Parse("1b77edb4-ae80-46b5-a388-d033eeddac1d"),
          CreatedOn = new DateTime(2025, 12, 23, 14, 26, 45, 530, DateTimeKind.Utc).AddTicks(6632),
          ModuloId = Guid.Parse("00000003-0002-0000-0000-000000000002"),
        },
        new()
        {
          Id = Guid.Parse("00000003-0002-0000-0018-000000000002"),
          Nome = "Gestão de inumações",
          Descricao = "Gestão de inumações",
          Ativo = true,
          CreatedBy = Guid.Parse("1b77edb4-ae80-46b5-a388-d033eeddac1d"),
          CreatedOn = new DateTime(2025, 12, 23, 14, 26, 45, 530, DateTimeKind.Utc).AddTicks(6632),
          ModuloId = Guid.Parse("00000003-0002-0000-0000-000000000002"),
        },
        new()
        {
          Id = Guid.Parse("00000003-0002-0000-0019-000000000002"),
          Nome = "Gestão de processos e movimentações",
          Descricao = "Gestão de processos e movimentações",
          Ativo = true,
          CreatedBy = Guid.Parse("1b77edb4-ae80-46b5-a388-d033eeddac1d"),
          CreatedOn = new DateTime(2025, 12, 23, 14, 26, 45, 530, DateTimeKind.Utc).AddTicks(6632),
          ModuloId = Guid.Parse("00000003-0002-0000-0000-000000000002"),
        },
        // Funcionalidades for GAcloud - Canídeos module
        new()
        {
          Id = Guid.Parse("00000003-0002-0000-0001-000000000003"),
          Nome = "Gestão de canídeos",
          Descricao = "Gestão de canídeos",
          Ativo = true,
          CreatedBy = Guid.Parse("1b77edb4-ae80-46b5-a388-d033eeddac1d"),
          CreatedOn = new DateTime(2025, 04, 16, 15, 55, 36, 778, DateTimeKind.Utc).AddTicks(4506),
          ModuloId = Guid.Parse("00000003-0002-0000-0000-000000000003"),
        },
        // Funcionalidades for GAcloud - Reports module
        new()
        {
          Id = Guid.Parse("00000003-0002-0000-0001-000000000004"),
          Nome = "Listagem de reports",
          Descricao = "Listagem de reports",
          Ativo = true,
          CreatedBy = Guid.Parse("1b77edb4-ae80-46b5-a388-d033eeddac1d"),
          CreatedOn = new DateTime(2025, 11, 14, 13, 50, 21, 810, DateTimeKind.Utc).AddTicks(3710),
          ModuloId = Guid.Parse("00000003-0002-0000-0000-000000000004"),
        },
        new()
        {
          Id = Guid.Parse("00000003-0002-0000-0002-000000000004"),
          Nome = "Designer de criação e edição de reports",
          Descricao = "Designer de criação e edição de reports",
          Ativo = true,
          CreatedBy = Guid.Parse("1b77edb4-ae80-46b5-a388-d033eeddac1d"),
          CreatedOn = new DateTime(2025, 11, 14, 13, 51, 21, 491, DateTimeKind.Utc).AddTicks(944),
          ModuloId = Guid.Parse("00000003-0002-0000-0000-000000000004"),
        },
        new()
        {
          Id = Guid.Parse("00000003-0002-0000-0003-000000000004"),
          Nome = "Visualização de reports",
          Descricao = "Visualização de reports",
          Ativo = true,
          CreatedBy = Guid.Parse("1b77edb4-ae80-46b5-a388-d033eeddac1d"),
          CreatedOn = new DateTime(2025, 11, 14, 13, 51, 37, 248, DateTimeKind.Utc).AddTicks(9544),
          ModuloId = Guid.Parse("00000003-0002-0000-0000-000000000004"),
        },
        // Funcionalidades for GAcloud - Editor de Texto module
        new()
        {
          Id = Guid.Parse("00000003-0002-0000-0001-000000000005"),
          Nome = "Editor de Texto",
          Descricao = "Editor de Texto",
          Ativo = true,
          CreatedBy = Guid.Parse("1b77edb4-ae80-46b5-a388-d033eeddac1d"),
          CreatedOn = new DateTime(2025, 12, 19, 10, 0, 0, 0, DateTimeKind.Utc),
          ModuloId = Guid.Parse("00000003-0002-0000-0000-000000000005"),
        },
      ];

      // Get existing funcionalidade IDs to avoid duplicates
      List<Guid> existingFuncionalidadeIds = context.Funcionalidades.Select(f => f.Id).ToList();

      // Only add funcionalidades that don't already exist (by ID)
      List<Funcionalidade> funcionalidadesToAdd =
      [
        .. funcionalidades.Where(f => !existingFuncionalidadeIds.Contains(f.Id)),
      ];

      if (funcionalidadesToAdd.Count != 0)
      {
        context.Funcionalidades.AddRange(funcionalidadesToAdd);
      }
    }
  }
}
