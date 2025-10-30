# Guia de Comandos para Configuração do Projeto

Este guia contém os comandos para criar e configurar o projeto utilizando o .NET.

## 1. Criar um Nano Service

Este comando cria um serviço no projeto com a solução e o nome de projeto especificados.
A pasta padrão é a seguinte Frotas.API.Application/Services/[MODULE].

```bash
dotnet new nano-service -s Distrito -p Distritos -ap Frotas.API
```

## 2. Criar um Nano Controller

Este comando cria um controlador no projeto com a solução e o nome de projeto especificados.
A pasta padrão é a seguinte Frotas.API.WebApi/Controllers/[MODULE].

```bash
dotnet new nano-controller -s Distrito -p Distritos -ap Frotas.API
```

## 3. Adicionar uma Migration ao Entity Framework

Este comando adiciona uma nova migration ao contexto de dados, com o nome especificado, para a base de dados.

```bash
dotnet ef migrations add DistritoEntityCreate -c ApplicationDbContext -s Frotas.API.WebApi/ -p Frotas.API.Infrastructure/ -o Persistence/Migrations
```

Este comando cria uma migration chamada DistritoEntityCreate, no contexto de dados ApplicationDbContext. Especifica as pastas para o projeto de API (Frotas.API.WebApi/), o projeto de infraestrutura (Frotas.API.Infrastructure/) e o diretório onde as migrations serão armazenadas (Persistence/Migrations).

## 4. Remover uma Migration

Este comando remove a última migration criada no projeto.

```bash
dotnet ef migrations remove -c ApplicationDbContext -s Frotas.API.WebApi/ -p Frotas.API.Infrastructure/
```

Este comando remove a última migration criada para o contexto de dados ApplicationDbContext. Especifica as pastas para o projeto de API (Frotas.API.WebApi/) e o projeto de infraestrutura (Frotas.API.Infrastructure/).
