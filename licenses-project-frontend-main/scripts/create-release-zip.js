/**
 * Creates a zip file of the dist folder with the version as filename
 *
 * Usage:
 *   node scripts/create-release-zip.js
 *
 * Output: releases/licenses-client-1.0.0.zip
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { execSync } from 'child_process'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '..')

const versionJsonPath = path.join(rootDir, 'public', 'version.json')
const distDir = path.join(rootDir, 'dist')
const releasesDir = path.join(rootDir, 'releases')

// Read version
const versionJson = JSON.parse(fs.readFileSync(versionJsonPath, 'utf8'))
const version = versionJson.appVersion

// Create releases folder if it doesn't exist
if (!fs.existsSync(releasesDir)) {
  fs.mkdirSync(releasesDir, { recursive: true })
}

const zipFileName = `licenses-client-${version}.zip`
const zipFilePath = path.join(releasesDir, zipFileName)

// Remove existing zip if exists
if (fs.existsSync(zipFilePath)) {
  fs.unlinkSync(zipFilePath)
}

// Create zip using PowerShell (Windows) or zip command (Unix)
const isWindows = process.platform === 'win32'

if (isWindows) {
  execSync(
    `powershell -NoProfile -Command "Compress-Archive -Path '${distDir}\\*' -DestinationPath '${zipFilePath}'"`,
    { stdio: 'inherit' }
  )
} else {
  execSync(`cd "${distDir}" && zip -r "${zipFilePath}" .`, { stdio: 'inherit' })
}

console.log(`Release zip created: releases/${zipFileName}`)

