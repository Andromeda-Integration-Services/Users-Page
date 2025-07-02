# 🚀 How to Run Your CAFM Project - Step by Step Guide

## 🎯 **SUPER EASY METHOD (Recommended)**

### **Option 1: One-Click Startup**
1. **Double-click** `start-project.bat` in your project folder
2. **Wait** for both services to start (about 10-15 seconds)
3. **Open your browser** and go to:
   - Frontend: http://localhost:5173 (GUARANTEED)
   - Backend API: http://localhost:5000 (FIXED)

That's it! ✅

---

## 🔧 **Manual Method (If you prefer step-by-step)**

### **Step 1: Start the Backend**
1. **Double-click** `start-backend.bat`
2. **Wait** until you see "Now listening on: http://localhost:5000"
3. **Keep this window open** (don't close it)

### **Step 2: Start the Frontend**
1. **Double-click** `start-frontend.bat`
2. **Wait** until you see "Local: http://localhost:5173/"
3. **Keep this window open** (don't close it)

### **Step 3: Open in Browser**
1. **Open your browser**
2. **Go to**: http://localhost:5173

---

## 🧪 **Test Login Credentials**

Use these test accounts to login:

### **Admin User**
- **Email**: `admin@cafm.com`
- **Password**: `Admin123!`

### **Other Test Users**
- **Asset Manager**: `assetmanager@cafm.com` / `AssetManager123!`
- **Plumber**: `plumber@cafm.com` / `Plumber123!`
- **Electrician**: `electrician@cafm.com` / `Electrician123!`
- **Cleaner**: `cleaner@cafm.com` / `Cleaner123!`
- **End User**: `user@cafm.com` / `EndUser123!`

---

## 🛑 **How to Stop the Project**

### **Easy Way:**
- **Close** the command windows that opened
- **Close** your browser tabs

### **If Something Gets Stuck:**
1. **Press** `Ctrl + C` in the command windows
2. **Close** the command windows
3. **Restart** using the batch files

---

## 🔍 **Troubleshooting**

### **Problem: "Port already in use"**
**Solution:**
1. Close all command windows
2. Wait 10 seconds
3. Run `start-project.bat` again

### **Problem: "Cannot connect to backend"**
**Solution:**
1. Make sure backend started first
2. Check that you see "Now listening on: http://localhost:5000"
3. Try refreshing your browser

### **Problem: "npm install fails"**
**Solution:**
1. Open command prompt as Administrator
2. Run: `cd cafm-system-frontend`
3. Run: `npm install --legacy-peer-deps --force`

### **Problem: "Database errors"**
**Solution:**
- The database is automatically created
- If issues persist, delete `cafm_system.db` file and restart

---

## 📁 **Project Structure**

```
Your Project Folder/
├── start-project.bat          ← Double-click this to start everything
├── start-backend.bat          ← Backend only
├── start-frontend.bat         ← Frontend only
├── CAFMSystem.API/            ← Backend files
└── cafm-system-frontend/      ← Frontend files
```

---

## 🎯 **Quick Reference URLs**

- **Frontend (Main App)**: http://localhost:5173 (GUARANTEED)
- **Login Page**: http://localhost:5173/login
- **Registration**: http://localhost:5173/register
- **Auth Test Page**: http://localhost:5173/auth-test
- **Backend API**: http://localhost:5000 (FIXED)
- **API Documentation**: http://localhost:5000/swagger
- **API Roles**: http://localhost:5000/api/auth/roles

---

## 💡 **Pro Tips**

1. **Always start backend first**, then frontend
2. **Keep both command windows open** while using the app
3. **Use the batch files** - they handle everything automatically
4. **Bookmark** http://localhost:5173 in your browser
5. **Test with admin@cafm.com** first to make sure everything works

---

## 🆘 **Still Having Issues?**

1. **Check** that both command windows are running
2. **Verify** URLs in browser address bar
3. **Try** the auth test page: http://localhost:5173/auth-test
4. **Restart** everything using the batch files
