import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { ScrollArea } from "./ui/scroll-area";

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
        } catch (err) {
            console.error('Error updating member:', err);
            alert('Failed to update member. Please try again.');
        }
    };

    if (isLoading) {
        return <div className="text-center text-zinc-400 p-8">Loading members...</div>;
    }

    if (error) {
        return <div className="text-center text-red-400 p-8">Error: {error}</div>;
    }

    return (
        <div className="flex h-[calc(100vh-4rem)] bg-zinc-900">
            {/* Members List */}
            <div className="w-1/2 p-6 border-zinc-800">
                <div className="mb-6">
                    <h2 className="text-2xl font-semibold text-white">Your Board Members</h2>
                    <p className="text-zinc-400 mt-2">Select a member to edit their information</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    {members.map((member) => (
                        <Card 
                            key={member.id}
                            className={`bg-zinc-900 text-white cursor-pointer border border-zinc-800 transition-all duration-300 hover:border-zinc-600 hover:shadow-lg hover:shadow-zinc-900/20
                                ${selectedMember?.id === member.id ? 'border-zinc-600 bg-zinc-800/50' : ''}`}
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
        </div>
    );
}
