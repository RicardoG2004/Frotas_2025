import { useState, useEffect, useCallback } from 'react'
import ClearIcon from '@mui/icons-material/Clear'
import FilterListIcon from '@mui/icons-material/FilterList'
import LinkIcon from '@mui/icons-material/Link'
import LinkOffIcon from '@mui/icons-material/LinkOff'
import {
  Box,
  Typography,
  IconButton,
  Stack,
  Button,
  Tooltip,
} from '@mui/material'

interface SvgFilterProps {
  svgElement: SVGElement | null
  onFilterChange: (filteredShapes: SVGElement[]) => void
}

interface FilterState {
  showWithRelationId: boolean
  showWithoutRelationId: boolean
  selectedRelationIds: string[]
  isExpanded: boolean
}

export function SvgFilter({ svgElement, onFilterChange }: SvgFilterProps) {
  const [filterState, setFilterState] = useState<FilterState>({
    showWithRelationId: false,
    showWithoutRelationId: false,
    selectedRelationIds: [],
    isExpanded: false,
  })

  const [availableRelationIds, setAvailableRelationIds] = useState<string[]>([])

  // Extract all relation IDs from the SVG (only from sepulturas)
  const extractRelationIds = useCallback(() => {
    if (!svgElement) return []

    const shapes = svgElement.querySelectorAll(
      'path, rect, circle, ellipse, polygon'
    )
    const relationIds = new Set<string>()

    shapes.forEach((shape) => {
      const shapeType = shape.getAttribute('data-shape-type')?.toLowerCase()
      // Only consider sepulturas
      if (shapeType === 'sepultura') {
        const relationId = shape.getAttribute('data-relation-id')
        if (relationId && relationId.trim() !== '') {
          relationIds.add(relationId)
        }
      }
    })

    return Array.from(relationIds).sort()
  }, [svgElement])

  // Apply filters to SVG elements
  const applyFilters = useCallback(() => {
    if (!svgElement) return

    const shapes = svgElement.querySelectorAll(
      'path, rect, circle, ellipse, polygon'
    )
    const filteredShapes: SVGElement[] = []

    shapes.forEach((shape) => {
      const relationId = shape.getAttribute('data-relation-id')
      const hasRelationId = relationId && relationId.trim() !== ''
      const shapeType = shape.getAttribute('data-shape-type')?.toLowerCase()

      // Only filter sepulturas - other shapes always show
      if (shapeType !== 'sepultura') {
        filteredShapes.push(shape as SVGElement)
        return
      }

      let shouldShow = false

      if (hasRelationId) {
        // Show sepulturas with relation ID only if that option is enabled
        if (
          filterState.showWithRelationId &&
          !filterState.showWithoutRelationId
        ) {
          // If specific relation IDs are selected, only show those
          if (filterState.selectedRelationIds.length > 0) {
            shouldShow = filterState.selectedRelationIds.includes(relationId)
          } else {
            shouldShow = true
          }
        } else if (
          !filterState.showWithRelationId &&
          !filterState.showWithoutRelationId
        ) {
          // If both options are disabled, show all sepulturas (initial state)
          shouldShow = true
        }
      } else {
        // Show sepulturas without relation ID only if that option is enabled
        if (
          filterState.showWithoutRelationId &&
          !filterState.showWithRelationId
        ) {
          shouldShow = true
        } else if (
          !filterState.showWithRelationId &&
          !filterState.showWithoutRelationId
        ) {
          // If both options are disabled, show all sepulturas (initial state)
          shouldShow = true
        }
      }

      if (shouldShow) {
        filteredShapes.push(shape as SVGElement)
      }
    })

    onFilterChange(filteredShapes)
  }, [svgElement, filterState, onFilterChange])

  // Update available relation IDs when SVG changes
  useEffect(() => {
    const relationIds = extractRelationIds()
    setAvailableRelationIds(relationIds)
  }, [extractRelationIds])

  // Apply filters when filter state changes
  useEffect(() => {
    applyFilters()
  }, [applyFilters])

  const handleToggleWithRelationId = () => {
    setFilterState((prev) => ({
      ...prev,
      showWithRelationId: !prev.showWithRelationId,
      showWithoutRelationId: false, // Turn off the other option
      selectedRelationIds: [], // Clear specific selections when toggling
    }))
  }

  const handleToggleWithoutRelationId = () => {
    setFilterState((prev) => ({
      ...prev,
      showWithoutRelationId: !prev.showWithoutRelationId,
      showWithRelationId: false, // Turn off the other option
      selectedRelationIds: [], // Clear specific selections when toggling
    }))
  }

  const handleClearFilters = () => {
    setFilterState({
      showWithRelationId: false,
      showWithoutRelationId: false,
      selectedRelationIds: [],
      isExpanded: false,
    })
  }

  const handleToggleExpanded = () => {
    setFilterState((prev) => ({
      ...prev,
      isExpanded: !prev.isExpanded,
    }))
  }

  const getFilteredCount = () => {
    if (!svgElement) return 0

    const shapes = svgElement.querySelectorAll(
      'path, rect, circle, ellipse, polygon'
    )
    let count = 0

    shapes.forEach((shape) => {
      const relationId = shape.getAttribute('data-relation-id')
      const hasRelationId = relationId && relationId.trim() !== ''
      const shapeType = shape.getAttribute('data-shape-type')?.toLowerCase()

      if (shapeType !== 'sepultura') return

      if (hasRelationId) {
        // Count sepulturas with relation ID only if that option is enabled
        if (
          filterState.showWithRelationId &&
          !filterState.showWithoutRelationId
        ) {
          if (filterState.selectedRelationIds.length > 0) {
            if (filterState.selectedRelationIds.includes(relationId)) {
              count++
            }
          } else {
            count++
          }
        } else if (
          !filterState.showWithRelationId &&
          !filterState.showWithoutRelationId
        ) {
          // If both options are disabled, count all sepulturas (initial state)
          count++
        }
      } else {
        // Count sepulturas without relation ID only if that option is enabled
        if (
          filterState.showWithoutRelationId &&
          !filterState.showWithRelationId
        ) {
          count++
        } else if (
          !filterState.showWithRelationId &&
          !filterState.showWithoutRelationId
        ) {
          // If both options are disabled, count all sepulturas (initial state)
          count++
        }
      }
    })

    return count
  }

  const getTotalSepulturasCount = () => {
    if (!svgElement) return 0

    const shapes = svgElement.querySelectorAll(
      'path, rect, circle, ellipse, polygon'
    )
    let count = 0

    shapes.forEach((shape) => {
      const shapeType = shape.getAttribute('data-shape-type')?.toLowerCase()
      if (shapeType === 'sepultura') {
        count++
      }
    })

    return count
  }

  const totalSepulturas = getTotalSepulturasCount()
  const filteredCount = getFilteredCount()

  // Don't render if no SVG element
  console.log('[SvgFilter] Rendering with svgElement:', svgElement)
  if (!svgElement) {
    console.log('[SvgFilter] No SVG element, returning null')
    return null
  }

  return (
    <Stack
      direction='row'
      spacing={1}
      sx={{
        position: 'absolute',
        top: 80,
        right: 16,
        zIndex: 1000,
        bgcolor: 'background.paper',
        borderRadius: 1,
        p: 1,
        boxShadow: 1,
      }}
    >
      <Tooltip title='Filtros Sepulturas'>
        <IconButton
          onClick={handleToggleExpanded}
          size='small'
          color={
            filterState.showWithRelationId || filterState.showWithoutRelationId
              ? 'primary'
              : 'default'
          }
        >
          <FilterListIcon />
        </IconButton>
      </Tooltip>

      <Tooltip title='Com Relation ID'>
        <IconButton
          onClick={handleToggleWithRelationId}
          size='small'
          color={filterState.showWithRelationId ? 'primary' : 'default'}
        >
          <LinkIcon />
        </IconButton>
      </Tooltip>

      <Tooltip title='Sem Relation ID'>
        <IconButton
          onClick={handleToggleWithoutRelationId}
          size='small'
          color={filterState.showWithoutRelationId ? 'primary' : 'default'}
        >
          <LinkOffIcon />
        </IconButton>
      </Tooltip>

      <Tooltip title='Limpar Filtros'>
        <IconButton
          onClick={handleClearFilters}
          size='small'
          disabled={
            !filterState.showWithRelationId &&
            !filterState.showWithoutRelationId
          }
        >
          <ClearIcon />
        </IconButton>
      </Tooltip>

      {/* Expanded Filter Panel */}
      {filterState.isExpanded && (
        <Box
          sx={{
            position: 'absolute',
            top: '100%',
            right: 0,
            mt: 1,
            bgcolor: 'background.paper',
            borderRadius: 1,
            p: 2,
            boxShadow: 3,
            minWidth: 280,
            zIndex: 1001,
          }}
        >
          <Typography variant='subtitle2' sx={{ mb: 2 }}>
            Filtros Sepulturas ({filteredCount}/{totalSepulturas})
          </Typography>

          {/* Specific Relation ID Filter */}
          {availableRelationIds.length > 0 &&
            filterState.showWithRelationId && (
              <Box sx={{ mb: 2 }}>
                <Typography variant='caption' sx={{ mb: 1, display: 'block' }}>
                  Relation IDs Específicos:
                </Typography>
                <Box sx={{ maxHeight: 120, overflowY: 'auto' }}>
                  {availableRelationIds.map((relationId) => (
                    <Box
                      key={relationId}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        p: 0.5,
                        cursor: 'pointer',
                        borderRadius: 0.5,
                        '&:hover': {
                          bgcolor: 'action.hover',
                        },
                      }}
                      onClick={() => {
                        const isSelected =
                          filterState.selectedRelationIds.includes(relationId)
                        setFilterState((prev) => ({
                          ...prev,
                          selectedRelationIds: isSelected
                            ? prev.selectedRelationIds.filter(
                                (id) => id !== relationId
                              )
                            : [...prev.selectedRelationIds, relationId],
                        }))
                      }}
                    >
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          bgcolor: filterState.selectedRelationIds.includes(
                            relationId
                          )
                            ? 'primary.main'
                            : 'action.disabled',
                          mr: 1,
                        }}
                      />
                      <Typography variant='caption'>{relationId}</Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            )}

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Typography variant='caption' color='text.secondary'>
              {filteredCount}/{totalSepulturas} sepulturas
            </Typography>
            <Button
              size='small'
              onClick={handleClearFilters}
              disabled={
                !filterState.showWithRelationId &&
                !filterState.showWithoutRelationId
              }
              sx={{ minWidth: 'auto', p: 0.5 }}
            >
              Limpar
            </Button>
          </Box>
        </Box>
      )}
    </Stack>
  )
}
