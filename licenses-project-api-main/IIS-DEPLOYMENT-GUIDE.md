# IIS Deployment Guide for GSLP.WebApi

This guide will help you deploy the GSLP.WebApi application to IIS on Windows Server.

## Prerequisites

1. **.NET 9.0 Hosting Bundle** - Download and install from [Microsoft .NET Downloads](https://dotnet.microsoft.com/download/dotnet/9.0)

   - This includes the .NET runtime and the ASP.NET Core Module for IIS
   - After installation, restart IIS: `iisreset` (run as Administrator)

2. **IIS Features** - Ensure the following Windows features are enabled:

   - Internet Information Services
   - ASP.NET Core Module V2
   - Windows Authentication (if needed)

3. **SQL Server** - Ensure SQL Server is accessible and the connection string is configured correctly

## Step 1: Build and Publish the Application

### Option A: Using Release Script (Recommended for Versioned Releases)

```bash
powershell -File release.ps1 0.0.1
```

This script will:

- Update `version.json` with the specified version
- Publish the application in Release mode
- Create a ZIP file in the `releases/` folder (e.g., `releases/gslp-v0.0.1.zip`)

**Note:** After running this script, extract the ZIP file to your IIS publish directory.

### Option B: Manual Publish Command

```bash
dotnet publish -c Release -o <publish-folder-path> --framework net9.0
```

**Example:**

```bash
dotnet publish -c Release -o C:\Publish\GSLP --framework net9.0
```

## Step 2: Prepare IIS

1. **Create Application Pool**

   - Open IIS Manager
   - Right-click "Application Pools" → "Add Application Pool"
   - Name: `GSLPAppPool`
   - .NET CLR Version: **No Managed Code** (important for .NET Core/5+)
   - Managed Pipeline Mode: Integrated
   - Click OK

2. **Configure Application Pool** (Right-click → Advanced Settings)

   - Set Identity to a user with appropriate permissions (or use ApplicationPoolIdentity)
   - Enable 32-bit Applications: False (unless needed)
   - Start Mode: AlwaysRunning (optional, for better performance)

3. **Create IIS Website/Application**
   - Right-click "Sites" → "Add Website" (or "Add Application" under an existing site)
   - Site name: `GSLP` (or your preferred name)
   - Application pool: Select `GSLPAppPool`
   - Physical path: Point to your publish directory (e.g., `C:\Publish\GSLP`)
   - Binding: Configure HTTP/HTTPS as needed
   - Click OK

## Step 3: Configure Application Settings

1. **Docker SQL Server Connection**:

   - The application is pre-configured to connect to a Docker SQL Server running on `localhost:1433`
   - The `appsettings.Production.json` file contains the connection string: `Server=localhost,1433;Database=GSlicenses;...`
   - **Ensure your Docker SQL Server container is running** before starting IIS:
     ```bash
     docker compose -f docker-compose.db.yml up -d
     ```
   - Verify the container is running:
     ```bash
     docker ps
     ```
   - The connection string uses:
     - Server: `localhost,1433` (or `127.0.0.1,1433`)
     - Database: `GSlicenses`
     - User: `sa`
     - Password: `pISI8LLup28YigA5cdfA5YFco6HaU6jp` (from docker-compose.yml)

2. **Configuration Files - Which appsettings are used?**

   ASP.NET Core loads configuration files in this order (later files override earlier ones):

   **During Development** (when running locally with `dotnet run` or Visual Studio):

   - 1. `appsettings.json` - Base configuration (ConnectionString: `Server=sqlserver;...`)
   - 2. `appsettings.Development.json` - Development overrides (ConnectionString: `Server=localhost;...`)
   - **Result**: Uses `appsettings.json` + `appsettings.Development.json` (Development overrides base)

   **In Production** (when deployed to IIS):

   - 1. `appsettings.json` - Base configuration (ConnectionString: `Server=sqlserver;...`)
   - 2. `appsettings.Production.json` - Production overrides (ConnectionString: `Server=localhost,1433;...`)
   - **Result**: Uses `appsettings.json` + `appsettings.Production.json` (Production overrides base)
   - The `web.config` file sets `ASPNETCORE_ENVIRONMENT=Production`, which triggers loading `appsettings.Production.json`

   **Key Points:**

   - `appsettings.json` is **always loaded first** and contains all base settings (JWT, Mail, Cloudinary, etc.)
   - Environment-specific files (`appsettings.Development.json` or `appsettings.Production.json`) **only override** the settings they contain
   - Connection string differences:
     - Development: `Server=localhost` (default port 1433)
     - Production: `Server=localhost,1433` (explicit port)
   - All other settings (JWT, Mail, Cloudinary, etc.) come from `appsettings.json` in both environments

3. **Updating Configuration** (if needed):

   - **Connection String**: Edit `appsettings.Production.json` (before publishing or in the publish directory)
   - **Other Settings** (JWT, Mail, Cloudinary, etc.): Edit `appsettings.json` (before publishing or in the publish directory)
   - Ensure sensitive data is properly secured

4. **Environment Variables** (Optional):
   - You can override settings via `web.config` environment variables
   - Or use IIS Application Settings

## Step 4: Set Permissions

1. **Grant IIS_IUSRS permissions** to the publish directory:

   ```powershell
   icacls "C:\Publish\GSLP" /grant "IIS_IUSRS:(OI)(CI)RX" /T
   ```

2. **Grant Application Pool Identity permissions**:

   ```powershell
   icacls "C:\Publish\GSLP" /grant "IIS AppPool\GSLPAppPool:(OI)(CI)RW" /T
   ```

3. **Create logs directory** (if it doesn't exist):
   ```powershell
   New-Item -ItemType Directory -Path "C:\Publish\GSLP\logs" -Force
   icacls "C:\Publish\GSLP\logs" /grant "IIS AppPool\GSLPAppPool:(OI)(CI)F" /T
   ```

## Step 5: Verify web.config

The `web.config` file should already be included in your publish output. Verify it contains:

- `AspNetCoreModuleV2` handler
- Correct `processPath` pointing to `dotnet`
- Correct `arguments` pointing to `.\GSLP.WebApi.dll`
- Appropriate environment variables

## Step 6: Test the Deployment

1. **Start the Application Pool**:

   - In IIS Manager, ensure `GSLPAppPool` is started

2. **Browse the Application**:

   - Navigate to your configured URL (e.g., `http://localhost` or your domain)
   - Check if the API responds correctly

3. **Check Logs**:
   - Application logs: `C:\Publish\GSLP\logs\stdout_*.log`
   - Windows Event Viewer: Windows Logs → Application

## Step 7: Configure HTTPS (Recommended)

1. **Install SSL Certificate** in IIS
2. **Add HTTPS Binding** to your site
3. **Update web.config** if needed to enforce HTTPS

## Troubleshooting

### Application Won't Start

1. **Check Event Viewer** for detailed error messages
2. **Verify .NET 9.0 Hosting Bundle** is installed:
   ```powershell
   dotnet --list-runtimes
   ```
3. **Check stdout logs** in the `logs` directory
4. **Verify web.config** syntax is correct
5. **Ensure Application Pool** is using "No Managed Code"

### 500.30 Error (In-Process Start Failure)

- Verify .NET 9.0 Hosting Bundle is installed
- Check application pool identity has proper permissions
- Review Event Viewer for detailed errors

### 502.5 Error (Process Failure)

- Check stdout logs
- Verify connection strings are correct
- Ensure all dependencies are published

### Database Connection Issues

- **Docker SQL Server not accessible**:
  - Verify Docker container is running: `docker ps` (look for `sqlserver` container)
  - Check if port 1433 is exposed: `docker port sqlserver`
  - Ensure the connection string in `appsettings.Production.json` uses `localhost,1433` or `127.0.0.1,1433`
  - Test connection from host: `sqlcmd -S localhost,1433 -U sa -P "pISI8LLup28YigA5cdfA5YFco6HaU6jp" -Q "SELECT 1"`
  - If using a different hostname, update the connection string accordingly
- **Firewall rules**: Ensure port 1433 is not blocked (though for localhost this is usually not an issue)
- **Verify connection string credentials**: Match the SA password from `docker-compose.db.yml`
- **Test connection using SQL Server Management Studio**: Connect to `localhost,1433` with sa credentials
- **Container restart**: If the container was recreated, ensure the database exists and migrations are applied

## Additional Configuration

### Performance Optimization

1. **Enable Output Caching** (if applicable)
2. **Configure Compression** in IIS
3. **Set appropriate timeouts** in Application Pool
4. **Consider using Application Initialization** for faster startup

### Security Recommendations

1. **Remove sensitive data** from appsettings.json (use User Secrets or Azure Key Vault)
2. **Enable HTTPS only**
3. **Configure CORS** properly in your application
4. **Set appropriate request limits** in web.config
5. **Regularly update** .NET runtime and dependencies

## Maintenance

- **Regular Updates**: Keep .NET runtime and dependencies updated
- **Log Rotation**: Implement log rotation for stdout logs
- **Monitoring**: Set up monitoring for application health
- **Backups**: Regular backups of application and database

## Support

For issues specific to this application, check:

- Application logs in the `logs` directory
- Windows Event Viewer
- IIS Failed Request Tracing (if enabled)
