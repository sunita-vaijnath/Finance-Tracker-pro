import { Transaction } from "@shared/schema";

export interface ChartDataPoint {
  date: string;
  income: number;
  expenses: number;
}

export function processTransactionsForChart(
  transactions: Transaction[], 
  period: '1M' | '6M' | '1Y'
): ChartDataPoint[] {
  // Group transactions by date with appropriate formatting
  const groupedByDate = transactions.reduce((acc, transaction) => {
    const date = formatDateForPeriod(transaction.date, period);
    
    if (!acc[date]) {
      acc[date] = { income: 0, expenses: 0 };
    }
    
    const amount = parseFloat(transaction.amount);
    if (transaction.type === 'income') {
      acc[date].income += amount;
    } else {
      acc[date].expenses += amount;
    }
    
    return acc;
  }, {} as Record<string, { income: number; expenses: number }>);

  // Convert to array and sort by date
  return Object.entries(groupedByDate)
    .map(([date, data]) => ({
      date,
      income: data.income,
      expenses: data.expenses,
    }))
    .sort((a, b) => {
      // Parse dates for proper sorting
      const dateA = new Date(a.date + ' 1, 2025'); // Add year for parsing
      const dateB = new Date(b.date + ' 1, 2025');
      return dateA.getTime() - dateB.getTime();
    });
}

export function getDateRange(period: '1M' | '6M' | '1Y'): { startDate: string; endDate: string } {
  const endDate = new Date();
  const startDate = new Date();
  
  switch (period) {
    case '1M':
      startDate.setMonth(startDate.getMonth() - 1);
      break;
    case '6M':
      startDate.setMonth(startDate.getMonth() - 6);
      break;
    case '1Y':
      startDate.setFullYear(startDate.getFullYear() - 1);
      break;
  }
  
  return {
    startDate: startDate.toISOString().split('T')[0],
    endDate: endDate.toISOString().split('T')[0],
  };
}

export function formatDateForPeriod(dateString: string, period: '1M' | '6M' | '1Y'): string {
  const date = new Date(dateString);
  
  switch (period) {
    case '1M':
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
    case '6M':
      return date.toLocaleDateString('en-US', { 
        month: 'short',
        year: '2-digit'
      });
    case '1Y':
      return date.toLocaleDateString('en-US', { 
        month: 'short',
        year: 'numeric'
      });
    default:
      return date.toLocaleDateString();
  }
}
