"use client";
import React from "react";
import VapiWidget from "../VapiWidget";

const API_KEY = "3676ec9c-58b6-467f-a998-7182fc483ed6";
const ASSISTANT_ID = "1310fabe-15e7-4c25-903c-2e1b18e3b9e1";

export default function EmbedPage() {
  return (
    <div style={{ minHeight: "100vh", background: "#f4f6f8" }}>
      <VapiWidget apiKey={API_KEY} assistantId={ASSISTANT_ID} />
    </div>
  );
} 