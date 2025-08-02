import { useState } from 'react';
import { Briefcase, Code, LineChart } from 'lucide-react';

export default function MulipleWorkspace() {
  const [hoveredWorkspace, setHoveredWorkspace] = useState(null);
  const [selectedWorkspace, setSelectedWorkspace] = useState(null);

  const workspaces = [
    {
      id: 'business',
      name: 'Business',
      description: 'Manage tasks, projects, and team collaboration',
      icon: Briefcase
    },
    {
      id: 'development',
      name: 'Development',
      description: 'Code, build, and deploy applications',
      icon: Code
    },
    {
      id: 'analytics',
      name: 'Analytics',
      description: 'Track metrics and generate reports',
      icon: LineChart
    }
  ];

  const handleSelect = (workspaceId) => {
    setSelectedWorkspace(workspaceId);
    // In a real app, this would navigate to the selected workspace
    console.log(`Selected workspace: ${workspaceId}`);
  };

  return (
    <div className="flex flex-col items-center justify-center w-screen h-screen bg-violet-900">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-white mb-2">Choose Your Workspace</h1>
        <p className="text-violet-200">Select the workspace that fits your current needs</p>
      </div>

      <div className="flex flex-wrap justify-center gap-8 px-4">
        {workspaces.map((workspace) => (
          <div
            key={workspace.id}
            className={`relative flex flex-col items-center p-8 rounded-xl w-64 transition-all duration-300 cursor-pointer
              ${hoveredWorkspace === workspace.id ? 'bg-violet-700 transform scale-105' : 'bg-violet-800'}
              ${selectedWorkspace === workspace.id ? 'ring-4 ring-violet-400' : ''}
            `}
            onMouseEnter={() => setHoveredWorkspace(workspace.id)}
            onMouseLeave={() => setHoveredWorkspace(null)}
            onClick={() => handleSelect(workspace.id)}
          >
            <div className="p-4 bg-violet-600 rounded-full mb-4">
              <workspace.icon size={48} className="text-white" />
            </div>
            
            <h2 className="text-xl font-bold text-white mb-2">{workspace.name}</h2>
            <p className="text-violet-200 text-center">{workspace.description}</p>
            
            {hoveredWorkspace === workspace.id && (
              <div className="absolute bottom-4 right-4">
                <div className="bg-violet-500 rounded-full p-2">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}