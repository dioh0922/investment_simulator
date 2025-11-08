import { useState, } from 'react'

import './App.css'
import Gemini from './Gemini'
import Trade from './Trade'
import { Grid } from '@mui/material'

const App = () => {
  const [trigger, setTrigger] = useState(0)
  const [loading, setLoading] = useState(false)
  const [base64, setBase64] = useState<string | null>('')
  const [simulateParam, setSimulateParam] = useState<{
    value: number,
    spread: number,
    lossRateLimit: number,
  } | null>(null)

  const handleLoadFile = (e: string) => {
    setBase64(e)
  }
  const callApi = () => {
    setLoading(true)
    setTrigger(prev => prev + 1)
  }
  const callSimulate = (e: {
    value: number,
    spread: number,
    lossRateLimit: number,
  }) => {
    setLoading(true)
    setSimulateParam(e)
  }
  const apiDone = () => {
    setLoading(false)
  }
  return (
    <>
      <Grid container spacing={2}>
        <Grid size={{xs: 12, md:6}}>
          <Trade
          sendFile={handleLoadFile}
          callApi={callApi}
          callSimulate={callSimulate}
          loading={loading}
          disabled={!base64}/>
        </Grid>
        <Grid size={{xs: 12, md:6}}>
          <Gemini
            base64={base64}
            trigger={trigger}
            loading={loading}
            simulate={simulateParam}
            apiDone={apiDone}/>
        </Grid>
      </Grid>
    </>
  )
}

export default App
