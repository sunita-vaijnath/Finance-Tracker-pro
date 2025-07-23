import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Transaction } from "@shared/schema";
import { Trash2, Filter } from "lucide-react";
import { useState } from "react";

interface TransactionListProps {
  transactions: Transaction[];
}

const categoryIcons: Record<string, string> = {
  food: "🍕",
  transportation: "🚗",
  entertainment: "🎬",
  shopping: "🛍️",
  utilities: "⚡",
  healthcare: "🏥",
  education: "📚",
  travel: "✈️",
  salary: "💼",
  freelance: "💻",
  investment: "📈",
  other: "📦",
};

const categoryColors: Record<string, string> = {
  food: "bg-orange-100 text-orange-600",
  transportation: "bg-blue-100 text-blue-600",
  entertainment: "bg-purple-100 text-purple-600",
  shopping: "bg-pink-100 text-pink-600",
  utilities: "bg-yellow-100 text-yellow-600",
  healthcare: "bg-red-100 text-red-600",
  education: "bg-indigo-100 text-indigo-600",
  travel: "bg-green-100 text-green-600",
  salary: "bg-emerald-100 text-emerald-600",
  freelance: "bg-cyan-100 text-cyan-600",
  investment: "bg-lime-100 text-lime-600",
  other: "bg-gray-100 text-gray-600",
};

export function TransactionList({ transactions }: TransactionListProps) {
  const [categoryFilter, setCategoryFilter] = useState("all");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const deleteTransactionMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest("DELETE", `/api/transactions/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/transactions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/transactions/summary"] });
      queryClient.invalidateQueries({ queryKey: ["/api/transactions/range"] });
      
      toast({
        title: "Transaction Deleted",
        description: "The transaction has been removed successfully.",
      });
    },
    onError: (error: any) => {
      console.error("Error deleting transaction:", error);
      toast({
        title: "Error",
        description: "Failed to delete transaction. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this transaction?")) {
      deleteTransactionMutation.mutate(id);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      return `Today, ${date.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      })}`;
    } else if (diffDays === 2) {
      return `Yesterday, ${date.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      })}`;
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    }
  };

  const formatCurrency = (amount: string) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(parseFloat(amount));
  };

  const filteredTransactions = transactions.filter(transaction => 
    categoryFilter === "all" || transaction.category === categoryFilter
  );

  const uniqueCategories = Array.from(new Set(transactions.map(t => t.category)));

  return (
    <Card className="bg-white rounded-xl shadow-sm border border-slate-200">
      <div className="p-6 border-b border-slate-200">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-slate-900">Recent Transactions</h2>
          <div className="flex items-center space-x-3">
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {uniqueCategories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {categoryIcons[category]} {category.charAt(0).toUpperCase() + category.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="ghost" size="sm">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        {filteredTransactions.length === 0 ? (
          <div className="p-8 text-center text-slate-500">
            <p>No transactions found.</p>
            <p className="text-sm mt-1">Add your first transaction to get started!</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-200">
            {filteredTransactions.map((transaction) => (
              <div key={transaction.id} className="p-6 hover:bg-slate-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`rounded-full p-2 ${
                      transaction.type === 'income' 
                        ? 'bg-success bg-opacity-10' 
                        : 'bg-danger bg-opacity-10'
                    }`}>
                      <span className="text-lg">
                        {categoryIcons[transaction.category] || "📦"}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">{transaction.description}</p>
                      <p className="text-sm text-slate-500">
                        <span className={`inline-block px-2 py-1 rounded-full text-xs mr-2 ${
                          categoryColors[transaction.category] || "bg-gray-100 text-gray-600"
                        }`}>
                          {transaction.category.charAt(0).toUpperCase() + transaction.category.slice(1)}
                        </span>
                        • {formatDate(transaction.date)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`font-semibold ${
                      transaction.type === 'income' ? 'text-success' : 'text-danger'
                    }`}>
                      {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(transaction.id)}
                      disabled={deleteTransactionMutation.isPending}
                      className="text-slate-400 hover:text-danger transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {filteredTransactions.length > 0 && (
        <div className="p-6 border-t border-slate-200">
          <div className="flex justify-between items-center">
            <p className="text-sm text-slate-500">
              Showing {filteredTransactions.length} of {transactions.length} transactions
            </p>
          </div>
        </div>
      )}
    </Card>
  );
}
