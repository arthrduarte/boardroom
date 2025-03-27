import { Link } from 'react-router-dom'

export function Sidebar() {
  return (
    <nav className="bg-zinc-800 w-64 h-screen flex flex-col border-r border-zinc-700">
      <div className="p-6 border-b border-zinc-700">
        <h1 className="text-xl font-bold text-white">Boardroom</h1>
      </div>

      <div className="flex-1 p-4">
        <div className="space-y-2">
          <div className="mb-6">
            <Link 
              to="/" 
              className="flex items-center px-4 py-3 text-zinc-300 hover:bg-zinc-700/50 rounded-lg transition-colors group"
            >
              <svg className="w-5 h-5 mr-3 text-zinc-400 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span className="font-medium">Home</span>
            </Link>
            <Link 
              to="/members" 
              className="flex items-center px-4 py-3 text-zinc-300 hover:bg-zinc-700/50 rounded-lg transition-colors group"
            >
              <svg className="w-5 h-5 mr-3 text-zinc-400 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <span className="font-medium">Edit Members</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

// Used AI to style the sidebar