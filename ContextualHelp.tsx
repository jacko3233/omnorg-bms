import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Badge } from '@/components/ui/badge';  // Temporarily commenting out
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  HelpCircle, 
  X, 
  Lightbulb, 
  AlertTriangle, 
  Zap, 
  ArrowRight,
  Sparkles,
  Brain
} from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';

interface HelpRecommendation {
  type: 'tip' | 'warning' | 'suggestion' | 'workflow';
  title: string;
  description: string;
  actionItems?: string[];
  relatedPages?: string[];
}

interface ContextualHelpProps {
  currentPage?: string;
  userAction?: string;
  pageData?: any;
  className?: string;
}

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'tip': return <Lightbulb className="w-4 h-4" />;
    case 'warning': return <AlertTriangle className="w-4 h-4" />;
    case 'suggestion': return <Sparkles className="w-4 h-4" />;
    case 'workflow': return <Zap className="w-4 h-4" />;
    default: return <HelpCircle className="w-4 h-4" />;
  }
};

const getTypeColor = (type: string) => {
  switch (type) {
    case 'tip': return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'warning': return 'bg-amber-100 text-amber-800 border-amber-200';
    case 'suggestion': return 'bg-purple-100 text-purple-800 border-purple-200';
    case 'workflow': return 'bg-green-100 text-green-800 border-green-200';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

export default function ContextualHelp({ 
  currentPage, 
  userAction, 
  pageData, 
  className = "" 
}: ContextualHelpProps) {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [recommendations, setRecommendations] = useState<HelpRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [, setNavigationLocation] = useLocation();

  const pageName = currentPage || location.split('/')[1] || 'home';

  const fetchRecommendations = async () => {
    setIsLoading(true);
    try {
      const response = await apiRequest('/api/ai/contextual-help', 'POST', {
        currentPage: pageName,
        userAction,
        pageData,
        userRole: 'user'
      });
      setRecommendations(Array.isArray(response) ? response : []);
    } catch (error) {
      console.error('Failed to fetch contextual help:', error);
      // Fallback recommendations
      setRecommendations([
        {
          type: 'suggestion',
          title: 'Navigate Home',
          description: 'Return to the main dashboard to access all business departments and analytics.',
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchRecommendations();
    }
  }, [isOpen, pageName, userAction]);

  const handleNavigate = (page: string) => {
    setNavigationLocation(`/${page}`);
    setIsOpen(false);
  };

  return (
    <>
      {/* Help Toggle Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-40 rounded-full w-14 h-14 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300 ${className}`}
        title="AI-Powered Help & Recommendations"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Brain className="w-6 h-6" />}
      </Button>

      {/* Help Panel */}
      {isOpen && (
        <Card className="fixed bottom-24 right-6 z-30 w-96 max-h-[70vh] bg-white/95 backdrop-blur-sm shadow-2xl border-slate-200">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Brain className="w-5 h-5 text-blue-600" />
              AI Assistant
              <span className="ml-auto text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full border border-blue-200">
                Smart Help
              </span>
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Contextual recommendations for {pageName === 'home' ? 'dashboard' : pageName}
            </p>
          </CardHeader>
          
          <CardContent className="pt-0">
            <ScrollArea className="max-h-96">
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <span className="ml-3 text-sm text-muted-foreground">
                    Analyzing context...
                  </span>
                </div>
              ) : recommendations.length > 0 ? (
                <div className="space-y-4">
                  {recommendations.map((rec, index) => (
                    <div 
                      key={index} 
                      className="p-4 rounded-lg border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <div className={`flex items-center justify-center w-8 h-8 rounded-full ${getTypeColor(rec.type)}`}>
                          {getTypeIcon(rec.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm text-slate-900 mb-1">
                            {rec.title}
                          </h4>
                          <p className="text-xs text-slate-600 leading-relaxed mb-3">
                            {rec.description}
                          </p>
                          
                          {rec.actionItems && rec.actionItems.length > 0 && (
                            <div className="mb-3">
                              <p className="text-xs font-medium text-slate-700 mb-2">
                                Action Items:
                              </p>
                              <ul className="space-y-1">
                                {rec.actionItems.map((item, idx) => (
                                  <li key={idx} className="flex items-center gap-2 text-xs text-slate-600">
                                    <ArrowRight className="w-3 h-3 text-slate-400" />
                                    {item}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          
                          {rec.relatedPages && rec.relatedPages.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {rec.relatedPages.map((page, idx) => (
                                <Button
                                  key={idx}
                                  variant="outline"
                                  size="sm"
                                  className="h-6 px-2 text-xs"
                                  onClick={() => handleNavigate(page)}
                                >
                                  {page}
                                </Button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <HelpCircle className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">
                    No specific recommendations available for this context.
                  </p>
                </div>
              )}
            </ScrollArea>
            
            <Separator className="my-4" />
            
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Powered by AI • Context-aware</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={fetchRecommendations}
                disabled={isLoading}
                className="h-6 px-2 text-xs"
              >
                Refresh
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}