import { Sidebar } from '@/components/chat/sidebar';
import { ChatHeader } from '@/components/chat/chat-header';

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar />
      <main className="flex-1 flex flex-col min-w-0 bg-background relative">
        <ChatHeader />
        <div className="flex-1 overflow-hidden">{children}</div>
      </main>
    </div>
  );
}
