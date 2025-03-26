import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { ScrollArea } from "./ui/scroll-area";

interface MemberProfileProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    name: string;
    role: string;
    image: string;
}

export default function MemberProfile({ open, onOpenChange, name, role, image }: MemberProfileProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="min-w-6xl flex p-0">
                {/* Sidebar - History */}
                <div className="border-r p-4">
                    <DialogHeader>
                        <div className="flex items-center gap-2 mb-4">
                            <img src={image} alt={name} className="rounded-full w-10 h-10" />
                            <div>
                                <DialogTitle>{name}</DialogTitle>
                                <p className="text-sm text-muted-foreground">{role}</p>
                            </div>
                        </div>
                    </DialogHeader>
                    <ScrollArea className="h-full">
                        <div className="space-y-4">
                            <div className="cursor-pointer p-2 rounded hover:bg-muted">
                                <h4 className="font-medium">Previous Discussion</h4>
                                <p className="text-sm text-muted-foreground">Date: 2024-03-20</p>
                            </div>
                            {/* Add more history items here */}
                        </div>
                    </ScrollArea>
                </div>

                {/* Main Content */}
                <div className="p-6">
                    <ScrollArea className="h-full">
                        <div className="space-y-4">
                            <h3 className="text-xl font-semibold">Current Discussion Topic</h3>
                            <div>
                                <p>This is where {name}'s detailed thoughts and contributions will be displayed.</p>
                            </div>
                        </div>
                    </ScrollArea>
                </div>
            </DialogContent>
        </Dialog>
    );
}
