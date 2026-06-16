'use client';

import React, { useState } from 'react';
import { 
  Users, 
  Settings, 
  Plus, 
  MoreHorizontal, 
  MapPin, 
  Mail, 
  Calendar 
} from 'lucide-react';

interface Member {
  userId: {
    _id: string;
    email: string;
    name: string;
  };
  title: string;
  permissions: string;
  role: string;
  isBlocked: boolean;
  isSuspend:boolean;
  isDeleted: boolean;
  isOnline: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Workspace {
  _id: string;
  name: string;
  slug: string;
  ownerId: string;
  createdAt: string;
  members: Member[];
  status: string;
  storage: number;
  currentSubscription: any;
  stripeCustomerId: string;
}

interface User {
  _id: string;
  email: string;
  name: string;
  workspace: Workspace[];
  isSuperAdmin: boolean;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  about: string | null;
  isSuspend:boolean;
  address: string | null;
  imageUrl: string | null;
  location: string;
  phone: string | null;
}

const mockUser: User = {
  _id: '6a26d0d0137db52bc065c1d2',
  email: 'kacanaw866@fixscal.com',
  name: 'Fazal',
  workspace: [
    {
      _id: '6a26c8538129f596ee372a15',
      name: 'Google',
      slug: 'googlecom',
      ownerId: '6a26c81e8129f596ee3729fa',
      createdAt: '2026-06-08T13:49:07.215Z',
      members: [],
      status: 'Active',
      storage: 1,
      currentSubscription: null,
      stripeCustomerId: '',
    },
    {
      _id: '6a27af9a3b05c98e21ac6dce',
      name: 'Yahoo',
      slug: 'yahoocom',
      ownerId: '6a26d0d0137db52bc065c1d2',
      createdAt: '2026-06-09T06:15:54.717Z',
      members: [],
      status: 'Active',
      storage: 1,
      currentSubscription: null,
      stripeCustomerId: '',
    },
    {
      _id: '6a27eedfb7c2500f1d1fca63',
      name: 'Developers',
      slug: 'developerscom',
      ownerId: '6a26c81e8129f596ee3729fa',
      createdAt: '2026-06-09T10:45:51.138Z',
      members: [],
      status: 'Active',
      storage: 1,
      currentSubscription: null,
      stripeCustomerId: '',
    },
    {
      _id: '6a27efe3b7c2500f1d1fcba4',
      name: 'testrer',
      slug: 'testrercom',
      ownerId: '6a26d0d0137db52bc065c1d2',
      createdAt: '2026-06-09T10:50:11.654Z',
      members: [],
      status: 'Active',
      storage: 1,
      currentSubscription: null,
      stripeCustomerId: '',
    }
  ],
  isSuperAdmin: false,
  isVerified: true,
  createdAt: '2026-06-08T14:25:20.442Z',
  updatedAt: '2026-06-09T15:44:59.425Z',
  about: null,
  address: null,
  imageUrl: null,
  location: 'kannur kerala',
  phone: null
};

const WorkspaceCard: React.FC<{ workspace: Workspace; isOwner: boolean }> = ({ workspace, isOwner }) => {
  const createdDate = new Date(workspace.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl">
            {workspace.name[0]}
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{workspace.name}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">@{workspace.slug}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <span className={`px-3 py-1 text-xs font-medium rounded-full ${
            workspace.status === 'Active' 
              ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
              : 'bg-gray-100 text-gray-600'
          }`}>
            {workspace.status}
          </span>
          {isOwner && (
            <span className="px-3 py-1 text-xs font-medium bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 rounded-full">
              Owner
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-6">
        <div className="flex items-center gap-1.5">
          <Calendar className="w-4 h-4" />
          <span>Created {createdDate}</span>
        </div>
        <div className="flex items-center gap-1">
          <Users className="w-4 h-4" />
          <span>{workspace.members.length || 1} members</span>
        </div>
      </div>

      <div className="flex gap-3">
        <button className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-4 rounded-xl font-medium transition-colors flex items-center justify-center gap-2">
          <span>Open Workspace</span>
        </button>
        
        <button className="p-3 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl transition-colors">
         Active
        </button>
      </div>
    </div>
  );
};

const UserProfileHeader: React.FC<{ user: User }> = ({ user }) => {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-8 py-8">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* Avatar */}
          <div className="w-28 h-28 rounded-3xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white text-5xl font-bold shadow-xl">
            {user.name.charAt(0)}
          </div>

          {/* Info */}
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-2">
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white">{user.name}</h1>
              {user.isVerified && (
                <div className="px-3 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400 text-sm font-medium rounded-full flex items-center gap-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  Verified
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-6 text-gray-600 dark:text-gray-400 mb-6">
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5" />
                <span>{user.email}</span>
              </div>
              {user.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  <span>{user.location}</span>
                </div>
              )}
            </div>

            <div className="flex gap-4">
              <button 
                onClick={() => setIsEditing(!isEditing)}
                className="flex items-center gap-2 px-6 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-2xl font-medium transition-colors"
              >
                <Settings className="w-5 h-5" />
                Edit Profile
              </button>
            
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 self-start">
            <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-5 text-center">
              <div className="text-3xl font-bold text-indigo-600">{user.workspace.length}</div>
              <div className="text-sm text-gray-500">Workspaces</div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-5 text-center">
              <div className="text-3xl font-bold text-emerald-600">4</div>
              <div className="text-sm text-gray-500">Active</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const Features  : React.FC = () => {
  const [user] = useState<User>(mockUser);
  const [filter, setFilter] = useState<'all' | 'owner' | 'member'>('all');

  const ownedWorkspaces = user.workspace.filter(ws => ws.ownerId === user._id);
  const memberWorkspaces = user.workspace.filter(ws => ws.ownerId !== user._id);

  const displayedWorkspaces = filter === 'owner' 
    ? ownedWorkspaces 
    : filter === 'member' 
      ? memberWorkspaces 
      : user.workspace;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Top Navigation */}
      

      <UserProfileHeader user={user} />

      <div className="max-w-7xl mx-auto px-8 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Your Workspaces</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Manage all your team spaces and collaborations</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-1">
              <button 
                onClick={() => setFilter('all')}
                className={`px-6 py-2.5 rounded-xl text-sm font-medium transition-all ${filter === 'all' ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
              >
                All
              </button>
              <button 
                onClick={() => setFilter('owner')}
                className={`px-6 py-2.5 rounded-xl text-sm font-medium transition-all ${filter === 'owner' ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
              >
                Owned
              </button>
              <button 
                onClick={() => setFilter('member')}
                className={`px-6 py-2.5 rounded-xl text-sm font-medium transition-all ${filter === 'member' ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
              >
                Member
              </button>
            </div>

           
          </div>
        </div>

        {/* Workspaces Grid */}
        {displayedWorkspaces.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedWorkspaces.map((workspace) => (
              <WorkspaceCard 
                key={workspace._id} 
                workspace={workspace} 
                isOwner={workspace.ownerId === user._id} 
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="mx-auto w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-3xl flex items-center justify-center mb-6">
              <Users className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-2xl font-semibold mb-2">No workspaces found</h3>
            <p className="text-gray-500 max-w-xs mx-auto">Create your first workspace to start collaborating with your team.</p>
          </div>
        )}
      </div>
    </div>
  );
};

