import { useState, useMemo } from 'react'
import { LoadingButton } from '@mui/lab';
import axios from 'axios'
import { Stack, Box, Button, Paper, TextField, Typography } from '@mui/material'


function Gemini() {

  const parseDataUrl = (dataUrl: string): { mimeType: string, base64Data: string } | null => {
    const match = dataUrl.match(/^data:([^;]+);base64,(.+)$/);
    if (!match) return null;

    const [, mimeType, base64Data] = match;
    return { mimeType, base64Data };
  }

  const apiUrl = import.meta.env.VITE_API_URL;
  const [result, setResult] = useState('')
    const resultChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setResult(e.target.value)
    }

  const [base64, setBase64] = useState<string | null>(null)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setBase64(result)
      setFileLoaded(true)
    }
    reader.onerror = (error) => {
      console.error('FileReader error:', error)
    }
    reader.readAsDataURL(file)
  }

  const [loading, setLoading] = useState(false);
  const [fileLoaded, setFileLoaded] = useState(false)


  const callApi = () => {
    const param = parseDataUrl(base64 ?? '')
    if (!param) return
    const prompt = "あなたは投資の専門家です。投資の勉強中で演習問題として以下のチャートの傾向を教えてください。"
    + "また、前提条件として企業の業績などの外的要因はこの時点では無視して構いません。"
    setLoading(true)
    axios.post(apiUrl + 'callGemini.php', {
      prompt: prompt,
      base64: param.base64Data,
      mime: param.mimeType,
    }).then((res) => {
      setResult(res.data.answer ?? '')
    }).catch((err) => {
      console.log(err)
    }).finally(() => {
      setLoading(false)
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
            onClick={callApi}
            disabled={!fileLoaded}
            variant="contained"
          >
            分析開始
          </LoadingButton>
        </Stack>

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
