<p align="center">
  <img src="assets/logo.svg" alt="globalsoft">
</p>

# Documentação dos Comandos Docker e EF Core

Este documento explica o uso dos comandos Docker e Entity Framework (EF) Core que são comumente utilizados em projetos .NET, como parte do desenvolvimento e gestão de bases de dados.

## Docker Compose

O Docker Compose é uma ferramenta para definir e executar aplicativos Docker multi-container. Usando um arquivo de configuração `docker-compose.yml`, é possível definir os serviços que compõem a aplicação e facilitar a gestão deles.

### 1. **`docker compose up -d`**

Este comando é utilizado para **subir** (iniciar) os containers definidos no arquivo `docker-compose.yml` em segundo plano (modo **detached**).

- `docker compose up`: Inicia todos os containers definidos no `docker-compose.yml`.
- `-d` ou `--detach`: Faz com que os containers sejam executados em segundo plano, permitindo que o terminal esteja livre para outros comandos.

**Exemplo de uso:**

```bash
docker compose up -d
```

### 2. **`docker compose down`**

Este comando é utilizado para **baixar** (baixar) os containers definidos no arquivo `docker-compose.yml`.

- `docker compose down`: Baixa todos os containers definidos no `docker-compose.yml`.

**Exemplo de uso:**

```bash
docker compose up -d
```

### 3. **`dotnet ef migrations add [MigrationName] -s GSLP.WebApi -p GSLP.Infrastructure -c ApplicationDbContext -o Persistence/Migrations`**

Este comando adiciona uma nova migração à base de dados utilizando o Entity Framework Core. Ele cria um arquivo de migração para ser aplicado à base de dados, baseado nas alterações realizadas no modelo de dados (Classes de Entidade).

#### Parâmetros:

- **`dotnet ef migrations add [MigrationName]`**: Cria uma nova migração com o nome especificado (substitua `[MigrationName]` pelo nome da migração).
- **`-s GSLP.WebApi`**: Define o projeto de **startup** que contém a configuração da aplicação (geralmente o projeto que possui a classe `Program` ou `Startup`).
- **`-p GSLP.Infrastructure`**: Define o projeto que contém o contexto da base de dados (`ApplicationDbContext`), geralmente o projeto que gere a infraestrutura.
- **`-c ApplicationDbContext`**: Define o contexto da base de dados a ser utilizado, neste caso o `ApplicationDbContext`.
- **`-o Persistence/Migrations`**: Define a pasta onde os arquivos de migração serão gerados.

### 4. **`dotnet ef migrations remove -s GSLP.WebApi -p GSLP.Infrastructure -c ApplicationDbContext -o Persistence/Migrations`**

Este comando remove a última migração que foi criada, revertendo as alterações feitas na base de dados e no código. Ele pode ser útil quando uma migração é criada erroneamente ou não é mais necessária.

#### Parâmetros:

- **`dotnet ef migrations remove`**: Remove a última migração criada.
- **`-s GSLP.WebApi`**: Define o projeto de **startup** que contém a configuração da aplicação (geralmente o projeto que possui a classe `Program` ou `Startup`).
- **`-p GSLP.Infrastructure`**: Define o projeto que contém o contexto da base de dados (`ApplicationDbContext`), geralmente o projeto que gere a infraestrutura.
- **`-c ApplicationDbContext`**: Define o contexto da base de dados a ser utilizado, neste caso o `ApplicationDbContext`.
- **`-o Persistence/Migrations`**: Define o diretório onde os arquivos de migração estão localizados.

### 5. **`dotnet ef database drop -s GSLP.WebApi -p GSLP.Infrastructure`**

Este comando é utilizado para excluir a base de dados associada ao contexto `ApplicationDbContext`. É útil quando se deseja remover completamente a base de dados, por exemplo, para recriar tudo desde o início.

#### Parâmetros:

- **`dotnet ef database drop`**: Exclui a base de dados.
- **`-s GSLP.WebApi`**: Define o projeto de **startup** que contém a configuração da aplicação (geralmente o projeto que possui a classe `Program` ou `Startup`).
- **`-p GSLP.Infrastructure`**: Define o projeto que contém o contexto da base de dados (`ApplicationDbContext`), geralmente o projeto que gere a infraestrutura.

### 6. **`dotnet publish -c Release -o <publish-folder-path> --framework net9.0`**

Este comando é utilizado para **publicar** a aplicação .NET em um diretório específico, compilando o código e preparando os arquivos para implantação em um servidor ou container. Ele gera uma versão da aplicação pronta para produção, levando em consideração as configurações de compilação especificadas.

#### Parâmetros:

- **`dotnet publish`**: Executa o processo de publicação da aplicação, gerando os arquivos necessários para a implantação.
- **`-c Release`**: Especifica o **modo de compilação** da aplicação. O valor `Release` é utilizado para otimizar a aplicação para produção, incluindo otimizações de desempenho e excluindo informações de depuração.
- **`-o <publish-folder-path>`**: Define o **diretório de saída** onde os arquivos publicados serão gerados. Substitua `<publish-folder-path>` pelo caminho do diretório onde você deseja salvar os arquivos (por exemplo, `C:\Sites\PublishCoreTest`).
- **`--framework net9.0`**: Define o **framework de destino** da aplicação. Neste caso, o comando está configurado para usar a versão `net9.0` do .NET. Isso garante que a aplicação seja compilada para o framework correto.

**Exemplo de uso:**

```bash
dotnet publish -c Release -o <publish-folder-path> --framework net9.0

dotnet publish -c Release -o C:\\Projects\\licenses-project\\publish --framework net9.0
```

### 7. **`.\release.ps1 [Version]`**

Este comando é utilizado para criar um pacote de release da aplicação GSLP com versionamento automático. O script atualiza automaticamente o arquivo `version.json` com a versão especificada, compila e publica a aplicação em modo Release, e cria um arquivo ZIP contendo todos os arquivos necessários para implantação.

#### Parâmetros:

- **`.\release.ps1`**: Executa o script PowerShell de release.
- **`[Version]`**: Versão a ser atribuída ao release (obrigatório). Deve seguir o formato de versionamento semântico (ex: `1.0.12`, `2.1.0`, `1.0.0`).

#### O que o script faz:

1. **Atualiza `version.json`**: Escreve a versão especificada no arquivo `version.json` na raiz do projeto.
2. **Limpa builds anteriores**: Remove qualquer pasta `publish` existente.
3. **Cria diretório de releases**: Garante que a pasta `releases/` existe.
4. **Publica o projeto**: Executa `dotnet publish` em modo Release com framework net9.0.
5. **Cria pacote de release**: Compacta os arquivos publicados em um arquivo ZIP no formato `gslp-v[version].zip` dentro da pasta `releases/`.
6. **Limpeza**: Remove a pasta temporária `publish` após criar o ZIP.

**Exemplo de uso:**

```bash
powershell -File release.ps1 0.0.1
```

Este comando criará um release com a versão `1.0.12`, atualizará o `version.json`, e gerará o arquivo `releases/gslp-v1.0.12.zip` contendo todos os arquivos necessários para implantação.

**Notas:**

- O script requer PowerShell 3.0 ou superior.
- Certifique-se de ter permissões de escrita no diretório do projeto.
- O arquivo `version.json` será sobrescrito cada vez que você executar o script.
- Os números de versão devem seguir o versionamento semântico (ex: 1.0.0, 1.0.1, 2.1.0).
- A pasta `releases/` será criada automaticamente se não existir.
