'use client'
import { useEffect, useRef, useState } from "react";
import Vapi from "@vapi-ai/web";

const API_KEY = "3676ec9c-58b6-467f-a998-7182fc483ed6";
const ASSISTANT_ID = "1310fabe-15e7-4c25-903c-2e1b18e3b9e1";

export default function Home() {
  const [modalOpen, setModalOpen] = useState(false);
  const [callActive, setCallActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const vapiRef = useRef<any>(null);

  useEffect(() => {
    // Remove old custom style injection (now using Tailwind)
  }, []);

  useEffect(() => {
    if (!vapiRef.current) {
      vapiRef.current = new Vapi(API_KEY);
      vapiRef.current.on("call-start", () => {
        setLoading(false);
        setCallActive(true);
      });
      vapiRef.current.on("call-end", () => {
        setCallActive(false);
        setModalOpen(true);
      });
      vapiRef.current.on("error", (e: any) => {
        setLoading(false);
        // eslint-disable-next-line no-console
        console.error(e);
      });
    }
  }, []);

  const handleStartCall = () => {
    setLoading(true);
    vapiRef.current?.start(ASSISTANT_ID);
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
          <p style={{ margin: "0.5rem 0" }}><strong>Score:</strong> 8/10</p>
          <p style={{ margin: "0.5rem 0" }}><strong>Feedback:</strong> Great tone and clear scheduling, but didn't confirm insurance clearly. The call was friendly and confident, offered appointment options, and ended well, but insurance details were unclear.</p>
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
}
