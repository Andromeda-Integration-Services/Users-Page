# 🔒 Role-Based Ticket Access Control System

## Overview

The CAFM System now implements **assignment-based ticket visibility** with proper role-based access control. This ensures that service providers only see tickets that are specifically assigned to them, providing better security and reducing information overload.

## 🎯 Key Features

### ✅ **Assignment-Based Visibility**
- Service providers see only tickets **assigned to them specifically**
- No more category-based visibility (old system showed ALL plumbing tickets to ALL plumbers)
- Clean separation of responsibilities

### ✅ **Secure Access Control**
- Real-time, backend-driven filtering
- Production-ready security implementation
- Optimized database queries with proper indexing

### ✅ **Role-Based Permissions**
- **Admin**: Full access to all tickets + assignment capabilities
- **AssetManager**: Full access to all tickets + assignment capabilities  
- **Service Providers** (Plumber/Electrician/Cleaner): Own created tickets + assigned tickets only
- **EndUser**: Only tickets they created

## 🔧 Technical Implementation

### **Backend Services**

#### **ITicketAccessService**
```csharp
public interface ITicketAccessService
{
    IQueryable<Ticket> ApplyAccessFilter(IQueryable<Ticket> query, string currentUserId, IList<string> userRoles);
    bool CanViewTicket(Ticket ticket, string currentUserId, IList<string> userRoles);
    bool CanUpdateTicket(Ticket ticket, string currentUserId, IList<string> userRoles);
    bool CanAssignTickets(IList<string> userRoles);
}
```

#### **TicketAccessService Implementation**
- **Modular design** for easy maintenance
- **Performance optimized** with efficient LINQ queries
- **Security-first approach** with explicit permission checks

### **API Endpoints**

#### **New UPDATE Endpoint**
```
PUT /api/tickets/{id}
```
- Role-based update permissions
- Assignment validation
- Audit trail support

#### **Enhanced GET Endpoints**
```
GET /api/tickets          - List with access filtering
GET /api/tickets/{id}     - Individual ticket with access check
```

## 🛡️ Access Control Matrix

| Role | View Own Created | View Assigned | View All | Assign Tickets | Update Tickets |
|------|------------------|---------------|----------|----------------|----------------|
| **Admin** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **AssetManager** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Plumber** | ✅ | ✅ | ❌ | ❌ | ✅ (Limited) |
| **Electrician** | ✅ | ✅ | ❌ | ❌ | ✅ (Limited) |
| **Cleaner** | ✅ | ✅ | ❌ | ❌ | ✅ (Limited) |
| **EndUser** | ✅ | ❌ | ❌ | ❌ | ✅ (Own only) |

## 📋 Usage Examples

### **Scenario 1: Material Request for Plumber**
1. **Person A** creates a material request for plumbing supplies
2. **Admin/AssetManager** assigns the ticket to **Plumber B**
3. **Visibility**:
   - ✅ **Person A** can see it (creator)
   - ✅ **Plumber B** can see it (assigned)
   - ✅ **Admin** can see it (full access)
   - ❌ **Other plumbers** cannot see it
   - ❌ **Electricians/Cleaners** cannot see it

### **Scenario 2: Service Request Assignment**
1. **Person A** creates a service request for electrical work
2. **Admin** assigns it to **Electrician C**
3. **Visibility**:
   - ✅ **Person A** can see it (creator)
   - ✅ **Electrician C** can see it (assigned)
   - ✅ **Admin** can see it (full access)
   - ❌ **Other electricians** cannot see it
   - ❌ **Plumbers/Cleaners** cannot see it

## 🧪 Testing

### **Test Data Setup**
Run the test script to create sample tickets:
```sql
-- Execute Test-Role-Based-Access-Control.sql
```

### **API Testing**
1. **Login as different users** to get JWT tokens
2. **Call GET /api/tickets** with each token
3. **Verify filtering** works correctly
4. **Test assignment** with Admin/AssetManager tokens
5. **Test update permissions** with different roles

### **Expected Results**
- **Plumber**: Only sees tickets assigned to them + their created tickets
- **Electrician**: Only sees tickets assigned to them + their created tickets  
- **Cleaner**: Only sees tickets assigned to them + their created tickets
- **EndUser**: Only sees tickets they created
- **Admin**: Sees all tickets

## 🚀 Deployment Considerations

### **Database Performance**
- Indexes on `AssignedToId` and `CreatedById` for fast filtering
- Optimized queries with proper JOIN strategies

### **Security**
- All access checks performed server-side
- No client-side filtering dependencies
- Proper authorization on all endpoints

### **Scalability**
- Service-based architecture for easy extension
- Clean separation of concerns
- Efficient query patterns

## 🔄 Migration from Old System

### **Before (Category-Based)**
```csharp
// OLD: All plumbers saw ALL plumbing tickets
query = query.Where(t => t.Category == TicketCategory.Plumbing);
```

### **After (Assignment-Based)**
```csharp
// NEW: Plumbers only see tickets assigned to them
query = query.Where(t => t.AssignedToId == currentUserId || t.CreatedById == currentUserId);
```

## 📝 Frontend Updates

### **Updated Visibility Messages**
- **Service Providers**: "You can see tickets you created + tickets specifically assigned to you"
- **Admin**: "You can see ALL tickets in the system and assign them to service providers"

### **Assignment Interface**
- Only Admin/AssetManager can assign tickets
- Proper validation and error handling
- Real-time updates after assignment

## 🎯 Benefits

1. **Enhanced Security**: Proper access isolation between service providers
2. **Reduced Noise**: Service providers only see relevant tickets
3. **Better Performance**: Optimized queries with targeted filtering
4. **Scalable Design**: Clean architecture for future enhancements
5. **Production Ready**: Comprehensive error handling and logging

## 🔧 Configuration

The system is configured automatically through dependency injection:
```csharp
// Program.cs
builder.Services.AddScoped<ITicketAccessService, TicketAccessService>();
```

No additional configuration required - the system works out of the box with proper role-based security.
