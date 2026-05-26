"use client";

import { useState } from "react";
import { CompanionSetup } from "./components/CompanionSetup";
import { ChatInterface } from "./components/ChatInterface";
import { useChatSession, type ChatConfig } from "@/hooks/useChatSession";
import type { CompanionCategory, CompanionMode } from "@/config/labels";

type Stage = "setup" | "chat";

const defaultConfig: ChatConfig = {
  mode: "emotion_question",
  category: "stress",
};

export default function ExperiencePage() {
  const [stage, setStage] = useState<Stage>("setup");
  const [draftMode, setDraftMode] = useState<CompanionMode>(defaultConfig.mode);
  const [draftCategory, setDraftCategory] = useState<CompanionCategory>(defaultConfig.category);
  const [config, setConfig] = useState<ChatConfig | null>(null);
  const chat = useChatSession(stage === "chat" ? config : null);

  function startCompanion() {
    setConfig({ mode: draftMode, category: draftCategory });
    setStage("chat");
  }

  function resetSetup() {
    setDraftMode(defaultConfig.mode);
    setDraftCategory(defaultConfig.category);
    setConfig(null);
    setStage("setup");
  }

  function resetChatToSetup() {
    chat.reset();
    setConfig(null);
    setStage("setup");
  }

  if (stage === "setup" || !config) {
    return (
      <CompanionSetup
        mode={draftMode}
        category={draftCategory}
        onModeChange={setDraftMode}
        onCategoryChange={setDraftCategory}
        onReset={resetSetup}
        onStart={startCompanion}
      />
    );
  }

  return (
    <ChatInterface
      mode={config.mode}
      category={config.category}
      session={chat}
      onReset={resetChatToSetup}
    />
  );
}
