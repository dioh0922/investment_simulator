import { useState, useMemo } from 'react'
import { Stack, Grid, Paper, TextField, Typography } from '@mui/material'

function Trade(){

    const [value, setValue] = useState(0)
    const valueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue(Number(e.target.value))
    }
    const [spread, setSpread] = useState(0.02)
    const spreadChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setSpread(Number(e.target.value))
    }
  
    const [lossRateLimit, setLossRateLimit] = useState(3)
    const lossRateLimitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setLossRateLimit(Number(e.target.value))
    }
    
    const profitLimitValue = useMemo(() => {
      const result = ((1 + Number(spread)) * value) * ((100 + (lossRateLimit * 2)) / 100.0)
      return result.toFixed(2)
    }, [value, spread, lossRateLimit])
  
    const lossLimitValue = useMemo(() => {
      const result = ((1 + Number(spread)) * value) * ((100 - lossRateLimit) / 100.0)
      return result.toFixed(2)
    }, [value, spread, lossRateLimit])

  return (
    <>
      <Paper sx={{ p: 3, maxWidth: 600, margin: "auto" }}>
        <Stack spacing={3}>
          <Grid container spacing={2}>
            <Grid size={6}>
              <TextField
                label="スプレッド"
                type="number"
                slotProps={{
                  htmlInput:{
                    step:"0.01"
                  }
                }}
                value={spread}
                onChange={spreadChange}
                fullWidth
                size="small"
              />
            </Grid>
            <Grid size={6}>
              <TextField
                label="損益範囲"
                type="number"
                value={lossRateLimit}
                onChange={lossRateLimitChange}
                fullWidth
                size="small"
              />
            </Grid>
          </Grid>
        </Stack>
      </Paper>

      <Paper variant="outlined" sx={{ p: 2 }}>
        <Stack spacing={2}>
          <TextField
            label="エントリー"
            type="number"
            value={value}
            onChange={valueChange}
            fullWidth
            size="small"
          />
          <Typography variant="body1">取得価格：{value}</Typography>
          <Typography variant="body1" color="success.main">
            利確ライン：{profitLimitValue}
          </Typography>
          <Typography variant="body1" color="error.main">
            損切りライン：{lossLimitValue}
          </Typography>
        </Stack>
      </Paper>
    </>
  )
}

export default Trade