
import { useState } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import Dashboard from "@/components/Dashboard";
import { Toaster } from "@/components/ui/toaster";
import { AIChat } from "@/components/AIChat";

const Index = () => {
  const [selectedTool, setSelectedTool] = useState("dashboard");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatContext, setChatContext] = useState<any>(null);

  const openChat = (context?: any) => {
    setChatContext(context);
    setIsChatOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header onOpenChat={openChat} />
      <div className="flex flex-col md:flex-row min-h-[calc(100vh-4rem)] md:min-h-[calc(100vh-5rem)]">
        <Sidebar selectedTool={selectedTool} onSelectTool={setSelectedTool} />
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <Dashboard selectedTool={selectedTool} onOpenChat={openChat} />
        </main>
      </div>
      <AIChat 
        isOpen={isChatOpen} 
        onClose={() => setIsChatOpen(false)}
        context={chatContext}
      />
      <Toaster />
    </div>
  );
};

export default Index;
