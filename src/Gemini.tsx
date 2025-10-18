import { useState, useMemo } from 'react'

function Gemini() {
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
      setResult(result)
    }
    reader.onerror = (error) => {
      console.error('FileReader error:', error)
    }
    reader.readAsDataURL(file)
  }

  const callApi = () => {
  }
  
  return (
    <>
      <div>
        <input type="file" accept="image/*" onChange={handleFileChange}/>
      </div>
      <div>
        <textarea
        readOnly
        value={result}
        onChange={resultChange}
        placeholder="gemini ask"
        rows={5}
        cols={40}></textarea>
      </div>
      <div>
        <button onClick={callApi}>分析開始</button>
      </div>
    </>
  )
}

export default Gemini
