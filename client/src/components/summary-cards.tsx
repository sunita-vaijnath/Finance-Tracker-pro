import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Activity } from "lucide-react";

interface SummaryCardsProps {
  totalIncome: number;
  totalExpenses: number;
  netIncome: number;
}

export function SummaryCards({ totalIncome, totalExpenses, netIncome }: SummaryCardsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <Card className="bg-white rounded-xl shadow-sm border border-slate-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Total Income</p>
              <p className="text-2xl font-bold text-success">{formatCurrency(totalIncome)}</p>
              <p className="text-xs text-success mt-1">
                <TrendingUp className="inline h-3 w-3 mr-1" />
                Income received
              </p>
            </div>
            <div className="bg-success bg-opacity-10 rounded-full p-3">
              <TrendingDown className="h-5 w-5 text-success" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white rounded-xl shadow-sm border border-slate-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Total Expenses</p>
              <p className="text-2xl font-bold text-danger">{formatCurrency(totalExpenses)}</p>
              <p className="text-xs text-danger mt-1">
                <TrendingUp className="inline h-3 w-3 mr-1" />
                Money spent
              </p>
            </div>
            <div className="bg-danger bg-opacity-10 rounded-full p-3">
              <TrendingUp className="h-5 w-5 text-danger" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white rounded-xl shadow-sm border border-slate-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Net Income</p>
              <p className={`text-2xl font-bold ${netIncome >= 0 ? 'text-primary' : 'text-danger'}`}>
                {formatCurrency(netIncome)}
              </p>
              <p className={`text-xs mt-1 ${netIncome >= 0 ? 'text-success' : 'text-danger'}`}>
                {netIncome >= 0 ? (
                  <TrendingUp className="inline h-3 w-3 mr-1" />
                ) : (
                  <TrendingDown className="inline h-3 w-3 mr-1" />
                )}
                Current balance
              </p>
            </div>
            <div className="bg-primary bg-opacity-10 rounded-full p-3">
              <Activity className="h-5 w-5 text-primary" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
