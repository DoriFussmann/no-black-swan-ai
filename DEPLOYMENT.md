# NBS AI Site - Deployment Guide

## 🚀 Quick Start

### Local Development
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Access at http://localhost:3000
```

### Production Build
```bash
# Create production build
npm run build

# Start production server
npm start
```

## 🌐 Deployment Options

### 1. Vercel (Recommended)

**Why Vercel?**
- Built by Next.js creators
- Zero configuration
- Automatic deployments
- Global CDN
- Custom domains
- SSL certificates

**Steps:**
1. Install Vercel CLI: `npm install -g vercel`
2. Run: `vercel`
3. Follow prompts
4. Your site will be live at a URL like: `https://nbs-ai-site.vercel.app`

**Automatic Deployments:**
- Connect your GitHub repository to Vercel
- Every push to main branch triggers automatic deployment

### 2. Netlify

**Steps:**
1. Build project: `npm run build`
2. Go to [netlify.com](https://netlify.com)
3. Drag and drop the `.next` folder
4. Your site will be live immediately

**GitHub Integration:**
1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set publish directory: `.next`
4. Automatic deployments on every push

### 3. Railway

**Steps:**
1. Go to [railway.app](https://railway.app)
2. Connect your GitHub repository
3. Railway auto-detects Next.js
4. Deploys automatically

### 4. DigitalOcean App Platform

**Steps:**
1. Connect GitHub repository
2. Set build command: `npm run build`
3. Set start command: `npm start`
4. Deploy

## 🔧 Environment Variables

If you need environment variables, create a `.env.local` file:

```env
# Example environment variables
NEXT_PUBLIC_API_URL=https://api.example.com
DATABASE_URL=your_database_url
```

## 📁 Project Structure

```
nbs-ai-site/
├── app/                    # Next.js 13+ app directory
│   ├── page.tsx           # Home page
│   ├── layout.tsx         # Root layout
│   ├── globals.css        # Global styles
│   ├── business-plan-composer/
│   ├── financial-model-builder/
│   ├── fpa-tools/
│   ├── investors-vault/
│   ├── presentation-creator/
│   └── valuation-tools/
├── public/                # Static assets
├── package.json           # Dependencies and scripts
├── next.config.ts         # Next.js configuration
└── tailwind.config.js     # Tailwind CSS configuration
```

## 🎨 Features

Your NBS AI site includes:

- **Business Plan Composer** - Interactive business plan creation
- **Financial Model Builder** - Excel-like financial modeling
- **FPA Tools** - Financial planning and analysis
- **Investors Vault** - Investor-focused tools
- **Presentation Creator** - AI-powered presentation generation
- **Valuation Tools** - Football field valuation charts

## 🚀 Performance Tips

1. **Optimize Images**: Use Next.js Image component
2. **Code Splitting**: Automatic with Next.js
3. **Caching**: Implement proper caching strategies
4. **CDN**: Use Vercel's global CDN

## 🔒 Security

- HTTPS automatically enabled on Vercel/Netlify
- Environment variables for sensitive data
- Input validation on all forms
- XSS protection built into React

## 📊 Analytics

Consider adding analytics:

```bash
# Google Analytics
npm install @vercel/analytics

# Or Plausible Analytics
npm install plausible-tracker
```

## 🆘 Troubleshooting

### Common Issues:

1. **Build Fails**
   - Check for TypeScript errors: `npm run lint`
   - Ensure all dependencies are installed: `npm install`

2. **Localhost Not Working**
   - Check if port 3000 is in use
   - Try: `npm run dev -- -p 3001`

3. **Deployment Issues**
   - Check build logs in your deployment platform
   - Ensure all environment variables are set
   - Verify Node.js version compatibility

## 📞 Support

For deployment issues:
- Vercel: [vercel.com/support](https://vercel.com/support)
- Netlify: [netlify.com/support](https://netlify.com/support)
- Next.js: [nextjs.org/docs](https://nextjs.org/docs)

---

**Ready to deploy?** Start with Vercel for the easiest experience!
