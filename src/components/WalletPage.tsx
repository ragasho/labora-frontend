import { useState, useEffect } from 'react';
import { 
  Wallet, 
  Plus, 
  ArrowUpCircle, 
  ArrowDownCircle, 
  ArrowLeft,
  History, 
  CreditCard,
  Smartphone,
  Banknote,
  TrendingUp,
  Shield,
  Star,
  Gift,
  X,
  CheckCircle
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { ScrollArea } from './ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { WalletTransaction } from '../types';
import { useAuth } from '../hooks/useAuth';
import { toast } from 'sonner@2.0.3';

interface WalletPageProps {
  onClose: () => void;
}

// Mock wallet data - in real app this would come from backend
const INITIAL_BALANCE = 2450.75;
const INITIAL_TRANSACTIONS: WalletTransaction[] = [
  {
    id: 'txn_001',
    type: 'debit',
    amount: 850.25,
    description: 'Order #QM2024001',
    timestamp: '2024-12-07T14:30:00Z',
    status: 'completed',
    orderId: 'QM2024001'
  },
  {
    id: 'txn_002',
    type: 'credit',
    amount: 1000.00,
    description: 'Wallet Top-up via UPI',
    timestamp: '2024-12-07T10:15:00Z',
    status: 'completed',
    paymentMethod: 'UPI'
  },
  {
    id: 'txn_003',
    type: 'credit',
    amount: 50.00,
    description: 'Cashback for Order #QM2024000',
    timestamp: '2024-12-06T18:45:00Z',
    status: 'completed'
  },
  {
    id: 'txn_004',
    type: 'debit',
    amount: 1250.50,
    description: 'Order #QM2024000',
    timestamp: '2024-12-06T18:30:00Z',
    status: 'completed',
    orderId: 'QM2024000'
  },
  {
    id: 'txn_005',
    type: 'credit',
    amount: 2500.00,
    description: 'Wallet Top-up via Credit Card',
    timestamp: '2024-12-05T16:20:00Z',
    status: 'completed',
    paymentMethod: 'Credit Card'
  }
];

const QUICK_ADD_AMOUNTS = [100, 200, 500, 1000, 2000, 5000];

export function WalletPage({ onClose }: WalletPageProps) {
  const [balance, setBalance] = useState(INITIAL_BALANCE);
  const [transactions, setTransactions] = useState<WalletTransaction[]>(INITIAL_TRANSACTIONS);
  const [isAddMoneyOpen, setIsAddMoneyOpen] = useState(false);
  const [addAmount, setAddAmount] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState<'all' | 'credit' | 'debit'>('all');
  
  const { user } = useAuth();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const formatDate = (timestamp: string) => {
    return new Intl.DateTimeFormat('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(timestamp));
  };

  const handleQuickAdd = (amount: number) => {
    setAddAmount(amount.toString());
  };

  const handleAddMoney = async () => {
    if (!addAmount || parseFloat(addAmount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (!selectedPaymentMethod) {
      toast.error('Please select a payment method');
      return;
    }

    setIsLoading(true);

    // Simulate payment processing
    setTimeout(() => {
      const amount = parseFloat(addAmount);
      const newTransaction: WalletTransaction = {
        id: `txn_${Date.now()}`,
        type: 'credit',
        amount,
        description: `Wallet Top-up via ${selectedPaymentMethod}`,
        timestamp: new Date().toISOString(),
        status: 'completed',
        paymentMethod: selectedPaymentMethod,
        transactionId: `TXN${Date.now()}`
      };

      setBalance(prev => prev + amount);
      setTransactions(prev => [newTransaction, ...prev]);
      setIsAddMoneyOpen(false);
      setAddAmount('');
      setSelectedPaymentMethod('');
      setIsLoading(false);
      
      toast.success(`${formatCurrency(amount)} added to your wallet successfully!`);
    }, 2000);
  };

  const filteredTransactions = transactions.filter(transaction => {
    if (filter === 'all') return true;
    return transaction.type === filter;
  });

  const getTransactionIcon = (transaction: WalletTransaction) => {
    if (transaction.type === 'credit') {
      return <ArrowUpCircle className="w-5 h-5 text-green-600" />;
    }
    return <ArrowDownCircle className="w-5 h-5 text-red-600" />;
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method.toLowerCase()) {
      case 'upi':
        return <Smartphone className="w-4 h-4" />;
      case 'credit card':
      case 'debit card':
        return <CreditCard className="w-4 h-4" />;
      case 'net banking':
        return <Banknote className="w-4 h-4" />;
      default:
        return <Wallet className="w-4 h-4" />;
    }
  };

  return (
    <div className="fixed inset-0 bg-white z-50">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b px-4 py-3">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
              <Wallet className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="font-semibold">My Wallet</h2>
              <p className="text-sm text-gray-500">Manage your money securely</p>
            </div>
          </div>
        </div>
      </div>

      <ScrollArea className="h-[calc(100vh-64px)]">
        <div className="p-4 space-y-6">
          {/* Balance Card */}
          <Card className="bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm mb-2">Available Balance</p>
                  <p className="text-3xl font-bold">{formatCurrency(balance)}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Shield className="w-4 h-4 text-green-200" />
                    <span className="text-green-100 text-sm">Secured by bank-grade encryption</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-2">
                    <TrendingUp className="w-8 h-8 text-white" />
                  </div>
                  <Badge className="bg-white/20 text-white border-white/30">
                    <Star className="w-3 h-3 mr-1" />
                    Premium
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Dialog open={isAddMoneyOpen} onOpenChange={setIsAddMoneyOpen}>
              <DialogTrigger asChild>
                <div className="cursor-pointer">
                  <Card className="hover:shadow-lg transition-all hover:-translate-y-1 bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                          <Plus className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">Add Money</h3>
                          <p className="text-sm text-gray-600">Top up your wallet instantly</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Add Money to Wallet</DialogTitle>
                  <DialogDescription>
                    Add money to your wallet for quick and easy payments
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="amount">Amount</Label>
                    <Input
                      id="amount"
                      type="number"
                      placeholder="Enter amount"
                      value={addAmount}
                      onChange={(e) => setAddAmount(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  
                  {/* Quick Add Buttons */}
                  <div>
                    <Label>Quick Add</Label>
                    <div className="grid grid-cols-3 gap-2 mt-2">
                      {QUICK_ADD_AMOUNTS.map((amount) => (
                        <Button
                          key={amount}
                          variant="outline"
                          size="sm"
                          onClick={() => handleQuickAdd(amount)}
                          className="text-xs"
                        >
                          ₹{amount}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="payment-method">Payment Method</Label>
                    <Select value={selectedPaymentMethod} onValueChange={setSelectedPaymentMethod}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select payment method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="UPI">
                          <div className="flex items-center gap-2">
                            <Smartphone className="w-4 h-4" />
                            UPI
                          </div>
                        </SelectItem>
                        <SelectItem value="Credit Card">
                          <div className="flex items-center gap-2">
                            <CreditCard className="w-4 h-4" />
                            Credit Card
                          </div>
                        </SelectItem>
                        <SelectItem value="Debit Card">
                          <div className="flex items-center gap-2">
                            <CreditCard className="w-4 h-4" />
                            Debit Card
                          </div>
                        </SelectItem>
                        <SelectItem value="Net Banking">
                          <div className="flex items-center gap-2">
                            <Banknote className="w-4 h-4" />
                            Net Banking
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button 
                    onClick={handleAddMoney} 
                    className="w-full"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Processing...
                      </div>
                    ) : (
                      `Add ${addAmount ? formatCurrency(parseFloat(addAmount)) : 'Money'}`
                    )}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
                    <Gift className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Cashback & Offers</h3>
                    <p className="text-sm text-gray-600">Earn rewards on every order</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Transaction History */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <History className="w-5 h-5 text-gray-600" />
                  <CardTitle>Transaction History</CardTitle>
                </div>
                <Select value={filter} onValueChange={(value: any) => setFilter(value)}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="credit">Money In</SelectItem>
                    <SelectItem value="debit">Money Out</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <div className="space-y-4 pr-4">
                  {filteredTransactions.length > 0 ? (
                    filteredTransactions.map((transaction, index) => (
                      <div key={transaction.id}>
                        <div className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors">
                          <div className="flex items-center gap-4">
                            <div className="flex-shrink-0">
                              {getTransactionIcon(transaction)}
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-gray-900">{transaction.description}</p>
                              <div className="flex items-center gap-2 text-sm text-gray-500">
                                <span>{formatDate(transaction.timestamp)}</span>
                                {transaction.paymentMethod && (
                                  <>
                                    <span>•</span>
                                    <div className="flex items-center gap-1">
                                      {getPaymentMethodIcon(transaction.paymentMethod)}
                                      <span>{transaction.paymentMethod}</span>
                                    </div>
                                  </>
                                )}
                                {transaction.status === 'completed' && (
                                  <>
                                    <span>•</span>
                                    <div className="flex items-center gap-1">
                                      <CheckCircle className="w-3 h-3 text-green-500" />
                                      <span className="text-green-600">Completed</span>
                                    </div>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className={`font-semibold ${
                              transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {transaction.type === 'credit' ? '+' : '-'}{formatCurrency(transaction.amount)}
                            </p>
                            {transaction.transactionId && (
                              <p className="text-xs text-gray-400">
                                ID: {transaction.transactionId}
                              </p>
                            )}
                          </div>
                        </div>
                        {index < filteredTransactions.length - 1 && <Separator />}
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <History className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p>No transactions found</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Security Notice */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-900 mb-1">Secure & Protected</h4>
                  <p className="text-sm text-blue-700">
                    Your wallet is protected with 256-bit encryption and two-factor authentication. 
                    We never store your payment details and all transactions are monitored for fraud.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </ScrollArea>
    </div>
  );
}