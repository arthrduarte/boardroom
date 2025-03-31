import { useState } from "react";
import { Card, CardHeader, CardTitle } from "./ui/card";
import MemberProfile from "./MemberProfile";

interface MemberCardProps {
    id: string;
    userId: string;
    name: string;
    role: string[];
    image: string;
    thoughts?: string;   // Making thoughts optional
    description?: string;  // Optional description
    background?: string;   // Optional background
    mode?: "profile" | "edit"; // New prop to determine behavior
    onEdit?: (member: any) => void; // Callback for edit mode
}

export default function MemberCard({ 
    id, 
    userId, 
    name, 
    role, 
    image, 
    description,
    background,
    mode = "profile", // Default to profile mode
    onEdit 
}: MemberCardProps) {
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    
    const handleClick = () => {
        if (mode === "profile") {
            setIsProfileOpen(true);
        } else if (mode === "edit" && onEdit) {
            onEdit({
                id,
                name,
                role,
                picture: image,
                user_id: userId,
                description: description || '',
                background: background || ''
            });
        }
    };

    return (
        <>
            <Card 
                className="bg-zinc-900 text-white cursor-pointer border border-zinc-800 transition-all duration-300 hover:border-zinc-600 hover:shadow-lg hover:shadow-zinc-900/20"
                onClick={handleClick}
            >
                <CardHeader className="flex flex-row">
                    <div className="w-1/3">
                        <img 
                            src={image} 
                            alt={name} 
                            className="w-full h-full border-2 rounded-lg border-zinc-700 object-cover"
                        />
                    </div>
                    <div className="w-2/3 ml-4">
                        <CardTitle className="text-lg sm:text-xl font-semibold mb-4">{name}</CardTitle>
                        <div className="flex flex-wrap gap-1.5 sm:gap-2">
                            {role.map((r, index) => (
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

            {mode === "profile" && (
                <MemberProfile
                    open={isProfileOpen}
                    onOpenChange={setIsProfileOpen}
                    name={name}
                    role={role}
                    image={image}
                    userId={userId}
                    memberId={id}
                    member={{
                        id,
                        name,
                        picture: image
                    }}
                />
            )}
        </>
    )
}
