
import React, { useState } from 'react';
import { Search, User, MapPin, Users, GitFork, Star, ExternalLink, Calendar, Building } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';

interface GitHubUser {
  login: string;
  name: string;
  avatar_url: string;
  bio: string;
  location: string;
  public_repos: number;
  followers: number;
  following: number;
  html_url: string;
  blog: string;
  company: string;
  created_at: string;
}

interface Repository {
  id: number;
  name: string;
  description: string;
  html_url: string;
  stargazers_count: number;
  language: string;
  forks_count: number;
  updated_at: string;
}

const Index = () => {
  const [username, setUsername] = useState('');
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { toast } = useToast();

  const searchUser = async () => {
    if (!username.trim()) {
      toast({
        title: "Error",
        description: "Please enter a GitHub username",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setError('');
    setUser(null);
    setRepositories([]);

    try {
      // Fetch user profile
      const userResponse = await fetch(`https://api.github.com/users/${username}`);
      if (!userResponse.ok) {
        throw new Error(userResponse.status === 404 ? 'User not found' : 'Failed to fetch user');
      }
      const userData = await userResponse.json();
      setUser(userData);

      // Fetch repositories
      const reposResponse = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=6`);
      if (!reposResponse.ok) {
        throw new Error('Failed to fetch repositories');
      }
      const reposData = await reposResponse.json();
      
      // Sort by stars and take top 5
      const sortedRepos = reposData
        .sort((a: Repository, b: Repository) => b.stargazers_count - a.stargazers_count)
        .slice(0, 5);
      
      setRepositories(sortedRepos);
      
      toast({
        title: "Success",
        description: `Found ${userData.name || userData.login} with ${userData.public_repos} repositories`,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      searchUser();
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getLanguageColor = (language: string) => {
    const colors: { [key: string]: string } = {
      JavaScript: 'bg-yellow-500',
      TypeScript: 'bg-blue-500',
      Python: 'bg-green-500',
      Java: 'bg-red-500',
      'C++': 'bg-purple-500',
      Go: 'bg-cyan-500',
      Rust: 'bg-orange-500',
      PHP: 'bg-indigo-500',
      Ruby: 'bg-red-600',
      Swift: 'bg-orange-600',
    };
    return colors[language] || 'bg-gray-500';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            GitHub Explorer
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Discover GitHub users and explore their repositories with detailed insights and statistics
          </p>
        </div>

        {/* Search Section */}
        <Card className="max-w-2xl mx-auto mb-8 bg-white/10 backdrop-blur-lg border-white/20">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <Input
                type="text"
                placeholder="Enter GitHub username..."
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                disabled={loading}
              />
              <Button 
                onClick={searchUser} 
                disabled={loading}
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-8"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                ) : (
                  <Search className="w-4 h-4 mr-2" />
                )}
                {loading ? 'Searching...' : 'Search'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Error State */}
        {error && (
          <Card className="max-w-2xl mx-auto mb-8 bg-red-500/10 backdrop-blur-lg border-red-500/20">
            <CardContent className="p-6 text-center">
              <p className="text-red-400 text-lg">{error}</p>
            </CardContent>
          </Card>
        )}

        {/* User Profile Section */}
        {user && (
          <div className="max-w-6xl mx-auto mb-8">
            <Card className="bg-white/10 backdrop-blur-lg border-white/20 mb-8">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                  <Avatar className="w-32 h-32 ring-4 ring-white/20">
                    <AvatarImage src={user.avatar_url} alt={user.login} />
                    <AvatarFallback className="text-2xl bg-gradient-to-r from-blue-500 to-purple-500">
                      {user.login.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 text-center md:text-left">
                    <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                      <h2 className="text-3xl font-bold text-white">
                        {user.name || user.login}
                      </h2>
                      <Badge variant="secondary" className="bg-white/20 text-white hover:bg-white/30 w-fit mx-auto md:mx-0">
                        @{user.login}
                      </Badge>
                    </div>
                    
                    {user.bio && (
                      <p className="text-gray-300 text-lg mb-4 max-w-2xl">{user.bio}</p>
                    )}
                    
                    <div className="flex flex-wrap justify-center md:justify-start gap-4 mb-4 text-gray-300">
                      {user.location && (
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          <span>{user.location}</span>
                        </div>
                      )}
                      {user.company && (
                        <div className="flex items-center gap-2">
                          <Building className="w-4 h-4" />
                          <span>{user.company}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>Joined {formatDate(user.created_at)}</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap justify-center md:justify-start gap-6 mb-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-white">{user.public_repos}</div>
                        <div className="text-gray-400 text-sm">Repositories</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-white">{user.followers}</div>
                        <div className="text-gray-400 text-sm">Followers</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-white">{user.following}</div>
                        <div className="text-gray-400 text-sm">Following</div>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap justify-center md:justify-start gap-4">
                      <Button
                        variant="outline"
                        className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                        onClick={() => window.open(user.html_url, '_blank')}
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        View Profile
                      </Button>
                      {user.blog && (
                        <Button
                          variant="outline"
                          className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                          onClick={() => window.open(user.blog.startsWith('http') ? user.blog : `https://${user.blog}`, '_blank')}
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Website
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Repositories Section */}
            {repositories.length > 0 && (
              <div>
                <h3 className="text-2xl font-bold text-white mb-6 text-center">
                  Top Repositories
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {repositories.map((repo) => (
                    <Card 
                      key={repo.id} 
                      className="bg-white/10 backdrop-blur-lg border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105 cursor-pointer"
                      onClick={() => window.open(repo.html_url, '_blank')}
                    >
                      <CardHeader className="pb-3">
                        <CardTitle className="text-white text-lg flex items-center justify-between">
                          <span className="truncate">{repo.name}</span>
                          <ExternalLink className="w-4 h-4 flex-shrink-0 ml-2" />
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-300 text-sm mb-4 line-clamp-3 min-h-[3rem]">
                          {repo.description || 'No description available'}
                        </p>
                        
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-4 text-sm text-gray-400">
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4" />
                              <span>{repo.stargazers_count}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <GitFork className="w-4 h-4" />
                              <span>{repo.forks_count}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          {repo.language && (
                            <div className="flex items-center gap-2">
                              <div className={`w-3 h-3 rounded-full ${getLanguageColor(repo.language)}`}></div>
                              <span className="text-gray-300 text-sm">{repo.language}</span>
                            </div>
                          )}
                          <span className="text-gray-400 text-xs">
                            Updated {formatDate(repo.updated_at)}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Empty State */}
        {!user && !loading && !error && (
          <Card className="max-w-2xl mx-auto bg-white/5 backdrop-blur-lg border-white/10">
            <CardContent className="p-12 text-center">
              <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Ready to Explore</h3>
              <p className="text-gray-400">
                Enter a GitHub username above to discover their profile and repositories
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Index;
