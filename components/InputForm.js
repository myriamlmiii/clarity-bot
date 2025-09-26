"use client"

import { useState } from "react"
import { Copy, Download, FileUp } from "lucide-react"

export default function InputForm() {
  const [inputText, setInputText] = useState("")
  const [outputText, setOutputText] = useState("")
  const [simplificationLevel, setSimplificationLevel] = useState(50)
  const [isProcessing, setIsProcessing] = useState(false)

  const handleSimplify = async () => {
    if (!inputText.trim()) return

    setIsProcessing(true)

    try {
      const response = await fetch("/api/simplify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: inputText,
          level: simplificationLevel,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setOutputText(data.result)
      } else {
        console.error("Error:", data.error)
        setOutputText("Error: Failed to simplify text. Please try again.")
      }
    } catch (error) {
      console.error("Error:", error)
      setOutputText("Error: Failed to simplify text. Please try again.")
    } finally {
      setIsProcessing(false)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(outputText)
  }

  const downloadText = () => {
    const element = document.createElement("a")
    const file = new Blob([outputText], { type: "text/plain" })
    element.href = URL.createObjectURL(file)
    element.download = "simplified-text.txt"
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Input</h3>
            <button className="inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring">
              <FileUp className="h-4 w-4 mr-2" />
              Upload File
            </button>
          </div>
          <textarea
            className="w-full h-[300px] p-4 rounded-lg bg-muted/30 border border-border resize-none focus:outline-none focus:ring-2 focus:ring-primary/50"
            placeholder="Paste your text here..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Simplification Level</span>
                <span className="text-sm font-medium">
                  {simplificationLevel < 33 ? "Basic" : simplificationLevel < 66 ? "Standard" : "Advanced"}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="1"
                value={simplificationLevel}
                onChange={(e) => setSimplificationLevel(Number.parseInt(e.target.value))}
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Basic</span>
                <span>Advanced</span>
              </div>
            </div>
            <button
              onClick={handleSimplify}
              disabled={!inputText.trim() || isProcessing}
              className="w-full h-10 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? "Simplifying..." : "Simplify Text"}
            </button>
          </div>
        </div>

        {/* Output Section */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Result</h3>
            <div className="flex gap-2">
              <button
                className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-input bg-background text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
                onClick={copyToClipboard}
                disabled={!outputText}
              >
                <Copy className="h-4 w-4" />
                <span className="sr-only">Copy to clipboard</span>
              </button>
              <button
                className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-input bg-background text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
                onClick={downloadText}
                disabled={!outputText}
              >
                <Download className="h-4 w-4" />
                <span className="sr-only">Download text</span>
              </button>
            </div>
          </div>
          <div
            className={`w-full h-[300px] p-4 rounded-lg border transition-all duration-300 ${
              outputText ? "bg-primary/5 border-primary/20" : "bg-muted/30 border-border"
            }`}
          >
            {isProcessing ? (
              <div className="h-full flex items-center justify-center">
                <div className="flex flex-col items-center gap-2">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  <p className="text-sm text-muted-foreground">Processing...</p>
                </div>
              </div>
            ) : outputText ? (
              <div className="h-full">
                <p>{outputText}</p>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-center">
                <p className="text-muted-foreground">Simplified text will appear here</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

