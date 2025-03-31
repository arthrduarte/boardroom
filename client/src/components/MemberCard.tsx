import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import MemberProfile from "./MemberProfile";

interface MemberCardProps {
    id: string;
    userId: string;
    name: string;
    role: string[];
    image: string;
    thoughts?: string;   // Making thoughts optional
}

export default function MemberCard({ id, userId, name, role, image, thoughts }: MemberCardProps) {
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    return (
        <>
            <Card 
                className="bg-zinc-900 text-white w-[350px] p-0 cursor-pointer border border-zinc-800 transition-all duration-300 hover:border-zinc-600 hover:shadow-lg hover:shadow-zinc-900/20 hover:transform hover:scale-[1.02]"
                onClick={() => setIsProfileOpen(true)}
            >
                <CardHeader className="flex flex-row items-center gap-4 p-6">
                    <div>
                        <img 
                            src={image} 
                            alt={name} 
                            className="w-16 h-16 rounded-full overflow-hidden border-2 border-zinc-700 object-cover"
                        />
                    </div>
                    <div className="space-y-2">
                        <CardTitle className="text-xl font-semibold">{name}</CardTitle>
                        <div className="flex flex-wrap gap-2">
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
                <CardContent className="px-6 pb-6 pt-0">
                    <p className="text-zinc-400 text-sm">
                        {thoughts || "Member thoughts come here..."}
                    </p>
                </CardContent>
            </Card>

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
                    image
                }}
            />
        </>
    )
}
