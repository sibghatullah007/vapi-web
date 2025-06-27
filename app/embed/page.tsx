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
    
    // For debugging
    console.log('Client-side referrer check:');
    console.log('Document referrer:', referrer);
    console.log('Window location:', window.location.href);
    console.log('Parent window:', window.parent !== window);
    
    // Check if we're in an iframe
    const isInIframe = window.parent !== window;
    const hasValidReferrer = referrer && referrer.includes(allowedDomain);
    
    // Allow access if:
    // 1. We're in an iframe (likely from LearnWorlds), OR
    // 2. We have a valid referrer from LearnWorlds
    if (isInIframe || hasValidReferrer) {
      setIsAuthorized(true);
    } else {
      // Only block if we have a clear referrer from a different domain
      if (referrer && !referrer.includes(allowedDomain)) {
        setIsAuthorized(false);
      } else {
        // No referrer or empty referrer - allow access (iframe case)
        setIsAuthorized(true);
      }
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
        <p style={{ fontSize: '12px', color: '#999', marginTop: '10px' }}>
          Referrer: {document.referrer || 'None'}
        </p>
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