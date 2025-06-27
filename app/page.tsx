'use client'
import React from "react";
import VapiWidget from "./VapiWidget";

const API_KEY = process.env.NEXT_PUBLIC_VAPI_API_KEY || "";
const ASSISTANT_ID = process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID || "";
const OPENAI_API_KEY = process.env.NEXT_PUBLIC_OPENAI_API_KEY || "";

export default function Home() {
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
