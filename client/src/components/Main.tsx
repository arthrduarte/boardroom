import MemberCard from './MemberCard'

const members = [
    { name: "Connor Walsh", role: ["Startup Founder","Growth Hacker"], image: "https://newkchtpdvzlvmwyonse.supabase.co/storage/v1/object/public/members-images//Connor_Walsh.png" },
    { name: "Riley Storm", role: ["Ex-Military","Operations Expert"], image: "https://newkchtpdvzlvmwyonse.supabase.co/storage/v1/object/public/members-images//Riley_Storm.png" },
    { name: "Aiden Knox", role: ["Creative Technologist","Futurist"], image: "https://newkchtpdvzlvmwyonse.supabase.co/storage/v1/object/public/members-images//Aiden_Knox.png" },
    { name: "Liang Chen", role: ["CTO","AI Researcher"], image: "https://newkchtpdvzlvmwyonse.supabase.co/storage/v1/object/public/members-images//Liang_Chen.png" },
    { name: "Tasha Bloom", role: ["Creative Director","Trend Analyst"], image: "https://newkchtpdvzlvmwyonse.supabase.co/storage/v1/object/public/members-images//Tasha_Bloom.png" },
    { name: "Marcus Steele", role: ["Veteran CEO","War Strategist"], image: "https://newkchtpdvzlvmwyonse.supabase.co/storage/v1/object/public/members-images//Marcus_Steele.png" },
    { name: "Sophia Gray", role: ["Psychologist","Cognitive Scientist"], image: "https://newkchtpdvzlvmwyonse.supabase.co/storage/v1/object/public/members-images//Sophia_Gray.png" },
    { name: "Jules Rivera", role: ["Street-Smart Investor","Angel Mentor"], image: "https://newkchtpdvzlvmwyonse.supabase.co/storage/v1/object/public/members-images//Jules_Rivera.png" },
    { name: "Dex Jackson", role: ["Ruthless CFO","Financial Architect"], image: "https://newkchtpdvzlvmwyonse.supabase.co/storage/v1/object/public/members-images//Dex_Jackson.png" },
    { name: "Eleanor Hart", role: ["Chairwoman","Philosopher"], image: "https://newkchtpdvzlvmwyonse.supabase.co/storage/v1/object/public/members-images//Eleanor_Hart.png" },
    { name: "Lucille Tran", role: ["Brand Strategist","Cultural Anthropologist"], image: "https://newkchtpdvzlvmwyonse.supabase.co/storage/v1/object/public/members-images//Lucille_Tran.png" },
    { name: "Priya Desai", role: ["Lawyer","Policy Advisor"], image: "https://newkchtpdvzlvmwyonse.supabase.co/storage/v1/object/public/members-images//Priya_Desai.png" },
    { name: "Dr. Omar Patel", role: ["Ethicist","AI Alignment Expert"], image: "https://newkchtpdvzlvmwyonse.supabase.co/storage/v1/object/public/members-images//Omar_Patel.png" },
    { name: "Gianna Moretti", role: ["Diplomat","Conflict Mediator"], image: "https://newkchtpdvzlvmwyonse.supabase.co/storage/v1/object/public/members-images//Gianna_Moretti.png" },
    { name: "Victor Kwan", role: ["Economist","Macroeconomic Analyst"], image: "https://newkchtpdvzlvmwyonse.supabase.co/storage/v1/object/public/members-images//Victor_Kwan.png" },
]

export default function Main() {
  return (
    <>
    <div className="flex flex-col items-center">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">The microphone/input comes here</h1>
      </div>
        <div className='flex flex-row gap-6 flex-wrap justify-center max-w-7xl'>
          {members.map((member) => (
            <MemberCard key={member.name} name={member.name} role={member.role} image={member.image} />
          ))}
        </div>
    </div>
    </>
  )
}
