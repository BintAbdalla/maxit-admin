export interface Account {
  id: string;
  accountNumber: string;
  ownerName: string;
  phoneNumber: string;
  balance: number;
  isBlocked: boolean;
  createdAt: Date;
  lastActivity: Date;
}

export interface Transfer {
  id: string;
  fromAccountId: string;
  toAccountId: string;
  fromAccountName: string;
  toAccountName: string;
  amount: number;
  fees: number;
  status: 'pending' | 'completed' | 'cancelled' | 'cancellation_requested';
  createdAt: Date;
  cancelRequestedAt?: Date;
  cancelReason?: string;
}

export interface Transaction {
  id: string;
  accountId: string;
  accountNumber: string;
  type: 'deposit' | 'withdrawal' | 'code_purchase';
  amount: number;
  description: string;
  createdAt: Date;
  status: 'success' | 'failed';
}

export interface CodePurchase {
  id: string;
  accountId: string;
  phoneNumber: string;
  codePurchase: string;
  amount: number;
  createdAt: Date;
  smsSent: boolean;
}