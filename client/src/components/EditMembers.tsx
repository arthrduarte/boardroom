import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle } from "./ui/card";
import { ScrollArea } from "./ui/scroll-area";
import { Loading } from "./ui/loading";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
    SheetFooter,
} from "./ui/sheet";

interface Member {
    id: string;
    name: string;
    description: string;
    background: string;
    role: string[];
    picture: string;
    user_id: string;
}

interface EditMembersProps {
    userId: string;
}

export default function EditMembers({ userId }: EditMembersProps) {
    const [members, setMembers] = useState<Member[]>([]);
    const [selectedMember, setSelectedMember] = useState<Member | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [editedMember, setEditedMember] = useState<Member | null>(null);
    const [isSheetOpen, setIsSheetOpen] = useState(false);

    useEffect(() => {
        fetchMembers();
    }, [userId]);

    const fetchMembers = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch(`http://localhost:3000/api/members/user/${userId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch members');
            }
            const data = await response.json();
            setMembers(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
            console.error('Error fetching members:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleMemberSelect = (member: Member) => {
        setSelectedMember(member);
        setEditedMember(member);
        setIsSheetOpen(true);
    };

    const handleInputChange = (field: keyof Member, value: string | string[]) => {
        if (!editedMember) return;

        setEditedMember(prev => {
            if (!prev) return prev;
            return {
                ...prev,
                [field]: value
            };
        });
    };

    const handleRoleChange = (roleStr: string) => {
        if (!editedMember) return;
        const roles = roleStr.split(',').map(role => role.trim());
        setEditedMember(prev => {
            if (!prev) return prev;
            return {
                ...prev,
                role: roles
            };
        });
    };

    const handleSave = async () => {
        if (!editedMember) return;
        
        try {
            const response = await fetch(`http://localhost:3000/api/members/${editedMember.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(editedMember),
            });

            if (!response.ok) {
                throw new Error('Failed to update member');
            }

            // Update the members list with the edited member
            setMembers(prev => prev.map(m => 
                m.id === editedMember.id ? editedMember : m
            ));
            
            // Update the selected member
            setSelectedMember(editedMember);
            setIsSheetOpen(false);
        } catch (err) {
            console.error('Error updating member:', err);
            alert('Failed to update member. Please try again.');
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-[calc(100vh-4rem)] bg-zinc-900 flex items-center justify-center">
                <Loading message="Loading members..." />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-[calc(100vh-4rem)] bg-zinc-900 flex items-center justify-center">
                <div className="text-center text-red-400 p-8">Error: {error}</div>
            </div>
        );
    }

    return (
        <>
            <div className="p-6 bg-zinc-900 min-h-[calc(100vh-4rem)]">
                <div className="mb-6">
                    <h2 className="text-2xl font-semibold text-white">Your Board Members</h2>
                    <p className="text-zinc-400 mt-2">Select a member to edit their information</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {members.map((member) => (
                        <Card 
                            key={member.id}
                            className="bg-zinc-900 text-white cursor-pointer border border-zinc-800 transition-all duration-300 hover:border-zinc-600 hover:shadow-lg hover:shadow-zinc-900/20"
                            onClick={() => handleMemberSelect(member)}
                        >
                            <CardHeader className="flex flex-row items-center gap-4 p-6">
                                <div>
                                    <img 
                                        src={member.picture} 
                                        alt={member.name} 
                                        className="w-16 h-16 rounded-full overflow-hidden border-2 border-zinc-700 object-cover"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <CardTitle className="text-xl font-semibold">{member.name}</CardTitle>
                                    <div className="flex flex-wrap gap-2">
                                        {member.role.map((r, index) => (
                                            <span 
                                                key={index}
                                                className="text-xs px-2.5 py-1 rounded-full bg-zinc-800 text-zinc-300"
                                            >
                                                {r}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </CardHeader>
                        </Card>
                    ))}
                </div>
            </div>

            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetContent className="min-w-1/3 bg-zinc-900 border-zinc-800 text-white">
                    <SheetHeader className="border-b border-zinc-800 pb-4">
                        <SheetTitle className="text-xl font-semibold text-white">
                            Edit Member
                        </SheetTitle>
                        <SheetDescription className="text-zinc-400">
                            Make changes to member information here
                        </SheetDescription>
                    </SheetHeader>

                    <ScrollArea className="h-[calc(100vh-10rem)] mt-6 mx-6">
                        <div className="space-y-6 pr-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-zinc-300 mb-2">Name</label>
                                    <input
                                        type="text"
                                        value={editedMember?.name}
                                        onChange={(e) => handleInputChange('name', e.target.value)}
                                        className="w-full p-2 bg-zinc-800/50 text-white border border-zinc-700 rounded-md 
                                                focus:ring-2 focus:ring-zinc-600 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-zinc-300 mb-2">Roles (comma-separated)</label>
                                    <input
                                        type="text"
                                        value={editedMember?.role.join(', ')}
                                        onChange={(e) => handleRoleChange(e.target.value)}
                                        className="w-full p-2 bg-zinc-800/50 text-white border border-zinc-700 rounded-md 
                                                focus:ring-2 focus:ring-zinc-600 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-zinc-300 mb-2">Description</label>
                                    <textarea
                                        value={editedMember?.description}
                                        onChange={(e) => handleInputChange('description', e.target.value)}
                                        className="w-full p-2 bg-zinc-800/50 text-white border border-zinc-700 rounded-md 
                                                focus:ring-2 focus:ring-zinc-600 focus:border-transparent h-32 resize-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-zinc-300 mb-2">Background</label>
                                    <textarea
                                        value={editedMember?.background}
                                        onChange={(e) => handleInputChange('background', e.target.value)}
                                        className="w-full p-2 bg-zinc-800/50 text-white border border-zinc-700 rounded-md 
                                                focus:ring-2 focus:ring-zinc-600 focus:border-transparent h-32 resize-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-zinc-300 mb-2">Profile Picture URL</label>
                                    <input
                                        type="text"
                                        value={editedMember?.picture}
                                        onChange={(e) => handleInputChange('picture', e.target.value)}
                                        className="w-full p-2 bg-zinc-800/50 text-white border border-zinc-700 rounded-md 
                                                focus:ring-2 focus:ring-zinc-600 focus:border-transparent"
                                    />
                                </div>
                            </div>
                        </div>
                    </ScrollArea>

                    <SheetFooter className="border-t border-zinc-800 pt-4">
                        <button
                            onClick={handleSave}
                            className="w-full bg-zinc-800 text-white py-2 px-4 rounded-md border border-zinc-700
                                    hover:bg-zinc-700 hover:border-zinc-600 transition-all duration-200"
                        >
                            Save Changes
                        </button>
                    </SheetFooter>
                </SheetContent>
            </Sheet>
        </>
    );
}
