# 🔑 GHL Token Fix Guide

## 🚨 Issue Identified

The error **"HTTP 401 Unauthorized"** with the message **"Please update your IAM config"** indicates that the current GoHighLevel API token is either:
- ❌ **Expired**
- ❌ **Invalid**
- ❌ **Missing proper permissions**
- ❌ **Not properly configured**

## ✅ Solution Implemented

### 1. **Centralized Configuration**
- ✅ **Created `src/config/ghlConfig.js`** - Central location for all GHL settings
- ✅ **Added configuration validation** - Automatic checks for valid settings
- ✅ **Enhanced error handling** - Better error messages and debugging

### 2. **Updated API Integration**
- ✅ **Refactored all API calls** - Now use centralized configuration
- ✅ **Added proper headers** - Consistent authentication across all requests
- ✅ **Enhanced logging** - Better error tracking and debugging

### 3. **Debug Tools Enhanced**
- ✅ **Configuration status** - Shows if GHL config is valid
- ✅ **Token instructions** - Step-by-step guide to get new token
- ✅ **Real-time validation** - Immediate feedback on configuration issues

## 🔧 How to Fix the Token Issue

### **Step 1: Get a New GHL API Token**

1. **Log into your GoHighLevel account**
2. **Navigate to Settings → API → Private App Tokens**
3. **Click "Create New Token"**
4. **Give it a name** (e.g., "Dashboard Integration")
5. **Select the necessary permissions:**
   - ✅ **Tasks: Read, Write**
   - ✅ **Contacts: Read**
   - ✅ **Users: Read**
6. **Copy the generated token**

### **Step 2: Update the Configuration**

1. **Open `src/config/ghlConfig.js`**
2. **Find the token field:**
   ```javascript
   token: 'pit-1dd731f9-e51f-40f7-bf4e-9e8cd31ed75f',
   ```
3. **Replace with your new token:**
   ```javascript
   token: 'your-new-token-here',
   ```
4. **Save the file**

### **Step 3: Test the Fix**

1. **Start the development server:**
   ```bash
   npm run dev
   ```
2. **Navigate to the task management page**
3. **Click the 🐛 debug button**
4. **Check the "GHL Configuration" section**
5. **Run the "Test GHL Connection" test**
6. **Run the "Test Task Creation" test**

## 🎯 Debug Panel Features

### **Configuration Status**
- **Valid/Invalid indicator** - Shows if config is correct
- **Issue details** - Lists specific problems
- **Token preview** - Shows first 20 characters of token
- **Base URL** - Shows the GHL endpoint

### **Test Functions**
- **GHL Connection Test** - Verifies API connectivity
- **Task Creation Test** - Tests task creation specifically
- **Real-time results** - Shows success/failure immediately

### **Fix Instructions**
- **Step-by-step guide** - How to get a new token
- **Permission requirements** - What permissions are needed
- **Configuration steps** - How to update the config file

## 📊 Current Configuration

```javascript
// src/config/ghlConfig.js
export const GHL_CONFIG = {
  baseUrl: 'https://services.leadconnectorhq.com/locations/b7vHWUGVUNQGoIlAXabY',
  token: 'pit-1dd731f9-e51f-40f7-bf4e-9e8cd31ed75f', // ← UPDATE THIS
  version: '2021-07-28',
  locationId: 'b7vHWUGVUNQGoIlAXabY'
};
```

## 🔍 Validation Checks

The system now automatically checks:
- ✅ **Token format** - Valid GHL token format
- ✅ **Base URL** - Valid GHL endpoint
- ✅ **Location ID** - Valid location identifier
- ✅ **Required permissions** - Proper API access

## 🚀 Expected Results After Fix

### **Before Fix:**
```
❌ GHL Configuration: Invalid
❌ GHL Connection Test: FAILED (401 Unauthorized)
❌ Task Creation Test: FAILED (401 Unauthorized)
```

### **After Fix:**
```
✅ GHL Configuration: Valid
✅ GHL Connection Test: SUCCESS
✅ Task Creation Test: SUCCESS
```

## 📞 Troubleshooting

### **If Still Getting 401 Errors:**
1. **Verify token is copied correctly** - No extra spaces or characters
2. **Check token permissions** - Ensure Tasks Read/Write is enabled
3. **Verify location ID** - Make sure it matches your GHL location
4. **Check token expiration** - Generate a new token if needed

### **If Getting Different Errors:**
1. **Check network connectivity** - Ensure internet connection
2. **Verify GHL service status** - Check if GHL is experiencing issues
3. **Review API documentation** - Check for any recent changes

## 🎯 Next Steps

1. **Get a new GHL API token** following the instructions above
2. **Update the configuration file** with the new token
3. **Test the connection** using the debug panel
4. **Try creating a task** through the normal UI
5. **Monitor for any remaining issues**

The application is now properly configured to handle GHL authentication and will provide clear feedback on any configuration issues! 🚀 