import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { ScrollArea } from "./ui/scroll-area";

interface MemberProfileProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    name: string;
    role: string[];
    image: string;
}

export default function MemberProfile({ open, onOpenChange, name, role, image }: MemberProfileProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="min-w-[900px] max-w-[80vw] flex p-0 gap-0 rounded-lg bg-zinc-900 text-white border border-zinc-800">
                {/* Sidebar - History */}
                <div className="w-[300px] border-r border-zinc-800 flex flex-col">
                    <DialogHeader className="p-6 border-b border-zinc-800">
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
                    <ScrollArea className="flex-1 p-6">
                        <div className="space-y-4">
                            <h3 className="text-sm font-medium text-zinc-400 mb-3">Previous Discussions</h3>
                            <div className="space-y-2">
                                {[...Array(3)].map((_, index) => (
                                    <div 
                                        key={index}
                                        className="cursor-pointer p-4 rounded-lg transition-colors hover:bg-zinc-800/50 border border-zinc-800"
                                    >
                                        <h4 className="font-medium mb-1">Board Meeting #{index + 1}</h4>
                                        <p className="text-sm text-zinc-400">March {20 - index}, 2024</p>
                                        <p className="text-sm text-zinc-500 mt-2 line-clamp-2">
                                            Discussion about quarterly objectives and key results...
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </ScrollArea>
                </div>

                {/* Main Content */}
                <div className="flex-1 flex flex-col">
                    <div className="border-b border-zinc-800 p-6">
                        <h2 className="text-2xl font-semibold">Current Discussion</h2>
                        <p className="text-zinc-400 mt-1">March 21, 2024</p>
                    </div>
                    <ScrollArea className="flex-1 p-6">
                        <div className="space-y-6 max-w-3xl">
                            <div className="space-y-4">
                                <h3 className="text-xl font-semibold text-zinc-100">Meeting Agenda</h3>
                                <div className="prose prose-invert">
                                    <p className="text-zinc-300 leading-relaxed">
                                        This is where {name}'s detailed thoughts and contributions will be displayed. 
                                        The content here can include meeting notes, decisions made, and action items.
                                    </p>
                                </div>
                            </div>
                            
                            <div className="space-y-4">
                                <h3 className="text-xl font-semibold text-zinc-100">Action Items</h3>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-zinc-300">
                                        <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                                        <span>Review Q1 performance metrics</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-zinc-300">
                                        <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                                        <span>Prepare presentation for stakeholders</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </ScrollArea>
                </div>
            </DialogContent>
        </Dialog>
    );
}
