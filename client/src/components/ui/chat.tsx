import { cn } from "@/lib/utils"
import { ArrowUp, Plus } from "lucide-react"
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

  // Auto-scroll para a última mensagem
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
      "fixed inset-0 z-50 flex flex-col bg-zinc-50 dark:bg-zinc-900",
      className
    )}>
      {/* Header  */}
      <div className="flex items-center justify-between p-4 border-b border-zinc-200 dark:border-zinc-800">
        <button 
          onClick={onClose}
          className="p-1 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800"
        >
        </button>
        
        <h3 className="font-medium text-zinc-900 dark:text-white">{title}</h3>
        
        {onNewChat && (
          <button 
            onClick={onNewChat}
            className="p-1 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            <Plus className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
          </button>
        )}
      </div>

      {/* Área de mensagens */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.map(msg => (
          <div 
            key={msg.id} 
            className={cn(
              "flex",
              msg.isCurrentUser ? "justify-end" : "justify-start"
            )}
          >
            <div className={cn(
              "max-w-[85%] p-4 rounded-2xl",
              msg.isCurrentUser 
                ? "bg-indigo-500 text-white rounded-br-none" 
                : "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white rounded-bl-none"
            )}>
              <p className="text-sm">{msg.text}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-zinc-200 dark:border-zinc-800">
        <form 
          onSubmit={handleSubmit}
          className="relative"
        >
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Message..."
            className="w-full p-4 pr-12 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
          <button
            type="submit"
            disabled={!inputValue.trim()}
            className={cn(
              "absolute right-2 top-2 p-2 rounded-full",
              inputValue.trim() 
                ? "bg-indigo-500 text-white hover:bg-indigo-600" 
                : "bg-zinc-100 dark:bg-zinc-700 text-zinc-400"
            )}
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  )
}