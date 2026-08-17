import React, { useState } from 'react';
import { Wallet, TrendingUp, TrendingDown, DollarSign, CreditCard } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

interface WalletProps {
  userId?: string;
  balance?: number;
  onDeposit?: (amount: number) => void;
  onWithdraw?: (amount: number) => void;
}

const WalletComponent: React.FC<WalletProps> = ({
  userId,
  balance = 0,
  onDeposit,
  onWithdraw
}) => {
  const [transactions, setTransactions] = React.useState([
    { id: "1", type: "deposit", amount: 100, date: "2026-06-08", description: "Bank Transfer" },
    { id: "2", type: "withdrawal", amount: 50, date: "2026-06-07", description: "ATM Withdrawal" },
    { id: "3", type: "deposit", amount: 200, date: "2026-06-06", description: "Salary Deposit" }
  ]);

  const totalDeposits = transactions
    .filter((t) => t.type === "deposit")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalWithdrawals = transactions
    .filter((t) => t.type === "withdrawal")
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-6">
      <Card className="bg-gradient-to-br from-primary/10 to-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-6 w-6" />
            My Wallet
          </CardTitle>
          <CardDescription>Manage your funds and transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="text-5xl font-bold mb-2">
              ${balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </div>
            <p className="text-muted-foreground">Available Balance</p>
          </div>
          <div className="flex gap-4 mt-6">
            <Button className="flex-1" onClick={() => onDeposit?.(100)}>
              <TrendingUp className="h-4 w-4 mr-2" />
              Deposit
            </Button>
            <Button variant="outline" className="flex-1" onClick={() => onWithdraw?.(50)}>
              <TrendingDown className="h-4 w-4 mr-2" />
              Withdraw
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Deposits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              ${totalDeposits.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Withdrawals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex items-center gap-2">
              <TrendingDown className="h-5 w-5 text-red-500" />
              ${totalWithdrawals.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Transactions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-blue-500" />
              {transactions.length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>Your latest wallet activity</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-full ${
                      transaction.type === "deposit"
                        ? "bg-green-100 text-green-600"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {transaction.type === "deposit" ? (
                      <TrendingUp className="h-5 w-5" />
                    ) : (
                      <TrendingDown className="h-5 w-5" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{transaction.description || 'No description'}</p>
                    <p className="text-sm text-muted-foreground">{transaction.date}</p>
                  </div>
                </div>
                <Badge
                  variant={transaction.type === "deposit" ? "default" : "destructive"}
                  className={
                    transaction.type === "deposit"
                      ? "bg-green-500"
                      : "bg-red-500"
                  }
                >
                  {transaction.type === "deposit" ? "+" : "-"}$
                  {transaction.amount.toFixed(2)}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WalletComponent;
