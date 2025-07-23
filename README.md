# Expense Tracker

A modern, full-stack expense tracking application built with React, Express.js, and PostgreSQL. Track your income and expenses with beautiful visualizations and comprehensive financial insights.

## Features

### 💰 Financial Management
- **Transaction Tracking**: Add, view, and delete income and expense transactions
- **Category System**: Organize transactions with predefined categories (Food, Transportation, Entertainment, etc.)
- **Multiple Time Periods**: View financial data across 1 Month, 6 Months, or 1 Year periods
- **Currency Support**: All amounts displayed in Indian Rupees (₹)

### 📊 Analytics & Visualization
- **Summary Dashboard**: Quick overview of total income, expenses, and net balance
- **Interactive Charts**: Line chart showing income vs expenses trends over time
- **Financial Metrics**: Average expenses, savings rate, and transaction count
- **Category Filtering**: Filter transactions by specific categories

### 👤 User Profile
- **Profile Management**: Editable user profile with personal information
- **Monthly Income Tracking**: Set and track your monthly income goals
- **Contact Information**: Store email, phone, and occupation details

### 🎨 Modern UI/UX
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Clean Interface**: Modern design with intuitive navigation
- **Real-time Updates**: Instant feedback when adding or editing data
- **Dark Mode Ready**: Built with theme support (future enhancement)

## Getting Started

### Prerequisites
- Node.js 20 or higher
- PostgreSQL database

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd expense-tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up the database**
   ```bash
   # Push database schema
   npm run db:push
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Access the application**
   Open your browser and navigate to `http://localhost:5000`

## How to Use

### Adding Transactions

1. **Select Transaction Type**
   - Click "Expense" for money spent
   - Click "Income" for money received

2. **Fill Transaction Details**
   - **Description**: What the transaction was for (e.g., "Grocery Shopping")
   - **Category**: Select from available categories
   - **Amount**: Enter amount in rupees (without ₹ symbol)
   - **Date**: Select the transaction date

3. **Submit**
   - Click "Add Transaction" to save

### Viewing Financial Data

#### Summary Cards
- **Total Income**: All money received
- **Total Expenses**: All money spent  
- **Net Income**: Income minus expenses (your current balance)

#### Charts & Trends
- Click **1Month**, **6Month**, or **1Year** buttons to change time period
- Green line shows income trends
- Red line shows expense trends
- Hover over data points for exact amounts

#### Transaction History
- View all transactions in chronological order
- Use category filter to show specific types
- Delete transactions by clicking the trash icon

### Managing Your Profile

1. **Access Profile**
   - Click the user icon in the top-right corner

2. **Edit Information**
   - Click the edit button (pencil icon)
   - Update any field: name, email, phone, occupation, monthly income
   - Click "Save Changes" to confirm

3. **Profile Data**
   - **Full Name**: Your display name
   - **Email**: Contact email address
   - **Phone**: Phone number
   - **Occupation**: Your job title
   - **Monthly Income**: Expected monthly earnings

## Categories

### Expense Categories
- 🍕 **Food & Dining**: Restaurants, groceries, coffee shops
- 🚗 **Transportation**: Gas, public transport, car maintenance
- 🎬 **Entertainment**: Movies, streaming services, games
- 🛍️ **Shopping**: Clothing, electronics, general purchases
- ⚡ **Utilities**: Electricity, internet, phone bills
- 🏥 **Healthcare**: Medical visits, medications, insurance
- 📚 **Education**: Courses, books, training
- ✈️ **Travel**: Flights, hotels, vacation expenses

### Income Categories
- 💼 **Salary**: Regular job income
- 💻 **Freelance**: Contract work, side projects
- 📈 **Investment**: Dividends, stock returns, interest

### General Category
- 📦 **Other**: Miscellaneous transactions

## Tips for Better Financial Tracking

### 1. Regular Updates
- Add transactions daily for accuracy
- Review your spending weekly
- Check monthly summaries for trends

### 2. Category Consistency
- Use the same categories for similar expenses
- This improves trend analysis accuracy

### 3. Detailed Descriptions
- Write clear transaction descriptions
- Include location or vendor when helpful
- This makes transactions easier to remember

### 4. Set Monthly Goals
- Update your monthly income in your profile
- Use the savings rate to track financial health
- Aim for positive net income each month

### 5. Use Time Periods Effectively
- **1 Month**: Track daily spending patterns
- **6 Month**: Identify seasonal trends  
- **1 Year**: Review annual financial performance

## Database Schema

### Transactions Table
- `id`: Unique transaction identifier
- `description`: Transaction description
- `amount`: Transaction amount (decimal)
- `type`: 'income' or 'expense'
- `category`: Transaction category
- `date`: Transaction date
- `createdAt`: Record creation timestamp

### Users Table  
- `id`: Unique user identifier
- `username`: User login name
- `fullName`: Display name
- `email`: Contact email
- `phone`: Phone number
- `occupation`: Job title
- `monthlyIncome`: Expected monthly income
- `createdAt`: Account creation date
- `updatedAt`: Last profile update

## API Endpoints

### Transaction Endpoints
- `GET /api/transactions` - Get all transactions
- `POST /api/transactions` - Create new transaction
- `DELETE /api/transactions/:id` - Delete transaction
- `GET /api/transactions/summary` - Get financial summary
- `GET /api/transactions/range` - Get transactions by date range

### User Endpoints
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile

## Technical Stack

### Frontend
- **React 18**: Modern React with hooks
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first styling
- **shadcn/ui**: Pre-built UI components
- **TanStack Query**: Server state management
- **Chart.js**: Data visualization
- **Wouter**: Lightweight routing

### Backend
- **Node.js**: JavaScript runtime
- **Express.js**: Web framework
- **TypeScript**: Type-safe backend code
- **Drizzle ORM**: Type-safe database queries

### Database
- **PostgreSQL**: Production database
- **Drizzle Kit**: Database migrations

### Development Tools
- **Vite**: Fast development server
- **ESBuild**: JavaScript bundler
- **PostCSS**: CSS processing

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Support

For questions or issues:
1. Check this README for common solutions
2. Review the application logs for error details
3. Contact the development team

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**Happy Tracking! 💰📊**

Keep your finances organized and make informed spending decisions with your personal Expense Tracker.