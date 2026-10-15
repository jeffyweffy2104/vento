import type { Metadata } from "next";
import Link from "next/link";
import { ConversationOnboarding } from "../../components/conversation-onboarding";

export const metadata: Metadata = { title: "join the conversation", description: "Join Vento through a guided, accessible conversation." };

export default function MessagesPage() {
  return <main className="conversation-page"><header className="conversation-header"><Link href="/" aria-label="back to vento home">vento.</Link><span>private beta</span></header><ConversationOnboarding /></main>;
}
