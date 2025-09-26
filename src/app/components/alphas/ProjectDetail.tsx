'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { ExternalLink, Calendar, TrendingUp, Star, Edit3, Save, X } from 'lucide-react';
import { useTabContext } from '@/context/TabContext';
import NotesManager from './NotesManager';
import SocialTimeline from './SocialTimeline';
import { useAppContext } from '@/context/AppContext';

interface Project {
  id: string;
  name: string;
  category: string;
  website: string;
  description?: string;
  socialLinks: {
    twitter?: string;
    telegram?: string;
    discord?: string;
    github?: string;
  };
  status: 'draft' | 'pending' | 'approved' | 'rejected';
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

interface Note {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  isPrivate: boolean;
}

const ProjectDetail: React.FC<{ projectId: string }> = ({ projectId }) => {
  const { updateTab } = useTabContext();
  const [project, setProject] = useState<Project | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingDescription, setEditingDescription] = useState(false);
  const [editedDescription, setEditedDescription] = useState('');

  // Load project data
  useEffect(() => {
    const loadProjectData = async () => {
      try {
        setLoading(true);

        // Get all projects to find the specific one
        const response = await fetch('/api/alphas/admin/projects');
        if (response.ok) {
          const data = await response.json();
          const foundProject = data.projects?.find((p: Project) => p.id === projectId);

          if (foundProject) {
            setProject(foundProject);
            setEditedDescription(foundProject.description || '');
            // Update tab title - using a timeout to avoid render loop
            setTimeout(() => {
              updateTab(`project-${projectId}`, { title: foundProject.name });
            }, 0);
          } else {
            console.error('Project not found:', projectId);
          }
        } else {
          console.error('Failed to load project data');
        }
      } catch (error) {
        console.error('Error loading project data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (projectId) {
      loadProjectData();
    }
  }, [projectId]); // Removed updateTab from dependencies to prevent infinite loop

  const handleSaveDescription = () => {
    if (project) {
      // Update project description
      setProject({
        ...project,
        description: editedDescription
      });
      setEditingDescription(false);
    }
  };

  const CategoryBadge: React.FC<{ category: string }> = ({ category }) => {
    const colors: Record<string, string> = {
      DeFi: 'bg-blue-100 text-blue-800',
      NFT: 'bg-purple-100 text-purple-800',
      GameFi: 'bg-green-100 text-green-800',
      Tools: 'bg-orange-100 text-orange-800',
      Gaming: 'bg-pink-100 text-pink-800',
      Infrastructure: 'bg-gray-100 text-gray-800',
      Other: 'bg-yellow-100 text-yellow-800'
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[category] || colors.Other}`}>
        {category}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="text-center py-12">
        <Star className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-lg font-medium text-gray-900">Project not found</h3>
        <p className="mt-1 text-gray-500">The requested project could not be loaded.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-3 mb-3">
            <h1 className="text-2xl font-bold text-gray-900">{project.name}</h1>
            <CategoryBadge category={project.category} />
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              {project.status}
            </span>
          </div>
          
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <Calendar size={14} />
              <span>Created {new Date(project.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-1">
              <TrendingUp size={14} />
              <span>Last updated {new Date(project.updatedAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
        
        <a
          href={project.website}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <ExternalLink size={16} />
          <span>Visit Website</span>
        </a>
      </div>

      {/* Description */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="h2-alphas">Description</h2>
          {editingDescription ? (
            <div className="flex gap-2">
              <button
                onClick={handleSaveDescription}
                className="inline-flex items-center gap-1 px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                <Save size={14} />
                <span>Save</span>
              </button>
              <button
                onClick={() => {
                  setEditingDescription(false);
                  setEditedDescription(project.description || '');
                }}
                className="inline-flex items-center gap-1 px-3 py-1 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
              >
                <X size={14} />
                <span>Cancel</span>
              </button>
            </div>
          ) : (
            <button
              onClick={() => setEditingDescription(true)}
              className="inline-flex items-center gap-1 px-3 py-1 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
            >
              <Edit3 size={14} />
              <span>Edit</span>
            </button>
          )}
        </div>
        
        {editingDescription ? (
          <textarea
            value={editedDescription}
            onChange={(e) => setEditedDescription(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={4}
          />
        ) : (
          <p className="text-gray-600 whitespace-pre-wrap">
            {project.description || 'No description available.'}
          </p>
        )}
      </div>

      {/* Social Links */}
      <div className="mb-8">
        <h2 className="h2-alphas">Social Links</h2>
        <div className="flex flex-wrap gap-3">
          {project.socialLinks.twitter && (
            <a
              href={project.socialLinks.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3 py-2 bg-blue-100 text-blue-800 rounded-md hover:bg-blue-200 transition-colors"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
              </svg>
              <span>Twitter</span>
            </a>
          )}
          
          {project.socialLinks.telegram && (
            <a
              href={project.socialLinks.telegram}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 1 0 12-12 12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
              </svg>
              <span>Telegram</span>
            </a>
          )}
          
          {project.socialLinks.discord && (
            <a
              href={project.socialLinks.discord}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14.82 4.26a10.14 10.14 0 0 0-.53 1.1 14.66 14.66 0 0 0-4.58 0 10.14 10.14 0 0 0-.53-1.1 16 16 0 0 0-4.13 1.3 17.33 17.33 0 0 0-3 11.59 16.6 16.6 0 0 0 5.07 2.59A12.89 12.89 0 0 0 8.23 18a9.65 9.65 0 0 1-1.71-.83 3.39 3.39 0 0 0 .42-.33 11.66 11.66 0 0 0 10.12 0q.21.18.42.33a10.84 10.84 0 0 1-1.71.84 12.41 12.41 0 0 0 1.08 1.78 16.44 16.44 0 0 0 5.06-2.59 17.22 17.22 0 0 0-3-11.59 16.09 16.09 0 0 0-4.09-1.35zM8.68 14.81a1.94 1.94 0 0 1-1.8-2.01 1.93 1.93 0 0 1 1.8-2.01 1.93 1.93 0 0 1 1.8 2.01 1.93 1.93 0 0 1-1.8 2.01zm6.64 0a1.94 1.94 0 0 1-1.8-2.01 1.93 1.93 0 0 1 1.8-2.01 1.92 1.92 0 0 1 1.8 2.01 1.92 1.92 0 0 1-1.8 2.01z"/>
              </svg>
              <span>Discord</span>
            </a>
          )}
          
          {project.socialLinks.github && (
            <a
              href={project.socialLinks.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-900 transition-colors"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.158.549.088.752-.233.752-.522 0-.266-.045-1.176-.069-2.108-3.106.66-3.75-1.334-3.75-1.334-.525-1.326-1.282-1.678-1.282-1.678-1.036-.701.081-.687.081-.687 1.158.08 1.75 1.17 1.75 1.17.811 1.406 2.088 1.007 2.608.769.081-.582.317-.968.58-1.19-2.042-.227-4.168-1.041-4.168-4.704 0-1.041.366-1.891 1.024-2.56-.108-.243-.459-1.282.091-2.633 0 0 .841-.267 2.75 1.026A9.392 9.392 0 0112.017 5.76c1.67 0 3.361.224 4.94.662 1.909-1.293 2.75-1.026 2.75-1.026.549 1.351.199 2.39.091 2.633.657.669 1.024 1.52 1.024 2.56 0 3.674-2.133 4.466-4.236 4.704.345.294.658.867.658 1.764 0 1.282-.047 2.31-.069 2.583 0 .291.203.61.752.622C20.876 21.404 24.029 17.066 24.029 11.987 24.029 5.367 18.662 0 12.017 0z"/>
              </svg>
              <span>GitHub</span>
            </a>
          )}
        </div>
      </div>

      {useAppContext && (
        <>
          {/* My Notes Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
            {/* Left Column - Notes Manager */}
            <NotesManager
              projectId={projectId}
              userAddress={useAppContext().address || ''}
            />

            {/* Right Column - Social Timeline */}
            <SocialTimeline
              projectId={projectId}
              projectName={project.name}
              twitterHandle={project.socialLinks.twitter ? extractTwitterHandle(project.socialLinks.twitter) : undefined}
              discordInvite={project.socialLinks.discord || undefined}
            />
          </div>
        </>
      )}
    </div>
  );

  // Helper function to extract Twitter handle from URL
  function extractTwitterHandle(url: string): string {
    const match = url.match(/twitter\.com\/(\w+)/);
    return match ? match[1] : '';
  }
};

export default ProjectDetail;
