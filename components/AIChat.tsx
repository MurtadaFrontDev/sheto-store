
import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Bot, Sparkles, Loader2, BrainCircuit } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { useStore } from '../context/StoreContext';

interface Message {
  role: 'user' | 'model';
  text: string;
}

const AIChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: 'هلا بيك! أنا مستشارك الذكي في شيتو. اسألني عن أي شي يخص تنظيم السيت-أب أو اختيار القطع المناسبة لمكتبك.' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { products } = useStore();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const modelName = 'gemini-3-flash-preview';
      
      const productContext = products.map(p => `${p.name} (${p.price} د.ع)`).join(', ');
      
      const response = await ai.models.generateContent({
        model: modelName,
        contents: [
          { role: 'user', parts: [{ text: userMessage }] }
        ],
        config: {
          systemInstruction: `أنت مساعد ذكي في متجر "شيتو" (Sheeto) العراقي المتخصص بتنظيم غرف الألعاب (Gaming Setups). 
          مهمتك: مساعدة الزبائن في اختيار المنتجات المناسبة وتنظيم مكاتبهم. 
          الأسلوب: ودي، احترافي، بلهجة عراقية خفيفة ومفهومة. 
          المنتجات المتاحة حالياً: ${productContext}.
          ركز على حلول تنظيم الكابلات، ألواح التنظيم الجدارية، والإضاءة. 
          إذا سأل عن السعر، أعطه السعر بالدينار العراقي.`
        }
      });

      const aiText = response.text || "عذراً، واجهت مشكلة بسيطة. جرب تسألني مرة ثانية!";
      setMessages(prev => [...prev, { role: 'model', text: aiText }]);
    } catch (error) {
      console.error("AI Chat Error:", error);
      setMessages(prev => [...prev, { role: 'model', text: "صار عندي خلل تقني، ثواني وارجعلك!" }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-[100] font-sans">
      {/* Chat Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative w-16 h-16 bg-brand-bronze text-white rounded-[1.5rem] shadow-[0_20px_40px_rgba(146,99,61,0.4)] flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-500 overflow-hidden"
        >
          {/* Animated Glow Effect */}
          <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
          
          {/* Pulse Rings */}
          <span className="absolute inset-0 rounded-[1.5rem] bg-brand-bronze animate-ping opacity-20"></span>
          
          {/* AI Advisor Icon */}
          <div className="relative z-10 flex flex-col items-center">
            <Bot size={28} className="group-hover:rotate-12 transition-transform duration-300" />
            <div className="absolute -top-1 -right-1">
              <Sparkles size={12} className="text-white/80 animate-pulse" />
            </div>
          </div>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="w-[400px] h-[600px] bg-white dark:bg-[#111111] border border-slate-200 dark:border-white/10 rounded-[2.5rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.4)] flex flex-col overflow-hidden animate-in fade-in slide-in-from-right-10 duration-500">
          {/* Header */}
          <div className="bg-gradient-to-r from-brand-bronze to-[#7a4f2f] p-7 flex items-center justify-between text-white">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20">
                <BrainCircuit size={24} className="animate-pulse" />
              </div>
              <div className="text-right">
                <h4 className="font-black text-base tracking-tight">مستشار شيتو الذكي</h4>
                <div className="flex items-center gap-1.5 justify-end">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
                  <p className="text-[10px] opacity-90 font-bold uppercase tracking-widest">AI Agent Online</p>
                </div>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)} 
              className="hover:bg-black/20 w-10 h-10 rounded-xl flex items-center justify-center transition-all group"
            >
              <X size={20} className="group-hover:rotate-90 transition-transform" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-slate-50/50 dark:bg-transparent">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                <div className={`max-w-[85%] p-5 rounded-[1.8rem] text-sm font-bold leading-relaxed shadow-sm ${
                  msg.role === 'user' 
                    ? 'bg-brand-bronze text-white rounded-tr-none' 
                    : 'bg-white dark:bg-white/5 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-white/5 rounded-tl-none'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white/5 p-5 rounded-[1.8rem] rounded-tl-none flex items-center gap-3 border border-white/5">
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-brand-bronze rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-brand-bronze rounded-full animate-bounce delay-75"></span>
                    <span className="w-1.5 h-1.5 bg-brand-bronze rounded-full animate-bounce delay-150"></span>
                  </div>
                  <span className="text-[10px] text-brand-bronze font-black uppercase tracking-widest">جاري التحليل...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-6 bg-white dark:bg-[#0a0a0a] border-t border-slate-200 dark:border-white/5">
            <div className="relative flex items-center gap-3">
              <input
                type="text"
                placeholder="كيف أقدر أرتب غرفتي اليوم؟"
                className="flex-1 h-14 bg-slate-100 dark:bg-white/5 border-none rounded-2xl px-5 text-right text-sm text-slate-800 dark:text-white outline-none focus:ring-2 ring-brand-bronze/40 transition-all font-bold placeholder:text-slate-400 dark:placeholder:text-slate-600"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              />
              <button 
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="w-14 h-14 bg-brand-bronze text-white rounded-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all disabled:opacity-30 disabled:grayscale"
              >
                <Send size={20} className="-rotate-45" />
              </button>
            </div>
            <div className="flex items-center justify-center gap-2 mt-4 opacity-40 grayscale hover:grayscale-0 transition-all">
               <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Powered by Sheeto Intelligence</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIChat;
