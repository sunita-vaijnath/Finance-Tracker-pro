import { transactions, type Transaction, type InsertTransaction, users, type User, type InsertUser } from "@shared/schema";
import { db } from "./db";
import { eq, desc, sql } from "drizzle-orm";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<InsertUser>): Promise<User>;
  getCurrentUser(): Promise<User | undefined>;
  
  // Transaction methods
  getAllTransactions(): Promise<Transaction[]>;
  getTransactionById(id: number): Promise<Transaction | undefined>;
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  deleteTransaction(id: number): Promise<void>;
  getTransactionSummary(): Promise<{
    totalIncome: number;
    totalExpenses: number;
    netIncome: number;
    transactionCount: number;
  }>;
  getTransactionsByDateRange(startDate: string, endDate: string): Promise<Transaction[]>;
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async updateUser(id: number, userData: Partial<InsertUser>): Promise<User> {
    const updateData: any = {
      ...userData,
      updatedAt: new Date(),
    };
    
    // Convert monthlyIncome to string if it exists
    if (updateData.monthlyIncome !== undefined) {
      updateData.monthlyIncome = updateData.monthlyIncome.toString();
    }

    const [user] = await db
      .update(users)
      .set(updateData)
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async getCurrentUser(): Promise<User | undefined> {
    // For demo purposes, we'll create or get a default user
    let [user] = await db.select().from(users).limit(1);
    
    if (!user) {
      // Create a default user for demo
      const newUser = await db
        .insert(users)
        .values({
          username: "demo_user",
          password: "password", // In real app, this would be hashed
          fullName: "Demo User",
          email: "demo@example.com",
        })
        .returning();
      user = newUser[0];
    }
    
    return user;
  }

  // Transaction methods
  async getAllTransactions(): Promise<Transaction[]> {
    return await db.select().from(transactions).orderBy(desc(transactions.date));
  }

  async getTransactionById(id: number): Promise<Transaction | undefined> {
    const [transaction] = await db.select().from(transactions).where(eq(transactions.id, id));
    return transaction || undefined;
  }

  async createTransaction(transaction: InsertTransaction): Promise<Transaction> {
    const [newTransaction] = await db
      .insert(transactions)
      .values({
        description: transaction.description,
        amount: transaction.amount.toString(),
        type: transaction.type,
        category: transaction.category,
        date: new Date(transaction.date),
      })
      .returning();
    return newTransaction;
  }

  async deleteTransaction(id: number): Promise<void> {
    await db.delete(transactions).where(eq(transactions.id, id));
  }

  async getTransactionSummary(): Promise<{
    totalIncome: number;
    totalExpenses: number;
    netIncome: number;
    transactionCount: number;
  }> {
    const result = await db
      .select({
        totalIncome: sql<number>`COALESCE(SUM(CASE WHEN type = 'income' THEN CAST(amount AS DECIMAL) ELSE 0 END), 0)`,
        totalExpenses: sql<number>`COALESCE(SUM(CASE WHEN type = 'expense' THEN CAST(amount AS DECIMAL) ELSE 0 END), 0)`,
        transactionCount: sql<number>`COUNT(*)`,
      })
      .from(transactions);

    const summary = result[0];
    const totalIncome = Number(summary.totalIncome);
    const totalExpenses = Number(summary.totalExpenses);
    const netIncome = totalIncome - totalExpenses;

    return {
      totalIncome,
      totalExpenses,
      netIncome,
      transactionCount: Number(summary.transactionCount),
    };
  }

  async getTransactionsByDateRange(startDate: string, endDate: string): Promise<Transaction[]> {
    return await db
      .select()
      .from(transactions)
      .where(
        sql`${transactions.date} >= ${new Date(startDate)} AND ${transactions.date} <= ${new Date(endDate)}`
      )
      .orderBy(desc(transactions.date));
  }
}

export const storage = new DatabaseStorage();
