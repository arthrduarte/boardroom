import { Loader2 } from "lucide-react";

interface LoadingProps {
    message?: string;
}

export function Loading({ message = "Loading..." }: LoadingProps) {
    return (
        <div className="flex flex-col items-center justify-center gap-4 p-8">
            <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
            <p className="text-zinc-400 text-lg">{message}</p>
        </div>
    );
} 