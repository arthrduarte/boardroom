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

type HistoryEntry = {
  id: string
  user_id: string
  member_id: string
  user_input: string
  member_output: string
  created_at: string
  historyParent_id?: string
  chat?: ChatMessage[]
}

type Member = {
  id: string
  name: string
  picture: string
}

type ChatMessage = {
  message: string
  member_id: string
}

interface MemberChatProps {
  member: {  
    id: string
    name: string
    picture: string
  }
  userId: string
  selectedEntry: HistoryEntry | null
}

export const MemberChat = ({ member, userId, selectedEntry }: MemberChatProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [members, setMembers] = useState<Member[]>([]);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

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

  useEffect(() => {
    if (selectedEntry?.chat) {
      setChatMessages(selectedEntry.chat);
    }
  }, [selectedEntry]);

  const getMemberInfo = (memberId: string): Member | undefined => {
    if (memberId === member.id) return member;
    return members.find(m => m.id === memberId);
  };

  const handleSubmit = async (selectedMember: Member | null, member: Member, user_input: string, member_output: string, historyId: string) => {
    setIsLoading(true);
    try {
      if (!selectedMember) {
        throw new Error('No member selected');
      }

      const response = await fetch(`${API_BASE_URL}/history/message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          member_1: selectedMember,
          member_2: member,
          user_input,
          member_output,
          history_id: historyId
        })
      });

      if (!response.ok) {
        throw new Error('Failed to submit message');
      }

      const data = await response.json();
      setChatMessages(prev => [...prev, {
        message: data.response,
        member_id: selectedMember.id
      }]);
      console.log('Message submitted:', data);
      toast.success('Message sent successfully');
    } catch (err) {
      console.error('Error submitting message:', err);
      toast.error('Failed to submit message');
    } finally {
      setIsLoading(false);
    }
  }
  

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
            Chat
          </h3>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {chatMessages.map((msg, index) => {
          const messageMember = getMemberInfo(msg.member_id);
          if (!messageMember) return null;

          return (
            <div key={index} className="flex items-start gap-3">
              <img 
                src={messageMember.picture} 
                alt={messageMember.name}
                className="w-8 h-8 rounded-full object-cover border border-zinc-700"
              />
              <div className="flex-1">
                <div className="font-medium text-zinc-200 mb-1">{messageMember.name}</div>
                <div className="text-zinc-300 text-sm">{msg.message}</div>
              </div>
            </div>
          );
        })}
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
              onClick={() => handleSubmit(selectedMember, member, selectedEntry?.user_input || '', selectedEntry?.member_output || '', selectedEntry?.id || '')}
          >
            <ArrowUp className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  )
}