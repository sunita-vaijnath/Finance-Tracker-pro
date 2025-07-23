import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Plus, Minus } from "lucide-react";

const categories = [
  { value: "food", label: "🍕 Food & Dining", type: "expense" },
  { value: "transportation", label: "🚗 Transportation", type: "expense" },
  { value: "entertainment", label: "🎬 Entertainment", type: "expense" },
  { value: "shopping", label: "🛍️ Shopping", type: "expense" },
  { value: "utilities", label: "⚡ Utilities", type: "expense" },
  { value: "healthcare", label: "🏥 Healthcare", type: "expense" },
  { value: "education", label: "📚 Education", type: "expense" },
  { value: "travel", label: "✈️ Travel", type: "expense" },
  { value: "salary", label: "💼 Salary", type: "income" },
  { value: "freelance", label: "💻 Freelance", type: "income" },
  { value: "investment", label: "📈 Investment", type: "income" },
  { value: "other", label: "📦 Other", type: "both" },
];

export function ExpenseForm() {
  const [transactionType, setTransactionType] = useState<"expense" | "income">("expense");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createTransactionMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest("POST", "/api/transactions", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/transactions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/transactions/summary"] });
      queryClient.invalidateQueries({ queryKey: ["/api/transactions/range"] });
      
      // Reset form
      setDescription("");
      setCategory("");
      setAmount("");
      setDate(new Date().toISOString().split('T')[0]);
      setErrors({});
      
      toast({
        title: "Transaction Added",
        description: "Your transaction has been saved successfully.",
      });
    },
    onError: (error: any) => {
      console.error("Error creating transaction:", error);
      toast({
        title: "Error",
        description: "Failed to create transaction. Please try again.",
        variant: "destructive",
      });
    },
  });

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!description.trim()) {
      newErrors.description = "Description is required";
    }

    if (!category) {
      newErrors.category = "Please select a category";
    }

    if (!amount || parseFloat(amount) <= 0) {
      newErrors.amount = "Amount must be greater than 0";
    }

    if (!date) {
      newErrors.date = "Date is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    createTransactionMutation.mutate({
      description: description.trim(),
      category,
      amount: parseFloat(amount),
      type: transactionType,
      date,
    });
  };

  const filteredCategories = categories.filter(
    cat => cat.type === transactionType || cat.type === "both"
  );

  return (
    <Card className="bg-white rounded-xl shadow-sm border border-slate-200">
      <CardContent className="p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-6">Add Transaction</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex bg-slate-100 rounded-lg p-1">
            <Button
              type="button"
              variant={transactionType === "expense" ? "default" : "ghost"}
              className={`flex-1 ${
                transactionType === "expense" 
                  ? "bg-danger text-white hover:bg-red-600" 
                  : "text-slate-600 hover:text-slate-800"
              }`}
              onClick={() => {
                setTransactionType("expense");
                setCategory("");
              }}
            >
              <Minus className="w-4 h-4 mr-2" />
              Expense
            </Button>
            <Button
              type="button"
              variant={transactionType === "income" ? "default" : "ghost"}
              className={`flex-1 ${
                transactionType === "income" 
                  ? "bg-success text-white hover:bg-green-600" 
                  : "text-slate-600 hover:text-slate-800"
              }`}
              onClick={() => {
                setTransactionType("income");
                setCategory("");
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Income
            </Button>
          </div>

          <div>
            <Label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-2">
              Description
            </Label>
            <Input
              id="description"
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter transaction description"
              className={errors.description ? "border-red-500" : ""}
            />
            {errors.description && (
              <p className="text-danger text-xs mt-1">{errors.description}</p>
            )}
          </div>

          <div>
            <Label htmlFor="category" className="block text-sm font-medium text-slate-700 mb-2">
              Category
            </Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className={errors.category ? "border-red-500" : ""}>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {filteredCategories.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && (
              <p className="text-danger text-xs mt-1">{errors.category}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="amount" className="block text-sm font-medium text-slate-700 mb-2">
                Amount
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-slate-500">₹</span>
                <Input
                  id="amount"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  className={`pl-7 ${errors.amount ? "border-red-500" : ""}`}
                />
              </div>
              {errors.amount && (
                <p className="text-danger text-xs mt-1">{errors.amount}</p>
              )}
            </div>

            <div>
              <Label htmlFor="date" className="block text-sm font-medium text-slate-700 mb-2">
                Date
              </Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className={errors.date ? "border-red-500" : ""}
              />
              {errors.date && (
                <p className="text-danger text-xs mt-1">{errors.date}</p>
              )}
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-primary text-white hover:bg-blue-700"
            disabled={createTransactionMutation.isPending}
          >
            <Plus className="w-4 h-4 mr-2" />
            {createTransactionMutation.isPending ? "Adding..." : "Add Transaction"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
