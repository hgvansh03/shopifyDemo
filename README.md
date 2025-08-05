# Unbridaled Diamonds - Shopify App

A complete AI-powered diamond curation Shopify app that connects jewelry settings to certified diamond inventory, helping merchants increase sales and reduce decision overwhelm for customers.

## 🚀 Features

### 💎 **Diamond Inventory Management**
- Browse 1M+ certified diamonds
- Filter by shape, carat, color, clarity, cut
- Natural and lab-grown diamond options
- Real-time pricing and availability
- Certificate integration (GIA, etc.)
- Video and image galleries

### 💍 **Jewelry Settings**
- Comprehensive jewelry catalog
- Ring, pendant, and earring settings
- Metal options (Gold, Platinum, Silver)
- Setting styles (Solitaire, Halo, Three Stone)
- Compatibility matching with diamond shapes

### 🤖 **AI-Powered Curation**
- Intelligent diamond recommendations
- Style and proportion matching
- Budget optimization
- Customer preference learning
- Confidence scoring
- Automated product creation

### 📊 **Advanced Analytics**
- Sales performance tracking
- Diamond shape popularity
- Conversion rate optimization
- Inventory alerts
- Profit margin analysis
- Customer behavior insights

### 🛍️ **E-commerce Integration**
- Seamless Shopify integration
- Theme compatibility
- Product synchronization
- Order management
- Customer tracking
- Pricing optimization

## 🏗️ Tech Stack

- **Framework**: Remix (React-based)
- **Database**: Prisma with SQLite/PostgreSQL
- **UI**: Shopify Polaris Design System
- **Authentication**: Shopify App Bridge
- **API**: Shopify GraphQL Admin API
- **AI**: Custom curation algorithms
- **Deployment**: Vercel, Railway, Heroku

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Shopify Partner Account
- Shopify CLI

### 1. Installation
\`\`\`bash
git clone <repository>
cd unbridaled-diamonds-app
npm install
\`\`\`

### 2. Environment Setup
Create `.env` file:
\`\`\`env
SHOPIFY_API_KEY=your_api_key
SHOPIFY_API_SECRET=your_api_secret
SCOPES=write_products,read_orders,read_customers
SHOPIFY_APP_URL=https://your-app-url.com
DATABASE_URL="file:./dev.sqlite"
\`\`\`

### 3. Database Setup
\`\`\`bash
npx prisma generate
npx prisma migrate deploy
\`\`\`

### 4. Development
\`\`\`bash
npm run dev
\`\`\`

## 📱 App Structure

### Core Pages
- **Dashboard** (`/app`) - Overview and quick actions
- **Diamond Inventory** (`/app/diamonds`) - Browse and filter diamonds
- **Jewelry Settings** (`/app/jewelry`) - Manage jewelry catalog
- **AI Curation** (`/app/curation`) - Smart recommendations
- **Analytics** (`/app/analytics`) - Performance insights

### Key Features

#### Diamond Management
- Advanced filtering system
- Comparison tools
- Certificate verification
- Video integration
- Pricing optimization

#### AI Curation Engine
- Machine learning recommendations
- Style compatibility analysis
- Budget optimization
- Customer preference tracking
- Confidence scoring

#### Analytics Dashboard
- Real-time performance metrics
- Diamond shape popularity
- Conversion tracking
- Inventory management
- Profit optimization

## 🚀 Deployment

### Vercel (Recommended)
\`\`\`bash
npm i -g vercel
vercel
\`\`\`

Set environment variables in Vercel dashboard:
- `SHOPIFY_API_KEY`
- `SHOPIFY_API_SECRET`
- `SCOPES`
- `SHOPIFY_APP_URL`
- `DATABASE_URL`

### Railway
\`\`\`bash
npm i -g @railway/cli
railway login
railway init
railway up
\`\`\`

### Heroku
\`\`\`bash
heroku create unbridaled-diamonds-app
heroku config:set SHOPIFY_API_KEY=your_key
git push heroku main
\`\`\`

## 🔧 Configuration

### Shopify App Settings
1. **App URL**: `https://your-app.vercel.app`
2. **Redirect URLs**: `https://your-app.vercel.app/api/auth`
3. **Scopes**: `write_products,read_orders,read_customers`
4. **Webhooks**: 
   - App uninstalled: `/webhooks/app/uninstalled`
   - Scopes update: `/webhooks/app/scopes_update`

### Database Configuration

#### Development (SQLite)
Default configuration - no additional setup required.

#### Production (PostgreSQL)
\`\`\`env
DATABASE_URL="postgresql://username:password@host:5432/database"
\`\`\`

#### Production (MySQL)
Update `schema.prisma`:
\`\`\`prisma
datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}
\`\`\`

## 🎯 Key Business Benefits

### For Merchants
- **Increase Sales**: AI curation reduces decision overwhelm
- **Higher AOV**: Premium diamond + jewelry combinations
- **Reduced Time**: Automated product creation and curation
- **Better Margins**: Intelligent pricing optimization
- **Customer Insights**: Advanced analytics and behavior tracking

### For Customers
- **Easy Selection**: AI-guided diamond choosing process
- **Visual Comparison**: Side-by-side diamond comparisons
- **Certified Quality**: GIA and other certificate integration
- **Video Previews**: 360° diamond videos
- **Transparent Pricing**: Clear, competitive pricing

## 🔌 API Integration

### Diamond Data Sources
- GIA (Gemological Institute of America)
- AGS (American Gem Society)
- EGL (European Gemological Laboratory)
- Real-time inventory feeds
- Pricing APIs

### Shopify Integration
- Product creation and updates
- Inventory synchronization
- Order processing
- Customer data management
- Theme integration

## 🧪 Testing

### Mock Data
The app includes comprehensive mock data for development:
- 15,420+ sample diamonds
- 245 jewelry settings
- AI curation examples
- Analytics data
- Customer scenarios

### Testing Features
\`\`\`bash
# Run tests
npm test

# Test diamond filtering
npm run test:diamonds

# Test AI curation
npm run test:curation
\`\`\`

## 🔒 Security

- Shopify OAuth 2.0 authentication
- Secure API key management
- HTTPS enforcement
- Data encryption
- GDPR compliance
- PCI DSS considerations

## 📈 Performance Optimization

- Lazy loading for diamond images
- Efficient database queries
- CDN integration for media
- Caching strategies
- Mobile optimization
- Progressive web app features

## 🛠️ Customization

### Adding New Diamond Sources
1. Create new data connector in `lib/diamond-sources/`
2. Update import functions
3. Add to curation algorithm
4. Test integration

### Custom AI Algorithms
1. Modify `lib/ai-curation.js`
2. Add new scoring factors
3. Update confidence calculations
4. Test recommendations

### Theme Integration
1. Add theme-specific CSS
2. Update component styling
3. Test across different themes
4. Ensure mobile compatibility

## 📞 Support & Documentation

- [Shopify App Development](https://shopify.dev/docs/apps)
- [Diamond Industry Standards](https://www.gia.edu/)
- [Remix Framework](https://remix.run/docs)
- [Shopify Polaris](https://polaris.shopify.com/)

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Shopify for the excellent app platform
- GIA for diamond certification standards
- The jewelry industry for inspiration
- Open source community for tools and libraries

---

**Ready to revolutionize your jewelry business with AI-powered diamond curation?** 

Deploy this app today and start connecting your customers to their perfect diamonds! 💎✨
