<p align="center">
  <img src="public/logo.svg" alt="globalsoft">
</p>

# Globalsoft Licenses Project - Client

Frontend de gestão de licenças da Globalsoft CBSC

## Variáveis de Ambiente

Para executar este projeto, é preciso adicionar as seguintes variáveis de ambiente no `.env`

### Opção 1: URLs específicas por protocolo (Recomendado)

O aplicativo detecta automaticamente o protocolo HTTP/HTTPS e usa a URL apropriada:

```env
VITE_URL_HTTP=http://seu-dominio-api.com:8084
VITE_URL_HTTPS=https://seu-dominio-api.com:8094
VITE_API_KEY=sua-chave-api
```

### Opção 2: URL única (Compatível com versões anteriores)

Se as URLs específicas por protocolo não estiverem definidas, esta será usada para ambos HTTP e HTTPS:

```env
VITE_URL=http://seu-dominio-api.com:8084
VITE_API_KEY=sua-chave-api
```

**Nota:** O sistema detecta automaticamente se está sendo acessado via HTTP ou HTTPS e usa a URL correspondente. Isso elimina a necessidade de configuração manual para diferentes ambientes.

## Development

Para começar a desenvolver

```bash
  npm run dev
```

## Deploy

Para fazer build do projeto

```bash
  npm run build
```

## Auto-Versioning System

This project includes an automatic version increment system that integrates with the build and release process. The system automatically increments version numbers (patch, minor, or major) when building or releasing the application, and stores the version in a JSON file accessible at runtime.

### Features

- **Automatic version increment** during build/release
- **Semantic versioning** support (major.minor.patch)
- **Version storage** in a JSON file accessible at runtime
- **Synchronized versions** between `package.json` and version file
- **Release automation** with zip file creation
- **Cross-platform** support (Windows and Unix)

### Version Storage

The version is stored in two places:

1. **`public/version.json`** - Runtime accessible version file (served as `/version.json` in the app)
2. **`package.json`** - Standard npm version field

### Usage

#### Build with Auto-Versioning

```bash
# Build with patch increment (1.0.0 → 1.0.1)
npm run build:patch

# Build with minor increment (1.0.0 → 1.1.0)
npm run build:minor

# Build with major increment (1.0.0 → 2.0.0)
npm run build:major
```

#### Version Bump Only (No Build)

```bash
# Increment patch version
npm run version:bump patch

# Increment minor version
npm run version:bump minor

# Increment major version
npm run version:bump major

# Set exact version
npm run version:bump 1.2.3
```

#### Full Release (Version + Build + Zip)

```bash
# Release with patch increment
npm run release:patch
# Output: releases/licenses-client-1.0.1.zip

# Release with minor increment
npm run release:minor
# Output: releases/licenses-client-1.1.0.zip

# Release with major increment
npm run release:major
# Output: releases/licenses-client-2.0.0.zip

# Release with specific version
npm run release -- 1.0.24
# Output: releases/licenses-client-1.0.24.zip
```

### Accessing Version in Your Application

#### Runtime Access (Recommended)

Fetch the version from the served JSON file:

```typescript
async function getAppVersion() {
  try {
    const response = await fetch('/version.json')
    const data = await response.json()
    return data.appVersion
  } catch (error) {
    console.error('Failed to fetch version:', error)
    return 'unknown'
  }
}
```

#### Build-Time Access

If you need the version at build time, you can import it:

```typescript
import versionData from '../public/version.json'

const appVersion = versionData.appVersion
```

### Scripts Overview

- **`bump-version.js`** - Increments or sets the version number
- **`create-release-zip.js`** - Creates a zip file of the dist folder with version in filename
- **`release.js`** - Orchestrates version bump, build, and zip creation

### Notes

- The version is read from `public/version.json` as the source of truth
- Both `package.json` and `version.json` are updated to keep them in sync
- The `releases/` folder is created automatically if it doesn't exist
- Existing zip files with the same version are overwritten
- The system supports semantic versioning (major.minor.patch format)
