import { Box, Typography, Paper } from '@mui/material'
import { ShapeData } from '../types'

interface ShapeTooltipProps {
  data: ShapeData
}

export function ShapeTooltip({ data }: ShapeTooltipProps) {
  if (!data) return null

  const tipoValue = data['shape-type']
  const showSubtitle = !!data.name && !!data['shape-type']
  const hasRelation = Boolean(data['relation-id'])

  return (
    <Paper
      elevation={12}
      sx={{
        display: 'flex',
        flexDirection: 'row',
        p: 0,
        maxWidth: 320,
        minWidth: 180,
        background: 'hsl(var(--card))',
        borderRadius: 'var(--radius)',
        border: '1px solid hsl(var(--border))',
        boxShadow: 'var(--shadow-lg)',
        overflow: 'hidden',
        transition: 'all 0.2s ease-in-out',
      }}
    >
      {/* Accent bar */}
      <Box
        sx={{
          width: 6,
          background: 'hsl(var(--primary))',
          flexShrink: 0,
          borderTopLeftRadius: 'var(--radius)',
          borderBottomLeftRadius: 'var(--radius)',
        }}
      />
      {/* Content */}
      <Box
        sx={{
          p: 1.5,
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: 1.2,
        }}
      >
        <Typography
          variant='h6'
          fontWeight='bold'
          sx={{
            mb: showSubtitle ? 0.2 : 0.8,
            letterSpacing: 0.3,
            fontSize: '1.08rem',
            lineHeight: 1.15,
            color: 'hsl(var(--foreground))',
            textShadow: '0 1px 4px hsl(var(--border))',
          }}
        >
          {tipoValue}
        </Typography>
        {/* Fields */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.7 }}>
          {data.name && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.7 }}>
              <Typography
                variant='body2'
                sx={{
                  fontWeight: 500,
                  minWidth: 60,
                  color: 'hsl(var(--muted-foreground))',
                }}
              >
                Nome
              </Typography>
              <Typography
                variant='body2'
                sx={{ fontWeight: 600, color: 'hsl(var(--foreground))' }}
              >
                {String(data.name)}
              </Typography>
            </Box>
          )}
          {data['shape-type'] && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.7 }}>
              <Typography
                variant='body2'
                sx={{
                  fontWeight: 500,
                  minWidth: 60,
                  color: 'hsl(var(--muted-foreground))',
                }}
              >
                Tipo
              </Typography>
              <Typography
                variant='body2'
                sx={{ fontWeight: 600, color: 'hsl(var(--foreground))' }}
              >
                {tipoValue}
              </Typography>
            </Box>
          )}
          {/* Associated field */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.7 }}>
            <Typography
              variant='body2'
              sx={{
                fontWeight: 500,
                minWidth: 60,
                color: 'hsl(var(--muted-foreground))',
              }}
            >
              Associado
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.7 }}>
              <Box
                sx={{
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  bgcolor: hasRelation
                    ? 'hsl(var(--success))'
                    : 'hsl(var(--destructive))',
                  boxShadow: hasRelation
                    ? '0 0 0 1.5px hsl(var(--success) / 0.2)'
                    : '0 0 0 1.5px hsl(var(--destructive) / 0.2)',
                  mr: 0.7,
                }}
              />
              <Box
                sx={{
                  px: 1,
                  py: 0.1,
                  borderRadius: 'var(--radius)',
                  bgcolor: hasRelation
                    ? 'hsl(var(--success) / 0.1)'
                    : 'hsl(var(--destructive) / 0.1)',
                  color: hasRelation
                    ? 'hsl(var(--success))'
                    : 'hsl(var(--destructive))',
                  fontWeight: 700,
                  fontSize: '0.92rem',
                  display: 'flex',
                  alignItems: 'center',
                  minWidth: 28,
                  justifyContent: 'center',
                  boxShadow: hasRelation
                    ? '0 1px 2px hsl(var(--success) / 0.2)'
                    : '0 1px 2px hsl(var(--destructive) / 0.2)',
                }}
              >
                {hasRelation ? 'Sim' : 'Não'}
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Paper>
  )
}
