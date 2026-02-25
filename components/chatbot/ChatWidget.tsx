'use client';

import { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Bot, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { ActionProvider, ChatMessage } from "@/lib/chatbot/ActionProvider";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export function ChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([
        {
            id: '1',
            sender: 'bot',
            text: "Hi! I'm your Glamoora assistant. Ask me about your budget, guests, or vendors!",
            timestamp: new Date()
        }
    ]);
    const [inputValue, setInputValue] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Initialize ActionProvider
    const actionProvider = useRef(new ActionProvider());
    const router = useRouter();

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const handleSendMessage = async () => {
        if (!inputValue.trim()) return;

        const userMsg: ChatMessage = {
            id: Date.now().toString(),
            sender: 'user',
            text: inputValue,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMsg]);
        setInputValue("");
        setIsTyping(true);

        // Process with ActionProvider
        // Simulate a small delay for "thinking"
        setTimeout(async () => {
            const response = await actionProvider.current.processMessage(userMsg.text);

            const botMsg: ChatMessage = {
                id: (Date.now() + 1).toString(),
                sender: 'bot',
                text: response.text,
                actionLink: response.link,
                timestamp: new Date()
            };

            setMessages(prev => [...prev, botMsg]);
            setIsTyping(false);

            // Auto-navigate if it's a direct navigation command
            if (response.link && (userMsg.text.toLowerCase().includes("go") || userMsg.text.toLowerCase().includes("navigate"))) {
                router.push(response.link);
            }
        }, 600);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSendMessage();
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-none">
            {/* Chat Window */}
            <div
                className={cn(
                    "bg-white border border-stone-200 shadow-xl rounded-2xl w-80 sm:w-96 mb-4 overflow-hidden transition-all duration-300 origin-bottom-right pointer-events-auto flex flex-col",
                    isOpen ? "opacity-100 scale-100 h-[500px]" : "opacity-0 scale-95 h-0"
                )}
            >
                {/* Header */}
                <div className="bg-charcoal text-white p-4 flex justify-between items-center shrink-0">
                    <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-white/20 rounded-full">
                            <Bot className="w-4 h-4" />
                        </div>
                        <div>
                            <h3 className="font-serif font-medium">Glamoora AI</h3>
                            <p className="text-xs text-stone-300">Always here to help</p>
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="text-white hover:bg-white/10 h-8 w-8"
                        onClick={() => setIsOpen(false)}
                    >
                        <X className="w-4 h-4" />
                    </Button>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-stone-50">
                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={cn(
                                "flex gap-2 max-w-[85%]",
                                msg.sender === 'user' ? "ml-auto flex-row-reverse" : "mr-auto"
                            )}
                        >
                            <div className={cn(
                                "w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-1",
                                msg.sender === 'user' ? "bg-taupe text-white" : "bg-gold text-white"
                            )}>
                                {msg.sender === 'user' ? <User className="w-3 h-3" /> : <Bot className="w-3 h-3" />}
                            </div>

                            <div className={cn(
                                "p-3 text-sm rounded-2xl shadow-sm",
                                msg.sender === 'user'
                                    ? "bg-white text-charcoal rounded-tr-none border border-stone-100"
                                    : "bg-charcoal text-white rounded-tl-none"
                            )}>
                                <p>{msg.text}</p>
                                {msg.actionLink && (
                                    <Link
                                        href={msg.actionLink}
                                        className={cn(
                                            "block mt-2 text-xs underline decoration-dotted underline-offset-2",
                                            msg.sender === 'user' ? "text-gold-leaf-600" : "text-gold"
                                        )}
                                    >
                                        Visit Page &rarr;
                                    </Link>
                                )}
                            </div>
                        </div>
                    ))}

                    {isTyping && (
                        <div className="flex gap-2 mr-auto">
                            <div className="w-6 h-6 bg-gold text-white rounded-full flex items-center justify-center shrink-0">
                                <Bot className="w-3 h-3" />
                            </div>
                            <div className="bg-charcoal text-white p-3 rounded-2xl rounded-tl-none text-sm flex items-center gap-1">
                                <span className="w-1.5 h-1.5 bg-white/50 rounded-full animate-bounce"></span>
                                <span className="w-1.5 h-1.5 bg-white/50 rounded-full animate-bounce delay-75"></span>
                                <span className="w-1.5 h-1.5 bg-white/50 rounded-full animate-bounce delay-150"></span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-3 bg-white border-t border-stone-100 shrink-0 flex gap-2">
                    <Input
                        placeholder="Type a message..."
                        className="bg-stone-50 border-stone-200 focus-visible:ring-charcoal"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                    <Button
                        size="icon"
                        className="bg-charcoal hover:bg-charcoal/90 text-white shrink-0"
                        onClick={handleSendMessage}
                        disabled={!inputValue.trim()}
                    >
                        <Send className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            {/* Toggle Button */}
            <Button
                size="icon"
                className={cn(
                    "h-14 w-14 rounded-full shadow-lg transition-all duration-300 pointer-events-auto",
                    isOpen ? "bg-white text-charcoal hover:bg-stone-100 border border-stone-200" : "bg-charcoal text-white hover:bg-charcoal/90 hover:scale-110"
                )}
                onClick={() => setIsOpen(!isOpen)}
            >
                {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
            </Button>
        </div>
    );
}
