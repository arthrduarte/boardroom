import MemberCard from './MemberCard'
import UserInput from './UserInput'
import { useState, useEffect } from 'react'
import { Loading } from './ui/loading'

interface Member {
    id: string;
    name: string;
    role: string[];
    picture: string;
}

interface MainProps {
    userId: string;
}

export default function Main({ userId }: MainProps) {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/members/user/${userId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch members');
        }
        const data = await response.json();
        setMembers(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, [userId]);

  if (loading) {
    return (
      <div className="bg-zinc-900 min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <Loading message="Loading members..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-zinc-900 min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <h2 className="text-red-500 text-xl">Error: {error}</h2>
      </div>
    );
  }

  return (
    <div className="bg-zinc-900 flex flex-col items-center p-6">
      <div className="w-full max-w-7xl space-y-8">
        <UserInput userId={userId} />
        <div className='flex flex-row gap-6 flex-wrap justify-center'>
          {members.map((member) => (
            <MemberCard 
              key={member.id}
              id={member.id}
              userId={userId}
              name={member.name}
              role={member.role}
              image={member.picture}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
