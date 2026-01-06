using GSLP.Domain.Entities.Catalog.Application;

namespace GSLP.Infrastructure.Persistence.Seeders
{
    public static class FuncionalidadeSeeder
    {
        public static List<Funcionalidade> GetFuncionalidades()
        {
            return
            [
                // Funcionalidades for Modulo "ExpenseTracker"
                new Funcionalidade
                {
                    Id = Guid.Parse("e5d6f8e2-c477-45e2-9d57-1e7e9b8de27a"),
                    Nome = "ExpenseCategorizer",
                    Descricao = "Categorizes expenses into predefined categories.",
                    Ativo = true,
                    ModuloId = Guid.Parse("e1f5ad3a-cd16-4c27-97a9-d426fa5e7bfa"), // ModuloId for ExpenseTracker
                    CreatedBy = Guid.Parse("1b77edb4-ae80-46b5-a388-d033eeddac1d"),
                    CreatedOn = new DateTime(2024, 12, 6, 10, 33, 18, DateTimeKind.Utc),
                },
                new Funcionalidade
                {
                    Id = Guid.Parse("7d7bdbfa-cd67-4970-9571-8e949b245378"),
                    Nome = "ExpenseSummary",
                    Descricao = "Generates a summary of the user's expenses.",
                    Ativo = true,
                    ModuloId = Guid.Parse("e1f5ad3a-cd16-4c27-97a9-d426fa5e7bfa"), // ModuloId for ExpenseTracker
                    CreatedBy = Guid.Parse("1b77edb4-ae80-46b5-a388-d033eeddac1d"),
                    CreatedOn = new DateTime(2024, 12, 6, 10, 33, 18, DateTimeKind.Utc),
                },
                // Funcionalidades for Modulo "ReportGenerator"
                new Funcionalidade
                {
                    Id = Guid.Parse("92d5129d-5c80-4411-b8f6-bf76d899b60d"),
                    Nome = "GenerateExpenseReport",
                    Descricao = "Generates detailed reports for expenses.",
                    Ativo = true,
                    ModuloId = Guid.Parse("24e8efcc-9d68-4a7d-b132-b8fc2e7d57c4"), // ModuloId for ReportGenerator
                    CreatedBy = Guid.Parse("1b77edb4-ae80-46b5-a388-d033eeddac1d"),
                    CreatedOn = new DateTime(2024, 12, 6, 10, 34, 18, DateTimeKind.Utc),
                },
                new Funcionalidade
                {
                    Id = Guid.Parse("39f503f5-f3e9-4569-8b1b-33a01f4f3b88"),
                    Nome = "ExpenseTrends",
                    Descricao = "Tracks spending trends over time.",
                    Ativo = true,
                    ModuloId = Guid.Parse("24e8efcc-9d68-4a7d-b132-b8fc2e7d57c4"), // ModuloId for ReportGenerator
                    CreatedBy = Guid.Parse("1b77edb4-ae80-46b5-a388-d033eeddac1d"),
                    CreatedOn = new DateTime(2024, 12, 6, 10, 34, 18, DateTimeKind.Utc),
                },
                // Funcionalidades for Modulo "StepCounter"
                new Funcionalidade
                {
                    Id = Guid.Parse("f45c98b8-8e38-46ea-a5ff-b446574b4870"),
                    Nome = "StepGoal",
                    Descricao = "Sets and tracks daily step goals.",
                    Ativo = true,
                    ModuloId = Guid.Parse("c7e56a9c-1d3f-484d-bb6d-800f4c54a4a2"), // ModuloId for StepCounter
                    CreatedBy = Guid.Parse("1b77edb4-ae80-46b5-a388-d033eeddac1d"),
                    CreatedOn = new DateTime(2024, 12, 6, 10, 33, 18, DateTimeKind.Utc),
                },
                new Funcionalidade
                {
                    Id = Guid.Parse("41334993-bb7c-4b56-b774-7ff0f800a80a"),
                    Nome = "StepProgress",
                    Descricao = "Displays progress toward daily step goal.",
                    Ativo = true,
                    ModuloId = Guid.Parse("c7e56a9c-1d3f-484d-bb6d-800f4c54a4a2"), // ModuloId for StepCounter
                    CreatedBy = Guid.Parse("1b77edb4-ae80-46b5-a388-d033eeddac1d"),
                    CreatedOn = new DateTime(2024, 12, 6, 10, 33, 18, DateTimeKind.Utc),
                },
                // Funcionalidades for Modulo "TimeLogs"
                new Funcionalidade
                {
                    Id = Guid.Parse("ab836455-b02a-4778-bf69-1d1840170b8b"),
                    Nome = "TrackTime",
                    Descricao = "Tracks the time spent on various tasks.",
                    Ativo = true,
                    ModuloId = Guid.Parse("ed5c2e45-62a1-4fa6-bf6b-dcfe86c92a92"), // ModuloId for TimeLogs
                    CreatedBy = Guid.Parse("1b77edb4-ae80-46b5-a388-d033eeddac1d"),
                    CreatedOn = new DateTime(2024, 12, 6, 10, 35, 18, DateTimeKind.Utc),
                },
                new Funcionalidade
                {
                    Id = Guid.Parse("f6246d1b-0e44-46c5-917d-306e03b0d58f"),
                    Nome = "TimeAnalysis",
                    Descricao = "Analyzes the time spent on different projects.",
                    Ativo = true,
                    ModuloId = Guid.Parse("ed5c2e45-62a1-4fa6-bf6b-dcfe86c92a92"), // ModuloId for TimeLogs
                    CreatedBy = Guid.Parse("1b77edb4-ae80-46b5-a388-d033eeddac1d"),
                    CreatedOn = new DateTime(2024, 12, 6, 10, 35, 18, DateTimeKind.Utc),
                },
                // Funcionalidades for Modulo "TaskList"
                new Funcionalidade
                {
                    Id = Guid.Parse("d7a7c61b-d39f-41ae-bc39-9d87952a9f53"),
                    Nome = "AddTask",
                    Descricao = "Adds a new task to the task list.",
                    Ativo = true,
                    ModuloId = Guid.Parse("8e7ff57b-b3b0-45a0-88c5-e21c3f6c9602"), // ModuloId for TaskList
                    CreatedBy = Guid.Parse("1b77edb4-ae80-46b5-a388-d033eeddac1d"),
                    CreatedOn = new DateTime(2024, 12, 6, 10, 36, 18, DateTimeKind.Utc),
                },
                new Funcionalidade
                {
                    Id = Guid.Parse("1ff50b9e-cde1-48d7-98ea-9a4b5f255d09"),
                    Nome = "TaskPriority",
                    Descricao = "Sets priority for tasks.",
                    Ativo = true,
                    ModuloId = Guid.Parse("8e7ff57b-b3b0-45a0-88c5-e21c3f6c9602"), // ModuloId for TaskList
                    CreatedBy = Guid.Parse("1b77edb4-ae80-46b5-a388-d033eeddac1d"),
                    CreatedOn = new DateTime(2024, 12, 6, 10, 36, 18, DateTimeKind.Utc),
                },
                // Funcionalidades for Modulo "NoteOrganizer"
                new Funcionalidade
                {
                    Id = Guid.Parse("7e6e1f58-890e-4573-a4a6-f63a2e9d76a9"),
                    Nome = "AddNote",
                    Descricao = "Add a new note to your collection.",
                    Ativo = true,
                    ModuloId = Guid.Parse("e0fba94c-b763-4de1-b60c-88e7d5b8c653"), // ModuloId for NoteOrganizer
                    CreatedBy = Guid.Parse("1b77edb4-ae80-46b5-a388-d033eeddac1d"),
                    CreatedOn = new DateTime(2024, 12, 6, 10, 37, 18, DateTimeKind.Utc),
                },
                new Funcionalidade
                {
                    Id = Guid.Parse("1fef25a6-b8b8-4737-a0b7-92ab416f8834"),
                    Nome = "SearchNotes",
                    Descricao = "Searches for notes by keyword.",
                    Ativo = true,
                    ModuloId = Guid.Parse("e0fba94c-b763-4de1-b60c-88e7d5b8c653"), // ModuloId for NoteOrganizer
                    CreatedBy = Guid.Parse("1b77edb4-ae80-46b5-a388-d033eeddac1d"),
                    CreatedOn = new DateTime(2024, 12, 6, 10, 37, 18, DateTimeKind.Utc),
                },
                // Funcionalidades for Modulo "BudgetOverview"
                new Funcionalidade
                {
                    Id = Guid.Parse("7b3457f2-4d76-4a87-bc09-df1b6396f3d5"),
                    Nome = "BudgetPlanner",
                    Descricao = "Helps the user plan and allocate a budget.",
                    Ativo = true,
                    ModuloId = Guid.Parse("a3d7f0fa-1cf1-4314-9d5f-d1f74790d75e"), // ModuloId for BudgetOverview
                    CreatedBy = Guid.Parse("1b77edb4-ae80-46b5-a388-d033eeddac1d"),
                    CreatedOn = new DateTime(2024, 12, 6, 10, 38, 18, DateTimeKind.Utc),
                },
                // Funcionalidades for Modulo "WeatherAlerts"
                new Funcionalidade
                {
                    Id = Guid.Parse("1c704679-33d0-4a5f-967f-084fb8b5aefb"),
                    Nome = "WeatherNotifications",
                    Descricao = "Receives notifications about weather changes.",
                    Ativo = true,
                    ModuloId = Guid.Parse("b8e82c3a-36de-4c96-8c63-9671c431cb82"), // ModuloId for WeatherAlerts
                    CreatedBy = Guid.Parse("1b77edb4-ae80-46b5-a388-d033eeddac1d"),
                    CreatedOn = new DateTime(2024, 12, 6, 10, 39, 18, DateTimeKind.Utc),
                },
            ];
        }
    }
}
