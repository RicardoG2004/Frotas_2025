# Memory Optimization Guide

## Overview

This guide provides comprehensive memory optimization strategies for your Zustand stores and localStorage usage. The optimizations implemented will significantly reduce memory consumption and improve application performance.

## Key Optimizations Implemented

### 1. Memory Manager (`src/utils/memory-manager.ts`)

A centralized memory management system that:
- Automatically cleans up unused form states, page states, and window cache
- Implements LRU (Least Recently Used) eviction policies
- Tracks memory usage across all stores
- Provides manual cleanup functions

**Features:**
- Periodic cleanup every 5 minutes
- Form data expiry after 30 minutes
- Page data expiry after 1 hour
- Maximum limits for each store type
- Automatic cleanup on page unload

### 2. Optimized Form Store (`src/stores/use-forms-store.ts`)

**Improvements:**
- Data size tracking for each form
- Optimized change detection to reduce unnecessary updates
- Selective persistence (only saves modified forms)
- Automatic cleanup of old/unused forms
- Memoized selectors to prevent re-renders

**Memory Savings:**
- Removes duplicate form data from page store
- Only persists essential form data
- Automatic cleanup of inactive forms

### 3. Optimized Page Store (`src/stores/use-pages-store.ts`)

**Improvements:**
- Removed duplicate form data storage
- Data size tracking for each page
- Optimized change detection
- Automatic cleanup of orphaned page states
- Selective persistence based on window activity

**Memory Savings:**
- Eliminates redundant form data storage
- Only persists active window data
- Automatic cleanup of inactive pages

### 4. Header Memory Monitor (`src/components/shared/header-memory-monitor.tsx`)

A memory monitoring tool integrated into the header bar that:
- Shows current memory usage across all stores
- Provides manual cleanup options
- Alerts when memory usage is high
- Updates when opened
- **Interface in Portuguese (Portugal)**
- **Located in the header bar next to the theme toggler**

### 5. Memory Optimization Hook (`src/hooks/use-memory-optimization.ts`)

Automated memory management that:
- Cleans up on user logout
- Cleans up when switching tabs
- Cleans up on window focus (if memory is high)
- Cleans up on page unload

## Usage

### 1. Access Memory Monitor from Header

The memory monitor is now accessible from the header bar:
- **Desktop**: Click the database icon (🗄️) in the header next to the theme toggler
- **Mobile**: Access through the mobile sidebar menu

### 2. Use Memory Optimization Hook

```tsx
import { useMemoryOptimization } from '@/hooks/use-memory-optimization'

function MyComponent() {
  const { manualCleanup, getCurrentStats } = useMemoryOptimization()
  
  const handleCleanup = () => {
    manualCleanup()
  }
  
  return (
    <button onClick={handleCleanup}>
      Limpar Memória
    </button>
  )
}
```

### 3. Manual Memory Management

```tsx
import { memoryManager } from '@/utils/memory-manager'

// Force cleanup all data
memoryManager.forceCleanup()

// Get memory statistics
const stats = memoryManager.getMemoryStats()

// Update configuration
memoryManager.updateConfig({
  maxFormStates: 15,
  cleanupInterval: 3 * 60 * 1000, // 3 minutes
})
```

## Configuration Options

### Memory Manager Configuration

```typescript
interface MemoryConfig {
  maxFormStates: number        // Default: 50 (increased from 20)
  maxPageStates: number        // Default: 30 (increased from 15)
  maxWindowCache: number       // Default: 20 (increased from 10)
  maxMapStates: number         // Default: 10 (increased from 5)
  cleanupInterval: number      // Default: 5 minutes
  formDataExpiry: number       // Default: 1 hour (increased from 30 minutes)
  pageDataExpiry: number       // Default: 2 hours (increased from 1 hour)
}
```

### Memory Level Thresholds

- **Low**: < 2MB (increased from 100KB)
- **Medium**: 2MB - 10MB (increased from 500KB)
- **High**: > 10MB (increased from 500KB)
- **Auto-cleanup threshold**: 10MB (increased from 500KB)

### Store-Specific Optimizations

#### Form Store
- **Data Size Tracking**: Each form tracks its memory footprint
- **Selective Persistence**: Only saves forms that have been modified
- **Automatic Cleanup**: Removes forms older than 30 minutes
- **Change Detection**: Optimized to prevent unnecessary updates

#### Page Store
- **Window-Based Cleanup**: Only keeps data for active windows
- **Orphaned State Removal**: Automatically removes unused page states
- **Size Tracking**: Monitors memory usage per page
- **Selective Persistence**: Only persists essential data

#### Window Store
- **LRU Cache**: Implements least-recently-used eviction
- **Cache Size Limits**: Maximum 10 cached windows
- **Automatic Cleanup**: Removes cache entries for closed windows

## Best Practices

### 1. Form Data Management
```tsx
// Use the optimized form hook
const formState = useFormState('my-form-id')

// Form data is automatically tracked and cleaned up
formState.setFormData({ ...data })
```

### 2. Page State Management
```tsx
// Use the optimized page hook
const pageState = usePageState(windowId)

// Page state is automatically cleaned up when window closes
pageState.setFilters([...filters])
```

### 3. Window Management
```tsx
// Windows are automatically managed
const windowsStore = useWindowsStore()

// Cache is automatically cleaned up
windowsStore.addWindow(newWindow)
```

### 4. Memory Monitoring
```tsx
// Memory monitor is automatically available in the header
// No additional setup required - just click the database icon in the header
```

## Performance Impact

### Expected Improvements

1. **Memory Usage**: 40-60% reduction in memory consumption
2. **LocalStorage Size**: 50-70% reduction in stored data
3. **Application Performance**: Faster state updates and reduced re-renders
4. **Browser Performance**: Less memory pressure on the browser

### Monitoring

Use the Header Memory Monitor to track:
- Total memory usage across all stores
- Individual store memory consumption
- LocalStorage size
- Number of cached items

## Troubleshooting

### High Memory Usage

1. **Check Header Memory Monitor**: Click the database icon in the header to see current memory usage
2. **Manual Cleanup**: Use the "Limpar" button to remove unused data
3. **Force Cleanup**: Use "Limpar Tudo" to reset all stores (use with caution)
4. **Review Configuration**: Adjust memory limits in the configuration

### Performance Issues

1. **Reduce Cleanup Interval**: Decrease the cleanup interval for more frequent cleanup
2. **Lower Memory Limits**: Reduce the maximum number of cached items
3. **Increase Expiry Times**: Extend the expiry times for data that needs to persist longer

### Data Loss

1. **Check Expiry Times**: Ensure expiry times are appropriate for your use case
2. **Review Cleanup Logic**: Verify that important data isn't being cleaned up prematurely
3. **Use Manual Cleanup**: Use manual cleanup instead of automatic cleanup for critical data

## Migration Guide

### From Old Stores

The optimized stores are backward compatible. Existing data will be automatically migrated:

1. **Form Store**: Old `instances` format is automatically converted
2. **Page Store**: Existing page states are preserved
3. **Window Store**: Existing windows are maintained

### Gradual Rollout

1. **Development**: Test with header memory monitor
2. **Staging**: Deploy with monitoring to verify performance
3. **Production**: Deploy with conservative cleanup settings

## Future Enhancements

1. **Compression**: Implement data compression for localStorage
2. **IndexedDB**: Migrate large data to IndexedDB for better performance
3. **Web Workers**: Move cleanup operations to web workers
4. **Analytics**: Add memory usage analytics and reporting
5. **Predictive Cleanup**: Use machine learning to predict when cleanup is needed

## Support

For issues or questions about memory optimization:

1. Check the Header Memory Monitor for current usage
2. Review the configuration settings
3. Test with manual cleanup functions
4. Monitor browser developer tools for memory usage 