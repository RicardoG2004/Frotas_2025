using GSLP.Domain.Entities.Catalog.Application;

namespace GSLP.Infrastructure.Persistence.Seeders
{
    public static class ModuloSeeder
    {
        public static List<Modulo> GetModulos()
        {
            return
            [
                new Modulo
                {
                    Id = Guid.Parse("e1f5ad3a-cd16-4c27-97a9-d426fa5e7bfa"),
                    Nome = "ExpenseTracker",
                    Descricao = "Tracks user expenses and categorizes them.",
                    Ativo = true,
                    AplicacaoId = Guid.Parse("aee9b3a5-c4b5-4c7a-8e33-408ed58c9ef3"), // AplicacaoId matches
                    CreatedBy = Guid.Parse("1b77edb4-ae80-46b5-a388-d033eeddac1d"),
                    CreatedOn = new DateTime(2024, 12, 6, 10, 32, 18, DateTimeKind.Utc),
                },
                new Modulo
                {
                    Id = Guid.Parse("24e8efcc-9d68-4a7d-b132-b8fc2e7d57c4"),
                    Nome = "ReportGenerator",
                    Descricao = "Generates detailed reports for expenses.",
                    Ativo = true,
                    AplicacaoId = Guid.Parse("aee9b3a5-c4b5-4c7a-8e33-408ed58c9ef3"), // Same AplicacaoId
                    CreatedBy = Guid.Parse("1b77edb4-ae80-46b5-a388-d033eeddac1d"),
                    CreatedOn = new DateTime(2024, 12, 6, 10, 32, 18, DateTimeKind.Utc),
                },
                // Modulos for Aplicacao "HealthTracker"
                new Modulo
                {
                    Id = Guid.Parse("c7e56a9c-1d3f-484d-bb6d-800f4c54a4a2"),
                    Nome = "StepCounter",
                    Descricao = "Tracks the user's daily step count.",
                    Ativo = true,
                    AplicacaoId = Guid.Parse("ad4d9bdf-4609-44cc-8287-c02e7e372b1f"), // AplicacaoId matches
                    CreatedBy = Guid.Parse("1b77edb4-ae80-46b5-a388-d033eeddac1d"),
                    CreatedOn = new DateTime(2024, 12, 6, 10, 32, 18, DateTimeKind.Utc),
                },
                // Modulos for Aplicacao "PhotoEditorPro"
                new Modulo
                {
                    Id = Guid.Parse("a1d5b2e3-d419-4e79-88d2-d7037c38a97d"),
                    Nome = "BasicEditingTools",
                    Descricao = "Includes basic editing tools like crop and rotate.",
                    Ativo = true,
                    AplicacaoId = Guid.Parse("e0a0c087-97bc-46da-a54b-7463423ecdbf"), // AplicacaoId matches
                    CreatedBy = Guid.Parse("1b77edb4-ae80-46b5-a388-d033eeddac1d"),
                    CreatedOn = new DateTime(2024, 12, 6, 10, 32, 18, DateTimeKind.Utc),
                },
                new Modulo
                {
                    Id = Guid.Parse("5be376be-4bba-43f4-8f50-1ea3dfaa6d90"),
                    Nome = "AdvancedFilters",
                    Descricao = "Provides advanced filters and effects.",
                    Ativo = true,
                    AplicacaoId = Guid.Parse("e0a0c087-97bc-46da-a54b-7463423ecdbf"), // Same AplicacaoId
                    CreatedBy = Guid.Parse("1b77edb4-ae80-46b5-a388-d033eeddac1d"),
                    CreatedOn = new DateTime(2024, 12, 6, 10, 32, 18, DateTimeKind.Utc),
                },
                // Modulos for Aplicacao "TaskMaster"
                new Modulo
                {
                    Id = Guid.Parse("8e7ff57b-b3b0-45a0-88c5-e21c3f6c9602"),
                    Nome = "TaskList",
                    Descricao = "Manage your to-do tasks and track progress.",
                    Ativo = true,
                    AplicacaoId = Guid.Parse("e3a1a3c2-d0b2-40e7-b6f2-89776bbbd9f0"), // AplicacaoId matches
                    CreatedBy = Guid.Parse("1b77edb4-ae80-46b5-a388-d033eeddac1d"),
                    CreatedOn = new DateTime(2024, 12, 6, 10, 33, 18, DateTimeKind.Utc),
                },
                // Modulos for Aplicacao "NoteTaker"
                new Modulo
                {
                    Id = Guid.Parse("e0fba94c-b763-4de1-b60c-88e7d5b8c653"),
                    Nome = "NoteOrganizer",
                    Descricao = "Organize notes into categories for easy access.",
                    Ativo = true,
                    AplicacaoId = Guid.Parse("ad6f3fa2-9a11-4b6f-8b70-03c88834c4ae"), // AplicacaoId matches
                    CreatedBy = Guid.Parse("1b77edb4-ae80-46b5-a388-d033eeddac1d"),
                    CreatedOn = new DateTime(2024, 12, 6, 10, 33, 18, DateTimeKind.Utc),
                },
                // Modulos for Aplicacao "TimeTracker"
                new Modulo
                {
                    Id = Guid.Parse("ed5c2e45-62a1-4fa6-bf6b-dcfe86c92a92"),
                    Nome = "TimeLogs",
                    Descricao = "Track and log time spent on tasks.",
                    Ativo = true,
                    AplicacaoId = Guid.Parse("b6fe4ccf-8034-4857-b4c9-0552fc7e897a"), // AplicacaoId matches
                    CreatedBy = Guid.Parse("1b77edb4-ae80-46b5-a388-d033eeddac1d"),
                    CreatedOn = new DateTime(2024, 12, 6, 10, 34, 18, DateTimeKind.Utc),
                },
                // Modulos for Aplicacao "ExpenseTracker"
                new Modulo
                {
                    Id = Guid.Parse("a3d7f0fa-1cf1-4314-9d5f-d1f74790d75e"),
                    Nome = "BudgetOverview",
                    Descricao = "Overview of your budget and spending.",
                    Ativo = true,
                    AplicacaoId = Guid.Parse("4534c7f8-d3f3-4175-9886-99c7748d5d87"), // AplicacaoId matches
                    CreatedBy = Guid.Parse("1b77edb4-ae80-46b5-a388-d033eeddac1d"),
                    CreatedOn = new DateTime(2024, 12, 6, 10, 35, 18, DateTimeKind.Utc),
                },
                // Modulos for Aplicacao "WeatherWatch"
                new Modulo
                {
                    Id = Guid.Parse("b8e82c3a-36de-4c96-8c63-9671c431cb82"),
                    Nome = "WeatherAlerts",
                    Descricao = "Receive notifications about weather changes.",
                    Ativo = true,
                    AplicacaoId = Guid.Parse("53e1d04b-6744-477a-9466-fc06f62f9cde"), // AplicacaoId matches
                    CreatedBy = Guid.Parse("1b77edb4-ae80-46b5-a388-d033eeddac1d"),
                    CreatedOn = new DateTime(2024, 12, 6, 10, 36, 18, DateTimeKind.Utc),
                },
            ];
        }
    }
}
