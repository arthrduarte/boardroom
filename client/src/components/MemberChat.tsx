import { useState, useEffect, useRef } from 'react'
import { cn } from "@/lib/utils"
import { ArrowUp, ChevronDown } from "lucide-react"
import { API_BASE_URL } from "@/config"
import { toast } from "sonner"
import { Loading } from "./ui/loading"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "./ui/dropdown-menu"

interface MemberChatProps {
  member?: {  
    id: string
    name: string
    avatar?: string
  }
  userId: string
  selectedDiscussionId?: string
}

type Message = {
  id: string
  sender: string
  text: string
  timestamp: Date
  isCurrentUser?: boolean
  historyParent_id?: string
}

type Member = {
  id: string
  name: string
  role: string[]
  picture: string
}

export const MemberChat = ({ member, userId, selectedDiscussionId }: MemberChatProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [members, setMembers] = useState<Member[]>([]);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [inputMessage, setInputMessage] = useState("");

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/members/user/${userId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch members');
        }
        const data = await response.json();
        setMembers(data);
      } catch (err) {
        console.error('Error fetching members:', err);
        toast.error('Failed to fetch members');
      }
    };

    fetchMembers();
  }, [userId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loading message="Loading discussion thread..." />
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full bg-zinc-900 text-white border-0 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <h3 className="font-medium text-zinc-100">
            {selectedDiscussionId ? 'Continue Discussion' : 'Start New Discussion'}
          </h3>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
      </div>

      {/* Input area */}
      <div className="p-4 border-t border-zinc-800 bg-zinc-900/50">
        <div className="flex items-center gap-2">
          <div className="flex-1 flex items-center gap-2 bg-zinc-800/50 rounded-lg px-4 py-2 text-sm">
            <span className="text-zinc-400">What do you think about this</span>
            <DropdownMenu>
              <DropdownMenuTrigger className="inline-flex items-center justify-center size-8 rounded-full hover:bg-zinc-700/50 transition-colors overflow-hidden border border-zinc-700">
                {selectedMember ? (
                  <img 
                    src={selectedMember.picture} 
                    alt={selectedMember.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <ChevronDown className="h-4 w-4 text-zinc-400" />
                )}
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-zinc-800 border-zinc-700">
                {members.map((m) => (
                  <DropdownMenuItem
                    key={m.id}
                    onClick={() => setSelectedMember(m)}
                    className="flex items-center gap-2 text-zinc-100 hover:bg-zinc-700 cursor-pointer"
                  >
                    <img 
                      src={m.picture} 
                      alt={m.name}
                      className="size-8 rounded-full object-cover border border-zinc-700"
                    />
                    <span>{m.name}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <span className="text-zinc-400">?</span>
          </div>
          <button
            className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!selectedMember}
          >
            <ArrowUp className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  )
}