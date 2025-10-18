import { useState, useMemo } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Gemini from './Gemini'

function App() {

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
      <div>
        スプレッド：<input type="number" step="0.01" value={spread} onChange={spreadChange}/>
        損益範囲：<input type="number" value={lossRateLimit} onChange={lossRateLimitChange}/>
      </div>
      <div>
        エントリー：<input type="number" value={value} onChange={valueChange}/>
        <p>取得価格：{value}</p>
        <p>利確ライン：{profitLimitValue}</p>
        <p>損切りライン：{lossLimitValue}</p>
      </div>
      <Gemini/>
    </>
  )
}

export default App
