import MemberCard from './MemberCard'

export default function Main() {
  return (
    <>
    <div className="flex flex-col justify-center items-center h-screen">
        <div className="mb-8">
            <h1 className="text-3xl font-bold">The microphone/input comes here</h1>
        </div>
        <div className="flex flex-row gap-6 flex-wrap justify-center max-w-6xl">
            <MemberCard name="John Doe" role="Board Member" image="https://plus.unsplash.com/premium_photo-1694557637761-4bf2467c261b?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" />
        </div>
    </div>
    </>
  )
}
