# 🛠️ CAFM System - Troubleshooting Guide

## 🎯 **GUARANTEED LOCALHOST:5173 SETUP**

Your CAFM system is configured to **ALWAYS** run on `localhost:5173`. If you're experiencing issues, follow this guide.

---

## 🚀 **Quick Fix - 99% of Issues**

1. **Close all browser tabs** with localhost:5173
2. **Close both command windows** (backend and frontend)
3. **Double-click** `🎯 SUPER-RELIABLE-START.bat`
4. **Wait 30 seconds** for everything to start
5. **Open** http://localhost:5173

---

## 🔍 **Common Issues & Solutions**

### ❌ **Issue: "Port 5173 is already in use"**
**Solution:**
```bash
# Kill any process using port 5173
netstat -ano | findstr :5173
taskkill /PID [PID_NUMBER] /F
```
Then restart using the bat file.

### ❌ **Issue: "Cannot connect to backend"**
**Solution:**
1. Check if backend window is open and running
2. Look for "Backend API will be available at: http://localhost:5000"
3. If not running, close frontend and restart both

### ❌ **Issue: "Page won't load"**
**Solution:**
1. Clear browser cache (Ctrl+Shift+Delete)
2. Try incognito/private mode
3. Check if you're going to http://localhost:5173 (not https)

### ❌ **Issue: "Login doesn't work"**
**Solution:**
1. Ensure backend is running (check command window)
2. Try these test accounts:
   - admin@cafm.com / Admin123!
   - user@cafm.com / Password123!

---

## 🔧 **Port Configuration (LOCKED)**

- **Frontend**: localhost:5173 (NEVER CHANGES)
- **Backend**: localhost:5000 (NEVER CHANGES)
- **API**: localhost:5000/api (NEVER CHANGES)

---

## 📋 **Startup Checklist**

✅ Node.js installed (check: `node --version`)
✅ npm available (check: `npm --version`)
✅ Backend executable exists: `CAFMSystem.API\bin\Debug\net9.0\CAFMSystem.API.exe`
✅ Frontend files exist: `cafm-system-frontend\package.json`
✅ No other apps using port 5173
✅ No other apps using port 5000

---

## 🆘 **Emergency Reset**

If nothing works:

1. **Kill all processes:**
   ```bash
   taskkill /F /IM node.exe
   taskkill /F /IM CAFMSystem.API.exe
   ```

2. **Clear npm cache:**
   ```bash
   cd cafm-system-frontend
   npm cache clean --force
   ```

3. **Reinstall dependencies:**
   ```bash
   cd cafm-system-frontend
   rmdir /s node_modules
   npm install
   ```

4. **Restart everything:**
   Double-click `🎯 SUPER-RELIABLE-START.bat`

---

## 📞 **Still Having Issues?**

1. Check both command windows for error messages
2. Look at browser console (F12) for JavaScript errors
3. Verify you're using the correct URLs:
   - Frontend: http://localhost:5173
   - Backend: http://localhost:5000
   - API Docs: http://localhost:5000/swagger

---

## 💡 **Pro Tips**

- **Always use the bat files** - don't start manually
- **Keep both command windows open** while using the app
- **Use incognito mode** if you see caching issues
- **Wait for "System is now LIVE"** message before opening browser
- **Your app will ALWAYS be on localhost:5173** - bookmark it!

---

## 🎉 **Success Indicators**

You know everything is working when:
- ✅ Browser opens to http://localhost:5173
- ✅ You see the CAFM login page
- ✅ Backend window shows "Backend API will be available"
- ✅ Frontend window shows "Local: http://localhost:5173"
- ✅ You can login with admin@cafm.com / Admin123!

---

**Remember: Your CAFM system is designed to be bulletproof and always run on localhost:5173!**
