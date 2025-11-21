# Deployment Guide

## Local Setup (Development)

### Prerequisites
- Node.js v14+ and npm

### Backend Setup

```bash
cd backend
npm install
npm run dev
```

Server will run on http://localhost:5000

### Frontend Setup

```bash
cd frontend
npm install
npm start
```

Application will open at http://localhost:3000

---

## Deployment to Production

### Option 1: Deploy Backend to Render

1. **Create Render Account**
   - Go to https://render.com
   - Sign up and verify email

2. **Create New Web Service**
   - Click "New +"
   - Select "Web Service"
   - Connect your GitHub repository

3. **Configure Service**
   - Name: `inventory-backend`
   - Environment: `Node`
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Instance Type: Free

4. **Set Environment Variables**
   - PORT: `5000`
   - NODE_ENV: `production`

5. **Deploy**
   - Click "Create Web Service"
   - Note the URL (e.g., `https://inventory-backend.onrender.com`)

### Option 2: Deploy Backend to Railway

1. **Create Railway Account**
   - Go to https://railway.app
   - Sign up with GitHub

2. **New Project**
   - Click "New Project"
   - Select "Deploy from GitHub"
   - Select your repository

3. **Configure Backend**
   - Select `backend` directory in deploy settings
   - Add environment variables:
     - PORT: `5000`
     - NODE_ENV: `production`

4. **Deploy**
   - Railway will automatically deploy
   - Get your deployed URL from Dashboard

### Frontend Deployment to Netlify

1. **Create Netlify Account**
   - Go to https://netlify.com
   - Sign up with GitHub

2. **New Site**
   - Click "Add new site"
   - Select "Import an existing project"
   - Connect GitHub repository

3. **Configure Build**
   - Base directory: `frontend`
   - Build command: `npm run build`
   - Publish directory: `build`
   - Environment variables:
     ```
     REACT_APP_API_URL=https://your-backend-url/api
     ```

4. **Deploy**
   - Netlify will build and deploy
   - Your site URL will be shown

### Frontend Deployment to Vercel

1. **Create Vercel Account**
   - Go to https://vercel.com
   - Sign up with GitHub

2. **Import Project**
   - Click "Add New..."
   - Select "Project"
   - Import your GitHub repository

3. **Configure Project**
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `build`
   - Environment variables:
     ```
     REACT_APP_API_URL=https://your-backend-url/api
     ```

4. **Deploy**
   - Vercel will deploy automatically
   - Your site URL will be shown

---

## Database Deployment

Since we're using SQLite, the database is file-based. For production:

### Option A: SQLite with Persistent Volumes (Recommended for small apps)

**Render**:
- SQLite works as-is (file is preserved)
- Data persists between deployments

**Railway**:
- Use SQLite Starter Plan
- Or connect PostgreSQL for scalability

### Option B: Migrate to PostgreSQL (For scalability)

If you need better performance, migrate to PostgreSQL:

1. Install `pg` package
2. Update database connection in `backend/database.js`
3. Update database initialization queries
4. Most queries are compatible (SQL syntax)

---

## Environment Variables Checklist

### Backend
```
NODE_ENV=production
PORT=5000
```

### Frontend
```
REACT_APP_API_URL=https://your-deployed-backend/api
```

---

## Testing Deployed Application

1. **Test Backend**
   ```bash
   curl https://your-backend-url/health
   # Should return: {"status":"Backend is running"}
   ```

2. **Test Frontend**
   - Open https://your-frontend-url
   - Try adding a product
   - Try importing sample CSV
   - Check inventory history

---

## Troubleshooting Deployment

### Backend Won't Start
- Check `npm start` command in package.json
- Verify database initialization
- Check console logs for errors

### Frontend Shows Blank Page
- Check browser console for errors
- Verify `REACT_APP_API_URL` is set correctly
- Ensure backend is running and accessible

### API Calls Failing
- Check CORS is enabled in backend
- Verify backend URL in `.env`
- Check network tab in browser DevTools

### Database Connection Issues
- For SQLite: ensure file permissions are correct
- For PostgreSQL: verify connection string in .env

---

## Performance Optimization

### Backend
1. Add caching headers
2. Implement pagination (already done)
3. Add database indexes on frequently searched fields
4. Consider Redis for session management

### Frontend
1. Implement code splitting
2. Lazy load components
3. Optimize images
4. Enable gzip compression

---

## Security Checklist

- [ ] Update dependencies regularly (`npm audit`)
- [ ] Use HTTPS in production
- [ ] Set CORS to specific domains
- [ ] Add rate limiting middleware
- [ ] Validate all user inputs
- [ ] Hash passwords if authentication is added
- [ ] Use environment variables for secrets
- [ ] Enable HTTPS redirect

---

## Monitoring and Logs

### Render/Railway
- Check "Logs" tab for application logs
- Monitor resource usage
- Set up email alerts for crashes

### Netlify/Vercel
- Check "Analytics" for frontend performance
- Monitor build logs
- Set up Slack notifications

---

## Backup and Restore

For SQLite database:
1. Regularly download `inventory.db` from production
2. Keep backups locally
3. Test restore process regularly

For PostgreSQL:
1. Set up automated daily backups
2. Use database provider's backup service
3. Test restore procedure

---

## Domain Setup (Optional)

1. Purchase domain from registrar
2. Update DNS records to point to:
   - Frontend hosting provider's nameservers
   - Backend hosting provider's nameservers (if needed)
3. Enable SSL/TLS certificate (usually automatic)

---

## Support and Help

- **Render Support**: https://render.com/support
- **Railway Support**: https://railway.app/docs
- **Netlify Support**: https://docs.netlify.com
- **Vercel Support**: https://vercel.com/support

---

**Last Updated**: November 2025
