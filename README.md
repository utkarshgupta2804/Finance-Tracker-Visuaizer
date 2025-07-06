# Personal Finance Visualizer

A comprehensive personal finance management application built with Next.js, TypeScript, and MongoDB. Track your expenses, manage budgets, and gain insights into your spending habits with beautiful visualizations.

## 🌟 Features

### 📊 **Dashboard Overview**
- Real-time financial statistics (balance, income, expenses, budget remaining)
- Interactive charts showing monthly expenses and category breakdowns
- Budget vs actual spending comparisons
- Recent transactions overview

### 💰 **Transaction Management**
- Add, edit, and delete transactions
- Categorize expenses (Food, Transportation, Entertainment, etc.)
- Search and filter transactions
- Bulk transaction operations

### 📈 **Budget Planning**
- Set monthly budgets for different categories
- Track budget progress with visual indicators
- Get alerts when approaching budget limits
- Compare actual spending vs planned budgets

### 📋 **Smart Insights**
- AI-powered spending analysis
- Personalized financial recommendations
- Category-wise spending trends
- Monthly and yearly financial summaries

### 🎨 **Modern UI/UX**
- Clean, responsive design
- Dark/light theme support
- Mobile-friendly interface
- Intuitive navigation with sidebar

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Database**: MongoDB with Mongoose
- **Charts**: Recharts for data visualization
- **Icons**: Lucide React
- **State Management**: React hooks and context

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- MongoDB database (local or cloud)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   \`\`\`bash
   git clone <repository-url>
   cd personal-finance-visualizer
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   \`\`\`env
   MONGODB_URI=your_mongodb_connection_string
   \`\`\`

4. **Run the development server**
   \`\`\`bash
   npm run dev
   \`\`\`

5. **Open your browser**
   Navigate to `http://localhost:3000`

## 📱 Usage

### Adding Transactions
1. Click the "Add Transaction" button
2. Fill in the amount, category, description, and date
3. Choose between income or expense
4. Save to add to your financial records

### Setting Budgets
1. Navigate to the Budget section
2. Set monthly limits for each spending category
3. Monitor your progress throughout the month
4. Receive insights on your spending patterns

### Viewing Analytics
1. Check the dashboard for overview statistics
2. Explore different chart views for detailed analysis
3. Review spending insights for personalized recommendations
4. Track your financial goals and progress

## 🏗️ Project Structure

\`\`\`
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   ├── budgets/       # Budget management endpoints
│   │   ├── transactions/  # Transaction CRUD endpoints
│   │   └── dashboard/     # Dashboard statistics
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx          # Home page
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── charts/           # Chart components
│   ├── dashboard.tsx     # Main dashboard
│   ├── transaction-*.tsx # Transaction components
│   └── budget-*.tsx      # Budget components
├── lib/                  # Utility functions
│   ├── mongodb.ts        # Database connection
│   ├── models/           # Database models
│   └── utils.ts          # Helper functions
└── hooks/                # Custom React hooks
\`\`\`

## 🔧 API Endpoints

- `GET/POST /api/transactions` - Manage transactions
- `GET/PUT/DELETE /api/transactions/[id]` - Individual transaction operations
- `GET/POST /api/budgets` - Budget management
- `GET /api/dashboard/stats` - Dashboard statistics

## 🎯 Key Features Explained

### Real-time Data Synchronization
All components automatically refresh when data changes, ensuring you always see the most up-to-date financial information.

### Intelligent Categorization
Transactions are automatically categorized, and the system learns from your patterns to suggest categories for new transactions.

### Budget Tracking
Set realistic budgets and track your progress with visual indicators. Get notified when you're approaching your limits.

### Financial Insights
The application analyzes your spending patterns and provides personalized insights to help you make better financial decisions.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Charts powered by [Recharts](https://recharts.org/)
- Icons from [Lucide](https://lucide.dev/)
