# Vercel Deployment Guide

## Project Structure
- `/backend` - Node.js/Express API (Separate Vercel Project)
- `/frontend` - React/Create React App (Separate Vercel Project)

## Backend Deployment Configuration

### 1. vercel.json Configuration ✅
```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "server.js"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
```

### 2. CORS Configuration ✅
Backend server.js already configured to accept:
- All `.vercel.app` domains
- Production frontend URL from `FRONTEND_URL` env var
- Local development URLs

### 3. Backend Environment Variables (Required in Vercel Dashboard)

#### Database Configuration
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/lab_appointment?retryWrites=true&w=majority
```

#### Email Configuration (Gmail SMTP)
```
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-gmail-app-password
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
```

#### Authentication & Security
```
JWT_SECRET=your-super-secret-jwt-key-min-32-characters
NODE_ENV=production
FRONTEND_URL=https://your-frontend-domain.vercel.app
```

#### reCAPTCHA (if used)
```
RECAPTCHA_SITE_KEY=your-recaptcha-site-key
RECAPTCHA_SECRET_KEY=your-recaptcha-secret-key
```

#### Razorpay Payment (if used)
```
RAZORPAY_KEY_ID=your-razorpay-key-id
RAZORPAY_KEY_SECRET=your-razorpay-secret-key
```

## Frontend Deployment Configuration

### 1. vercel.json Configuration ✅
```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "build"
      }
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
```

### 2. API Configuration ✅
All frontend files updated to use:
- `process.env.VITE_API_URL` (Vite/Production)
- `process.env.REACT_APP_API_URL` (Create React App/Development)
- Fallback to `http://localhost:5001` (Local)

### 3. Frontend Environment Variables (Required in Vercel Dashboard)
```
VITE_API_URL=https://your-backend-domain.vercel.app
```

## Deployment Steps

### Step 1: Deploy Backend
1. Create a new GitHub repository for the `backend` folder only
2. Connect the repository to Vercel
3. Add all backend environment variables in Vercel dashboard
4. Deploy and note the backend URL

### Step 2: Deploy Frontend
1. Create a new GitHub repository for the `frontend` folder only
2. Connect the repository to Vercel
3. Add `VITE_API_URL` pointing to your deployed backend URL
4. Deploy and note the frontend URL

### Step 3: Update Backend CORS
1. Go back to your backend Vercel project
2. Update the `FRONTEND_URL` environment variable with your frontend URL
3. Redeploy backend

## Important Notes

### Gmail App Password Setup
1. Enable 2-Factor Authentication on your Gmail account
2. Go to: https://myaccount.google.com/apppasswords
3. Generate an App Password for "Mail"
4. Use the 16-character app password instead of your regular password
5. Update `EMAIL_PASS` in backend environment variables

### MongoDB Atlas Setup
1. Create a free MongoDB Atlas cluster
2. Add your Vercel backend IP to whitelist (0.0.0.0/0 for all IPs)
3. Get the connection string and update `MONGODB_URI`

### Testing
1. Test backend health endpoint: `https://your-backend.vercel.app/health`
2. Test frontend loads and connects to backend APIs
3. Test user registration, login, and booking functionality

## Troubleshooting

### Common Issues
1. **CORS Errors**: Ensure `FRONTEND_URL` is correctly set in backend
2. **Database Connection**: Verify `MONGODB_URI` is correct and IP is whitelisted
3. **Email Failures**: Use Gmail App Password, not regular password
4. **Build Failures**: Check that all environment variables are set

### Debug Mode
Set `NODE_ENV=development` in backend to see detailed error logs

## File Structure After Deployment

```
your-project/
├── backend/          # Deployed to backend.vercel.app
│   ├── server.js
│   ├── vercel.json
│   └── ... (all backend files)
└── frontend/         # Deployed to frontend.vercel.app
    ├── src/
    ├── package.json
    ├── vercel.json
    └── ... (all frontend files)
```

## Security Considerations

1. Never commit `.env` files to Git
2. Use strong, unique secrets for `JWT_SECRET`
3. Restrict MongoDB access to specific IPs when possible
4. Use HTTPS URLs in production
5. Regularly rotate secrets and passwords
