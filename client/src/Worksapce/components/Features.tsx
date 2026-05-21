import {
  LayoutGrid,
  Search,
  MessageSquare,
  ShieldCheck,
  Bell,
  Layers3,
  CheckCircle2,
} from "lucide-react";
import { HeaderLanding } from "../../Member/pages/Header";
import {  useNavigate } from "react-router-dom";

const features = [
  {
    title: "Kanban Board",
    icon: <LayoutGrid size={28} />,
    desc: "Organize tasks with drag & drop workflows, sprint tracking, and project pipelines.",
    image:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1200&auto=format&fit=crop",
  },
  {
    title: "AI RAG Search",
    icon: <Search size={28} />,
    desc: "Find messages, files, tasks, and documents instantly using AI-powered semantic search.",
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&auto=format&fit=crop",
  },
  {
    title: "Group Chat",
    icon: <MessageSquare size={28} />,
    desc: "Real-time messaging, channels, team collaboration, and threaded conversations.",
    image:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop",
  },
  {
    title: "Roles & Permissions",
    icon: <ShieldCheck size={28} />,
    desc: "Advanced access control for admins, managers, developers, and guests.",
    image:
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1200&auto=format&fit=crop",
  },
  {
    title: "Notifications",
    icon: <Bell size={28} />,
    desc: "Get instant alerts for mentions, tasks, deadlines, and project updates.",
    image:
      "https://images.unsplash.com/photo-1516321165247-4aa89a48be28?q=80&w=1200&auto=format&fit=crop",
  },
  {
    title: "Multiple Workspaces",
    icon: <Layers3 size={28} />,
    desc: "Manage multiple teams, organizations, and projects from one platform.",
    image:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=1200&auto=format&fit=crop",
  },
];

export const Features = () => {

  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-white text-black overflow-hidden">
      <HeaderLanding />

      {/* HERO */}
      <div className="relative">
        <img
          src="https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=1600&auto=format&fit=crop"
          alt="background"
          className="absolute inset-0 w-full h-full object-cover opacity-10"
        />

        <div className="relative z-10 px-6 md:px-20 py-28">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 bg-cyan-50 px-4 py-2 rounded-full border border-cyan-100 mb-6 shadow-sm">
              <CheckCircle2 className="text-green-500" size={18} />

              <span className="text-sm text-gray-700 font-medium">
                Collaboration Platform
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold leading-tight text-gray-900">
              Build Faster Teams with
              <span className="bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">
                {" "}
                AI Collaboration
              </span>
            </h1>

            <p className="mt-6 text-gray-600 text-lg max-w-2xl leading-relaxed">
              A modern platform combining Jira-style project management and
              Slack-like communication in one powerful workspace.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <button className="px-7 py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 transition font-semibold text-white shadow-lg"    onClick={() => navigate("/signup")}>
                Get Started
              </button>

            </div>
          </div>
        </div>
      </div>

      {/* FEATURES */}
      <div className="px-6 md:px-20 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900">
            Powerful Features
          </h2>

          <p className="text-gray-600 mt-4">
            Everything your team needs to collaborate, manage, and scale.
          </p>
        </div>

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-xl hover:-translate-y-2 transition duration-500"
            >
              {/* Background Image */}
              <div className="absolute inset-0">
                <img
                  src={feature.image}
                  alt={feature.title}
                  className="w-full h-full object-cover opacity-10 group-hover:opacity-20 transition duration-500"
                />
              </div>

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/90 to-white/70"></div>

              {/* Content */}
              <div className="relative z-10 p-8">
                <div className="w-14 h-14 rounded-2xl bg-cyan-100 border border-cyan-200 flex items-center justify-center text-cyan-600 shadow-sm">
                  {feature.icon}
                </div>

                <h3 className="mt-6 text-2xl font-semibold text-gray-900">
                  {feature.title}
                </h3>

                <p className="mt-4 text-gray-600 leading-relaxed">
                  {feature.desc}
                </p>

               
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* STATS */}
 
    </div>
  );
};