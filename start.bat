@echo off

:: Primeira janela: gacloud-api
start "GACloud API" cmd /k "cd /d C:\Projects\gacloud-client-api && docker compose -f docker-compose.db.yml up -d && cd GACloud.API.WebAPI && dotnet watch"

:: Abrir gacloud-api no VSCode
start "VSCode - GACloud API" code C:\Projects\gacloud-client-api

:: Segunda janela: licenses-api
start "Licenses API" cmd /k "cd /d C:\Projects\licenses-project-api\GSLP.WebApi && dotnet watch"

:: Terceira janela: gacloud-frontend
start "Client App" cmd /k "cd /d C:\Projects\gacloud-client-frontend && cursor ."