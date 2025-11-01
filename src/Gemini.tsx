import { useState, useEffect  } from 'react'
import axios from 'axios'
import { Box, Paper, TextField } from '@mui/material'


const Gemini = ({base64, trigger, loading, apiDone}:{
  base64: string | null,
  trigger: number,
  loading: boolean,
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

  useEffect(() => {
    callGemini()
  }, [trigger])

  const callGemini = () => {
    const param = parseDataUrl(base64 ?? '')
    if (!param) return
    const prompt = "あなたは投資の専門家です。投資の勉強中で演習問題として以下のチャートの傾向を教えてください。"
    + "また、前提条件として企業の業績などの外的要因はこの時点では無視して構いません。"
    axios.post(apiUrl + 'callGemini.php', {
      prompt: prompt,
      base64: param.base64Data,
      mime: param.mimeType,
    }).then((res) => {
      setResult(res.data.answer ?? '')
    }).catch((err) => {
      console.log(err)
    }).finally(() => {
      apiDone()
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
        <Box>
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
        </Box>
      </Paper>
    </>
  )
}

export default Gemini
