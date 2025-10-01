'use client';

import React, { useState, useEffect } from 'react';
import { MessageSquare, ExternalLink, Loader, AlertTriangle } from 'lucide-react';

interface DiscordMessage {
  id: string;
  content: string;
  timestamp: string;
  author: {
    username: string;
    avatar: string | null;
  };
  url: string;
}

interface DiscordWidgetProps {
  projectName: string;
  discordUrl?: string;
}

const DiscordWidget: React.FC<DiscordWidgetProps> = ({ projectName, discordUrl }) => {
  const [messages, setMessages] = useState<DiscordMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!projectName) return;

    const fetchDiscordMessages = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/alphas/discord-feed?projectName=${encodeURIComponent(projectName)}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.statusText}`);
        }
        const data = await response.json();
        setMessages(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        console.error("Error fetching Discord messages:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDiscordMessages();
  }, [projectName]);

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center p-8">
          <Loader className="animate-spin text-gray-400" />
          <span className="ml-2 text-gray-500">Loading Discord feed...</span>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <AlertTriangle className="w-8 h-8 text-red-400 mb-2" />
          <p className="text-red-600">Error loading feed</p>
          <p className="text-xs text-gray-500 mt-1">{error}</p>
        </div>
      );
    }

    if (messages.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <MessageSquare className="w-8 h-8 text-gray-400 mb-2" />
          <p className="text-gray-600">No recent announcements found for "{projectName}"</p>
          <p className="text-xs text-gray-500 mt-1">Only the last 20 channel messages are checked.</p>
        </div>
      );
    }

    return (
      <ul className="space-y-3 p-4">
        {messages.map((msg) => (
          <li key={msg.id} className="p-3 bg-gray-50 rounded-lg border border-gray-200 text-sm">
            <div className="flex items-start space-x-3">
              <img
                src={msg.author.avatar || `https://cdn.discordapp.com/embed/avatars/0.png`}
                alt={`${msg.author.username}'s avatar`}
                className="w-8 h-8 rounded-full bg-gray-200"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-800">{msg.author.username}</span>
                  <a href={msg.url} target="_blank" rel="noopener noreferrer" title="View on Discord">
                    <ExternalLink className="w-4 h-4 text-gray-400 hover:text-blue-500" />
                  </a>
                </div>
                <p className="text-gray-600 mt-1 whitespace-pre-wrap">{msg.content}</p>
                <time className="text-xs text-gray-400 mt-2 block">
                  {new Date(msg.timestamp).toLocaleString()}
                </time>
              </div>
            </div>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="w-full">
      <div className="bg-gray-50 border rounded-lg">
        <div className="flex items-center gap-2 p-4 border-b">
          <svg className="w-5 h-5 text-indigo-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M14.82 4.26a10.14 10.14 0 0 0-.53 1.1 14.66 14.66 0 0 0-4.58 0 10.14 10.14 0 0 0-.53-1.1 16 16 0 0 0-4.13 1.3 17.33 17.33 0 0 0-3 11.59 16.6 16.6 0 0 0 5.07 2.59A12.89 12.89 0 0 0 8.23 18a9.65 9.65 0 0 1-1.71-.83 3.39 3.39 0 0 0 .42-.33 11.66 11.66 0 0 0 10.12 0q.21.18.42.33a10.84 10.84 0 0 1-1.71.84 12.41 12.41 0 0 0 1.08 1.78 16.44 16.44 0 0 0 5.06-2.59 17.22 17.22 0 0 0-3-11.59 16.09 16.09 0 0 0-4.09-1.35zM8.68 14.81a1.94 1.94 0 0 1-1.8-2.01 1.93 1.93 0 0 1 1.8-2.01 1.93 1.93 0 0 1 1.8 2.01 1.93 1.93 0 0 1-1.8 2.01zm6.64 0a1.94 1.94 0 0 1-1.8-2.01 1.93 1.93 0 0 1 1.8-2.01 1.92 1.92 0 0 1 1.8 2.01 1.92 1.92 0 0 1-1.8 2.01z"/>
          </svg>
          <span className="text-sm font-medium text-gray-700">Discord Announcements</span>
        </div>
        <div className="bg-white rounded-b-lg max-h-[400px] overflow-y-auto">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default DiscordWidget;
