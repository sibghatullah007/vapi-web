import React, { useState, useEffect, useRef, useCallback } from 'react';
import Vapi from '@vapi-ai/web';

interface VapiWidgetProps {
  apiKey: string;
  assistantId: string;
  openaiApiKey?: string;
}

const VapiWidget: React.FC<VapiWidgetProps> = ({ 
  apiKey, 
  assistantId, 
  openaiApiKey
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [callActive, setCallActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [callAnalysis, setCallAnalysis] = useState<string>('');
  const vapiRef = useRef<Vapi | null>(null);
  const callIdRef = useRef<string | null>(null);
  const fullTranscriptRef = useRef<Array<{role: string, text: string}>>([]);

  const analyzeCallWithOpenAI = useCallback(async (transcript: Array<{role: string, text: string}>) => {
    if (!openaiApiKey) {
      console.log('OpenAI API key not provided, skipping analysis');
      return;
    }

    // Tone & Friendliness: X/10  
    // Insurance Handling: X/10  
    // Appointment Offer: X/10  
    // Clarity & Next Steps: X/10  
    // Call Closing: X/10  

    setAnalysisLoading(true);
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openaiApiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: `You are an AI evaluator reviewing only the user's spoken responses in a call transcript. Evaluate the user on the following five criteria. For each, assign a score from 1 to 10 based only on how well the user performed in the conversation:
Tone & Friendliness – Did the user sound warm, approachable, and confident?
Insurance Handling – Did the user clearly confirm insurance acceptance and sound knowledgeable?
Appointment Offer – Did the user offer specific days/times and make scheduling easy?
Clarity & Next Steps – Was the call clear, and did the patient know what would happen next?
Call Closing – Did the user thank the caller, confirm details, or offer any last help?

Then:
Calculate the overall score (average of the 5).
Write one short sentence of feedback highlighting strengths and one area for improvement.

Return the output in the following format:
Score: X/10  
Feedback: "Your feedback here."  

Rules:
Base all ratings and feedback only on the user's speech — ignore the caller.
If any criteria were not addressed in the conversation, briefly note that in the feedback.
Keep the feedback natural and helpful, like a coach or quality reviewer. Must mention the reasons for the less score if it is less then 8.`
            },
            {
              role: 'user',
              content: `This is the Transcription Call: ${JSON.stringify(transcript)}`
            }
          ],
          max_tokens: 500,
          temperature: 0.7,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const analysis = data.choices[0]?.message?.content || 'Analysis failed';
        console.log('Call Analysis:', analysis);
        setCallAnalysis(analysis);
      } else {
        console.error('OpenAI API error:', response.status, response.statusText);
        setCallAnalysis('Analysis failed - API error');
      }
    } catch (error) {
      console.error('Error analyzing call:', error);
      setCallAnalysis('Analysis failed - Network error');
    } finally {
      setAnalysisLoading(false);
    }
  }, [openaiApiKey]);

  useEffect(() => {
    if (!vapiRef.current) {
      vapiRef.current = new Vapi(apiKey);
      
      vapiRef.current.on("call-start", (...args: unknown[]) => {
        const call = args[0];
        if (call && typeof call === "object" && "id" in call) {
          callIdRef.current = call.id as string;
        }
        setLoading(false);
        setCallActive(true);
        fullTranscriptRef.current = []; // Reset full transcript on new call
        setCallAnalysis(''); // Reset analysis
      });

      vapiRef.current.on("call-end", async () => {
        setLoading(true);
        setCallActive(false);
        setModalOpen(true);
        
        console.log('Call ended');
        console.log('Full Call Transcript:', fullTranscriptRef.current);
        
        // Analyze the call transcript with OpenAI
        if (fullTranscriptRef.current.length > 0) {
          await analyzeCallWithOpenAI(fullTranscriptRef.current);
        }
        
        setLoading(false);
      });

      vapiRef.current.on("message", (message) => {
        if (message.type === 'transcript') {
          const newMessage = {
            role: message.role,
            text: message.transcript
          };
          fullTranscriptRef.current = [...fullTranscriptRef.current, newMessage];
          console.log('Current full transcript:', fullTranscriptRef.current);
        }
      });

      vapiRef.current.on("error", (e: unknown) => {
        setLoading(false);
        console.error(e);
      });
    }
  }, [apiKey, analyzeCallWithOpenAI]);

  const handleStartCall = () => {
    setLoading(true);
    vapiRef.current?.start(assistantId);
  };

  const handleStopCall = () => {
    vapiRef.current?.stop();
  };

  return (
    <div>
      {/* Modal Overlay */}
      <div
        id="call-ended-overlay"
        style={{
          display: modalOpen ? "block" : "none",
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "rgba(0,0,0,0.6)",
          zIndex: 9998,
        }}
      />
      
      {/* Modal */}
      <div
        id="call-ended-modal"
        style={{
          display: modalOpen ? "block" : "none",
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          background: "#fff",
          color: "#000",
          padding: "2rem",
          borderRadius: "12px",
          width: "90%",
          maxWidth: "500px",
          zIndex: 9999999,
          boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <h2 style={{ textAlign: "center", fontSize: "1.75rem", margin: "0 0 1rem" }}>
          Call Report
        </h2>
        
        <div style={{ textAlign: "left" }}>
          {analysisLoading ? (
            <p style={{ margin: "0.5rem 0" }}>
              <strong>Analyzing call performance...</strong>
            </p>
          ) : callAnalysis ? (
            <div>
              <pre style={{
                margin: "0.5rem 0",
                fontSize: "14px",
                whiteSpace: "pre-wrap",
                fontFamily: "inherit",
                background: "#f8f9fa",
                padding: "12px",
                borderRadius: "8px",
                border: "1px solid #e9ecef"
              }}>
                {callAnalysis}
              </pre>
            </div>
          ) : (
            <p style={{ margin: "0.5rem 0" }}>
              <strong>Call completed. Analysis not available.</strong>
            </p>
          )}
        </div>
        
        <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
          <button
            onClick={() => setModalOpen(false)}
            style={{
              padding: "1.2rem 1.2rem",
              background: "#a00000",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              fontSize: "1.3rem",
              cursor: "pointer",
            }} 
          >
            Close
          </button>
        </div>
      </div>
      
      {/* Vapi Call Button */}
      <button
        id="vapi-support-btn"
        onClick={callActive ? handleStopCall : handleStartCall}
        disabled={loading}
        className={`fixed z-[9999998] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[150px] w-[150px] rounded-full text-white font-semibold text-xl shadow-lg focus:outline-none transition-transform duration-300 cursor-pointer flex items-center justify-center
          ${
            loading
              ? "bg-gray-400 animate-pulse scale-95 cursor-not-allowed"
              : callActive
                ? "bg-red-700 animate-pulse scale-110 hover:scale-105 hover:bg-red-800"
                : "bg-teal-700 hover:bg-teal-800 scale-100 hover:scale-105 animate-bounce"
          }
        `}
        style={{ boxShadow: "0 4px 16px rgba(0,0,0,0.15)" }}
      >
        {loading ? (
          <span className="flex flex-col items-center">
            <svg className="animate-spin h-8 w-8 mb-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
            </svg>
          </span>
        ) : callActive ? (
          <span></span>
        ) : (
          <span></span>
        )}
      </button>
    </div>
  );
};

export default VapiWidget; 