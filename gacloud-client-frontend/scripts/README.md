# Universal Page Generator

This script automatically generates the complete folder and file structure for new pages in any module, following the established patterns in the codebase.

## Usage

```bash
node scripts/generate-page.js <module> <entity-name>
```

### Examples

```bash
# Generate cemiterios pages
node scripts/generate-page.js cemiterios defuntos-tipos
node scripts/generate-page.js cemiterios sepulturas-tipos

# Generate base module pages
node scripts/generate-page.js base paises
node scripts/generate-page.js base distritos

# Generate dashboard pages
node scripts/generate-page.js dashboard widgets
node scripts/generate-page.js dashboard analytics

# Generate any other module/entity combination
node scripts/generate-page.js my-module my-entity
```

## What it generates

The script creates a complete folder structure with all the necessary files:

```
src/pages/<module>/<entity-name>/
├── <entity-name>-page.tsx                  # Main page component
├── queries/
│   ├── <entity-name>-queries.ts           # React Query hooks
│   └── <entity-name>-mutations.ts        # Mutation hooks
└── components/
    ├── <entity-name>-create-page/
    │   └── <entity-name>-create-page.tsx   # Create page wrapper
    ├── <entity-name>-forms/
    │   ├── <entity-name>-create-form.tsx   # Create form component
    │   └── <entity-name>-update-form.tsx   # Update form component
    ├── <entity-name>-table/
    │   ├── <entity-name>-table.tsx        # Data table component
    │   ├── <entity-name>-columns.tsx      # Table column definitions
    │   ├── <entity-name>-cell-actions.tsx # Cell action buttons
    │   ├── <entity-name>-filter-controls.tsx # Filter controls
    │   └── <entity-name>-constants.ts     # Table constants
    └── <entity-name>-update-page/
        └── <entity-name>-update-page.tsx   # Update page wrapper
```

## Generated Features

Each generated page includes:

- **Main Page**: Complete page with breadcrumbs, data table, and pagination
- **Queries**: React Query hooks for data fetching, caching, and prefetching
- **Mutations**: CRUD operations with proper cache invalidation
- **Data Table**: Sortable, filterable table with pagination
- **Forms**: Create and update forms with validation
- **Filtering**: Search and filter capabilities
- **Window Management**: Integration with the window management system
- **Error Handling**: Comprehensive error handling and user feedback

## Next Steps After Generation

After running the script, you'll need to:

1. **Create DTO Types**: Add types in `src/types/dtos/<page-name>.dtos.ts`
2. **Create Service**: Add service in `src/lib/services/cemiterios/<page-name>-service/`
3. **Add Routes**: Update routing configuration
4. **Update Menu**: Add menu items if needed
5. **Test Components**: Verify everything works correctly

## Naming Conventions

The script automatically handles naming conversions:

- **Input**: `defuntos-tipos` (kebab-case)
- **PascalCase**: `DefuntosTipos` (for component names)
- **camelCase**: `defuntosTipos` (for variable names)
- **Title Case**: `Defuntos Tipos` (for display names)

## Template Features

All generated files include:

- TypeScript with proper typing
- React Query integration
- Form validation with Zod
- Error handling and loading states
- Responsive design
- Accessibility features
- Consistent styling with the existing codebase

## Customization

The generated files are templates that you can customize:

- Add more fields to forms
- Modify table columns
- Add custom validation rules
- Implement additional features
- Update styling and layout

The script provides a solid foundation that follows the established patterns in your codebase.
