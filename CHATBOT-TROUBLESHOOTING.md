# 🔧 CHATBOT TROUBLESHOOTING GUIDE

## 🚨 **FIXING THE 400 ERROR**

The chatbot is showing a "Request failed with status code 400" error. Let's fix this step by step!

---

## 🔍 **DIAGNOSIS STEPS**

### **Step 1: Check User Authentication**
1. **Open Browser Developer Tools** (F12)
2. **Go to Application/Storage tab**
3. **Check localStorage** for:
   - `token` - Should contain JWT token
   - `user` - Should contain user object with `id` field

### **Step 2: Verify API Connection**
1. **Open Network tab** in Developer Tools
2. **Try creating a ticket via chatbot**
3. **Look for the POST request** to `/api/tickets`
4. **Check the request payload** and response

### **Step 3: Test API Directly**
Use the **🧪 Test API** button in the chatbot to test the connection.

---

## 🛠️ **COMMON FIXES**

### **Fix 1: User ID Issue**
The most common cause is incorrect user ID format.

**Check in browser console:**
```javascript
// Check what's stored
console.log('Token:', localStorage.getItem('token'));
console.log('User:', JSON.parse(localStorage.getItem('user')));
```

**Expected user object:**
```json
{
  "id": "user-guid-here",
  "email": "user@cafm.com",
  "firstName": "John",
  "lastName": "Doe"
}
```

### **Fix 2: Re-login**
If user data is corrupted:
1. **Logout** from the system
2. **Clear browser storage** (F12 → Application → Clear Storage)
3. **Login again** with valid credentials
4. **Test chatbot** again

### **Fix 3: Backend Validation**
The backend expects these required fields:
- `title` (min 5 chars, max 200)
- `description` (min 10 chars, max 2000)
- `location` (max 200 chars)
- `priority` (1-5)
- `requestedByUserId` (valid user GUID)

---

## 🧪 **TESTING PROCEDURE**

### **Test 1: Manual API Test**
```javascript
// Run in browser console after login
const testTicket = {
  title: "Test Ticket from Console",
  description: "This is a test ticket created from browser console to verify API",
  location: "Test Location",
  priority: 2,
  requestedByUserId: JSON.parse(localStorage.getItem('user')).id
};

fetch('http://localhost:5000/api/tickets', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  },
  body: JSON.stringify(testTicket)
})
.then(response => response.json())
.then(data => console.log('Success:', data))
.catch(error => console.error('Error:', error));
```

### **Test 2: Chatbot Test**
1. **Open chatbot**
2. **Type**: "help"
3. **Click**: "🧪 Test API" button
4. **Check console** for detailed logs

### **Test 3: Natural Language Test**
1. **Type**: "AC broken in room 101"
2. **Check if** issue detection works
3. **Try creating** the ticket

---

## 🔧 **BACKEND FIXES**

### **Check Backend Logs**
Look for these in the API console:
```
Creating ticket for user: {UserId}
Ticket created successfully with ID: {TicketId}
```

### **Common Backend Issues**
1. **Database connection** - Check connection string
2. **User not found** - Verify user exists in database
3. **Validation errors** - Check model validation

---

## 🎯 **ENHANCED ERROR HANDLING**

The chatbot now provides better error messages:

- **400 Error**: "Invalid ticket data. Please check your input and try again."
- **401 Error**: "Please log in again to create tickets."
- **500 Error**: "Server error. Please try again in a moment."
- **Network Error**: "Network connection issue. Please check your connection."

---

## 🚀 **QUICK FIXES**

### **Fix 1: Clear and Re-login**
```javascript
// Run in browser console
localStorage.clear();
// Then login again
```

### **Fix 2: Check User Object Structure**
```javascript
// Check user object
const user = JSON.parse(localStorage.getItem('user'));
console.log('User ID:', user.id || user.userId);
console.log('User object:', user);
```

### **Fix 3: Verify Token**
```javascript
// Check token validity
const token = localStorage.getItem('token');
console.log('Token exists:', !!token);
console.log('Token length:', token?.length);
```

---

## 📋 **VALIDATION CHECKLIST**

Before creating tickets, ensure:

- ✅ **User is logged in** (token exists)
- ✅ **User object has ID** (user.id or user.userId)
- ✅ **Backend is running** (localhost:5000)
- ✅ **Frontend is running** (localhost:5173)
- ✅ **Database is connected** (check backend logs)
- ✅ **CORS is configured** (backend allows frontend origin)

---

## 🎊 **SUCCESS INDICATORS**

When working correctly, you should see:

1. **Console logs**: "Creating ticket with request: {...}"
2. **Network request**: POST to `/api/tickets` with 201 response
3. **Success message**: "🎉 Ticket Created Successfully!"
4. **Real ticket ID**: Shows actual database ID
5. **Navigation links**: "View Ticket" button works

---

## 🆘 **EMERGENCY FALLBACK**

If chatbot still doesn't work:

1. **Use Manual Form**: Click "Use Manual Form" button
2. **Direct Navigation**: Go to `/tickets/new`
3. **Check Regular Form**: Verify normal ticket creation works
4. **Contact Support**: Check backend logs for detailed errors

---

**Remember**: The chatbot is designed to gracefully handle errors and provide fallback options. Users can always use the manual form if the API integration fails!

---

*Last Updated: $(Get-Date)*
*Status: 🔧 TROUBLESHOOTING ACTIVE*
