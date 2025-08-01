import OpenAI from "openai";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY environment variable is required");
}

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

interface ContextualHelpRequest {
  currentPage: string;
  userAction?: string;
  pageData?: any;
  userRole?: string;
  recentErrors?: string[];
}

interface HelpRecommendation {
  type: 'tip' | 'warning' | 'suggestion' | 'workflow';
  title: string;
  description: string;
  actionItems?: string[];
  relatedPages?: string[];
}

export class AIHelpService {
  // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
  private model = "gpt-4o";

  async generateContextualHelp(request: ContextualHelpRequest): Promise<HelpRecommendation[]> {
    const systemPrompt = `You are an AI assistant for OMNOR GROUP's business management system. Provide contextual help and recommendations based on the user's current context.

System Overview:
- Multi-department business management (Hire, Fabrication, Sales, Testing, Transport)
- Job tracking with auto-generated numbers (LEH, LEF, LES, LET, LEX prefixes)
- Client management and credit applications
- Performance analytics and reporting
- Professional 2050 futuristic design aesthetic

Your role is to provide helpful, actionable recommendations that improve workflow efficiency and prevent common mistakes.`;

    const userPrompt = `Current Context:
- Page: ${request.currentPage}
- User Action: ${request.userAction || 'browsing'}
- Page Data: ${JSON.stringify(request.pageData || {})}
- User Role: ${request.userRole || 'user'}
- Recent Errors: ${request.recentErrors?.join(', ') || 'none'}

Provide 2-4 contextual recommendations in JSON format. Each recommendation should include:
- type: 'tip', 'warning', 'suggestion', or 'workflow'
- title: Brief, actionable title
- description: Helpful explanation (max 100 words)
- actionItems: Array of specific steps (optional)
- relatedPages: Array of relevant page names (optional)

Focus on practical business management advice, workflow optimization, and preventing common errors.`;

    try {
      const response = await openai.chat.completions.create({
        model: this.model,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        response_format: { type: "json_object" },
        temperature: 0.7,
        max_tokens: 1000,
      });

      const content = response.choices[0].message.content;
      if (!content) throw new Error("No response content");

      const parsed = JSON.parse(content);
      return parsed.recommendations || [];
    } catch (error) {
      console.error("AI Help Service Error:", error);
      return this.getFallbackRecommendations(request.currentPage);
    }
  }

  async generateWorkflowSuggestions(context: {
    jobData?: any;
    department?: string;
    jobStatus?: string;
  }): Promise<string[]> {
    const prompt = `Based on this job context, suggest 3-5 next steps for optimal workflow:
Department: ${context.department || 'unknown'}
Job Status: ${context.jobStatus || 'unknown'}
Job Data: ${JSON.stringify(context.jobData || {})}

Provide actionable next steps as a JSON array of strings.`;

    try {
      const response = await openai.chat.completions.create({
        model: this.model,
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
        temperature: 0.6,
        max_tokens: 500,
      });

      const content = response.choices[0].message.content;
      if (!content) throw new Error("No response content");

      const parsed = JSON.parse(content);
      return parsed.suggestions || [];
    } catch (error) {
      console.error("Workflow Suggestions Error:", error);
      return ["Complete job details", "Assign project manager", "Update job status"];
    }
  }

  private getFallbackRecommendations(currentPage: string): HelpRecommendation[] {
    const fallbacks: Record<string, HelpRecommendation[]> = {
      home: [
        {
          type: 'tip',
          title: 'Quick Navigation',
          description: 'Use department cards to quickly access job management for each division.',
          relatedPages: ['hire', 'fabrication', 'sales', 'testing', 'transport']
        },
        {
          type: 'suggestion',
          title: 'Performance Insights',
          description: 'Check your performance dashboard for business analytics and trends.',
          actionItems: ['Click Performance Insights', 'Review department metrics', 'Analyze revenue trends']
        }
      ],
      'new-job': [
        {
          type: 'tip',
          title: 'Auto Job Numbers',
          description: 'Job numbers are automatically generated based on department (LEH, LEF, LES, LET, LEX).',
        },
        {
          type: 'warning',
          title: 'Required Fields',
          description: 'Ensure client, description, and cost fields are completed for proper job tracking.',
          actionItems: ['Select existing client', 'Add detailed description', 'Set accurate cost estimate']
        }
      ],
      performance: [
        {
          type: 'tip',
          title: 'Interactive Charts',
          description: 'Click on department bars and metrics to navigate directly to relevant sections.',
        },
        {
          type: 'workflow',
          title: 'Revenue Analysis',
          description: 'Use trend data to identify peak performance periods and optimize resource allocation.',
          actionItems: ['Identify high-revenue months', 'Compare department performance', 'Plan resource allocation']
        }
      ]
    };

    return fallbacks[currentPage] || [
      {
        type: 'suggestion',
        title: 'Need Help?',
        description: 'Navigate to the home page for quick access to all business departments and analytics.',
        relatedPages: ['home']
      }
    ];
  }
}

export const aiHelpService = new AIHelpService();