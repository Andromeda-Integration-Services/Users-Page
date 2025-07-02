import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComments, faTimes, faPaperPlane, faRobot, faUser, faTicketAlt, faLightbulb, faCheckCircle, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';

// Message interface for our chat
interface ChatMessage {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
  type: 'text' | 'action' | 'form' | 'success' | 'error';
  actions?: Array<{
    label: string;
    action: () => void;
    variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  }>;
}

// AI Response patterns for CAFM system
const AI_RESPONSES = {
  greeting: [
    "Hello! I'm your CAFM Assistant. How can I help you today?",
    "Hi there! I'm here to help with facility management. What do you need?",
    "Welcome! I can help you create tickets, check status, or answer questions."
  ],
  ticketCreation: [
    "I'll help you create a ticket. Can you describe the issue?",
    "Let me guide you through creating a maintenance request.",
    "I can help you report that issue. What's the problem?"
  ],
  location: [
    "Which location is this for? (e.g., Building A, Room 101)",
    "Where is this issue located?",
    "Can you specify the location?"
  ],
  priority: [
    "How urgent is this? (Low, Medium, High priority)",
    "What's the priority level for this issue?",
    "Is this urgent or can it wait?"
  ],
  confirmation: [
    "Perfect! I'm creating your ticket now...",
    "Got it! Setting up your maintenance request...",
    "All set! Processing your ticket..."
  ]
};

/**
 * ProfessionalAIChatbot - Advanced conversational AI chatbot
 * Features: NLP, intelligent responses, ticket creation wizard
 */
const WorkingChatButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [conversationState, setConversationState] = useState<'idle' | 'asking_issue' | 'asking_location' | 'asking_urgency' | 'asking_photos' | 'creating_ticket'>('idle');
  const [ticketData, setTicketData] = useState<{
    issue?: string;
    location?: string;
    urgency?: string;
    priority?: number;
    category?: string;
    title?: string;
    description?: string;
  }>({});

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      if (messages.length === 0) {
        addBotMessage(getRandomResponse(AI_RESPONSES.greeting));
      }
    }
  }, [isOpen]);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleCreateTicket = () => {
    // Direct navigation without useNavigate hook
    window.location.href = '/tickets/new';
  };

  const handleViewTickets = () => {
    // Direct navigation without useNavigate hook
    window.location.href = '/tickets';
  };

  // Helper function to get random response
  const getRandomResponse = (responses: string[]) => {
    return responses[Math.floor(Math.random() * responses.length)];
  };

  // Add bot message
  const addBotMessage = (text: string, type: 'text' | 'action' | 'form' | 'success' | 'error' = 'text', actions?: any[]) => {
    const message: ChatMessage = {
      id: Date.now().toString(),
      text,
      isBot: true,
      timestamp: new Date(),
      type,
      actions
    };
    setMessages(prev => [...prev, message]);
  };

  // Add user message
  const addUserMessage = (text: string) => {
    const message: ChatMessage = {
      id: Date.now().toString(),
      text,
      isBot: false,
      timestamp: new Date(),
      type: 'text'
    };
    setMessages(prev => [...prev, message]);
  };

  // AI Natural Language Processing
  const processUserInput = (input: string) => {
    const lowerInput = input.toLowerCase();

    // Intent detection
    if (lowerInput.includes('ticket') || lowerInput.includes('issue') || lowerInput.includes('problem') ||
        lowerInput.includes('broken') || lowerInput.includes('repair') || lowerInput.includes('maintenance')) {
      return 'create_ticket';
    }

    if (lowerInput.includes('status') || lowerInput.includes('check') || lowerInput.includes('view')) {
      return 'check_status';
    }

    if (lowerInput.includes('help') || lowerInput.includes('how') || lowerInput.includes('what')) {
      return 'help';
    }

    return 'general';
  };

  // Extract information from user input
  const extractTicketInfo = (input: string) => {
    const lowerInput = input.toLowerCase();
    const info: any = {};

    // Extract location
    const locationPatterns = [
      /room (\d+)/i,
      /building ([a-z])/i,
      /floor (\d+)/i,
      /office (\d+)/i
    ];

    for (const pattern of locationPatterns) {
      const match = input.match(pattern);
      if (match) {
        info.location = match[0];
        break;
      }
    }

    // Extract priority
    if (lowerInput.includes('urgent') || lowerInput.includes('emergency') || lowerInput.includes('critical')) {
      info.priority = 3; // High
    } else if (lowerInput.includes('soon') || lowerInput.includes('important')) {
      info.priority = 2; // Medium
    } else {
      info.priority = 1; // Low
    }

    // Extract issue type for title
    if (lowerInput.includes('ac') || lowerInput.includes('air condition')) {
      info.title = 'Air Conditioning Issue';
    } else if (lowerInput.includes('light') || lowerInput.includes('bulb')) {
      info.title = 'Lighting Issue';
    } else if (lowerInput.includes('water') || lowerInput.includes('leak')) {
      info.title = 'Water/Plumbing Issue';
    } else if (lowerInput.includes('door') || lowerInput.includes('lock')) {
      info.title = 'Door/Lock Issue';
    } else {
      info.title = 'General Maintenance Request';
    }

    return info;
  };

  // Handle step-by-step conversation flow
  const handleStepByStepFlow = (input: string) => {
    const currentData = { ...ticketData };

    switch (conversationState) {
      case 'asking_issue':
        currentData.issue = input.trim();
        currentData.description = input.trim();

        // Determine category and title from issue
        const lowerInput = input.toLowerCase();
        if (lowerInput.includes('ac') || lowerInput.includes('air condition') || lowerInput.includes('hvac') ||
            lowerInput.includes('heating') || lowerInput.includes('cooling') || lowerInput.includes('temperature')) {
          currentData.category = 'HVAC/Air Conditioning';
          currentData.title = 'HVAC/Air Conditioning Issue';
        } else if (lowerInput.includes('light') || lowerInput.includes('bulb') || lowerInput.includes('lighting')) {
          currentData.category = 'Electrical/Lighting';
          currentData.title = 'Lighting Issue';
        } else if (lowerInput.includes('water') || lowerInput.includes('leak') || lowerInput.includes('plumbing')) {
          currentData.category = 'Plumbing/Water';
          currentData.title = 'Plumbing Issue';
        } else if (lowerInput.includes('door') || lowerInput.includes('lock') || lowerInput.includes('security')) {
          currentData.category = 'Security/Access';
          currentData.title = 'Security/Access Issue';
        } else if (lowerInput.includes('clean') || lowerInput.includes('maintenance')) {
          currentData.category = 'General Maintenance';
          currentData.title = 'General Maintenance Request';
        } else {
          currentData.category = 'General';
          currentData.title = 'General Issue';
        }

        setTicketData(currentData);
        setConversationState('asking_location');
        addBotMessage("**Where is it located?**\n\n(e.g., Conference Room A, Building 2 Floor 3, Office 101)");
        break;

      case 'asking_location':
        currentData.location = input.trim();
        setTicketData(currentData);
        setConversationState('asking_urgency');
        addBotMessage("**How urgent is it?**\n\nPlease choose:", 'action', [
          { label: 'Low Priority', action: () => handleUrgencySelection('Low', 1), variant: 'secondary' },
          { label: 'Medium Priority', action: () => handleUrgencySelection('Medium', 2), variant: 'primary' },
          { label: 'High Priority', action: () => handleUrgencySelection('High', 3), variant: 'success' }
        ]);
        break;

      case 'asking_urgency':
        // This will be handled by button clicks
        break;

      case 'asking_photos':
        setConversationState('creating_ticket');
        createFinalTicket();
        break;
    }
  };

  // Handle urgency selection
  const handleUrgencySelection = (urgencyText: string, priorityNum: number) => {
    const currentData = { ...ticketData };
    currentData.urgency = urgencyText;
    currentData.priority = priorityNum;
    setTicketData(currentData);
    setConversationState('asking_photos');
    addBotMessage(`**Any photos to share?**\n\nFor now, I'll create the ticket with the information provided. Photo upload will be available in the full form.`, 'action', [
      { label: 'Create Ticket Now', action: () => createFinalTicket(), variant: 'success' },
      { label: 'Add More Details', action: () => { window.location.href = '/tickets/new'; }, variant: 'secondary' }
    ]);
  };

  // Create ticket directly - REAL API INTEGRATION! 🚀
  const createTicketDirectly = async (ticketData: any): Promise<void> => {
    try {
      setConversationState('creating_ticket');
      addBotMessage("🚀 Creating your ticket now...", 'text');

      // Get current user from localStorage
      const userStr = localStorage.getItem('user');
      const tokenStr = localStorage.getItem('token');

      if (!userStr || !tokenStr) {
        throw new Error('Please log in to create tickets');
      }

      const user = JSON.parse(userStr);

      // Validate required fields and provide defaults
      const title = ticketData.title ||
                   `${ticketData.issue || ticketData.description || 'Maintenance Request'}${ticketData.location ? ` - ${ticketData.location}` : ''}`;

      const description = `Issue: ${ticketData.issue || ticketData.description || 'Not specified'}\n` +
                         `Location: ${ticketData.location || 'Not specified'}\n` +
                         `Priority: ${ticketData.urgency || 'Medium'}\n\n` +
                         `Created via Chatbot Assistant`;

      // Ensure minimum length requirements
      const finalTitle = title.length >= 5 ? title : `Maintenance Request - ${title}`;
      const finalDescription = description.length >= 10 ? description : `${description}\n\nAdditional details: User reported an issue that needs attention.`;

      // Map chatbot data to API format with proper validation
      const createTicketRequest = {
        title: finalTitle.substring(0, 200), // Ensure max length
        description: finalDescription.substring(0, 2000), // Ensure max length
        location: (ticketData.location || 'Not specified').substring(0, 200),
        priority: mapUrgencyToPriority(ticketData.urgency || 'Medium'),
        type: 1, // Default to Service type (1 = Service, 2 = Material)
        requestedByUserId: user.userId || user.id, // Use userId from AuthResponse
        onBehalfOf: undefined
      };

      console.log('User data:', user);
      console.log('Creating ticket with request:', createTicketRequest);

      // Import and use the ticket service
      const { default: ticketService } = await import('../api/ticketService');
      const createdTicket = await ticketService.createTicket(createTicketRequest);

      // Success message with REAL ticket details! 🎉
      const successMessage = `🎉 **Ticket Created Successfully!**\n\n` +
        `🎫 **Ticket #${createdTicket.id}**\n` +
        `📋 ${createdTicket.title}\n` +
        `📍 ${createdTicket.location}\n` +
        `⚡ Priority: ${createdTicket.priorityText}\n` +
        `📊 Status: ${createdTicket.statusText}\n` +
        `📅 Created: ${new Date(createdTicket.createdAt).toLocaleDateString()}\n\n` +
        `✅ **Your ticket is now in the system and will be processed by our team!**`;

      addBotMessage(successMessage, 'success', [
        {
          label: 'View Ticket',
          action: () => {
            window.location.href = `/tickets/${createdTicket.id}`;
          },
          variant: 'primary'
        },
        {
          label: 'Create Another Ticket',
          action: () => startTicketCreation(),
          variant: 'secondary'
        },
        {
          label: 'View All Tickets',
          action: () => {
            window.location.href = '/tickets';
          },
          variant: 'secondary'
        }
      ]);

      // Reset state
      setConversationState('idle');
      setTicketData({});

    } catch (error: any) {
      console.error('Error creating ticket:', error);

      // Provide more specific error messages
      let errorMessage = 'Failed to create ticket. Please try again.';

      if (error.response?.status === 400) {
        errorMessage = 'Invalid ticket data. Please check your input and try again.';
      } else if (error.response?.status === 401) {
        errorMessage = 'Please log in again to create tickets.';
      } else if (error.response?.status === 500) {
        errorMessage = 'Server error. Please try again in a moment.';
      } else if (error.message?.includes('Network Error')) {
        errorMessage = 'Network connection issue. Please check your connection.';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      addBotMessage(`❌ **Error Creating Ticket**\n\n${errorMessage}\n\nDon't worry! I can help you try again or use the manual form.`, 'error', [
        {
          label: 'Try Again',
          action: () => createTicketDirectly(ticketData),
          variant: 'warning'
        },
        {
          label: 'Use Manual Form',
          action: () => {
            sessionStorage.setItem('chatbot_ticket_data', JSON.stringify(ticketData));
            window.location.href = '/tickets/new';
          },
          variant: 'secondary'
        }
      ]);

      setConversationState('idle');
      setTicketData({});
    }
  };

  // Helper function to map urgency to priority numbers
  const mapUrgencyToPriority = (urgency: string): number => {
    switch (urgency?.toLowerCase()) {
      case 'low': return 1;
      case 'medium': return 2;
      case 'high': return 3;
      case 'critical': return 4;
      case 'emergency': return 5;
      default: return 2; // Default to Medium
    }
  };

  // Create the final ticket with all gathered information
  const createFinalTicket = () => {
    const data = ticketData;
    addBotMessage("I understand you have an issue. Let me create a ticket:\n\n" +
      `📍 **Location**: ${data.location || 'Conference Room'}\n` +
      `📋 **Category**: ${data.category || 'HVAC/Air Conditioning'}\n` +
      `⚡ **Priority**: ${data.urgency || 'Medium'} (Suggested)\n\n` +
      "Would you like me to create this ticket for you?", 'action', [
      {
        label: 'Create This Ticket Automatically',
        action: () => {
          // Create ticket directly
          const ticketRequest = {
            title: data.title || 'General Maintenance Request',
            description: data.description || data.issue || 'Issue reported via chatbot',
            location: data.location || 'Not specified',
            priority: data.priority || 2,
            urgency: data.urgency || 'Medium'
          };
          createTicketDirectly(ticketRequest);
        },
        variant: 'success'
      },
      {
        label: 'Use Manual Form',
        action: () => {
          sessionStorage.setItem('chatbot_ticket_data', JSON.stringify(data));
          window.location.href = '/tickets/new';
        },
        variant: 'secondary'
      }
    ]);

    setConversationState('idle');
    setTicketData({});
  };

  // Handle user message and generate AI response
  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    addUserMessage(inputText);

    // Handle step-by-step flow if in conversation
    if (conversationState !== 'idle') {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        handleStepByStepFlow(inputText);
      }, 500);
    } else {
      const intent = processUserInput(inputText);
      setIsTyping(true);

      // Simulate AI thinking time
      setTimeout(() => {
        setIsTyping(false);

        switch (intent) {
          case 'create_ticket':
            startTicketCreation();
            break;
          case 'check_status':
            addBotMessage("I can help you check ticket status. Let me redirect you to your tickets page.", 'action', [
              { label: 'View My Tickets', action: handleViewTickets, variant: 'primary' }
            ]);
            break;
          case 'help':
            addBotMessage("I can help you with:\n• Creating maintenance tickets\n• Checking ticket status\n• Facility management questions\n\nWhat would you like to do?", 'action', [
              { label: 'Create Ticket', action: () => startTicketCreation(), variant: 'primary' },
              { label: 'View Tickets', action: handleViewTickets, variant: 'secondary' }
            ]);
            break;
          default:
            addBotMessage("I understand you need help. Would you like to create a ticket or check existing ones?", 'action', [
              { label: 'Create New Ticket', action: () => startTicketCreation(), variant: 'primary' },
              { label: 'View My Tickets', action: handleViewTickets, variant: 'secondary' },
              { label: '🧪 Test API', action: () => testTicketCreation(), variant: 'warning' }
            ]);
        }
      }, 800 + Math.random() * 1200);
    }

    setInputText('');
  };

  // Start ticket creation process with step-by-step questions
  const startTicketCreation = () => {
    setConversationState('asking_issue');
    setTicketData({});
    addBotMessage("Let me gather some details:\n\n🔹 What's the issue?\n🔹 Where is it located?\n🔹 How urgent is it?\n🔹 Any photos to share?\n\nI'll create the perfect ticket for you!\n\n**What's the issue?**");
  };

  // Debug function to test ticket creation
  const testTicketCreation = () => {
    const testData = {
      issue: 'Test AC Issue',
      location: 'Test Room 101',
      urgency: 'Medium',
      title: 'Test AC Issue - Test Room 101',
      description: 'Test ticket from chatbot'
    };

    addBotMessage("🧪 **Testing Ticket Creation**\n\nI'll try to create a test ticket to check the API connection...", 'text');
    createTicketDirectly(testData);
  };



  return (
    <>
      {/* Professional Chat Window */}
      {isOpen && (
        <div style={{
          position: 'fixed',
          bottom: '90px',
          right: '20px',
          width: '380px',
          height: '500px',
          backgroundColor: 'white',
          borderRadius: '16px',
          boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
          zIndex: 9998,
          border: '1px solid #e9ecef',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}>
          {/* Header */}
          <div style={{
            background: 'linear-gradient(135deg, #007bff, #0056b3)',
            color: 'white',
            padding: '16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <FontAwesomeIcon icon={faRobot} size="lg" />
              </div>
              <div>
                <h6 style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>CAFM Assistant</h6>
                <small style={{ opacity: 0.9, fontSize: '12px' }}>
                  {isTyping ? 'Typing...' : 'Online'}
                </small>
              </div>
            </div>
            <button
              onClick={handleToggle}
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                border: 'none',
                color: 'white',
                cursor: 'pointer',
                padding: '8px',
                borderRadius: '6px',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>

          {/* Messages Area */}
          <div style={{
            flex: 1,
            padding: '16px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            {messages.map((message) => (
              <div
                key={message.id}
                style={{
                  display: 'flex',
                  justifyContent: message.isBot ? 'flex-start' : 'flex-end',
                  alignItems: 'flex-start',
                  gap: '8px'
                }}
              >
                {message.isBot && (
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #007bff, #0056b3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <FontAwesomeIcon icon={faRobot} color="white" size="sm" />
                  </div>
                )}

                <div style={{
                  maxWidth: '75%',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
                }}>
                  <div style={{
                    padding: '12px 16px',
                    borderRadius: message.isBot ? '16px 16px 16px 4px' : '16px 16px 4px 16px',
                    background: message.isBot ?
                      (message.type === 'success' ? '#d4edda' :
                       message.type === 'error' ? '#f8d7da' : '#f8f9fa') :
                      'linear-gradient(135deg, #007bff, #0056b3)',
                    color: message.isBot ?
                      (message.type === 'success' ? '#155724' :
                       message.type === 'error' ? '#721c24' : '#333') : 'white',
                    fontSize: '14px',
                    lineHeight: '1.4',
                    whiteSpace: 'pre-line',
                    border: message.type === 'success' ? '1px solid #c3e6cb' :
                            message.type === 'error' ? '1px solid #f5c6cb' : 'none'
                  }}>
                    {message.type === 'success' && <FontAwesomeIcon icon={faCheckCircle} className="me-2" />}
                    {message.type === 'error' && <FontAwesomeIcon icon={faExclamationTriangle} className="me-2" />}
                    {message.text}
                  </div>

                  {message.actions && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {message.actions.map((action, index) => (
                        <button
                          key={index}
                          onClick={action.action}
                          style={{
                            padding: '8px 12px',
                            borderRadius: '8px',
                            border: 'none',
                            background: action.variant === 'success' ? '#28a745' :
                                       action.variant === 'secondary' ? '#6c757d' :
                                       action.variant === 'warning' ? '#ffc107' :
                                       action.variant === 'danger' ? '#dc3545' : '#007bff',
                            color: 'white',
                            fontSize: '13px',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                          }}
                          onMouseOver={(e) => {
                            e.currentTarget.style.opacity = '0.9';
                            e.currentTarget.style.transform = 'translateY(-1px)';
                          }}
                          onMouseOut={(e) => {
                            e.currentTarget.style.opacity = '1';
                            e.currentTarget.style.transform = 'translateY(0)';
                          }}
                        >
                          {action.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {!message.isBot && (
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: '#6c757d',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <FontAwesomeIcon icon={faUser} color="white" size="sm" />
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div style={{
                display: 'flex',
                justifyContent: 'flex-start',
                alignItems: 'flex-start',
                gap: '8px'
              }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #007bff, #0056b3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <FontAwesomeIcon icon={faRobot} color="white" size="sm" />
                </div>
                <div style={{
                  padding: '12px 16px',
                  borderRadius: '16px 16px 16px 4px',
                  background: '#f8f9fa',
                  color: '#333',
                  fontSize: '14px'
                }}>
                  <div style={{
                    display: 'flex',
                    gap: '4px',
                    alignItems: 'center'
                  }}>
                    <div style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: '#007bff',
                      animation: 'pulse 1.5s ease-in-out infinite'
                    }}></div>
                    <div style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: '#007bff',
                      animation: 'pulse 1.5s ease-in-out infinite 0.2s'
                    }}></div>
                    <div style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: '#007bff',
                      animation: 'pulse 1.5s ease-in-out infinite 0.4s'
                    }}></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div style={{
            padding: '16px',
            borderTop: '1px solid #e9ecef',
            background: '#f8f9fa'
          }}>
            <div style={{
              display: 'flex',
              gap: '8px',
              alignItems: 'flex-end'
            }}>
              <input
                ref={inputRef}
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder={
                  conversationState === 'asking_issue' ? "Describe the issue (e.g., 'AC not working')" :
                  conversationState === 'asking_location' ? "Enter location (e.g., 'Conference Room A')" :
                  conversationState === 'asking_photos' ? "Type 'done' to continue or describe more details" :
                  "Type your message... (e.g., 'AC broken in room 101')"
                }
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  border: '1px solid #dee2e6',
                  borderRadius: '20px',
                  fontSize: '14px',
                  outline: 'none',
                  resize: 'none',
                  minHeight: '44px',
                  maxHeight: '100px'
                }}
                disabled={isTyping}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputText.trim() || isTyping}
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  border: 'none',
                  background: inputText.trim() && !isTyping ?
                    'linear-gradient(135deg, #007bff, #0056b3)' : '#dee2e6',
                  color: 'white',
                  cursor: inputText.trim() && !isTyping ? 'pointer' : 'not-allowed',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s',
                  flexShrink: 0
                }}
                onMouseOver={(e) => {
                  if (inputText.trim() && !isTyping) {
                    e.currentTarget.style.transform = 'scale(1.05)';
                  }
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                <FontAwesomeIcon icon={faPaperPlane} />
              </button>
            </div>

            {/* Quick suggestions */}
            {messages.length === 1 && (
              <div style={{
                marginTop: '12px',
                display: 'flex',
                flexWrap: 'wrap',
                gap: '6px'
              }}>
                {[
                  'AC not working',
                  'Light bulb out',
                  'Water leak',
                  'Door lock broken'
                ].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => {
                      setInputText(suggestion);
                      setTimeout(() => handleSendMessage(), 100);
                    }}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '12px',
                      border: '1px solid #dee2e6',
                      background: 'white',
                      color: '#6c757d',
                      fontSize: '12px',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.background = '#007bff';
                      e.currentTarget.style.color = 'white';
                      e.currentTarget.style.borderColor = '#007bff';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.background = 'white';
                      e.currentTarget.style.color = '#6c757d';
                      e.currentTarget.style.borderColor = '#dee2e6';
                    }}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Enhanced Floating Chat Button */}
      <div style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: 9999
      }}>
        <button
          onClick={handleToggle}
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            border: 'none',
            background: 'linear-gradient(135deg, #007bff, #0056b3)',
            color: 'white',
            cursor: 'pointer',
            fontSize: '24px',
            boxShadow: '0 6px 20px rgba(0, 123, 255, 0.3)',
            transition: 'all 0.3s ease',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'scale(1.1) rotate(5deg)';
            e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 123, 255, 0.4)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'scale(1) rotate(0deg)';
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 123, 255, 0.3)';
          }}
          title="Chat with AI Assistant - Try saying 'AC broken in room 101'"
        >
          <FontAwesomeIcon
            icon={isOpen ? faTimes : faComments}
            style={{
              transition: 'all 0.3s ease',
              transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)'
            }}
          />

          {/* Notification pulse for new features */}
          {!isOpen && (
            <div style={{
              position: 'absolute',
              top: '-2px',
              right: '-2px',
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              background: '#28a745',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '10px',
              fontWeight: 'bold',
              animation: 'pulse 2s infinite'
            }}>
              AI
            </div>
          )}
        </button>
      </div>

      {/* CSS Animation Styles */}
      <style>{`
        @keyframes pulse {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.7;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </>
  );
};

export default WorkingChatButton;
