import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { Alert, Button, Card, Form as BootstrapForm, Badge, Table } from 'react-bootstrap';
import ticketService, { type KeywordSuggestion } from '../../api/ticketService';
import userService, { type RegisteredUser, type UserSuggestion } from '../../api/userService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTags, faLightbulb, faHashtag, faUser, faUserFriends, faSearch, faRobot, faUpload } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../context/AuthContext';
import AutocompleteInput from '../ui/AutocompleteInput';
import { ticketSuggestions } from '../../data/ticketSuggestions';
import FileUpload from '../common/FileUpload';
// NEW: Service detection imports (completely optional)
import ServiceDetectionBadge from '../ui/ServiceDetectionBadge';
import ServiceDetectionPanel from '../ui/ServiceDetectionPanel';
import {
  type ServiceDetectionResult,
  createDetectionDebouncer,
  shouldTriggerDetection,
  filterResultsByConfidence,
  convertApiResponseToDetectionResult,
  handleDetectionError
} from '../../utils/serviceDetection';

// Validation schema
const TicketSchema = Yup.object().shape({
  title: Yup.string()
    .required('Title is required')
    .min(5, 'Title must be at least 5 characters')
    .max(100, 'Title must be at most 100 characters'),
  description: Yup.string()
    .required('Description is required')
    .min(10, 'Description must be at least 10 characters'),
  priority: Yup.number()
    .required('Priority is required'),
  type: Yup.number()
    .required('Type is required'),
  location: Yup.string()
    .required('Location is required'),
  requestedByUserId: Yup.string()
    .required('Requested By is required'),
  onBehalfOf: Yup.string()
    .optional(),
});

// Helper function to convert category text to category ID
// IMPORTANT: These IDs must match the backend TicketCategory enum exactly!
const getCategoryIdFromText = (categoryText: string): number => {
  const categoryMap: Record<string, number> = {
    'General': 1,      // TicketCategory.General = 1
    'Plumbing': 2,     // TicketCategory.Plumbing = 2
    'Electrical': 3,   // TicketCategory.Electrical = 3
    'HVAC': 4,         // TicketCategory.HVAC = 4
    'Cleaning': 5,     // TicketCategory.Cleaning = 5
    'Security': 6,     // TicketCategory.Security = 6
    'IT': 7,           // TicketCategory.IT = 7
    'Maintenance': 8,  // TicketCategory.Maintenance = 8
    'Safety': 9,       // TicketCategory.Safety = 9
    'Other': 10        // TicketCategory.Other = 10
  };

  return categoryMap[categoryText] || 1; // Default to General if not found
};

const CreateTicketForm: React.FC = () => {
  const navigate = useNavigate();
  // const { user } = useAuth(); // Not used currently
  const [error, setError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<KeywordSuggestion[]>([]);
  const [predictedCategory, setPredictedCategory] = useState<string | null>(null);
  const [debounceTimeout, setDebounceTimeout] = useState<number | null>(null);

  // New state for enhanced features
  const [nextTicketId, setNextTicketId] = useState<number>(1);
  const [registeredUsers, setRegisteredUsers] = useState<RegisteredUser[]>([]);
  const [userSuggestions, setUserSuggestions] = useState<UserSuggestion[]>([]);
  const [onBehalfOfQuery, setOnBehalfOfQuery] = useState<string>('');
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);

  // NEW: Service detection state (completely optional - graceful fallback if disabled)
  const [serviceDetectionResults, setServiceDetectionResults] = useState<ServiceDetectionResult[]>([]);
  const [isDetecting, setIsDetecting] = useState<boolean>(false);
  const [detectionEnabled, setDetectionEnabled] = useState<boolean>(true);
  const [showDetectionPanel, setShowDetectionPanel] = useState<boolean>(false);
  const [selectedDetectedCategory, setSelectedDetectedCategory] = useState<number | null>(null);

  // File upload state
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadingFiles, setUploadingFiles] = useState<boolean>(false);

  // Load initial data on component mount
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        // Load next ticket ID
        const nextIdData = await ticketService.getNextTicketId();
        setNextTicketId(nextIdData.nextId);

        // Load registered users
        await loadRegisteredUsers();
      } catch (err) {
        console.error('Error loading initial data:', err);
      }
    };

    loadInitialData();
  }, []);

  // Function to load registered users (can be called to refresh)
  const loadRegisteredUsers = async () => {
    try {
      const users = await userService.getRegisteredUsers();
      setRegisteredUsers(users);
      console.log('Loaded registered users:', users);
    } catch (err) {
      console.error('Error loading registered users:', err);
    }
  };

  // Handle description change with debounce
  const handleDescriptionChange = (value: string, setFieldValue: (field: string, value: any) => void) => {
    setFieldValue('description', value);

    // Clear previous timeout
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }

    // Set new timeout
    const timeout = window.setTimeout(() => {
      fetchSuggestions(value);
    }, 500); // 500ms debounce

    setDebounceTimeout(timeout);
  };

  // Fetch keyword suggestions
  const fetchSuggestions = async (text: string) => {
    if (text.length < 5) {
      setSuggestions([]);
      setPredictedCategory(null);
      return;
    }

    try {
      const suggestionsData = await ticketService.getKeywordSuggestions(text);
      setSuggestions(suggestionsData);

      // Determine predicted category based on highest relevance
      if (suggestionsData.length > 0) {
        const categoryCounts: Record<string, number> = {};

        suggestionsData.forEach(suggestion => {
          const categoryText = suggestion.categoryText;
          if (!categoryCounts[categoryText]) {
            categoryCounts[categoryText] = 0;
          }
          categoryCounts[categoryText] += suggestion.relevance;
        });

        const predictedCat = Object.entries(categoryCounts)
          .sort((a, b) => b[1] - a[1])
          [0][0];

        setPredictedCategory(predictedCat);
      } else {
        setPredictedCategory(null);
      }
    } catch (err) {
      console.error('Error fetching suggestions:', err);
    }
  };

  // Apply suggestion to description
  const applySuggestion = (suggestion: KeywordSuggestion, currentText: string, setFieldValue: (field: string, value: any) => void) => {
    // Check if the keyword is already in the text
    if (currentText.toLowerCase().includes(suggestion.keyword.toLowerCase())) {
      return;
    }

    // Add the keyword to the end of the description
    const newText = `${currentText} ${suggestion.keyword}`;
    setFieldValue('description', newText);

    // Refresh suggestions
    fetchSuggestions(newText);
  };

  // Handle "On Behalf Of" autocomplete
  const handleOnBehalfOfChange = async (value: string, setFieldValue: (field: string, value: any) => void) => {
    setOnBehalfOfQuery(value);
    setFieldValue('onBehalfOf', value);

    if (value.length >= 2) {
      try {
        const suggestions = await userService.searchUsers(value);
        setUserSuggestions(suggestions);
        setShowSuggestions(true);
      } catch (err) {
        console.error('Error fetching user suggestions:', err);
        setUserSuggestions([]);
      }
    } else {
      setUserSuggestions([]);
      setShowSuggestions(false);
    }
  };

  // Apply user suggestion
  const applyUserSuggestion = (suggestion: UserSuggestion, setFieldValue: (field: string, value: any) => void) => {
    setFieldValue('onBehalfOf', suggestion.name);
    setOnBehalfOfQuery(suggestion.name);
    setShowSuggestions(false);
    setUserSuggestions([]);
  };

  // NEW: Service detection functions (completely optional with graceful fallback)
  const performServiceDetection = async (text: string) => {
    if (!detectionEnabled || !shouldTriggerDetection(text)) {
      return;
    }

    try {
      setIsDetecting(true);
      setServiceDetectionResults([]);

      // Call the new backend suggestions endpoint
      const apiResults = await ticketService.getKeywordSuggestions(text);

      // Convert API response to detection results
      const detectionResults = apiResults.map(convertApiResponseToDetectionResult);

      // Filter by confidence and set results
      const filteredResults = filterResultsByConfidence(detectionResults);
      setServiceDetectionResults(filteredResults);

      // Show detection panel if we have good results
      if (filteredResults.length > 0) {
        setShowDetectionPanel(true);
      }
    } catch (error) {
      // Graceful fallback - don't break existing functionality
      console.warn('Service detection failed, falling back gracefully:', error);
      const fallbackResult = handleDetectionError(error);
      setServiceDetectionResults([fallbackResult]);
    } finally {
      setIsDetecting(false);
    }
  };

  // Create debounced detection function
  const debouncedDetection = createDetectionDebouncer(performServiceDetection);

  // Handle service category selection from detection
  const handleDetectedCategorySelection = (categoryId: number) => {
    setSelectedDetectedCategory(categoryId);
    // Note: We don't automatically set the category in the form to preserve user control
    // Users can manually select it if they want
  };

  // Enhanced description change handler with service detection
  const handleDescriptionChangeWithDetection = (value: string, setFieldValue: (field: string, value: any) => void) => {
    // Call existing function first (maintains backward compatibility)
    handleDescriptionChange(value, setFieldValue);

    // Add new service detection (optional enhancement)
    if (detectionEnabled) {
      debouncedDetection(value);
    }
  };

  return (
    <Card className="shadow">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="mb-0">Create New Ticket</h2>

          {/* NEW: Service Detection Toggle (optional feature control) */}
          <div className="d-flex align-items-center">
            <small className="text-muted me-2">AI Service Detection:</small>
            <div className="form-check form-switch">
              <input
                className="form-check-input"
                type="checkbox"
                id="serviceDetectionToggle"
                checked={detectionEnabled}
                onChange={(e) => {
                  setDetectionEnabled(e.target.checked);
                  if (!e.target.checked) {
                    // Clear detection state when disabled
                    setServiceDetectionResults([]);
                    setShowDetectionPanel(false);
                    setIsDetecting(false);
                  }
                }}
              />
              <label className="form-check-label" htmlFor="serviceDetectionToggle">
                <FontAwesomeIcon icon={faRobot} className="me-1" />
                {detectionEnabled ? 'Enabled' : 'Disabled'}
              </label>
            </div>
          </div>
        </div>

        {error && (
          <Alert variant="danger">
            <div>{error}</div>
            {error.includes('Unable to connect to server') && (
              <div className="mt-2">
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={async () => {
                    try {
                      const response = await fetch('http://localhost:5000/api/auth/roles');
                      if (response.ok) {
                        setError('✅ Backend connection successful! Please try creating the ticket again.');
                      } else {
                        setError(`❌ Backend responded with error: ${response.status}. Please check if the backend is running.`);
                      }
                    } catch (err) {
                      setError('❌ Cannot connect to backend. Please ensure CAFMSystem.API is running on localhost:5000.');
                    }
                  }}
                >
                  🔍 Test Backend Connection
                </Button>
              </div>
            )}
          </Alert>
        )}

        <Formik
          initialValues={{
            title: '',
            description: '',
            priority: 2, // Medium priority
            type: 2, // Service Request
            location: '',
            requestedByUserId: '',
            onBehalfOf: '',
          }}
          validationSchema={TicketSchema}
          onSubmit={async (values, { setSubmitting }) => {
            try {
              console.log('Submitting ticket with values:', values);

              // Validate required fields
              if (!values.requestedByUserId) {
                setError('Please select a user in the "Requested By" field.');
                setSubmitting(false);
                return;
              }

              if (!values.type) {
                setError('Please select a request type (Material or Service).');
                setSubmitting(false);
                return;
              }

              // Add type prefix to title based on selected type
              const typePrefix = values.type === 1 ? '(Material Request)' : '(Service Request)';
              const cleanTitle = values.title.replace(/^\((Material Request|Service Request)\)\s*/, '');
              const titleWithPrefix = `${typePrefix} ${cleanTitle}`;

              // Ensure minimum requirements like chatbot does
              const finalTitle = titleWithPrefix.length >= 5 ? titleWithPrefix : `Maintenance Request - ${titleWithPrefix}`;
              const finalDescription = values.description.length >= 10 ? values.description : `${values.description}\n\nAdditional details: User reported an issue that needs attention.`;

              // Convert predicted category to category ID
              let categoryId: number | undefined = undefined;
              if (predictedCategory) {
                categoryId = getCategoryIdFromText(predictedCategory);
              }

              const ticketData = {
                title: finalTitle.substring(0, 200), // Ensure max length
                description: finalDescription.substring(0, 2000), // Ensure max length
                location: (values.location || 'Not specified').substring(0, 200),
                priority: values.priority,
                type: values.type,
                category: categoryId, // Include detected category
                requestedByUserId: values.requestedByUserId,
                onBehalfOf: values.onBehalfOf || undefined
              };

              console.log('Final ticket data being sent:', ticketData);

              const ticket = await ticketService.createTicket(ticketData);
              console.log('Ticket created successfully:', ticket);

              // Upload files if any are selected
              if (selectedFiles.length > 0) {
                try {
                  setUploadingFiles(true);
                  console.log('Uploading files for ticket:', ticket.id);

                  const uploadResponse = await ticketService.uploadFiles(ticket.id, selectedFiles);
                  console.log('Files uploaded successfully:', uploadResponse);

                  if (!uploadResponse.success && uploadResponse.errors.length > 0) {
                    // Show warning but don't prevent navigation
                    console.warn('Some files failed to upload:', uploadResponse.errors);
                    setError(`Ticket created successfully, but some files failed to upload: ${uploadResponse.errors.join(', ')}`);
                  }
                } catch (fileErr: any) {
                  console.error('Error uploading files:', fileErr);
                  // Don't prevent navigation, just show warning
                  setError(`Ticket created successfully, but file upload failed: ${fileErr.message || 'Unknown error'}`);
                } finally {
                  setUploadingFiles(false);
                }
              }

              navigate(`/tickets/${ticket.id}`);
            } catch (err: any) {
              console.error('Error creating ticket:', err);

              // Enhanced error handling
              let errorMessage = 'Failed to create ticket. Please try again.';

              if (err.isNetworkError) {
                errorMessage = 'Unable to connect to server. Please ensure the backend is running on localhost:5000.';
              } else if (err.response?.data?.message) {
                errorMessage = err.response.data.message;
              } else if (err.message) {
                errorMessage = err.message;
              }

              setError(errorMessage);
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ isSubmitting, touched, errors, values, setFieldValue }) => (
            <Form>
              {/* Enhanced Ticket Information Table */}
              <Card className="mb-4 border-primary">
                <Card.Header className="bg-primary text-white">
                  <h5 className="mb-0">
                    <FontAwesomeIcon icon={faHashtag} className="me-2" />
                    Ticket Information
                  </h5>
                </Card.Header>
                <Card.Body>
                  <Table responsive className="mb-0">
                    <thead>
                      <tr>
                        <th style={{ width: '33%' }}>
                          <FontAwesomeIcon icon={faHashtag} className="me-2 text-primary" />
                          Request ID
                        </th>
                        <th style={{ width: '33%' }}>
                          <FontAwesomeIcon icon={faUser} className="me-2 text-success" />
                          Requested By
                        </th>
                        <th style={{ width: '34%' }}>
                          <FontAwesomeIcon icon={faUserFriends} className="me-2 text-info" />
                          On Behalf Of
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
                          <div className="d-flex align-items-center">
                            <Badge bg="secondary" className="fs-6 px-3 py-2">
                              #{nextTicketId.toString().padStart(4, '0')}
                            </Badge>
                            <small className="text-muted ms-2">Auto-generated</small>
                          </div>
                        </td>
                        <td>
                          <div className="d-flex">
                            <Field
                              as="select"
                              name="requestedByUserId"
                              className={`form-select ${touched.requestedByUserId && errors.requestedByUserId ? 'is-invalid' : ''}`}
                            >
                              <option value="">Select a user...</option>
                              {registeredUsers.map((user) => (
                                <option key={user.id} value={user.id}>
                                  {user.fullName} ({user.email})
                                  {user.department && ` - ${user.department}`}
                                </option>
                              ))}
                            </Field>
                            <Button
                              variant="outline-secondary"
                              size="sm"
                              className="ms-2"
                              onClick={loadRegisteredUsers}
                              title="Refresh user list"
                            >
                              🔄
                            </Button>
                          </div>
                          <ErrorMessage name="requestedByUserId" component="div" className="text-danger small mt-1" />
                          <small className="text-muted">
                            {registeredUsers.length} users available
                          </small>
                        </td>
                        <td>
                          <div className="position-relative">
                            <Field
                              type="text"
                              name="onBehalfOf"
                              className={`form-control ${touched.onBehalfOf && errors.onBehalfOf ? 'is-invalid' : ''}`}
                              placeholder="Type to search for a person..."
                              value={onBehalfOfQuery}
                              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                handleOnBehalfOfChange(e.target.value, setFieldValue)
                              }
                              autoComplete="off"
                            />
                            <ErrorMessage name="onBehalfOf" component="div" className="text-danger small mt-1" />

                            {/* Autocomplete suggestions dropdown */}
                            {showSuggestions && userSuggestions.length > 0 && (
                              <div className="position-absolute w-100 bg-white border rounded shadow-sm mt-1" style={{ zIndex: 1000 }}>
                                {userSuggestions.map((suggestion, index) => (
                                  <div
                                    key={index}
                                    className="p-2 border-bottom cursor-pointer hover-bg-light"
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => applyUserSuggestion(suggestion, setFieldValue)}
                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                                  >
                                    <div className="fw-bold">{suggestion.name}</div>
                                    <small className="text-muted">
                                      {suggestion.type} {suggestion.department && `• ${suggestion.department}`}
                                    </small>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>

              <BootstrapForm.Group className="mb-3">
                <BootstrapForm.Label>
                  <FontAwesomeIcon icon={faSearch} className="me-2 text-success" />
                  Request Title
                </BootstrapForm.Label>

                {/* Enhanced Autocomplete Input for Title */}
                <AutocompleteInput
                  value={values.title.replace(/^\((Material Request|Service Request)\)\s*/, '')}
                  onChange={(value) => {
                    // Remove any existing prefix and add the current type prefix
                    const cleanTitle = value.replace(/^\((Material Request|Service Request)\)\s*/, '');
                    if (values.type) {
                      const typePrefix = values.type === 1 ? '(Material Request)' : '(Service Request)';
                      setFieldValue('title', `${typePrefix} ${cleanTitle}`);
                    } else {
                      setFieldValue('title', cleanTitle);
                    }
                  }}
                  placeholder="Enter a descriptive title (e.g., 'Water leak in restroom', 'Power outage in office')..."
                  className={touched.title && errors.title ? 'is-invalid' : ''}
                  suggestions={ticketSuggestions}
                />
                <ErrorMessage name="title" component="div" className="text-danger" />

                {/* Title Preview */}
                {values.type && values.title.replace(/^\((Material Request|Service Request)\)\s*/, '') && (
                  <div className="mt-2 p-2 bg-light border rounded">
                    <small className="text-muted">Final title preview:</small>
                    <div className="fw-bold text-primary">
                      {values.type === 1 ? '(Material Request)' : '(Service Request)'} {values.title.replace(/^\((Material Request|Service Request)\)\s*/, '')}
                    </div>
                  </div>
                )}
              </BootstrapForm.Group>

              <BootstrapForm.Group className="mb-3">
                <BootstrapForm.Label>
                  <FontAwesomeIcon icon={faSearch} className="me-2 text-primary" />
                  Request description
                  {/* NEW: Service detection badge (optional enhancement) */}
                  {detectionEnabled && (
                    <ServiceDetectionBadge
                      detectionResult={serviceDetectionResults[0] || null}
                      isDetecting={isDetecting}
                      className="ms-2"
                    />
                  )}
                </BootstrapForm.Label>

                {/* Enhanced Autocomplete Input */}
                <AutocompleteInput
                  value={values.description}
                  onChange={(value) => {
                    setFieldValue('description', value);
                    // Use enhanced handler with service detection
                    handleDescriptionChangeWithDetection(value, setFieldValue);
                  }}
                  placeholder="Type your issue description (e.g., 'water leak', 'electrical', 'cleaning', 'power outage')..."
                  className={touched.description && errors.description ? 'is-invalid' : ''}
                  suggestions={ticketSuggestions}
                />
                <ErrorMessage name="description" component="div" className="text-danger" />

                {/* Keyword suggestions */}
                {suggestions.length > 0 && (
                  <div className="mt-2">
                    <div className="d-flex align-items-center mb-2">
                      <FontAwesomeIcon icon={faTags} className="me-2 text-primary" />
                      <strong>Suggested Keywords:</strong>
                    </div>
                    <div>
                      {suggestions.map((suggestion, index) => (
                        <Badge
                          key={index}
                          bg="light"
                          text="dark"
                          className="me-2 mb-2 p-2 border"
                          style={{ cursor: 'pointer' }}
                          onClick={() => applySuggestion(suggestion, values.description, setFieldValue)}
                        >
                          {suggestion.keyword}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Predicted category */}
                {predictedCategory && (
                  <div className="mt-3 p-2 bg-light rounded border">
                    <div className="d-flex align-items-center">
                      <FontAwesomeIcon icon={faLightbulb} className="me-2 text-warning" />
                      <span>
                        <strong>Predicted Category:</strong> {predictedCategory}
                      </span>
                    </div>
                  </div>
                )}

                {/* NEW: Service Detection Panel (completely optional enhancement) */}
                {detectionEnabled && showDetectionPanel && (
                  <ServiceDetectionPanel
                    detectionResults={serviceDetectionResults}
                    isDetecting={isDetecting}
                    onSelectCategory={handleDetectedCategorySelection}
                    onDismiss={() => setShowDetectionPanel(false)}
                    selectedCategoryId={selectedDetectedCategory || undefined}
                    className="mt-3"
                  />
                )}
              </BootstrapForm.Group>

              <BootstrapForm.Group className="mb-3">
                <BootstrapForm.Label>Priority</BootstrapForm.Label>
                <Field
                  as="select"
                  name="priority"
                  className={`form-select ${touched.priority && errors.priority ? 'is-invalid' : ''}`}
                >
                  <option value={1}>Low</option>
                  <option value={2}>Medium</option>
                  <option value={3}>High</option>
                  <option value={4}>Critical</option>
                </Field>
                <ErrorMessage name="priority" component="div" className="text-danger" />
              </BootstrapForm.Group>

              <BootstrapForm.Group className="mb-3">
                <BootstrapForm.Label>
                  <span className="text-danger">*</span> Request Type
                </BootstrapForm.Label>
                <Field
                  as="select"
                  name="type"
                  className={`form-select ${touched.type && errors.type ? 'is-invalid' : ''}`}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                    const selectedType = parseInt(e.target.value);
                    setFieldValue('type', selectedType);

                    // Update title preview with type prefix
                    const currentTitle = values.title.replace(/^\((Material Request|Service Request)\)\s*/, '');
                    const typePrefix = selectedType === 1 ? '(Material Request)' : '(Service Request)';
                    const newTitle = currentTitle ? `${typePrefix} ${currentTitle}` : '';
                    if (currentTitle) {
                      setFieldValue('title', newTitle);
                    }
                  }}
                >
                  <option value="">Select request type...</option>
                  <option value={1}>Material Request</option>
                  <option value={2}>Service Request</option>
                </Field>
                <ErrorMessage name="type" component="div" className="text-danger" />
                <div className="form-text">
                  <strong>Material Request:</strong> For requesting supplies, equipment, or materials<br/>
                  <strong>Service Request:</strong> For requesting repairs, maintenance, or services
                </div>
              </BootstrapForm.Group>

              <BootstrapForm.Group className="mb-3">
                <BootstrapForm.Label>Location</BootstrapForm.Label>
                <Field
                  type="text"
                  name="location"
                  className={`form-control ${touched.location && errors.location ? 'is-invalid' : ''}`}
                  placeholder="Enter the location (e.g., Building A, Room 101)"
                />
                <ErrorMessage name="location" component="div" className="text-danger" />
              </BootstrapForm.Group>

              {/* File Upload Section */}
              <BootstrapForm.Group className="mb-4">
                <BootstrapForm.Label>
                  <FontAwesomeIcon icon={faUpload} className="me-2 text-primary" />
                  File Attachments (Optional)
                </BootstrapForm.Label>
                <FileUpload
                  onFilesSelected={setSelectedFiles}
                  maxFiles={5}
                  maxFileSize={10}
                  disabled={isSubmitting}
                  className="mt-2"
                />
                {selectedFiles.length > 0 && (
                  <div className="mt-2">
                    <small className="text-muted">
                      {selectedFiles.length} file(s) selected. Files will be uploaded after ticket creation.
                    </small>
                  </div>
                )}
              </BootstrapForm.Group>

              <div className="d-flex justify-content-between mt-4">
                <Button
                  variant="secondary"
                  onClick={() => navigate('/tickets')}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  type="submit"
                  disabled={isSubmitting || uploadingFiles}
                >
                  {uploadingFiles ? 'Uploading Files...' : isSubmitting ? 'Creating...' : 'Create Ticket'}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </Card.Body>
    </Card>
  );
};

export default CreateTicketForm;
