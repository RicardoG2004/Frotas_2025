FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
WORKDIR /app
EXPOSE 8080
EXPOSE 8081

FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src
COPY ["GSLP.WebApi/GSLP.WebApi.csproj", "GSLP.WebApi/"]
COPY ["GSLP.Application/GSLP.Application.csproj", "GSLP.Application/"]
COPY ["GSLP.Domain/GSLP.Domain.csproj", "GSLP.Domain/"]
COPY ["GSLP.Infrastructure/GSLP.Infrastructure.csproj", "GSLP.Infrastructure/"]
COPY ["GSLP.Reports/GSLP.Reports.csproj", "GSLP.Reports/"]
RUN dotnet restore "GSLP.WebApi/GSLP.WebApi.csproj"
COPY . .
WORKDIR "/src/GSLP.WebApi"
RUN dotnet build "GSLP.WebApi.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "GSLP.WebApi.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "GSLP.WebApi.dll"] 