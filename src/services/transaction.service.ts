import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Transaction, CodePurchase } from '../models/interfaces';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private transactionsSubject = new BehaviorSubject<Transaction[]>([]);
  private codePurchasesSubject = new BehaviorSubject<CodePurchase[]>([]);

  transactions$ = this.transactionsSubject.asObservable();
  codePurchases$ = this.codePurchasesSubject.asObservable();

  processDeposit(accountId: string, accountNumber: string, amount: number, description: string): Transaction {
    const transaction: Transaction = {
      id: 'TXN' + Date.now(),
      accountId,
      accountNumber,
      type: 'deposit',
      amount,
      description: description || 'Dépôt sur compte',
      createdAt: new Date(),
      status: 'success'
    };

    const transactions = this.transactionsSubject.value;
    this.transactionsSubject.next([...transactions, transaction]);
    
    return transaction;
  }

  processWithdrawal(accountId: string, accountNumber: string, amount: number, description: string): Transaction {
    const transaction: Transaction = {
      id: 'TXN' + Date.now(),
      accountId,
      accountNumber,
      type: 'withdrawal',
      amount,
      description: description || 'Retrait du compte',
      createdAt: new Date(),
      status: 'success'
    };

    const transactions = this.transactionsSubject.value;
    this.transactionsSubject.next([...transactions, transaction]);
    
    return transaction;
  }

  processCodePurchase(accountId: string, phoneNumber: string, amount: number): CodePurchase {
    const code = this.generateCode();
    const codePurchase: CodePurchase = {
      id: 'CODE' + Date.now(),
      accountId,
      phoneNumber,
      code,
      amount,
      createdAt: new Date(),
      smsSent: true // Simulation d'envoi SMS
    };

    // Ajouter la transaction
    const transaction: Transaction = {
      id: 'TXN' + Date.now(),
      accountId,
      accountNumber: '',
      type: 'code_purchase',
      amount,
      description: `Achat de code ${code}`,
      createdAt: new Date(),
      status: 'success'
    };

    const transactions = this.transactionsSubject.value;
    const codePurchases = this.codePurchasesSubject.value;
    
    this.transactionsSubject.next([...transactions, transaction]);
    this.codePurchasesSubject.next([...codePurchases, codePurchase]);
    
    return codePurchase;
  }

  private generateCode(): string {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  }

  getTransactionsByAccount(accountId: string): Transaction[] {
    return this.transactionsSubject.value.filter(t => t.accountId === accountId);
  }
}