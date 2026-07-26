"use client";

import { useState } from "react";
import { Search, Send, CheckCheck, Paperclip, MoreVertical } from "lucide-react";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

import { useLocale, useTranslations } from "next-intl";

const mockConversations = [
  { id: "c1", name: "Blossom Kids Admin", lastMsg: "Your booking has been approved.", unread: 2, online: true },
  { id: "c2", name: "Teacher Lana", lastMsg: "Adam is doing great in art class today!", unread: 0, online: false },
];

const mockMessages: Record<string, Array<{ sender: string; text: string; time: string }>> = {
  c1: [
    { sender: "them", text: "Hello, how can we help you today?", time: "10:02 AM" },
    { sender: "me", text: "Hi! I wanted to check if there are seats in Montessori group.", time: "10:05 AM" },
    { sender: "them", text: "Yes! We have 5 remaining seats. Your booking has been approved.", time: "10:10 AM" },
  ],
  c2: [
    { sender: "them", text: "Hi Amira, just wanted to let you know Emma completed her drawing task.", time: "02:30 PM" },
    { sender: "me", text: "That is wonderful news! Thank you.", time: "02:35 PM" },
  ],
};

export default function ChatConsole() {
  const [activeConv, setActiveConv] = useState("c1");
  const [messages, setMessages] = useState(mockMessages);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const locale = useLocale();
  const tNav = useTranslations("nav");

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMsg = {
      sender: "me",
      text: inputText,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages({
      ...messages,
      [activeConv]: [...(messages[activeConv] || []), newMsg],
    });
    setInputText("");

    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const replyMsg = {
        sender: "them",
        text: "Thank you for your message, we will check and reply shortly.",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => ({
        ...prev,
        [activeConv]: [...(prev[activeConv] || []), replyMsg],
      }));
    }, 1500);
  };

  return (
    <div className="flex min-h-screen flex-col bg-surface text-on-surface">
      <NavBar />

      <main className="flex-1 max-w-[1440px] mx-auto w-full px-4 sm:px-6 lg:px-10 py-10">
        <div className="card-surface shadow-elevation-2 overflow-hidden h-[620px] grid grid-cols-1 md:grid-cols-3">
          {/* LEFT: Conversations List */}
          <div className="border-r border-outline-variant flex flex-col h-full md:col-span-1">
            <div className="p-4 border-b border-outline-variant">
              <div className="flex items-center gap-2.5 px-3 py-2 bg-surface-container-lowest rounded-[var(--radius-control)] border border-outline-variant">
                <Search className="w-4 h-4 text-on-surface-variant" />
                <input
                  type="text"
                  placeholder="Search messages..."
                  className="bg-transparent border-none text-xs outline-none text-on-surface placeholder:text-on-surface-variant/60 w-full"
                />
              </div>
            </div>

            <div className="flex-grow overflow-y-auto">
              {mockConversations.map((conv) => {
                const isSelected = activeConv === conv.id;
                return (
                  <div
                    key={conv.id}
                    onClick={() => setActiveConv(conv.id)}
                    className={`flex items-center justify-between p-4 cursor-pointer border-b border-outline-variant transition ${
                      isSelected
                        ? "bg-primary-container/10 text-on-surface font-semibold"
                        : "hover:bg-surface-container-low"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-primary-container/20 text-primary flex items-center justify-center font-bold text-sm">
                          {conv.name.charAt(0)}
                        </div>
                        {conv.online && (
                          <span className="absolute bottom-0 right-0 w-3 h-3 bg-tertiary border-2 border-surface rounded-full"></span>
                        )}
                      </div>
                      <div className="space-y-0.5 text-left">
                        <h4 className="text-sm font-bold text-on-surface">{conv.name}</h4>
                        <p className="text-xs text-on-surface-variant line-clamp-1">{conv.lastMsg}</p>
                      </div>
                    </div>

                    {conv.unread > 0 && (
                      <span className="w-5 h-5 flex items-center justify-center bg-primary text-on-primary text-[10px] font-bold rounded-full">
                        {conv.unread}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT: Live Dialogue Box */}
          <div className="md:col-span-2 flex flex-col h-full bg-surface-container-low/30">
            {/* Header info */}
            <div className="p-4 bg-surface-container-lowest border-b border-outline-variant flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary-container/20 text-primary flex items-center justify-center font-bold text-sm">
                  {mockConversations.find((c) => c.id === activeConv)?.name.charAt(0)}
                </div>
                <div className="text-left">
                  <h4 className="text-sm font-bold text-on-surface">
                    {mockConversations.find((c) => c.id === activeConv)?.name}
                  </h4>
                  <p className="text-[11px] text-on-surface-variant">
                    {mockConversations.find((c) => c.id === activeConv)?.online ? "Active Now" : "Offline"}
                  </p>
                </div>
              </div>
              <button className="text-on-surface-variant hover:text-on-surface">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-grow overflow-y-auto p-4 space-y-4">
              {(messages[activeConv] || []).map((msg, i) => {
                const isMe = msg.sender === "me";
                return (
                  <div key={i} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[70%] p-3.5 rounded-[var(--radius-card)] text-sm shadow-elevation-1 space-y-1 ${
                        isMe
                          ? "bg-primary text-on-primary rounded-br-none"
                          : "card-surface text-on-surface rounded-bl-none"
                      }`}
                    >
                      <p>{msg.text}</p>
                      <div className="flex justify-end items-center gap-1 text-[9px] opacity-75">
                        <span>{msg.time}</span>
                        {isMe && <CheckCheck className="w-3.5 h-3.5" />}
                      </div>
                    </div>
                  </div>
                );
              })}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="card-surface p-3 rounded-xl flex items-center gap-1 text-xs text-on-surface-variant">
                    <span className="animate-bounce">●</span>
                    <span className="animate-bounce [animation-delay:0.2s]">●</span>
                    <span className="animate-bounce [animation-delay:0.4s]">●</span>
                  </div>
                </div>
              )}
            </div>

            {/* Input Footer */}
            <form onSubmit={handleSendMessage} className="p-4 bg-surface-container-lowest border-t border-outline-variant flex items-center gap-3">
              <button type="button" className="text-on-surface-variant hover:text-on-surface">
                <Paperclip className="w-5 h-5" />
              </button>
              <input
                type="text"
                placeholder="Type your message..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="w-full px-4 py-2.5 rounded-[var(--radius-control)] bg-surface-container-low outline-none text-sm text-on-surface placeholder:text-on-surface-variant/60 border border-outline-variant focus-visible:outline-2 focus-visible:outline-primary"
              />
              <Button type="submit" size="icon">
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
