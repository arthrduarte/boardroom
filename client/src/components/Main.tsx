import MemberCard from './MemberCard'
import UserInput from './UserInput'
import { useState, useEffect } from 'react'
import { Loading } from './ui/loading'
import { API_BASE_URL } from '../config'

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
        const response = await fetch(`${API_BASE_URL}/members/user/${userId}`);
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
    <div className="bg-zinc-900 flex flex-col items-center p-4 sm:p-6">
      <div className="w-full max-w-7xl space-y-6 sm:space-y-8 mt-12 lg:mt-0">
        <UserInput userId={userId} />
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4'>
          {members.map((member) => (
            <MemberCard 
              key={member.id}
              id={member.id}
              userId={userId}
              name={member.name}
              role={member.role}
              image={member.picture}
              mode="profile"
            />
          ))}
        </div>
      </div>
    </div>
  )
}
