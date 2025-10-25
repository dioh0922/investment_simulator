import { useState, useMemo } from 'react'
import { LoadingButton } from '@mui/lab';
import axios from 'axios'

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
      <div>
        <input type="file" accept="image/*" onChange={handleFileChange}/>
        <LoadingButton
          loading={loading}
          onClick={callApi}
          disabled={!fileLoaded}
          variant="contained"
        >
          分析開始
        </LoadingButton>
      </div>
      <div>
        <textarea
        name="result"
        readOnly
        value={result}
        onChange={resultChange}
        placeholder="gemini ask"
        rows={50}
        cols={80}></textarea>
      </div>
    </>
  )
}

export default Gemini
