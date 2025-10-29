#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Script to generate the complete folder and file structure for new pages
 * Usage: node scripts/generate-page.js <module> <entity-name>
 * Example: node scripts/generate-page.js cemiterios defuntos-tipos
 * Example: node scripts/generate-page.js base paises
 * Example: node scripts/generate-page.js dashboard widgets
 */

// Get the module and entity name from command line arguments
const moduleName = process.argv[2];
const entityName = process.argv[3];

if (!moduleName || !entityName) {
  console.error('❌ Error: Please provide both module and entity name');
  console.log('Usage: node scripts/generate-page.js <module> <entity-name>');
  console.log('Example: node scripts/generate-page.js cemiterios defuntos-tipos');
  console.log('Example: node scripts/generate-page.js base paises');
  console.log('Example: node scripts/generate-page.js dashboard widgets');
  process.exit(1);
}

// Convert kebab-case to PascalCase for component names
function toPascalCase(str) {
  return str
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
}

// Convert kebab-case to camelCase for variable names
function toCamelCase(str) {
  return str
    .split('-')
    .map((word, index) => 
      index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1)
    )
    .join('');
}

// Convert kebab-case to Title Case for display names
function toTitleCase(str) {
  return str
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

const pascalCaseName = toPascalCase(entityName);
const camelCaseName = toCamelCase(entityName);
const titleCaseName = toTitleCase(entityName);

// Base paths - now dynamic based on module
const basePath = path.join(__dirname, '..', 'src', 'pages', moduleName);
const pagePath = path.join(basePath, entityName);

// All templates removed - now creating empty files only

// Function to create directory if it doesn't exist
function createDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`✅ Created directory: ${dirPath}`);
  }
}

// Function to write file if it doesn't exist
function writeFile(filePath, content) {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Created file: ${filePath}`);
  } else {
    console.log(`⚠️  File already exists: ${filePath}`);
  }
}

// Main execution
console.log(`🚀 Generating ${titleCaseName} page structure...`);

try {
  // Create main directory
  createDir(pagePath);
  
  // Create components directory
  createDir(path.join(pagePath, 'components'));
  createDir(path.join(pagePath, 'components', `${entityName}-create-page`));
  createDir(path.join(pagePath, 'components', `${entityName}-forms`));
  createDir(path.join(pagePath, 'components', `${entityName}-table`));
  createDir(path.join(pagePath, 'components', `${entityName}-update-page`));
  
  // Create queries directory
  createDir(path.join(pagePath, 'queries'));

  // Write main page file
  writeFile(path.join(pagePath, `${entityName}-page.tsx`), '');

  // Write queries files
  writeFile(path.join(pagePath, 'queries', `${entityName}-queries.ts`), '');
  writeFile(path.join(pagePath, 'queries', `${entityName}-mutations.ts`), '');

  // Write table components
  writeFile(path.join(pagePath, 'components', `${entityName}-table`, `${entityName}-table.tsx`), '');
  writeFile(path.join(pagePath, 'components', `${entityName}-table`, `${entityName}-columns.tsx`), '');
  writeFile(path.join(pagePath, 'components', `${entityName}-table`, `${entityName}-cell-actions.tsx`), '');
  writeFile(path.join(pagePath, 'components', `${entityName}-table`, `${entityName}-filter-controls.tsx`), '');
  writeFile(path.join(pagePath, 'components', `${entityName}-table`, `${entityName}-constants.ts`), '');

  // Write form components (using singular form for individual entity)
  const singularEntityName = entityName.split('-').map(word => word.replace(/s$/, '')).join('-'); // Make each word singular
  writeFile(path.join(pagePath, 'components', `${entityName}-forms`, `${singularEntityName}-create-form.tsx`), '');
  writeFile(path.join(pagePath, 'components', `${entityName}-forms`, `${singularEntityName}-update-form.tsx`), '');

  // Write page components
  writeFile(path.join(pagePath, 'components', `${entityName}-create-page`, `${entityName}-create-page.tsx`), '');
  writeFile(path.join(pagePath, 'components', `${entityName}-update-page`, `${entityName}-update-page.tsx`), '');

  console.log(`\n🎉 Successfully generated ${titleCaseName} page structure!`);
  console.log(`\n📁 Generated files:`);
  console.log(`   - ${pagePath}/${entityName}-page.tsx`);
  console.log(`   - ${pagePath}/queries/${entityName}-queries.ts`);
  console.log(`   - ${pagePath}/queries/${entityName}-mutations.ts`);
  console.log(`   - ${pagePath}/components/${entityName}-table/${entityName}-table.tsx`);
  console.log(`   - ${pagePath}/components/${entityName}-table/${entityName}-columns.tsx`);
  console.log(`   - ${pagePath}/components/${entityName}-table/${entityName}-cell-actions.tsx`);
  console.log(`   - ${pagePath}/components/${entityName}-table/${entityName}-filter-controls.tsx`);
  console.log(`   - ${pagePath}/components/${entityName}-table/${entityName}-constants.ts`);
  console.log(`   - ${pagePath}/components/${entityName}-forms/${singularEntityName}-create-form.tsx`);
  console.log(`   - ${pagePath}/components/${entityName}-forms/${singularEntityName}-update-form.tsx`);
  console.log(`   - ${pagePath}/components/${entityName}-create-page/${entityName}-create-page.tsx`);
  console.log(`   - ${pagePath}/components/${entityName}-update-page/${entityName}-update-page.tsx`);
  
  console.log(`\n📝 Next steps:`);
  console.log(`   1. Create the DTO types in src/types/dtos/${entityName}.dtos.ts`);
  console.log(`   2. Create the service in src/lib/services/${moduleName}/${entityName}-service/`);
  console.log(`   3. Add routes to the routing configuration`);
  console.log(`   4. Update the menu items if needed`);
  console.log(`   5. Test the generated components`);

} catch (error) {
  console.error('❌ Error generating page structure:', error.message);
  process.exit(1);
}
