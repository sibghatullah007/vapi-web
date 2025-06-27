"use client";
import React, { useEffect, useState } from "react";
import VapiWidget from "../VapiWidget";

const API_KEY = process.env.NEXT_PUBLIC_VAPI_API_KEY || "";
const ASSISTANT_ID = process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID || "";
const OPENAI_API_KEY = process.env.NEXT_PUBLIC_OPENAI_API_KEY || "";

export default function EmbedPage() {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Client-side referrer check as additional security
    const allowedDomain = 'patient-phone-pro.learnworlds.com';
    const referrer = document.referrer;
    
    if (referrer && referrer.includes(allowedDomain)) {
      setIsAuthorized(true);
    } else {
      // If no referrer or wrong domain, show access denied
      setIsAuthorized(false);
    }
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div style={{ 
        minHeight: "100vh", 
        background: "#f4f6f8",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}>
        <div>Loading...</div>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div style={{ 
        minHeight: "100vh", 
        background: "#f4f6f8",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column"
      }}>
        <h2>Access Denied</h2>
        <p>This content can only be accessed from authorized domains.</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f4f6f8" }}>
      <VapiWidget 
        apiKey={API_KEY}
        assistantId={ASSISTANT_ID}
        openaiApiKey={OPENAI_API_KEY}
      />
    </div>
  );
} 