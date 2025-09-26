"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Copy, Download, Book, Scale, Code, Sparkles, FileUp } from "lucide-react";
import { motion } from "framer-motion";

export default function TextSimplifier() {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [simplificationLevel, setSimplificationLevel] = useState([50]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);

  useEffect(() => {
    const words = inputText.trim().split(/\s+/).filter(Boolean);
    setWordCount(words.length);
    setCharCount(inputText.length);
  }, [inputText]);

  const handleSimplify = async () => {
    setError("");
    if (!inputText.trim()) return setError("Please enter text");
    if (inputText.length > 1500) return setError("Max 1500 characters");
    if (inputText.trim().split(/\s+/).length < 5) return setError("Minimum 5 words required");

    setIsProcessing(true);
    try {
      const level = simplificationLevel[0];
      const maxLength = level < 33 ? 300 : level < 66 ? 220 : 160;
      const minLength = level < 33 ? 120 : level < 66 ? 80 : 40;
      const temperature = level < 33 ? 0.3 : level < 66 ? 0.7 : 1.0;

      const response = await fetch("/api/simplify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: inputText,
          level: simplificationLevel[0],
          parameters: {
            max_length: maxLength,
            min_length: minLength,
            temperature,
          },
        }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Simplification failed");
      if (!data.simplified) throw new Error("Failed to generate summary");

      setOutputText(data.simplified.replace(/^(Summarize|Simplify):?/i, '').trim());
    } catch (error) {
      setError(error instanceof Error ? error.message : "Unknown error");
    } finally {
      setIsProcessing(false);
    }
  };

  const copyToClipboard = () => navigator.clipboard.writeText(outputText);

  const downloadText = () => {
    const element = document.createElement("a");
    element.href = URL.createObjectURL(new Blob([outputText], { type: "text/plain" }));
    element.download = "simplified-text.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <motion.div 
        initial={{ opacity: 0, y: -10 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.6 }} 
        className="text-center mb-12 space-y-2"
      >
        <motion.h1
          whileHover={{ scale: 1.05, textShadow: "0px 0px 12px rgba(99,102,241,0.7)" }}
          className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600"
        >
          ClarityBot ✨
        </motion.h1>
        <p className="text-lg text-muted-foreground">
          Transform complex ideas into elegant simplicity with AI.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-10">
        <motion.div className="space-y-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Input</h3>
            <Button variant="outline" size="sm">
              <FileUp className="h-4 w-4 mr-2" /> Upload
            </Button>
          </div>
          <textarea
            className="w-full h-[300px] p-4 rounded-lg border bg-background focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-200 shadow-sm focus:shadow-lg dark:bg-gray-800"
            placeholder="Paste your text here..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
          <div className="text-sm text-muted-foreground">
            {wordCount} words, {charCount} characters
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Simplification Level</span>
                <span className="font-medium">
                  {simplificationLevel[0] < 33 ? "Basic" : simplificationLevel[0] < 66 ? "Standard" : "Advanced"}
                </span>
              </div>
              <Slider
                value={simplificationLevel}
                onValueChange={setSimplificationLevel}
                max={100}
                step={1}
                className="[&_.slider-track]:h-2 [&_.slider-range]:bg-gradient-to-r from-blue-600 to-purple-600"
              />
            </div>

            <motion.div whileTap={{ scale: 0.98 }}>
              <Button
                onClick={handleSimplify}
                disabled={!inputText.trim() || isProcessing}
                className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg shadow-xl"
              >
                {isProcessing ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Processing...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5" />
                    Simplify Text
                  </div>
                )}
              </Button>
            </motion.div>

            {error && (
              <motion.div
                className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20"
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
              </motion.div>
            )}
          </div>
        </motion.div>

        <motion.div className="space-y-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Result</h3>
            <div className="flex gap-2">
              <Button variant="outline" onClick={copyToClipboard} disabled={!outputText}>
                <Copy className="h-4 w-4 mr-2" /> Copy
              </Button>
              <Button variant="outline" onClick={downloadText} disabled={!outputText}>
                <Download className="h-4 w-4 mr-2" /> Download
              </Button>
            </div>
          </div>
          <motion.div
            className="w-full h-[300px] p-4 rounded-lg border bg-background dark:bg-gray-800 overflow-y-auto shadow-inner"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            {isProcessing ? (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : outputText ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
                className="whitespace-pre-wrap text-blue-100"
              >
                {outputText}
              </motion.div>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                Simplified text will appear here
              </div>
            )}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
