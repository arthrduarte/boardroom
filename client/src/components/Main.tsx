import MemberCard from './MemberCard'
import UserInput from './UserInput'
import { useState, useEffect } from 'react'

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
    return <div className="bg-zinc-900 flex flex-col items-center">
      <h2 className="text-white text-xl">Loading members...</h2>
    </div>;
  }

  if (error) {
    return <div className="bg-zinc-900 flex flex-col items-center">
      <h2 className="text-red-500 text-xl">Error: {error}</h2>
    </div>;
  }

  return (
    <>
    <div className="bg-zinc-900 flex flex-col items-center">
      <div className="mb-8">
        <UserInput />
        <h1 className="text-3xl font-bold text-white">The microphone/input comes here</h1>
      </div>
        <div className='flex flex-row gap-6 flex-wrap justify-center max-w-7xl'>
          {members.map((member) => (
            <MemberCard key={member.id} name={member.name} role={member.role} image={member.picture} />
          ))}
        </div>
    </div>
    </>
  )
}
