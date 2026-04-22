// @vitest-environment jsdom
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import type { ConversationItem } from "../../../types";
import { Messages } from "./Messages";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: "en", changeLanguage: vi.fn() },
  }),
}));

describe("Messages shared session provenance", () => {
  beforeAll(() => {
    if (!HTMLElement.prototype.scrollIntoView) {
      HTMLElement.prototype.scrollIntoView = vi.fn();
    }
    if (!HTMLElement.prototype.scrollTo) {
      HTMLElement.prototype.scrollTo = vi.fn();
    }
  });

  afterEach(() => {
    cleanup();
  });

  it("renders per-message provenance badge for assistant messages", async () => {
    const items: ConversationItem[] = [
      {
        id: "user-1",
        kind: "message",
        role: "user",
        text: "Compare two implementations",
      },
      {
        id: "assistant-1",
        kind: "message",
        role: "assistant",
        text: "Codex answer",
        engineSource: "codex",
      },
      {
        id: "assistant-2",
        kind: "message",
        role: "assistant",
        text: "Claude answer",
        engineSource: "claude",
      },
    ];

    render(
      <Messages
        items={items}
        threadId="shared:thread-1"
        workspaceId="ws-1"
        isThinking={false}
        openTargets={[]}
        selectedOpenAppId=""
      />,
    );

    await waitFor(() => {
      expect(screen.getByText("Codex")).toBeTruthy();
      expect(screen.getByText("Claude")).toBeTruthy();
    });
  });
});

