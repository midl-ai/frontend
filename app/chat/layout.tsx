import { Sidebar } from '@/components/chat/sidebar';
import { ChatHeader } from '@/components/chat/chat-header';

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden">
      {/* Full-width header at top */}
      <ChatHeader />

      {/* Content area with floating sidebar */}
      <div className="flex-1 flex overflow-hidden relative">
        <Sidebar />
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
