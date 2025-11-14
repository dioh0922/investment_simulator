import { useState, useEffect  } from 'react'
import axios from 'axios'
import { Box, Paper, TextField, CircularProgress } from '@mui/material'


const Gemini = ({base64, trigger, loading, simulate, apiDone}:{
  base64: string | null,
  trigger: number,
  loading: boolean,
  simulate:{
    value: number,
    spread: number,
    lossRateLimit: number,
  } | null,
  apiDone: () => void
}) => {
  const parseDataUrl = (inputData: string): { mimeType: string, base64Data: string } | null => {
    const match = inputData.match(/^data:([^;]+);base64,(.+)$/);
    if (!match) return null;

    const [, mimeType, base64Data] = match;
    return { mimeType, base64Data };
  }
  const apiUrl = import.meta.env.VITE_API_URL;
  const [result, setResult] = useState('')
  const resultChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setResult(e.target.value)
  }

  const callGemini = (param: {
    prompt: string,
    base64: string | null,
    mime: string | null,
  }) => {
    axios.post(apiUrl + 'callGemini.php', param)
    .then((res) => {
      setResult(res.data.answer ?? res.data)
    }).catch((err) => {
      console.log(err)
    }).finally(() => {
      apiDone()
    })
  }

  useEffect(() => {
    callGeminiChart()
  }, [trigger])

  useEffect(() => {
    if (!simulate) return
    callGeminiSimulate()
  }, [simulate])

  const callGeminiSimulate = () => {
    if (!simulate) return
    const param = parseDataUrl(base64 ?? '')
    if (!param) return
    
    const prompt = "あなたは投資の専門家です。投資の勉強で演習問題として以下のチャートの形状でのシナリオを考えてください。"
    + "シナリオは1日単位のトレード、1週間単位のトレード、数か月以上のトレードで考えてください。"
    + "また、前提条件として企業の業績などの外的要因はこの時点では無視して構いません。"
    + "チャートは形状のみから傾向を求めてください。値段は無視してください。"
    + "ポジションの情報："+JSON.stringify({
      "エントリー時の値段":simulate?.value,
      "損失":simulate.lossRateLimit+"%",
      "利益":(simulate.lossRateLimit * 2)+"%",
      "スプレッド":simulate.spread})
    callGemini({
      prompt: prompt,
      base64: param.base64Data,
      mime: param.mimeType,
    })

  }

  const callGeminiChart = () => {
    const param = parseDataUrl(base64 ?? '')
    if (!param) return
    const prompt = "あなたは投資の専門家です。投資の勉強中で演習問題として以下のチャートの傾向を教えてください。"
    + "また、前提条件として企業の業績などの外的要因はこの時点では無視して構いません。"
    callGemini({
      prompt: prompt,
      base64: param.base64Data,
      mime: param.mimeType,
    })
  }
  
  return (
    <>
      <Paper
        sx={{
          p: 3,
          m: "auto",
          maxWidth: 800,
          display: "flex",
          flexDirection: "column",
          gap: 3,
        }}
        elevation={3}
      >

        {/* --- 結果表示エリア --- */}
        <Box sx={{position: 'relative', width: '100%'}}>
          <TextField
            multiline
            fullWidth
            value={result}
            onChange={resultChange}
            placeholder="Gemini ask result..."
            rows={20}
            variant="outlined"
            InputProps={{
              readOnly: true,
            }}
          />
          {loading && (
            <Box
              sx={{
                position: 'absolute',
                inset: 0,
                bgcolor: 'rgba(255,255,255,0.6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 1,
              }}
            >
            <CircularProgress size={"12rem"} />
            </Box>
          )}
        </Box>
      </Paper>
    </>
  )
}

export default Gemini
