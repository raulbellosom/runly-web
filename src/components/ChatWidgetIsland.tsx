// src/components/ChatWidgetIsland.tsx
import { ChatWidget } from "@raulbellosom/runly-sdk/react";
import { runlySdk } from "../lib/runly-sdk";
import { SITE_NAME } from "../consts";

// client:only/client:idle island — runlySdk is imported directly here rather
// than passed as an Astro prop because it's a live client object (methods,
// in-memory session state); Astro serializes island props to JSON, which a
// class-like object like this would not survive.
export default function ChatWidgetIsland() {
  if (!runlySdk) return null;
  return <ChatWidget sdk={runlySdk} companyName={SITE_NAME} accentColor="#ff5e14" />;
}
