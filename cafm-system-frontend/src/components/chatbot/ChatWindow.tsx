import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faTimes, 
  faMinimize, 
  faPaperPlane, 
  faRobot,
  faUser,
  faTicketAlt,
  faQuestionCircle
} from '@fortawesome/free-solid-svg-icons';
import MessageBubble from './MessageBubble';
import QuickActions from './QuickActions';
import { useAuth } from '../../context/AuthContext';
import './ChatWindow.css';

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
  type?: 'text' | 'quick-reply' | 'ticket-suggestion' | 'ticket-confirmation' | 'success' | 'error' | 'loading';
  data?: any;
  actions?: Array<{
    label: string;
    action: () => void;
  }>;
}

interface ChatWindowProps {
  onClose: () => void;
  onMinimize: () => void;
  onNewMessage: () => void;
  theme: string;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ 
  onClose, 
  onMinimize, 
  onNewMessage,
  theme 
}) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize with welcome message
  useEffect(() => {
    const welcomeMessage: Message = {
      id: 'welcome',
      text: `Hi ${user?.firstName || 'there'}! 👋 I'm your CAFM Assistant. I can help you create tickets, check status, or answer questions about facility management. How can I help you today?`,
      isBot: true,
      timestamp: new Date(),
      type: 'text'
    };
    setMessages([welcomeMessage]);
  }, [user]);

  // Auto-scroll to bottom
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      isBot: false,
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setShowQuickActions(false);
    setIsTyping(true);

    // Simulate bot response
    setTimeout(() => {
      const botResponse = generateBotResponse(inputText);
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
      onNewMessage();
    }, 1000 + Math.random() * 1000);
  };

  const generateBotResponse = (userInput: string): Message => {
    const input = userInput.toLowerCase();

    // Enhanced keyword-based responses with real ticket creation capability
    if (input.includes('ticket') || input.includes('create') || input.includes('issue') || input.includes('problem') ||
        input.includes('broken') || input.includes('not working') || input.includes('repair') || input.includes('fix')) {

      // Try to extract issue details from the input
      const issueDetails = extractIssueDetails(userInput);

      if (issueDetails.hasDetails) {
        return {
          id: Date.now().toString(),
          text: `I understand you have an issue! Let me help create a ticket:\n\n📋 **Issue**: ${issueDetails.issue}\n📍 **Location**: ${issueDetails.location || 'Please specify'}\n⚡ **Priority**: ${issueDetails.priority}\n\nShould I create this ticket for you?`,
          isBot: true,
          timestamp: new Date(),
          type: 'ticket-confirmation',
          actions: [
            {
              label: 'Create Ticket Now',
              action: () => createTicketFromDetails(issueDetails)
            },
            {
              label: 'Modify Details',
              action: () => window.location.href = '/tickets/new'
            }
          ]
        };
      } else {
        return {
          id: Date.now().toString(),
          text: "I'd be happy to help you create a ticket! 🎫 Can you tell me:\n\n1️⃣ What's the issue?\n2️⃣ Where is it located?\n3️⃣ How urgent is it?\n\nOr click 'Create Ticket' below for the full form.",
          isBot: true,
          timestamp: new Date(),
          type: 'ticket-suggestion',
          actions: [
            {
              label: 'Create Ticket',
              action: () => window.location.href = '/tickets/new'
            }
          ]
        };
      }
    }
    
    if (input.includes('status') || input.includes('check')) {
      return {
        id: Date.now().toString(),
        text: "To check your ticket status, you can:\n\n📋 Go to the Tickets page\n🔍 Search by ticket number\n📧 Check your email for updates\n\nDo you have a specific ticket number you'd like me to help you find?",
        isBot: true,
        timestamp: new Date(),
        type: 'text'
      };
    }
    
    if (input.includes('help') || input.includes('how')) {
      return {
        id: Date.now().toString(),
        text: "I'm here to help! 🤝 I can assist you with:\n\n🎫 Creating maintenance tickets\n📊 Checking ticket status\n📍 Finding locations\n⚡ Setting priorities\n❓ General CAFM questions\n\nWhat would you like to know more about?",
        isBot: true,
        timestamp: new Date(),
        type: 'text'
      };
    }

    // Default response
    return {
      id: Date.now().toString(),
      text: "I understand you're asking about facility management. Let me help you with that! Would you like to create a ticket, check an existing one, or do you have a specific question?",
      isBot: true,
      timestamp: new Date(),
      type: 'text'
    };
  };

  const handleQuickAction = (action: string) => {
    setShowQuickActions(false);
    
    const actionMessage: Message = {
      id: Date.now().toString(),
      text: `I'd like to ${action}`,
      isBot: false,
      timestamp: new Date(),
      type: 'text'
    };
    
    setMessages(prev => [...prev, actionMessage]);
    
    // Generate appropriate response
    setTimeout(() => {
      let response: Message;
      
      switch (action) {
        case 'create a ticket':
          response = {
            id: Date.now().toString(),
            text: "Perfect! I'll help you create a ticket. You can either:\n\n🚀 Use the quick form below\n📝 Go to the full Create Ticket page\n💬 Tell me about the issue here\n\nWhich would you prefer?",
            isBot: true,
            timestamp: new Date(),
            type: 'ticket-suggestion'
          };
          break;
        case 'check ticket status':
          response = {
            id: Date.now().toString(),
            text: "I can help you check your ticket status! Please provide:\n\n🔢 Your ticket number (e.g., #1234)\n📧 Or I can show you all your recent tickets\n\nWhat would you like to do?",
            isBot: true,
            timestamp: new Date(),
            type: 'text'
          };
          break;
        default:
          response = {
            id: Date.now().toString(),
            text: "I'm here to help! What specific information do you need?",
            isBot: true,
            timestamp: new Date(),
            type: 'text'
          };
      }
      
      setMessages(prev => [...prev, response]);
      onNewMessage();
    }, 800);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Extract issue details from user input using simple pattern matching
  const extractIssueDetails = (input: string) => {
    const lowerInput = input.toLowerCase();

    // Common issue patterns
    const issuePatterns = [
      { pattern: /(ac|air conditioning|hvac).*(not working|broken|down|cold|hot)/i, issue: 'Air conditioning issue', category: 'HVAC' },
      { pattern: /(light|bulb|lighting).*(out|broken|not working|flickering)/i, issue: 'Lighting issue', category: 'Electrical' },
      { pattern: /(water|leak|plumbing|toilet|sink).*(leak|broken|clogged|not working)/i, issue: 'Plumbing issue', category: 'Plumbing' },
      { pattern: /(door|lock|key).*(broken|stuck|not working)/i, issue: 'Door/Lock issue', category: 'Security' },
      { pattern: /(elevator|lift).*(broken|stuck|not working)/i, issue: 'Elevator issue', category: 'Mechanical' }
    ];

    // Location patterns
    const locationPatterns = [
      /room\s+(\w+)/i,
      /floor\s+(\d+)/i,
      /(conference|meeting)\s+room/i,
      /(bathroom|restroom|toilet)/i,
      /(lobby|reception|entrance)/i,
      /(kitchen|break\s+room)/i
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
      const match = input.match(pattern);
      if (match) {
        detectedLocation = match[0];
        break;
      }
    }

    // Determine priority based on keywords
    if (lowerInput.includes('emergency') || lowerInput.includes('urgent') || lowerInput.includes('critical')) {
      priority = 'High';
    } else if (lowerInput.includes('asap') || lowerInput.includes('immediately')) {
      priority = 'High';
    }

    return {
      hasDetails: detectedIssue !== input || detectedLocation !== '',
      issue: detectedIssue,
      location: detectedLocation,
      category: detectedCategory,
      priority: priority
    };
  };

  // Create ticket from extracted details
  const createTicketFromDetails = async (details: any) => {
    try {
      // Get current user from localStorage
      const userStr = localStorage.getItem('user');
      const tokenStr = localStorage.getItem('token');

      if (!userStr || !tokenStr) {
        const errorMessage: Message = {
          id: Date.now().toString(),
          text: '❌ Please log in to create tickets.',
          isBot: true,
          timestamp: new Date(),
          type: 'error'
        };
        setMessages(prev => [...prev, errorMessage]);
        onNewMessage();
        return;
      }

      const user = JSON.parse(userStr);

      const loadingMessage: Message = {
        id: Date.now().toString(),
        text: '🔄 Creating your ticket...',
        isBot: true,
        timestamp: new Date(),
        type: 'loading'
      };
      setMessages(prev => [...prev, loadingMessage]);
      onNewMessage();

      // Validate and prepare data
      const title = `${details.issue}${details.location ? ` - ${details.location}` : ''}`;
      const description = `Issue: ${details.issue}\n` +
                         `Category: ${details.category}\n` +
                         `Location: ${details.location || 'Not specified'}\n` +
                         `Priority: ${details.priority}\n\n` +
                         `Created via Chatbot Assistant`;

      // Ensure minimum length requirements
      const finalTitle = title.length >= 5 ? title : `Maintenance Request - ${title}`;
      const finalDescription = description.length >= 10 ? description : `${description}\n\nAdditional details: User reported an issue that needs attention.`;

      // Map details to API format with proper validation
      const createTicketRequest = {
        title: finalTitle.substring(0, 200), // Ensure max length
        description: finalDescription.substring(0, 2000), // Ensure max length
        location: (details.location || 'Not specified').substring(0, 200),
        priority: mapPriorityToNumber(details.priority),
        type: 1, // Default to Service type (1 = Service, 2 = Material)
        requestedByUserId: user.userId || user.id, // Use userId from AuthResponse
        onBehalfOf: undefined
      };

      console.log('Creating ticket with request:', createTicketRequest);

      // Import and use the ticket service
      const { default: ticketService } = await import('../../api/ticketService');
      const createdTicket = await ticketService.createTicket(createTicketRequest);

      // Remove loading message
      setMessages(prev => prev.filter(msg => msg.type !== 'loading'));

      // Success message with real ticket details
      const successMessage: Message = {
        id: Date.now().toString(),
        text: `🎉 **Ticket Created Successfully!**\n\n🎫 **Ticket #${createdTicket.id}**\n📋 ${createdTicket.title}\n📍 ${createdTicket.location}\n⚡ Priority: ${createdTicket.priorityText}\n📊 Status: ${createdTicket.statusText}\n📅 Created: ${new Date(createdTicket.createdAt).toLocaleDateString()}\n\n✅ **Your ticket is now in the system!**`,
        isBot: true,
        timestamp: new Date(),
        type: 'success'
      };

      setMessages(prev => [...prev, successMessage]);
      onNewMessage();

    } catch (error: any) {
      console.error('Error creating ticket:', error);

      // Remove loading message
      setMessages(prev => prev.filter(msg => msg.type !== 'loading'));

      const errorMessage = error.message || 'Failed to create ticket. Please try again.';
      const errorMsg: Message = {
        id: Date.now().toString(),
        text: `❌ **Error Creating Ticket**\n\n${errorMessage}`,
        isBot: true,
        timestamp: new Date(),
        type: 'error'
      };

      setMessages(prev => [...prev, errorMsg]);
      onNewMessage();
    }
  };

  // Helper function to map priority text to numbers
  const mapPriorityToNumber = (priority: string): number => {
    switch (priority?.toLowerCase()) {
      case 'low': return 1;
      case 'medium': return 2;
      case 'high': return 3;
      case 'critical': return 4;
      case 'emergency': return 5;
      default: return 2; // Default to Medium
    }
  };

  return (
    <div className="chat-window-container">
      {/* Header */}
      <div className={`chat-header ${theme}`}>
        <div className="chat-header-info">
          <FontAwesomeIcon icon={faRobot} className="chat-avatar-icon" />
          <div>
            <h6 className="chat-title">CAFM Assistant</h6>
            <small className="chat-status">Online • Ready to help</small>
          </div>
        </div>
        <div className="chat-header-actions">
          <button 
            className="chat-header-btn" 
            onClick={onMinimize}
            title="Minimize"
          >
            <FontAwesomeIcon icon={faMinimize} />
          </button>
          <button 
            className="chat-header-btn" 
            onClick={onClose}
            title="Close"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="chat-messages">
        {messages.map((message) => (
          <MessageBubble 
            key={message.id} 
            message={message}
            theme={theme}
          />
        ))}
        
        {isTyping && (
          <div className="typing-indicator">
            <FontAwesomeIcon icon={faRobot} className="typing-avatar" />
            <div className="typing-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}
        
        {showQuickActions && messages.length === 1 && (
          <QuickActions onAction={handleQuickAction} theme={theme} />
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="chat-input-container">
        <div className="chat-input-wrapper">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="chat-input"
            rows={1}
            maxLength={500}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputText.trim()}
            className={`chat-send-btn ${theme}`}
            title="Send message"
          >
            <FontAwesomeIcon icon={faPaperPlane} />
          </button>
        </div>
        <div className="chat-input-footer">
          <small className="text-muted">
            Press Enter to send • Shift+Enter for new line
          </small>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
