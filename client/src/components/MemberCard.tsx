import { useState } from "react";
import { Card, CardHeader, CardTitle } from "./ui/card";
import MemberProfile from "./MemberProfile";

interface MemberCardProps {
    name: string;
    role: string[];
    image: string;   
}

export default function MemberCard({ name, role, image }: MemberCardProps) {
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    return (
        <>
            <Card 
                className="bg-zinc-900 text-white w-[250px] p-0 cursor-pointer border border-zinc-800 transition-all duration-300 hover:border-zinc-600 hover:shadow-lg hover:shadow-zinc-900/20 hover:transform hover:scale-[1.02]"
                onClick={() => setIsProfileOpen(true)}
            >
                <CardHeader className="flex flex-col items-center space-y-6 p-6">
                    <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-zinc-700">
                        <img 
                            src={image} 
                            alt={name} 
                            className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                        />
                    </div>
                    <div className="text-center space-y-2.5">
                        <CardTitle className="text-xl font-semibold tracking-tight">{name}</CardTitle>
                        <div className="flex flex-wrap gap-2 justify-center">
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

            <MemberProfile
                open={isProfileOpen}
                onOpenChange={setIsProfileOpen}
                name={name}
                role={role}
                image={image}
            />
        </>
    )
}
