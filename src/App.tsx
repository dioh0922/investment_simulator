import { useState, useMemo } from 'react'

import './App.css'
import Gemini from './Gemini'
import Trade from './Trade'
import { Grid } from '@mui/material'

function App() {

  return (
    <>
      <Grid container spacing={2}>
        <Grid size={{xs: 12, md:6}}>
          <Trade/>
        </Grid>
        <Grid size={{xs: 12, md:6}}>
          <Gemini/>
        </Grid>
      </Grid>
    </>
  )
}

export default App
