# Window Communication Mechanism

This document explains how to implement automatic selection of newly created items from child windows.

## Overview

The window communication mechanism allows a parent window to automatically select a newly created item from a child window. This is useful for forms where users need to create related entities (like creating a "rua" from a "localização" form).

## How it Works

1. **Parent Window**: Opens a child window for creating an item
2. **Child Window**: Creates the item and sets return data
3. **Parent Window**: Automatically detects the return data and selects the new item

## Implementation

### 1. In the Parent Window (e.g., Any Form)

```typescript
import { openRuaCreationWindow } from '@/utils/window-utils'
// Or use the generic function for custom routes
import { openCreationWindow } from '@/utils/window-utils'
import { useAutoSelection } from '@/hooks/use-auto-selection'

// Pre-defined function

// Use the auto-selection hook for any entity type
useAutoSelection({
  windowId,
  instanceId,
  data: yourEntityData, // e.g., ruasData, sepulturasData, etc.
  setValue: (value: string) => form.setValue('yourFieldId', value),
  refetch: refetchYourData,
  itemName: 'Your Entity Name', // e.g., 'Rua', 'Sepultura', etc.
  successMessage: 'Your record was selected automatically',
  manualSelectionMessage:
    'Your record was created successfully. Please select it manually.',
})

// Function to open any creation window (simplified)
const handleCreateEntity = () => {
  openRuaCreationWindow(
    // Pre-defined function
    navigate,
    windowId,
    addWindow,
    updateWindowState,
    findWindowByPathAndInstanceId
  )
}

const handleCreateCustomEntity = () => {
  openCreationWindow(
    navigate,
    windowId,
    '/your/custom/route/create',
    addWindow,
    updateWindowState,
    findWindowByPathAndInstanceId
  )
}
```

## Pre-defined Creation Window Functions

For common entities, you can use these pre-defined functions:

```typescript
import {
  openPaisCreationWindow,
  openSepulturaCreationWindow,
  openDistritoCreationWindow,
  openConcelhoCreationWindow,
  openFreguesiaCreationWindow,
  openRuaCreationWindow,
} from '@/utils/window-utils'

// Usage is always the same
openRuaCreationWindow(
  navigate,
  windowId,
  addWindow,
  updateWindowState,
  findWindowByPathAndInstanceId
)
openSepulturaCreationWindow(
  navigate,
  windowId,
  addWindow,
  updateWindowState,
  findWindowByPathAndInstanceId
)
// etc...
```

## Examples for Different Entity Types

### Example 1: Creating Ruas from Localização Form

```typescript
// In localizacao form
useAutoSelection({
  windowId,
  instanceId,
  data: ruasData,
  setValue: (value: string) => form.setValue('ruaId', value),
  refetch: refetchRuas,
  itemName: 'Rua',
})

const handleCreateRua = () => {
  openRuaCreationWindow(
    // Pre-defined function
    navigate,
    windowId,
    addWindow,
    updateWindowState,
    findWindowByPathAndInstanceId
  )
}
```

### Example 2: Creating Sepulturas from Another Form

```typescript
// In any form that needs sepulturas
useAutoSelection({
  windowId,
  instanceId,
  data: sepulturasData,
  setValue: (value: string) => form.setValue('sepulturaId', value),
  refetch: refetchSepulturas,
  itemName: 'Sepultura',
})

const handleCreateSepultura = () => {
  openSepulturaCreationWindow(
    // Pre-defined function
    navigate,
    windowId,
    addWindow,
    updateWindowState,
    findWindowByPathAndInstanceId
  )
}
```

### Example 3: Creating Distritos from Localização Form

```typescript
// In localizacao form
useAutoSelection({
  windowId,
  instanceId,
  data: distritosData,
  setValue: (value: string) => form.setValue('distritoId', value),
  refetch: refetchDistritos,
  itemName: 'Distrito',
})

const handleCreateDistrito = () => {
  openDistritoCreationWindow(
    // Pre-defined function
    navigate,
    windowId,
    addWindow,
    updateWindowState,
    findWindowByPathAndInstanceId
  )
}
```

## Fallback Mechanisms

The system includes multiple fallback mechanisms to ensure reliable communication:

1. **Primary**: Direct child window communication
2. **First Fallback**: InstanceId-based return data
3. **Second Fallback**: Parent window ID from storage
4. **Third Fallback**: SessionStorage backup

## Creating Custom Creation Windows

To create a new creation window for a different entity:

```typescript
// Create a new utility function
export function openCustomCreationWindow(
  navigate: (path: string) => void,
  parentWindowId: string,
  addWindow: (window: Omit<WindowState, 'isMinimized'>) => void,
  updateWindowState: (id: string, updates: Partial<WindowState>) => void,
  findWindowByPathAndInstanceId: (
    path: string,
    instanceId: string
  ) => WindowState | undefined
) {
  return openCreationWindow(
    navigate,
    parentWindowId,
    '/your/custom/route/create',
    addWindow,
    updateWindowState,
    findWindowByPathAndInstanceId
  )
}
```

## Benefits

- **Generic**: Works with any entity type, not just a single category
- **Automatic Selection**: No manual selection required
- **Multiple Fallbacks**: Reliable communication even if primary mechanism fails
- **Reusable**: Easy to implement in other forms
- **Clean Code**: Minimal boilerplate with the `useAutoSelection` hook
- **User Experience**: Seamless workflow for creating related entities

### 2. In the Child Window (e.g., Any Creation Form)

```typescript
import { setReturnDataWithFallbacks } from '@/utils/window-utils'

// In the form submission
const onSubmit = async (values: YourFormSchemaType) => {
  const response = await createYourEntityMutation.mutateAsync(submitData)
  if (response.info.succeeded) {
    const newEntityId = response.info.data

    // Set return data for parent window
    if (effectiveWindowId) {
      setReturnDataWithFallbacks(
        effectiveWindowId,
        { id: newEntityId, nome: values.nome }, // or any other identifier
        setWindowReturnData,
        parentWindowIdFromStorage || undefined
      )
    }

    toast.success('Entity created successfully')
    handleClose()
  }
}
```

## Examples for Different Entity Types
