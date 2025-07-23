import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Transaction } from "@shared/schema";
import { SummaryCards } from "@/components/summary-cards";
import { ExpenseForm } from "@/components/expense-form";
import { TransactionList } from "@/components/transaction-list";
import { TrendsChart } from "@/components/trends-chart";
import { ProfileDialog } from "@/components/profile-dialog";
import { Wallet, Bell, User } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);
  
  const { data: transactions = [], isLoading: transactionsLoading } = useQuery<Transaction[]>({
    queryKey: ["/api/transactions"],
  });

  const { data: summary, isLoading: summaryLoading } = useQuery<{
    totalIncome: number;
    totalExpenses: number;
    netIncome: number;
    transactionCount: number;
  }>({
    queryKey: ["/api/transactions/summary"],
  });

  if (transactionsLoading || summaryLoading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="flex items-center justify-center h-64">
          <div className="text-slate-500">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-inter text-slate-700">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-primary rounded-lg p-2">
                <Wallet className="text-white h-6 w-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">Expense Tracker</h1>
                <p className="text-sm text-slate-500">Personal Finance Manager</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="sm"
                className="text-slate-500 hover:text-slate-700 transition-colors"
              >
                <Bell className="h-5 w-5" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setIsProfileDialogOpen(true)}
                className="bg-slate-200 hover:bg-slate-300 rounded-full p-2 transition-colors"
              >
                <User className="text-slate-600 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary Cards */}
        {summary && (
          <SummaryCards
            totalIncome={summary.totalIncome}
            totalExpenses={summary.totalExpenses}
            netIncome={summary.netIncome}
          />
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Transaction Form and Quick Stats */}
          <div className="lg:col-span-1 space-y-6">
            <ExpenseForm />

            {/* Quick Stats */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">This Month</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Transactions</span>
                  <span className="font-semibold">{summary?.transactionCount || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Avg. Expense</span>
                  <span className="font-semibold text-danger">
                    ${summary && summary.transactionCount > 0 
                      ? (summary.totalExpenses / summary.transactionCount).toFixed(2)
                      : "0.00"
                    }
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Savings Rate</span>
                  <span className="font-semibold text-success">
                    {summary && summary.totalIncome > 0 
                      ? ((summary.netIncome / summary.totalIncome) * 100).toFixed(1)
                      : "0.0"
                    }%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Trends Chart */}
            <TrendsChart />

            {/* Transactions List */}
            <TransactionList transactions={transactions} />
          </div>
        </div>
      </main>

      {/* Profile Dialog */}
      <ProfileDialog 
        isOpen={isProfileDialogOpen} 
        onClose={() => setIsProfileDialogOpen(false)} 
      />
    </div>
  );
}
