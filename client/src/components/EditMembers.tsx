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
import { Pencil, Plus, Trash2 } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "./ui/dialog";
import { API_BASE_URL } from "../config";

interface Picture {
    id: string;
    url: string;
    created_at: string;
}

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
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [editedMember, setEditedMember] = useState<Member | null>(null);
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [pictures, setPictures] = useState<Picture[]>([]);
    const [isPicturesLoading, setIsPicturesLoading] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    useEffect(() => {
        fetchMembers();
    }, [userId]);

    const fetchMembers = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_BASE_URL}/members/user/${userId}`);
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

    const fetchPictures = async () => {
        console.log("Fetching pictures...");
        setIsPicturesLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/pictures`);
            if (!response.ok) {
                throw new Error('Failed to fetch pictures');
            }
            
            const data = await response.json();
            console.log("Pictures data received:", data);
            setPictures(data);
        } catch (err) {
            console.error('Error fetching pictures:', err);
        } finally {
            setIsPicturesLoading(false);
        }
    };

    const handleMemberSelect = (member: Member) => {
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
            let response;
            if (editedMember.id === 'new') {
                // Create new member
                response = await fetch(`${API_BASE_URL}/members`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        name: editedMember.name,
                        description: editedMember.description,
                        background: editedMember.background,
                        role: editedMember.role,
                        picture: editedMember.picture || '',
                        user_id: userId
                    }),
                });
            } else {
                // Update existing member
                response = await fetch(`${API_BASE_URL}/members/${editedMember.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(editedMember),
                });
            }

            if (!response.ok) {
                throw new Error(editedMember.id === 'new' ? 'Failed to create member' : 'Failed to update member');
            }

            const savedMember = await response.json();

            // Update the members list
            setMembers(prev => 
                editedMember.id === 'new' 
                    ? [...prev, savedMember]
                    : prev.map(m => m.id === editedMember.id ? savedMember : m)
            );
            
            setIsSheetOpen(false);
            toast.success('Member saved successfully!');
        } catch (err) {
            console.error('Error saving member:', err);
            toast.error('Failed to save member. Please try again.');
        }
    };

    const handlePictureSelect = (url: string) => {
        if (!editedMember) return;
        handleInputChange('picture', url);
    };

    const handleDelete = async () => {
        if (!editedMember || editedMember.id === 'new') return;
        setIsDeleteDialogOpen(true);
    };

    const confirmDelete = async () => {
        if (!editedMember || editedMember.id === 'new') return;

        try {
            const response = await fetch(`${API_BASE_URL}/members/${editedMember.id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete member');
            }

            // Remove the member from the list
            setMembers(prev => prev.filter(m => m.id !== editedMember.id));
            setIsSheetOpen(false);
            setIsDeleteDialogOpen(false);
            toast.success('Member deleted successfully!');
        } catch (err) {
            console.error('Error deleting member:', err);
            toast.error('Failed to delete member. Please try again.');
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
                    <Card 
                        className="bg-zinc-900 text-zinc-400 cursor-pointer border-2 border-dashed border-zinc-700 transition-all duration-300 hover:border-zinc-500 hover:text-zinc-200 hover:shadow-lg hover:shadow-zinc-900/20"
                        onClick={() => handleMemberSelect({
                            id: 'new',
                            name: '',
                            description: '',
                            background: '',
                            role: [],
                            picture: '',
                            user_id: userId
                        })}
                    >
                        <CardHeader className="flex items-center justify-center h-[104px]">
                            <Plus className="w-8 h-8" />
                        </CardHeader>
                    </Card>
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
                                <div className="flex items-center gap-2">
                                    {editedMember?.picture ? (
                                        <img 
                                            src={editedMember?.picture} 
                                            alt={editedMember?.name} 
                                            className="w-16 h-16 rounded-full overflow-hidden border-2 border-zinc-700 object-cover" 
                                        />
                                    ) : (
                                        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-zinc-700 bg-zinc-800 flex items-center justify-center">
                                        </div>
                                    )}
                                    <DropdownMenu onOpenChange={(open) => {
                                        if (open) {
                                            fetchPictures();
                                        }
                                    }}>
                                        <DropdownMenuTrigger asChild>
                                            <button 
                                                className="p-2 hover:bg-zinc-800 rounded-full transition-colors"
                                            >
                                                <Pencil className="w-4 h-4 text-zinc-400" />
                                            </button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent 
                                            className="w-[320px] bg-zinc-800 border-zinc-700 p-2"
                                            align="end"
                                        >
                                            <div className="mb-2 px-2 py-1">
                                                <h4 className="text-sm font-medium text-zinc-300">Select Profile Picture</h4>
                                            </div>
                                            {isPicturesLoading ? (
                                                <div className="p-4 text-center text-sm text-zinc-400">
                                                    Loading pictures...
                                                </div>
                                            ) : pictures.length === 0 ? (
                                                <div className="p-4 text-center text-sm text-zinc-400">
                                                    No pictures available
                                                </div>
                                            ) : (
                                                <div className="grid grid-cols-4 gap-2 max-h-[320px] overflow-y-auto p-1">
                                                    {pictures.map((picture) => (
                                                        <button
                                                            key={picture.id}
                                                            className={`
                                                                aspect-square rounded-md overflow-hidden
                                                                hover:ring-2 hover:ring-zinc-500
                                                                transition-all duration-200
                                                                ${editedMember?.picture === picture.url ? 'ring-2 ring-blue-500' : ''}
                                                            `}
                                                            onClick={() => handlePictureSelect(picture.url)}
                                                        >
                                                            <img
                                                                src={picture.url}
                                                                alt="Profile picture option"
                                                                className="w-full h-full object-cover"
                                                            />
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
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
                            </div>
                        </div>
                    </ScrollArea>

                    <SheetFooter className="border-t border-zinc-800 pt-4">
                        <div className="flex w-full gap-2">
                            <button
                                onClick={handleSave}
                                className="cursor-pointer flex-1 bg-zinc-800 text-white py-2 px-4 rounded-md border border-zinc-700
                                        hover:bg-zinc-700 hover:border-zinc-600 transition-all duration-200"
                            >
                                Save Changes
                            </button>
                            {editedMember?.id !== 'new' && (
                                <button
                                    onClick={handleDelete}
                                    className="cursor-pointer px-4 py-2 text-red-400 border border-zinc-700 rounded-md hover:bg-red-500/10 
                                            hover:border-red-500/50 hover:text-red-300 transition-all duration-200"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            )}
                        </div>
                    </SheetFooter>
                </SheetContent>
            </Sheet>

            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent className="bg-zinc-900 border-zinc-800 text-white">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-semibold">Delete Member</DialogTitle>
                        <DialogDescription className="text-zinc-400">
                            Are you sure you want to delete {editedMember?.name}? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="flex gap-2 border-t border-zinc-800 pt-4">
                        <button
                            onClick={() => setIsDeleteDialogOpen(false)}
                            className="cursor-pointer flex-1 bg-zinc-800 text-white py-2 px-4 rounded-md border border-zinc-700
                                    hover:bg-zinc-700 hover:border-zinc-600 transition-all duration-200"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={confirmDelete}
                            className="cursor-pointer flex-1 bg-red-500/10 text-red-400 py-2 px-4 rounded-md border border-red-500/50
                                    hover:bg-red-500/20 hover:text-red-300 transition-all duration-200"
                        >
                            Delete
                        </button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
