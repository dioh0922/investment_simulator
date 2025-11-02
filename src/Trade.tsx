import { useState, useMemo } from 'react'
import {
  Stack,
  Grid,
  Card,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  CardMedia,
  Button,
  Paper,
  TextField,
  Typography
} from '@mui/material'
import { LoadingButton } from '@mui/lab'

const Trade = ({ sendFile, callApi, loading, disabled }: {
  sendFile: (file: string) => void,
  callApi: () => void,
  loading: boolean,
  disabled: boolean
}) => {
    const [base64, setBase64] = useState('')
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

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (!file) return
  
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setBase64(result)
        sendFile(result)
      }
      reader.onerror = (error) => {
        console.error('FileReader error:', error)
      }
      reader.readAsDataURL(file)
    }

    const [expanded, setExpanded] = useState<string | false>(false)
    const handleExpand = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false)
    }

    const handleApiCall = () => {
      setExpanded('panel3')
      callApi()
    }

  return (
    <>
      <Box sx={{width: '100%'}}>
        <Accordion
          expanded={expanded === 'panel1'}
          onChange={handleExpand('panel1')}
        >
          <AccordionSummary
            aria-controls="panel1a-content"
            id="panel1a-header" >
              エントリー設定
          </AccordionSummary>
          <AccordionDetails>
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
          </AccordionDetails>
        </Accordion>

        <Accordion
          expanded={expanded === 'panel2'}
          onChange={handleExpand('panel2')}
        >
          <AccordionSummary
            aria-controls="panel2a-content"
            id="panel2a-header"
          >
            チャート
          </AccordionSummary>
          <AccordionDetails>
            <Paper variant="outlined" sx={{ p: 2 }}>
              {/* --- アップロードとボタン --- */}
              <Stack direction="row" spacing={2} alignItems="center">
                <Button
                  variant="outlined"
                  component="label"
                  sx={{ minWidth: 150 }}
                >
                  画像を選択
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={handleFileChange}
                  />
                </Button>

                <LoadingButton
                  loading={loading}
                  onClick={handleApiCall}
                  disabled={disabled}
                  variant="contained"
                >
                  分析開始
                </LoadingButton>
              </Stack>
            </Paper>
          </AccordionDetails>
        </Accordion>
        <Accordion
          expanded={expanded === 'panel3'}
          onChange={handleExpand('panel3')}
        >
          <AccordionSummary
            aria-controls="panel3a-content"
            id="panel3a-header"
          >
            画像
          </AccordionSummary>
          <AccordionDetails>
            <Paper>
              <Stack direction="row" spacing={2} alignItems="center">
                <Card>
                  <CardMedia
                    component="img"
                    height="200"
                    image={base64}
                  />
                </Card>
              </Stack>
            </Paper>
          </AccordionDetails>
        </Accordion>
      </Box>
    </>
  )
}

export default Trade