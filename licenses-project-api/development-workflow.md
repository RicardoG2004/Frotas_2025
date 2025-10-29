# Development Workflow Guide

## Initial Setup

1. Generate SSL Certificate:

```bash
./scripts/setup-certs.sh
```

2. Build and Start Services:

```bash
docker compose up -d --build
```

The application will be available at:

- HTTP: http://localhost:8080
- HTTPS: https://localhost:8081

## Daily Development Commands

### 1. Code Changes

For regular code changes:

```bash
docker compose up -d --build api
```

### 2. View Logs

Monitor application logs in real-time:

```bash
docker compose logs -f api
```

### 3. Database Operations

Apply migrations:

```bash
docker compose exec api dotnet ef database update
```

Add new migration:

```bash
docker compose exec api dotnet ef migrations add MigrationName
```

### 4. Clean Rebuild

When you need a fresh start:

```bash
# Stop all containers
docker compose down

# Remove existing volumes (warning: deletes database)
docker volume rm $(docker volume ls -q)

# Rebuild without cache
docker compose build --no-cache

# Start services
docker compose up -d
```

## Troubleshooting

### Common Issues and Solutions

1. **API Not Responding**

   - Check container status: `docker compose ps`
   - View logs: `docker compose logs api`
   - Verify ports 8080/8081 aren't in use

2. **Database Connection Failed**

   - Verify SQL Server is running: `docker compose ps sqlserver`
   - Check connection string in appsettings.json
   - Ensure migrations are applied

3. **Certificate Errors**
   - Regenerate certificates: `./scripts/setup-certs.sh`
   - Verify cert.pfx exists in ./certs directory

### Development Tips

1. **Hot Reload**
   The application supports hot reload for:

   - C# code changes
   - Configuration changes
   - View modifications

2. **Database Persistence**

   - Data persists between restarts
   - Use volume removal command for clean slate

3. **Package Updates**
   After adding new NuGet packages:
   ```bash
   docker compose build --no-cache api
   docker compose up -d api
   ```

## Best Practices

1. Always check logs when troubleshooting
2. Use volume removal sparingly (data loss)
3. Keep certificates in ./certs directory
4. Never commit sensitive data to version control

## Environment Variables

Key environment variables are set in docker-compose.yml:

- ASPNETCORE_URLS
- ConnectionStrings\_\_DefaultConnection
- CERT_PASSWORD (if using custom certificate)

  ```bash
  export CERT_PASSWORD=your_certificate_password
  ```

  or

  ```yaml
  services:
  api:
    environment:
      - CERT_PASSWORD=your_certificate_password
  ```

## Environment Settings

The application uses different settings based on ASPNETCORE_ENVIRONMENT:

- Development: Uses `appsettings.Development.json` (local development)
- Production: Uses `appsettings.json` (default in Docker)

### Local Development Setup

1. Start only the database:

```bash
docker compose -f docker-compose.db.yml up -d
```

2. Check database health:

```bash
docker ps # Wait until health status shows "healthy"
```

3. Run the API locally:

```bash
cd GSLP.WebApi
dotnet watch run
```

The environment is set in:

- `launchSettings.json` for local development
- Docker environment variables for containers

### Environment Configuration Files

- `appsettings.json`: Base configuration, used in production
- `appsettings.Development.json`: Development overrides
  - Local connection strings
  - Debug settings
  - Detailed logging

### Connection Strings

- Development: Points to `localhost`
- Production: Points to `sqlserver` container

See configuration loading in:
csharp:GSLP.Infrastructure/Persistence/Contexts/ApplicationDbContextFactory.cs

This setup allows different configurations between local development and containerized environments.

## Database Migrations

1. First, make sure your SQL Server container is running:

```bash
docker compose -f docker-compose.db.yml up -d
```

2. Then, when running EF Core commands, set the environment:

```bash
$env:ASPNETCORE_ENVIRONMENT='Development'  # PowerShell
# or
export ASPNETCORE_ENVIRONMENT=Development  # Bash/Linux
```

3. Now you can run your EF Core command:

```bash
dotnet ef migrations remove -c ApplicationDbContext -s GSLP.WebApi/ -p GSLP.Infrastructure/
```

4. Or you can use the scripts inside the scripts folder:

```bash
./scripts/add-migration.ps1 -e Development -n "MigrationName"
./scripts/remove-migration.ps1 -e Development
```

5. Or you can use the scripts inside the scripts folder:

```bash
./scripts/add-migration.sh -e Development -n "MigrationName"
./scripts/remove-migration.sh -e Development
```
