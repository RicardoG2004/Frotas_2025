@echo off

:: Primeira janela: gacloud-api
start "Frotas API" cmd /k "cd /d C:\Projects\frotas-client-api && docker compose -f docker-compose.db.yml up -d && cd Frotas.API.WebApi && dotnet watch"

:: Abrir gacloud-api no VSCode
start "VSCode - Frotas API" code C:\Projects\frotas-client-api

:: Segunda janela: licenses-api
start "Licenses API" cmd /k "cd /d C:\Projects\licenses-project-api-main\GSLP.WebApi && dotnet watch"

:: Terceira janela: gacloud-frontend
start "Frotas Frontend" cmd /k "cd /d C:\Projects\frotas-client-frontend && npm run dev"