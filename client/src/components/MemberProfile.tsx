import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { ScrollArea } from "./ui/scroll-area";
import { useEffect, useState } from "react";
import { Loading } from "./ui/loading";
import { MemberChat } from './MemberChat';

interface HistoryEntry {
    id: string;
    user_input: string;
    member_output: string;
    created_at: string;
}

interface MemberProfileProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    name: string;
    role: string[];
    image: string;
    userId: string;
    memberId: string;
    member: {
        id: string;
        name: string;
        image?: string;
    };
}

export default function MemberProfile({ 
    open, 
    onOpenChange, 
    name, 
    role, 
    image,
    userId,
    memberId,
    member
}: MemberProfileProps) {
    const [history, setHistory] = useState<HistoryEntry[]>([]);
    const [selectedEntry, setSelectedEntry] = useState<HistoryEntry | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (open && userId && memberId) {
            fetchHistory();
        }
        if (!open) {
            setSelectedEntry(null);
        }
    }, [open, userId, memberId]);

    const fetchHistory = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch(`http://localhost:3000/api/history/member/${memberId}/user/${userId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch history');
            }
            const data = await response.json();
            setHistory(data);
            if (data.length > 0) {
                setSelectedEntry(data[0]);
            } else {
                setSelectedEntry(null);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
            console.error('Error fetching history:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    return (
        <>
            {/* Main Profile Dialog */}
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="min-w-[1200px] max-w-[90vw] h-[80vh] flex p-0 gap-0 rounded-lg bg-zinc-900 text-white border border-zinc-800">
                    {/* Sidebar - History */}
                    <div className="w-[300px] border-r border-zinc-800 flex flex-col h-full">
                        <DialogHeader className="p-6 border-b border-zinc-800 flex-shrink-0">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-zinc-700">
                                    <img src={image} alt={name} className="w-full h-full object-cover" />
                                </div>
                                <div className="space-y-1">
                                    <DialogTitle className="text-xl font-semibold tracking-tight">{name}</DialogTitle>
                                    <div className="flex flex-wrap gap-1.5">
                                        {role.map((r, index) => (
                                            <span 
                                                key={index}
                                                className="text-xs px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300"
                                            >
                                                {r}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </DialogHeader>
                        <div className="flex-1 min-h-0">
                            <ScrollArea className="h-full">
                                <div className="p-6">
                                    {isLoading ? (
                                        <Loading message="Loading history..." />
                                    ) : error ? (
                                        <div className="text-center text-red-400">{error}</div>
                                    ) : history.length === 0 ? (
                                        <div className="text-center text-zinc-400">No previous discussions yet</div>
                                    ) : (
                                        <div className="space-y-4">
                                            <h3 className="text-sm font-medium text-zinc-400 mb-3">Previous Discussions</h3>
                                            <div className="space-y-2">
                                                {history.map((entry) => (
                                                    <div 
                                                        key={entry.id}
                                                        onClick={() => setSelectedEntry(entry)}
                                                        className={`group cursor-pointer p-4 rounded-lg transition-colors border
                                                            ${selectedEntry?.id === entry.id 
                                                                ? 'bg-zinc-800 border-zinc-600' 
                                                                : 'border-zinc-800 hover:bg-zinc-800/50'}`}
                                                    >
                                                        <div className="flex justify-between items-start">
                                                            <div>
                                                                <p className="text-sm text-zinc-400">{formatDate(entry.created_at)}</p>
                                                                <p className="text-sm text-zinc-300 mt-2 line-clamp-2">
                                                                    {entry.user_input}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </ScrollArea>
                        </div>
                        <div className="p-4 border-t border-zinc-800">
                            <span className="text-xs text-zinc-500">Select a past discussion to view details.</span>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 flex flex-col h-full border-r border-zinc-800">
                        <div className="border-b border-zinc-800 p-6 flex-shrink-0">
                            <h2 className="text-2xl font-semibold">Discussion Details</h2>
                            {selectedEntry && (
                                <p className="text-zinc-400 mt-1">{formatDate(selectedEntry.created_at)}</p>
                            )}
                        </div>
                        <div className="flex-1 min-h-0">
                            <ScrollArea className="h-full">
                                <div className="p-6">
                                    {selectedEntry ? (
                                        <div className="space-y-8 max-w-3xl">
                                            <div className="space-y-4">
                                                <div className="space-y-2">
                                                    <h3 className="text-lg font-medium text-zinc-300">Your Question</h3>
                                                    <p className="text-zinc-400 leading-relaxed">
                                                        {selectedEntry.user_input}
                                                    </p>
                                                </div>
                                            </div>
                                            
                                            <div className="space-y-4">
                                                <div className="space-y-2">
                                                    <h3 className="text-lg font-medium text-zinc-300">{name}'s Response</h3>
                                                    <div className="prose prose-invert max-w-none">
                                                        <p className="text-zinc-400 leading-relaxed whitespace-pre-wrap">
                                                            {selectedEntry.member_output}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-center text-zinc-400 mt-8 flex items-center justify-center h-full">
                                            {isLoading ? <Loading message="Loading discussion..." /> : history.length > 0 ? 'Select a discussion to view details' : 'No discussion history available.'}
                                        </div>
                                    )}
                                </div>
                            </ScrollArea>
                        </div>
                    </div>

                    {/* Chat Section */}
                    <div className="w-[400px] flex flex-col h-full bg-zinc-900">
                        <MemberChat
                            member={member}
                            key={memberId}
                        />
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}