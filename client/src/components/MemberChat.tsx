import { useState, useEffect, useRef } from 'react'
import { cn } from "@/lib/utils"
import { ArrowUp } from "lucide-react"

interface MemberChatProps {
  member?: {  
    id: string
    name: string
    avatar?: string
  }
}

type Message = {
  id: string
  sender: string
  text: string
  timestamp: Date
  isCurrentUser?: boolean
}

export const MemberChat = ({ member }: MemberChatProps) => {
  const [messages, setMessages] = useState<Message[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const [inputValue, setInputValue] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to last message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  useEffect(() => {
    if (messages.length === 0 && member) {
      setIsTyping(true)
      setTimeout(() => {
        setMessages([{
          id: '1',
          sender: member.name, 
          text: `Hi there! I'm ${member.name}. What would you like to discuss?`,
          timestamp: new Date(),
          isCurrentUser: false
        }])
        setIsTyping(false)
      }, 1500)
    }
  }, [member, messages.length])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!member || !inputValue.trim()) return;

    const text = inputValue.trim()
    setInputValue("")

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'You',
      text,
      timestamp: new Date(),
      isCurrentUser: true
    }
    setMessages(prev => [...prev, userMessage])
    setIsTyping(true)

    setTimeout(() => {
      const reply: Message = {
        id: Date.now().toString() + '-reply',
        sender: member.name,
        text: generateResponse(text, member.name),
        timestamp: new Date(),
        isCurrentUser: false
      }
      setMessages(prev => [...prev, reply])
      setIsTyping(false)
    }, 1000 + Math.random() * 2000)
  }

  const generateResponse = (input: string, memberName: string): string => {
    const responses: Record<string, string[]> = {
      "Comor Walsh": [
        `As a battle-tested CEO, here's my take: ${input} requires bold moves.`,
        `${input}? That's a common challenge. The solution lies in three steps...`,
        `*adjusts tie* Let me be frank about ${input}...`
      ],
      "Susan Fowler": [
        `From a cultural perspective, ${input} raises interesting questions.`,
        `Have you considered the team impact of ${input}?`,
        `My research suggests a nuanced approach to ${input}.`
      ],
      "Gwen Hester": [
        `Technically speaking, ${input} presents these opportunities...`,
        `Let me break down the engineering perspective on ${input}.`,
        `For ${input}, I'd recommend this technical approach first.`
      ]
    }

    return responses[memberName]?.[Math.floor(Math.random() * (responses[memberName]?.length || 0))] || 
           `Interesting point about ${input}. Let me think...`
  }

  const allMessages = isTyping 
    ? [...messages, {
        id: 'typing',
        sender: member?.name || '',
        text: '...',
        timestamp: new Date(),
        isCurrentUser: false
      }]
    : messages

  return (
    <div className="flex flex-col h-full bg-zinc-900 text-white border-0 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <h3 className="font-medium text-zinc-100">Chat with {member?.name || ''}</h3>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {allMessages.map(msg => (
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