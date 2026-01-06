using GSLP.Domain.Entities.Catalog.Application;

namespace GSLP.Infrastructure.Persistence.Seeders
{
    public static class AplicacaoSeeder
    {
        public static List<Aplicacao> GetAplicacoes()
        {
            return
            [
                new Aplicacao
                {
                    Id = Guid.Parse("aee9b3a5-c4b5-4c7a-8e33-408ed58c9ef3"),
                    Nome = "BudgetBuddy",
                    Descricao = "Helps users manage their finances and track expenses with ease.",
                    Versao = "2.0.5",
                    FicheiroXAP = "budgetbuddy.xap",
                    Ativo = true,
                    CreatedBy = Guid.Parse("1b77edb4-ae80-46b5-a388-d033eeddac1d"),
                    CreatedOn = new DateTime(2024, 12, 6, 10, 31, 18, DateTimeKind.Utc),
                },
                new Aplicacao
                {
                    Id = Guid.Parse("ad4d9bdf-4609-44cc-8287-c02e7e372b1f"),
                    Nome = "HealthTracker",
                    Descricao = "Monitors daily steps, calories, and overall health metrics.",
                    Versao = "3.1.0",
                    FicheiroXAP = "healthtracker.xap",
                    Ativo = true,
                    CreatedBy = Guid.Parse("1b77edb4-ae80-46b5-a388-d033eeddac1d"),
                    CreatedOn = new DateTime(2024, 12, 6, 10, 31, 18, DateTimeKind.Utc),
                },
                new Aplicacao
                {
                    Id = Guid.Parse("e0a0c087-97bc-46da-a54b-7463423ecdbf"),
                    Nome = "PhotoEditorPro",
                    Descricao = "A powerful image editing app for professionals and beginners.",
                    Versao = "4.4.8",
                    FicheiroXAP = "photoeditorpro.xap",
                    Ativo = true,
                    CreatedBy = Guid.Parse("1b77edb4-ae80-46b5-a388-d033eeddac1d"),
                    CreatedOn = new DateTime(2024, 12, 6, 10, 31, 18, DateTimeKind.Utc),
                },
                new Aplicacao
                {
                    Id = Guid.Parse("e3a1a3c2-d0b2-40e7-b6f2-89776bbbd9f0"),
                    Nome = "TaskMaster",
                    Descricao = "Manage your tasks, projects, and deadlines effectively.",
                    Versao = "1.2.3",
                    FicheiroXAP = "taskmaster.xap",
                    Ativo = true,
                    CreatedBy = Guid.Parse("1b77edb4-ae80-46b5-a388-d033eeddac1d"),
                    CreatedOn = new DateTime(2024, 12, 6, 10, 32, 18, DateTimeKind.Utc),
                },
                new Aplicacao
                {
                    Id = Guid.Parse("ad6f3fa2-9a11-4b6f-8b70-03c88834c4ae"),
                    Nome = "NoteTaker",
                    Descricao = "Create and organize notes on the go.",
                    Versao = "2.0.1",
                    FicheiroXAP = "notetaker.xap",
                    Ativo = true,
                    CreatedBy = Guid.Parse("1b77edb4-ae80-46b5-a388-d033eeddac1d"),
                    CreatedOn = new DateTime(2024, 12, 6, 10, 33, 18, DateTimeKind.Utc),
                },
                new Aplicacao
                {
                    Id = Guid.Parse("b6fe4ccf-8034-4857-b4c9-0552fc7e897a"),
                    Nome = "TimeTracker",
                    Descricao = "Track how much time you spend on various activities.",
                    Versao = "1.4.6",
                    FicheiroXAP = "timetracker.xap",
                    Ativo = true,
                    CreatedBy = Guid.Parse("1b77edb4-ae80-46b5-a388-d033eeddac1d"),
                    CreatedOn = new DateTime(2024, 12, 6, 10, 34, 18, DateTimeKind.Utc),
                },
                new Aplicacao
                {
                    Id = Guid.Parse("4534c7f8-d3f3-4175-9886-99c7748d5d87"),
                    Nome = "ExpenseTracker",
                    Descricao = "Track and categorize your expenses easily.",
                    Versao = "3.0.0",
                    FicheiroXAP = "expensetracker.xap",
                    Ativo = true,
                    CreatedBy = Guid.Parse("1b77edb4-ae80-46b5-a388-d033eeddac1d"),
                    CreatedOn = new DateTime(2024, 12, 6, 10, 35, 18, DateTimeKind.Utc),
                },
                new Aplicacao
                {
                    Id = Guid.Parse("53e1d04b-6744-477a-9466-fc06f62f9cde"),
                    Nome = "WeatherWatch",
                    Descricao = "Keep track of your location's weather conditions.",
                    Versao = "2.3.2",
                    FicheiroXAP = "weatherwatch.xap",
                    Ativo = true,
                    CreatedBy = Guid.Parse("1b77edb4-ae80-46b5-a388-d033eeddac1d"),
                    CreatedOn = new DateTime(2024, 12, 6, 10, 36, 18, DateTimeKind.Utc),
                },
                new Aplicacao
                {
                    Id = Guid.Parse("5f0e5e0f-5b4d-4203-9292-5a9c0fae1f8d"),
                    Nome = "FitnessTracker",
                    Descricao = "Track your fitness progress over time.",
                    Versao = "1.1.2",
                    FicheiroXAP = "fitnesstracker.xap",
                    Ativo = true,
                    CreatedBy = Guid.Parse("1b77edb4-ae80-46b5-a388-d033eeddac1d"),
                    CreatedOn = new DateTime(2024, 12, 6, 10, 37, 18, DateTimeKind.Utc),
                },
                new Aplicacao
                {
                    Id = Guid.Parse("f477ff53-86d5-4d61-a38b-d62398793575"),
                    Nome = "TravelManager",
                    Descricao = "Manage your travel plans and bookings.",
                    Versao = "5.1.1",
                    FicheiroXAP = "travelmanager.xap",
                    Ativo = true,
                    CreatedBy = Guid.Parse("1b77edb4-ae80-46b5-a388-d033eeddac1d"),
                    CreatedOn = new DateTime(2024, 12, 6, 10, 38, 18, DateTimeKind.Utc),
                },
                new Aplicacao
                {
                    Id = Guid.Parse("7a95e0a1-e0c1-40b7-9d2e-9c8a128b9cda"),
                    Nome = "LanguageLearner",
                    Descricao = "Learn new languages with ease and fun.",
                    Versao = "2.3.3",
                    FicheiroXAP = "languagelearner.xap",
                    Ativo = true,
                    CreatedBy = Guid.Parse("1b77edb4-ae80-46b5-a388-d033eeddac1d"),
                    CreatedOn = new DateTime(2024, 12, 6, 10, 39, 18, DateTimeKind.Utc),
                },
            ];
        }
    }
}
