import React, { useEffect, useState, useRef } from 'react'

const useSpeechToText = ({ interimResults = true, continuous = false }) => {
    const [isListening, setIsListening] = useState(false)
    const [transcript, setTranscript] = useState("")
    const recognitionRef = useRef(null)

    useEffect(() => {
        if (!('webkitSpeechRecognition' in window)) {
            console.log("Web speech API is not supported.")
            return;
        }

        recognitionRef.current = new window.webkitSpeechRecognition()
        const recognition = recognitionRef.current
        recognition.interimResults = interimResults
        recognition.continuous = continuous

        if ("webkitSpeechGrammarList" in window) {
            const grammar = "#JSGF V1.0; grammar punctuation; public <punc> = . | , | ? | ! | ; | : ;"
            const speechRecognitionList = new window.webkitSpeechGrammarList()
            speechRecognitionList.addFromString(grammar, 1)
            recognition.grammars = speechRecognitionList
        }

        recognition.onresult = (event) => {
            let text = ""
            for (let i = 0; i < event.results.length; i++) {
                text += event.results[i][0].transcript
            }
            setTranscript(text)
        }

        recognition.onerror = (event) => {
            console.log("Speech recognition error:", event.error)
        }

        recognition.onend = () => {
            setIsListening(false)
            setTranscript("")
        }

        return () => {
            recognition.stop()
        }
    }, [interimResults, continuous])

    const startListening = () => {
        if (recognitionRef.current && !isListening) {
            recognitionRef.current.start()
            setIsListening(true)
        }
    }

    const stopListening = () => {
        if (recognitionRef.current && isListening) {
            recognitionRef.current.stop()
            setIsListening(false)
        }
    }

    return {
        isListening,
        transcript,
        startListening,
        stopListening
    }
}

export default useSpeechToText
