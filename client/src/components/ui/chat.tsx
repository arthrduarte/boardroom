import { cn } from "@/lib/utils"
import { ArrowUp, Plus, X } from "lucide-react"
import { useEffect, useRef, useState } from "react"

interface ChatProps {
  className?: string
  title: string
  messages: {
    id: string
    sender: string
    text: string
    timestamp: Date
    isCurrentUser?: boolean
  }[]
  onSendMessage: (message: string) => void
  onClose: () => void
  onNewChat?: () => void
}

export const Chat = ({
  className,
  title,
  messages,
  onSendMessage,
  onClose,
  onNewChat
}: ChatProps) => {
  const [inputValue, setInputValue] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to last message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (inputValue.trim()) {
      onSendMessage(inputValue)
      setInputValue("")
    }
  }

  return (
    <div className={cn(
      "flex flex-col h-full bg-zinc-900 text-white border border-zinc-800 rounded-lg overflow-hidden",
      className
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <h3 className="font-medium text-zinc-100">{title}</h3>
        </div>
        
        <div className="flex items-center gap-6">
          {onNewChat && (
            <button 
              onClick={onNewChat}
              className="p-1.5 rounded-full hover:bg-zinc-800 transition-colors"
            >
              <Plus className="w-5 h-5 text-zinc-400" />
            </button>
          )}
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(msg => (
          <div 
            key={msg.id} 
            className={cn(
              "flex",
              msg.isCurrentUser ? "justify-end" : "justify-start"
            )}
          >
            <div className={cn(
              "max-w-[85%] p-3 rounded-lg",
              msg.isCurrentUser 
                ? "bg-indigo-600 text-white rounded-br-none" 
                : "bg-zinc-800 text-zinc-100 rounded-bl-none"
            )}>
              {!msg.isCurrentUser && (
                <p className="text-xs font-medium text-indigo-400 mb-1">{msg.sender}</p>
              )}
              <p className="text-sm">{msg.text}</p>
              <p className="text-xs mt-1 opacity-60 text-right">
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="p-4 border-t border-zinc-800 bg-zinc-900/50">
        <form 
          onSubmit={handleSubmit}
          className="relative"
        >
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type a message..."
            className="w-full p-3 pr-12 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-zinc-500 text-zinc-100"
          />
          <button
            type="submit"
            disabled={!inputValue.trim()}
            className={cn(
              "absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full transition-colors",
              inputValue.trim() 
                ? "bg-indigo-600 text-white hover:bg-indigo-700" 
                : "bg-zinc-700 text-zinc-500 cursor-not-allowed"
            )}
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  )
}