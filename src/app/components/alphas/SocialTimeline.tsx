'use client';

import React, { useState, useEffect } from 'react';
import { ExternalLink, Twitter, MessageSquare, User, Calendar, TrendingUp } from 'lucide-react';

interface SocialPost {
  id: string;
  platform: 'twitter' | 'discord';
  content: string;
  author: {
    name: string;
    handle?: string;
    avatar?: string;
  };
  timestamp: string;
  url?: string;
  engagement?: {
    likes?: number;
    retweets?: number;
    replies?: number;
  };
}

interface SocialTimelineProps {
  projectName: string;
  twitterHandle?: string;
  discordInvite?: string;
}

const SocialTimeline: React.FC<SocialTimelineProps> = ({ projectName, twitterHandle, discordInvite }) => {
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Mock data for demonstration - In production, replace with actual API calls
  useEffect(() => {
    const loadSocialData = async () => {
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        const mockPosts: SocialPost[] = [
          {
            id: '1',
            platform: 'twitter',
            content: `🎉 ¡Excelentes noticias! Estamos trabajando en una nueva funcionalidad que revolucionará la experiencia de nuestros usuarios. ¿Qué opina la comunidad? #${projectName.toLowerCase().replace(' ', '')}`,
            author: {
              name: projectName,
              handle: `@${twitterHandle || projectName.toLowerCase().replace(' ', '')}`,
              avatar: `https://via.placeholder.com/40x40?text=${projectName.charAt(0)}`
            },
            timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
            url: `https://twitter.com/${twitterHandle || projectName.toLowerCase()}/status/1`,
            engagement: {
              likes: 45,
              retweets: 23,
              replies: 8
            }
          },
          {
            id: '2',
            platform: 'discord',
            content: `🛠️ **MANTENIMIENTO DEL SISTEMA**\n\nVamos a realizar mantenimiento programado esta noche entre las 2:00 AM y 4:00 AM UTC. Durante este tiempo, algunos servicios podrán verse afectados temporalmente.`,
            author: {
              name: 'Sistema',
              handle: 'Team',
              avatar: 'https://via.placeholder.com/40x40?text=S'
            },
            timestamp: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
            url: discordInvite,
          },
          {
            id: '3',
            platform: 'twitter',
            content: `📊 Nuestros KPIs de crecimiento superan las expectativas para Q3. ¡Gracias a nuestra increíble comunidad por el apoyo continuo! 🚀`,
            author: {
              name: projectName,
              handle: `@${twitterHandle || projectName.toLowerCase().replace(' ', '')}`,
              avatar: `https://via.placeholder.com/40x40?text=${projectName.charAt(0)}`
            },
            timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
            url: `https://twitter.com/${twitterHandle || projectName.toLowerCase()}/status/2`,
            engagement: {
              likes: 123,
              retweets: 67,
              replies: 25
            }
          },
          {
            id: '4',
            platform: 'discord',
            content: `💬 ¡Nuevo AMA esta noche!\n\n**Tema:** Roadmap Q4 y futuras funcionalidades\n**Horario:** 20:00 UTC\n**Moderador:** @DevTeam\n\n¿Preguntas preparadas? ¡Únete al chat! ${discordInvite ? `👉 ${discordInvite}` : ''}`,
            author: {
              name: 'Community Manager',
              handle: 'CM',
              avatar: 'https://via.placeholder.com/40x40?text=CM'
            },
            timestamp: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
            url: discordInvite,
          }
        ];

        setPosts(mockPosts);
      } catch (err) {
        console.error('Error loading social data:', err);
        setError('Error cargando timeline social');
      } finally {
        setLoading(false);
      }
    };

    loadSocialData();
  }, [projectName, twitterHandle, discordInvite]);

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date().getTime();
    const time = new Date(timestamp).getTime();
    const diff = now - time;

    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Ahora mismo';
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    if (days < 7) return `${days}d`;
    return new Date(timestamp).toLocaleDateString();
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'twitter':
        return <Twitter size={16} className="text-blue-500" />;
      case 'discord':
        return <MessageSquare size={16} className="text-indigo-600" />;
      default:
        return <MessageSquare size={16} className="text-gray-500" />;
    }
  };

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'twitter':
        return 'border-blue-200 bg-blue-50';
      case 'discord':
        return 'border-indigo-200 bg-indigo-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Actividades Recientes</h3>
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="animate-pulse">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Actividades Recientes</h3>
        <div className="text-center py-8 text-gray-500">
          <TrendingUp className="mx-auto h-8 w-8 mb-2" />
          <p>{error}</p>
          <p className="text-sm mt-1">La integración completa estará disponible próximamente.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Actividades Recientes</h3>
        <div className="flex gap-2 text-sm text-gray-500">
          <span>Últimos 7 días</span>
        </div>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <MessageSquare className="mx-auto h-8 w-8 mb-2" />
          <p>No hay actividades recientes</p>
        </div>
      ) : (
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {posts.map((post, index) => (
            <div
              key={post.id}
              className={`border-l-4 ${getPlatformColor(post.platform)} p-4 rounded-r-lg hover:shadow-sm transition-shadow`}
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  {post.author.avatar ? (
                    <img
                      src={post.author.avatar}
                      alt={post.author.name}
                      className="w-10 h-10 rounded-full"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                      <User size={16} className="text-gray-600" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-gray-900 text-sm">
                      {post.author.name}
                    </span>
                    {post.author.handle && (
                      <span className="text-gray-500 text-sm">{post.author.handle}</span>
                    )}
                    <div className="flex items-center gap-1">
                      {getPlatformIcon(post.platform)}
                    </div>
                    <span className="text-gray-400 text-xs">
                      {formatTimeAgo(post.timestamp)}
                    </span>
                  </div>

                  <div className="text-gray-700 text-sm leading-relaxed mb-2">
                    {post.platform === 'twitter' ? (
                      <p className="whitespace-pre-wrap">{post.content}</p>
                    ) : (
                      <div className="whitespace-pre-wrap">{post.content}</div>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {post.engagement && (
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                          {post.engagement.likes && (
                            <span>❤️ {post.engagement.likes}</span>
                          )}
                          {post.engagement.retweets && (
                            <span>🔄 {post.engagement.retweets}</span>
                          )}
                          {post.engagement.replies && (
                            <span>💬 {post.engagement.replies}</span>
                          )}
                        </div>
                      )}
                    </div>

                    {post.url && (
                      <a
                        href={post.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        <ExternalLink size={14} />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
        <div className="flex items-center gap-2 text-blue-800">
          <Calendar size={16} />
          <span className="text-sm font-medium">Próximamente:</span>
        </div>
        <p className="text-sm text-blue-700 mt-1">
          Integración completa con Discord webhooks y Twitter API para contenidos en tiempo real.
        </p>
      </div>
    </div>
  );
};

export default SocialTimeline;
