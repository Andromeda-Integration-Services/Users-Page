import ticketService, { CreateTicketRequest } from '../api/ticketService';

export interface IssueDetails {
  hasDetails: boolean;
  issue: string;
  location: string;
  category: string;
  priority: string;
}

export interface ChatbotTicketRequest {
  issue: string;
  location?: string;
  category?: string;
  priority?: string;
  description?: string;
}

class ChatbotService {
  // Extract issue details from user input using pattern matching
  extractIssueDetails(input: string): IssueDetails {
    const lowerInput = input.toLowerCase();
    
    // Common issue patterns with categories
    const issuePatterns = [
      { 
        pattern: /(ac|air conditioning|hvac|heating|cooling).*(not working|broken|down|cold|hot|temperature)/i, 
        issue: 'HVAC/Air Conditioning Issue', 
        category: 'HVAC' 
      },
      { 
        pattern: /(light|bulb|lighting|lamp).*(out|broken|not working|flickering|dim)/i, 
        issue: 'Lighting Issue', 
        category: 'Electrical' 
      },
      { 
        pattern: /(water|leak|plumbing|toilet|sink|faucet|pipe).*(leak|broken|clogged|not working|overflow)/i, 
        issue: 'Plumbing Issue', 
        category: 'Plumbing' 
      },
      { 
        pattern: /(door|lock|key|handle).*(broken|stuck|not working|jammed)/i, 
        issue: 'Door/Lock Issue', 
        category: 'Security' 
      },
      { 
        pattern: /(elevator|lift).*(broken|stuck|not working|out of order)/i, 
        issue: 'Elevator Issue', 
        category: 'Mechanical' 
      },
      { 
        pattern: /(window|glass).*(broken|cracked|stuck)/i, 
        issue: 'Window Issue', 
        category: 'Building' 
      },
      { 
        pattern: /(computer|printer|phone|network|wifi|internet).*(not working|broken|slow|down)/i, 
        issue: 'IT Equipment Issue', 
        category: 'IT' 
      },
      { 
        pattern: /(clean|cleaning|trash|garbage|dirty).*(needed|full|overflow)/i, 
        issue: 'Cleaning Request', 
        category: 'Cleaning' 
      }
    ];
    
    // Location patterns
    const locationPatterns = [
      { pattern: /room\s+([a-zA-Z0-9]+)/i, extract: (match: RegExpMatchArray) => `Room ${match[1]}` },
      { pattern: /floor\s+(\d+)/i, extract: (match: RegExpMatchArray) => `Floor ${match[1]}` },
      { pattern: /(conference|meeting)\s+room\s*([a-zA-Z0-9]*)/i, extract: (match: RegExpMatchArray) => `Conference Room ${match[2] || ''}`.trim() },
      { pattern: /(bathroom|restroom|toilet)/i, extract: () => 'Bathroom' },
      { pattern: /(lobby|reception|entrance)/i, extract: () => 'Lobby' },
      { pattern: /(kitchen|break\s+room|breakroom)/i, extract: () => 'Kitchen/Break Room' },
      { pattern: /(office|desk)\s+([a-zA-Z0-9]+)/i, extract: (match: RegExpMatchArray) => `Office ${match[2]}` },
      { pattern: /(parking|garage)/i, extract: () => 'Parking Area' }
    ];
    
    let detectedIssue = input;
    let detectedCategory = 'General';
    let detectedLocation = '';
    let priority = 'Medium';
    
    // Check for issue patterns
    for (const pattern of issuePatterns) {
      if (pattern.pattern.test(input)) {
        detectedIssue = pattern.issue;
        detectedCategory = pattern.category;
        break;
      }
    }
    
    // Check for location patterns
    for (const pattern of locationPatterns) {
      const match = input.match(pattern.pattern);
      if (match) {
        detectedLocation = pattern.extract(match);
        break;
      }
    }
    
    // Determine priority based on keywords
    if (lowerInput.includes('emergency') || lowerInput.includes('urgent') || lowerInput.includes('critical')) {
      priority = 'High';
    } else if (lowerInput.includes('asap') || lowerInput.includes('immediately') || lowerInput.includes('important')) {
      priority = 'High';
    } else if (lowerInput.includes('when possible') || lowerInput.includes('not urgent') || lowerInput.includes('low priority')) {
      priority = 'Low';
    }
    
    return {
      hasDetails: detectedIssue !== input || detectedLocation !== '',
      issue: detectedIssue,
      location: detectedLocation,
      category: detectedCategory,
      priority: priority
    };
  }

  // Map priority text to API numbers
  mapPriorityToNumber(priority: string): number {
    switch (priority?.toLowerCase()) {
      case 'low': return 1;
      case 'medium': return 2;
      case 'high': return 3;
      case 'critical': return 4;
      case 'emergency': return 5;
      default: return 2; // Default to Medium
    }
  }

  // Create ticket from chatbot request
  async createTicketFromChatbot(request: ChatbotTicketRequest, userId: string) {
    // Validate and prepare data
    const title = `${request.issue}${request.location ? ` - ${request.location}` : ''}`;
    const description = `Issue: ${request.issue}\n` +
                       `Category: ${request.category || 'General'}\n` +
                       `Location: ${request.location || 'Not specified'}\n` +
                       `Priority: ${request.priority || 'Medium'}\n` +
                       `${request.description ? `\nAdditional Details: ${request.description}\n` : ''}` +
                       `\nCreated via Chatbot Assistant`;

    // Ensure minimum length requirements
    const finalTitle = title.length >= 5 ? title : `Maintenance Request - ${title}`;
    const finalDescription = description.length >= 10 ? description : `${description}\n\nAdditional details: User reported an issue that needs attention.`;

    const createTicketRequest: CreateTicketRequest = {
      title: finalTitle.substring(0, 200), // Ensure max length
      description: finalDescription.substring(0, 2000), // Ensure max length
      location: (request.location || 'Not specified').substring(0, 200),
      priority: this.mapPriorityToNumber(request.priority || 'Medium'),
      requestedByUserId: userId,
      onBehalfOf: null
    };

    return await ticketService.createTicket(createTicketRequest);
  }

  // Generate smart responses based on user input
  generateSmartResponse(input: string): { 
    text: string; 
    type: string; 
    actions?: Array<{label: string, action: string}> 
  } {
    const lowerInput = input.toLowerCase();
    
    // Greeting responses
    if (lowerInput.includes('hello') || lowerInput.includes('hi') || lowerInput.includes('hey')) {
      return {
        text: "Hello! 👋 I'm here to help you with facility management. I can create tickets, check status, or answer questions. What can I do for you?",
        type: 'text'
      };
    }
    
    // Status check responses
    if (lowerInput.includes('status') || lowerInput.includes('check')) {
      return {
        text: "To check your ticket status:\n\n📋 Go to the Tickets page\n🔍 Search by ticket number\n📧 Check your email for updates\n\nDo you have a specific ticket number?",
        type: 'text',
        actions: [
          { label: 'View All Tickets', action: 'view_tickets' }
        ]
      };
    }
    
    // Help responses
    if (lowerInput.includes('help') || lowerInput.includes('how')) {
      return {
        text: "I can help you with:\n\n🎫 Creating maintenance tickets\n📊 Checking ticket status\n📍 Finding locations\n⚡ Setting priorities\n❓ General CAFM questions\n\nWhat would you like to know more about?",
        type: 'text'
      };
    }
    
    // Default response
    return {
      text: "I understand you're asking about facility management. Let me help you with that! Would you like to create a ticket, check an existing one, or do you have a specific question?",
      type: 'text',
      actions: [
        { label: 'Create Ticket', action: 'create_ticket' },
        { label: 'Check Status', action: 'check_status' }
      ]
    };
  }
}

export default new ChatbotService();
