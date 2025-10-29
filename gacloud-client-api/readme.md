# Guia de Comandos para Configuração do Projeto

Este guia contém os comandos para criar e configurar o projeto utilizando o .NET.

## 1. Criar um Nano Service

Este comando cria um serviço no projeto com a solução e o nome de projeto especificados.
A pasta padrão é a seguinte GACloud.API.Application/Services/[MODULE].

```bash
dotnet new nano-service -s Distrito -p Distritos -ap GACloud.API
```

## 2. Criar um Nano Controller

Este comando cria um controlador no projeto com a solução e o nome de projeto especificados.
A pasta padrão é a seguinte GACloud.API.WebApi/Controllers/[MODULE].

```bash
dotnet new nano-controller -s Distrito -p Distritos -ap GACloud.API
```

## 3. Adicionar uma Migration ao Entity Framework

Este comando adiciona uma nova migration ao contexto de dados, com o nome especificado, para a base de dados.

```bash
dotnet ef migrations add DistritoEntityCreate -c ApplicationDbContext -s GACloud.API.WebApi/ -p GACloud.API.Infrastructure/ -o Persistence/Migrations
```

Este comando cria uma migration chamada DistritoEntityCreate, no contexto de dados ApplicationDbContext. Especifica as pastas para o projeto de API (GACloud.API.WebApi/), o projeto de infraestrutura (GACloud.API.Infrastructure/) e o diretório onde as migrations serão armazenadas (Persistence/Migrations).

## 4. Remover uma Migration

Este comando remove a última migration criada no projeto.

```bash
dotnet ef migrations remove -c ApplicationDbContext -s GACloud.API.WebApi/ -p GACloud.API.Infrastructure/
```

Este comando remove a última migration criada para o contexto de dados ApplicationDbContext. Especifica as pastas para o projeto de API (GACloud.API.WebApi/) e o projeto de infraestrutura (GACloud.API.Infrastructure/).
