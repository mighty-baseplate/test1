# 🚀 Deployment Guide

This guide covers various deployment options for the Roleplay Chat Simulator.

## 📋 Prerequisites

Before deploying, ensure you have:
- Google Gemini API key
- (Optional) Kokoro TTS Docker setup
- Environment variables configured

## 🌐 Vercel Deployment (Recommended)

Vercel provides the easiest deployment experience with automatic builds and deployments.

### Step 1: Prepare Your Repository

1. Push your code to GitHub, GitLab, or Bitbucket
2. Ensure your `.env.example` file is included (but not `.env`)

### Step 2: Deploy to Vercel

1. Visit [vercel.com](https://vercel.com) and sign up
2. Click "New Project" and import your repository
3. Configure environment variables:
   ```
   VITE_GEMINI_API_KEY=your_actual_api_key
   VITE_API_PROVIDER=gemini
   VITE_APP_NAME=Roleplay Chat Simulator
   ```
4. Deploy!

### Step 3: Custom Domain (Optional)

1. Go to your project settings in Vercel
2. Add your custom domain
3. Configure DNS records as instructed

**Live Demo**: Your app will be available at `https://your-project.vercel.app`

## 🚀 Netlify Deployment

### Option 1: Git Integration

1. Push your code to a Git repository
2. Go to [netlify.com](https://netlify.com) and sign up
3. Click "New site from Git"
4. Select your repository
5. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
6. Add environment variables in Site settings > Environment variables

### Option 2: Manual Deploy

1. Build your project locally:
   ```bash
   npm run build
   ```
2. Drag and drop the `dist` folder to Netlify

## 🐳 Docker Deployment

### Local Docker

1. **Build the image:**
   ```bash
   docker build -t roleplay-chat .
   ```

2. **Run the container:**
   ```bash
   docker run -p 3000:3000 roleplay-chat
   ```

3. **Access the app:**
   Open `http://localhost:3000`

### Docker Compose (with TTS)

1. **Start all services:**
   ```bash
   docker-compose up --build
   ```

2. **Access the app:**
   - Main app: `http://localhost:3000`
   - TTS service: `http://localhost:8080`

### Production Docker

For production deployment with Docker:

1. **Create production environment file:**
   ```bash
   cp .env.example .env.production
   # Edit .env.production with your production values
   ```

2. **Build production image:**
   ```bash
   docker build -t roleplay-chat:production --target production .
   ```

3. **Run with production config:**
   ```bash
   docker run -p 80:3000 --env-file .env.production roleplay-chat:production
   ```

## ☁️ Cloud Platform Deployment

### AWS (Amazon Web Services)

#### Option 1: AWS Amplify
1. Connect your Git repository to AWS Amplify
2. Configure build settings and environment variables
3. Deploy automatically on git push

#### Option 2: AWS S3 + CloudFront
1. Build your project: `npm run build`
2. Upload `dist` folder to S3 bucket
3. Configure CloudFront distribution
4. Set up custom domain with Route 53

#### Option 3: AWS ECS (Docker)
1. Push Docker image to ECR
2. Create ECS task definition
3. Deploy to ECS cluster

### Google Cloud Platform

#### Option 1: Firebase Hosting
1. Install Firebase CLI: `npm install -g firebase-tools`
2. Login: `firebase login`
3. Initialize: `firebase init hosting`
4. Build: `npm run build`
5. Deploy: `firebase deploy`

#### Option 2: Google Cloud Run (Docker)
1. Build and push image to Google Container Registry
2. Deploy to Cloud Run
3. Configure custom domain

### Microsoft Azure

#### Azure Static Web Apps
1. Connect your GitHub repository
2. Configure build settings
3. Add environment variables
4. Deploy automatically

## 🔧 Environment Configuration

### Required Environment Variables

```bash
# Required
VITE_GEMINI_API_KEY=your_gemini_api_key

# Optional
VITE_KOKORO_TTS_URL=http://localhost:8080
VITE_API_PROVIDER=gemini
VITE_APP_NAME=Roleplay Chat Simulator
```

### Platform-Specific Settings

#### Vercel
- Add variables in Project Settings > Environment Variables
- Prefix with `VITE_` for client-side access

#### Netlify
- Add in Site settings > Environment variables
- No special configuration needed

#### Docker
- Use `.env` file or `--env-file` flag
- Pass individual variables with `-e` flag

## 🔒 Security Considerations

### API Keys
- Never commit API keys to version control
- Use environment variables on all platforms
- Rotate keys regularly
- Monitor API usage

### CORS Configuration
- Configure allowed origins for production
- Restrict to your domain only
- Update API service CORS settings

### Content Security Policy
- Review and update CSP headers
- Allow necessary external resources
- Block unauthorized scripts

## 📊 Monitoring & Analytics

### Performance Monitoring
- Set up Vercel Analytics or similar
- Monitor Core Web Vitals
- Track API response times

### Error Tracking
- Integrate Sentry or similar service
- Monitor JavaScript errors
- Track API failures

### Usage Analytics
- Google Analytics 4
- Plausible Analytics (privacy-focused)
- Custom analytics solution

## 🚀 CI/CD Pipeline

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Vercel
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

## 🔍 Troubleshooting

### Common Deployment Issues

1. **Build Fails**
   - Check Node.js version compatibility
   - Verify all dependencies are installed
   - Review build logs for specific errors

2. **Environment Variables Not Working**
   - Ensure variables are prefixed with `VITE_`
   - Check platform-specific configuration
   - Verify variables are set correctly

3. **Routing Issues**
   - Configure rewrites for SPA routing
   - Check `vercel.json` or equivalent config
   - Ensure history API fallback is enabled

4. **API Calls Failing**
   - Verify CORS configuration
   - Check API key validity
   - Review network policies

### Performance Optimization

1. **Bundle Size**
   - Analyze with `npm run build -- --analyze`
   - Implement code splitting
   - Remove unused dependencies

2. **Loading Speed**
   - Enable compression (gzip/brotli)
   - Optimize images and assets
   - Use CDN for static assets

3. **Caching Strategy**
   - Configure proper cache headers
   - Use service worker for offline support
   - Implement API response caching

## 📈 Scaling Considerations

### Traffic Growth
- Monitor usage patterns
- Plan for API rate limits
- Consider CDN implementation

### Feature Expansion
- Modular architecture supports growth
- Database integration for user accounts
- Multi-language support

### Cost Management
- Monitor API usage costs
- Implement usage quotas
- Optimize API calls

---

**Need help with deployment? Check the troubleshooting section or open an issue on GitHub!**