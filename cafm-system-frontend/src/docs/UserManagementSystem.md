# User Management System Documentation

## Overview

The User Management System is a comprehensive admin interface built with Material UI and a professional green color palette. It provides full CRUD operations for managing system users, role-based access control, messaging capabilities, and advanced features like bulk operations and data export.

## Features

### 🎨 Professional Design
- **Material UI Components**: Modern, responsive design with consistent styling
- **Green Color Palette**: Professional green theme throughout the interface
- **Responsive Layout**: Works seamlessly on desktop, tablet, and mobile devices
- **Accessibility**: WCAG compliant with proper ARIA labels and keyboard navigation

### 👥 User Management
- **View All Users**: Paginated table with comprehensive user information
- **Search & Filter**: Real-time search by name, email, or employee ID
- **Department Filter**: Filter users by department
- **Role Filter**: Filter users by assigned roles
- **Status Filter**: Filter by active/inactive status
- **User Statistics**: Display ticket counts, completion rates, and activity metrics

### ✏️ CRUD Operations
- **Create User**: Add new users with validation and role assignment
- **View User Details**: Comprehensive user profile with tabs for:
  - Personal information
  - Performance statistics
  - Login history
  - Activity timeline
- **Edit User**: Update user information, roles, and status
- **Delete User**: Safe deletion with confirmation dialog
- **Toggle Status**: Quick activate/deactivate users

### 💬 Messaging System
- **Individual Messages**: Send messages to specific users
- **Bulk Messaging**: Send messages to multiple users simultaneously
- **Message Types**: Support for different message categories (General, Task, Alert, Announcement)
- **Priority Levels**: Set message priority (Low, Normal, High, Urgent)
- **Message Preview**: Real-time preview before sending
- **Recipient Filtering**: Filter recipients by department, role, or status

### 📊 Advanced Features
- **Export Functionality**: Export user data to CSV format
- **Bulk Operations**: Bulk status updates for multiple users
- **Real-time Statistics**: Live dashboard with user metrics
- **Activity Tracking**: Comprehensive audit trail of user actions
- **Error Handling**: Robust error handling with user-friendly messages
- **Loading States**: Smooth loading indicators and progress bars

## Technical Architecture

### Frontend Stack
- **React 18**: Modern React with hooks and functional components
- **TypeScript**: Full type safety and enhanced developer experience
- **Material UI v5**: Component library with custom theming
- **React Router**: Client-side routing for SPA navigation
- **Axios**: HTTP client for API communication

### Backend Integration
- **RESTful APIs**: Clean API design with proper HTTP methods
- **Error Handling**: Comprehensive error responses with validation
- **Authentication**: JWT-based authentication with role-based access
- **Data Validation**: Server-side validation with detailed error messages

### State Management
- **React Hooks**: useState, useEffect for local state management
- **Context API**: Authentication and theme context
- **API Service Layer**: Centralized API calls with error handling
- **Loading States**: Proper loading state management throughout

## Component Structure

```
src/
├── pages/
│   └── AdminUsersPageMUI.tsx          # Main user management page
├── components/admin/
│   ├── UserDetailModalMUI.tsx         # User detail modal with tabs
│   ├── EditUserModalMUI.tsx           # Edit user form modal
│   ├── SendMessageModalEnhanced.tsx   # Individual messaging
│   └── BulkMessageModal.tsx           # Bulk messaging interface
├── theme/
│   └── greenTheme.ts                  # Material UI green theme
├── api/
│   └── adminUserService.ts            # API service layer
└── tests/
    ├── AdminUsersPage.test.tsx        # Component tests
    └── UserManagementIntegration.test.tsx # Integration tests
```

## API Endpoints

### User Management
- `GET /admin/adminusers` - Get all users with pagination and filters
- `GET /admin/adminusers/{id}` - Get specific user details
- `POST /admin/adminusers` - Create new user
- `PUT /admin/adminusers/{id}` - Update user information
- `DELETE /admin/adminusers/{id}` - Delete user
- `PATCH /admin/adminusers/{id}/toggle-status` - Toggle user status

### Statistics & Analytics
- `GET /admin/adminusers/statistics` - Get system statistics
- `GET /admin/adminusers/{id}/statistics` - Get user-specific statistics
- `GET /admin/adminusers/{id}/login-history` - Get user login history
- `GET /admin/adminusers/{id}/activity` - Get user activity timeline

### Messaging
- `POST /admin/adminmessages` - Send message to user
- `GET /admin/adminmessages/user/{id}` - Get user messages
- `PATCH /admin/adminmessages/{id}/read` - Mark message as read

### Advanced Operations
- `GET /admin/adminusers/departments` - Get available departments
- `GET /admin/adminusers/roles` - Get available roles
- `PATCH /admin/adminusers/bulk-status` - Bulk update user status
- `GET /admin/adminusers/export` - Export users to CSV

## Usage Guide

### Accessing User Management
1. Navigate to `/admin/users` (requires Admin role)
2. The page displays user statistics and a searchable user table
3. Use filters to narrow down the user list

### Managing Users
1. **Create User**: Click "Add User" button, fill the form with validation
2. **View Details**: Click the eye icon to see comprehensive user information
3. **Edit User**: Click the edit icon to modify user details
4. **Delete User**: Click the delete icon and confirm the action
5. **Toggle Status**: Click the toggle icon to activate/deactivate users

### Messaging
1. **Individual Message**: Click the message icon next to a user
2. **Bulk Message**: Click "Bulk Message" button, select recipients
3. Choose message type and priority
4. Preview message before sending

### Advanced Features
1. **Export Data**: Click the download icon to export filtered user data
2. **Bulk Operations**: Select multiple users for bulk status updates
3. **Real-time Updates**: Data refreshes automatically after operations

## Security Features

- **Role-based Access**: Only Admin users can access user management
- **Input Validation**: Comprehensive client and server-side validation
- **CSRF Protection**: Protected against cross-site request forgery
- **Audit Trail**: All user management actions are logged
- **Secure Communication**: HTTPS and JWT token authentication

## Performance Optimizations

- **Pagination**: Large user lists are paginated for better performance
- **Lazy Loading**: Components load only when needed
- **Debounced Search**: Search queries are debounced to reduce API calls
- **Caching**: API responses are cached where appropriate
- **Optimistic Updates**: UI updates immediately with rollback on errors

## Testing

### Unit Tests
- Component rendering tests
- User interaction tests
- Form validation tests
- API service tests

### Integration Tests
- End-to-end user workflows
- API integration tests
- Error handling scenarios
- Theme and styling tests

### Running Tests
```bash
npm test                    # Run all tests
npm test -- --watch        # Run tests in watch mode
npm test -- --coverage     # Run tests with coverage report
```

## Troubleshooting

### Common Issues
1. **Access Denied**: Ensure user has Admin role
2. **API Errors**: Check network connection and server status
3. **Form Validation**: Review required fields and format requirements
4. **Theme Issues**: Verify Material UI theme provider is properly configured

### Debug Mode
Enable debug mode by setting `USE_MOCK_DATA = true` in `adminUserService.ts` for development testing.

## Future Enhancements

- **Advanced Filtering**: More sophisticated filter options
- **User Import**: Bulk user import from CSV/Excel files
- **Advanced Analytics**: More detailed user analytics and reports
- **Real-time Notifications**: WebSocket-based real-time updates
- **Mobile App**: Native mobile application for user management
- **API Rate Limiting**: Implement rate limiting for API endpoints

## Support

For technical support or feature requests, please contact the development team or create an issue in the project repository.
