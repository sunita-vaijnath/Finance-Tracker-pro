import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { processTransactionsForChart, getDateRange } from "@/lib/chart-utils";
import { Transaction } from "@shared/schema";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export function TrendsChart() {
  const [selectedPeriod, setSelectedPeriod] = useState<'1M' | '6M' | '1Y'>('1M');
  const { startDate, endDate } = getDateRange(selectedPeriod);

  const { data: transactions = [], isLoading } = useQuery<Transaction[]>({
    queryKey: ["/api/transactions/range", startDate, endDate, selectedPeriod],
    queryFn: async () => {
      const response = await fetch(`/api/transactions/range?startDate=${startDate}&endDate=${endDate}`);
      if (!response.ok) {
        throw new Error("Failed to fetch transactions");
      }
      return response.json();
    },
  });

  const chartData = processTransactionsForChart(transactions, selectedPeriod);

  const data = {
    labels: chartData.map(point => point.date),
    datasets: [
      {
        label: 'Income',
        data: chartData.map(point => point.income),
        borderColor: 'hsl(142, 76%, 36%)',
        backgroundColor: 'hsla(142, 76%, 36%, 0.1)',
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Expenses',
        data: chartData.map(point => point.expenses),
        borderColor: 'hsl(0, 84%, 60%)',
        backgroundColor: 'hsla(0, 84%, 60%, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
        callbacks: {
          label: function(context: any) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += new Intl.NumberFormat('en-IN', {
                style: 'currency',
                currency: 'INR'
              }).format(context.parsed.y);
            }
            return label;
          }
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value: any) {
            return new Intl.NumberFormat('en-IN', {
              style: 'currency',
              currency: 'INR'
            }).format(value);
          }
        }
      }
    },
    interaction: {
      mode: 'nearest' as const,
      axis: 'x' as const,
      intersect: false,
    },
  };

  return (
    <Card className="bg-white rounded-xl shadow-sm border border-slate-200">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-slate-900">Financial Trends</h2>
          <div className="flex space-x-2">
            <Button 
              size="sm" 
              variant={selectedPeriod === '1M' ? 'default' : 'ghost'}
              className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                selectedPeriod === '1M' 
                  ? 'bg-primary text-white' 
                  : 'text-slate-600 hover:text-slate-800'
              }`}
              onClick={() => setSelectedPeriod('1M')}
            >
              1Month
            </Button>
            <Button 
              size="sm" 
              variant={selectedPeriod === '6M' ? 'default' : 'ghost'}
              className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                selectedPeriod === '6M' 
                  ? 'bg-primary text-white' 
                  : 'text-slate-600 hover:text-slate-800'
              }`}
              onClick={() => setSelectedPeriod('6M')}
            >
              6Month
            </Button>
            <Button 
              size="sm" 
              variant={selectedPeriod === '1Y' ? 'default' : 'ghost'}
              className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                selectedPeriod === '1Y' 
                  ? 'bg-primary text-white' 
                  : 'text-slate-600 hover:text-slate-800'
              }`}
              onClick={() => setSelectedPeriod('1Y')}
            >
              1Year
            </Button>
          </div>
        </div>
        <div className="h-64">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-slate-500">Loading chart data...</div>
            </div>
          ) : chartData.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-slate-500">No data available for the selected period</div>
            </div>
          ) : (
            <Line data={data} options={options} />
          )}
        </div>
      </CardContent>
    </Card>
  );
}
