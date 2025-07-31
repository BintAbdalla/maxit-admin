import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Account, Transaction } from '../models/interfaces';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private accountsSubject = new BehaviorSubject<Account[]>([
    {
      id: '1',
      accountNumber: 'ACC001',
      ownerName: 'Jean Dupont',
      phoneNumber: '+33123456789',
      balance: 1500.50,
      isBlocked: false,
      createdAt: new Date('2024-01-15'),
      lastActivity: new Date()
    },
    {
      id: '2',
      accountNumber: 'ACC002',
      ownerName: 'Marie Martin',
      phoneNumber: '+33987654321',
      balance: 2300.75,
      isBlocked: true,
      createdAt: new Date('2024-02-20'),
      lastActivity: new Date('2024-12-01')
    },
    {
      id: '3',
      accountNumber: 'ACC003',
      ownerName: 'Pierre Bernard',
      phoneNumber: '+33456789123',
      balance: 750.25,
      isBlocked: false,
      createdAt: new Date('2024-03-10'),
      lastActivity: new Date()
    }
  ]);

  accounts$ = this.accountsSubject.asObservable();

  getAccounts(): Observable<Account[]> {
    return this.accounts$;
  }

  getAccountById(id: string): Account | undefined {
    return this.accountsSubject.value.find(account => account.id === id);
  }

  toggleAccountBlock(accountId: string): boolean {
    const accounts = this.accountsSubject.value;
    const accountIndex = accounts.findIndex(acc => acc.id === accountId);
    
    if (accountIndex !== -1) {
      accounts[accountIndex].isBlocked = !accounts[accountIndex].isBlocked;
      accounts[accountIndex].lastActivity = new Date();
      this.accountsSubject.next([...accounts]);
      return true;
    }
    return false;
  }

  updateAccountBalance(accountId: string, newBalance: number): boolean {
    const accounts = this.accountsSubject.value;
    const accountIndex = accounts.findIndex(acc => acc.id === accountId);
    
    if (accountIndex !== -1) {
      accounts[accountIndex].balance = newBalance;
      accounts[accountIndex].lastActivity = new Date();
      this.accountsSubject.next([...accounts]);
      return true;
    }
    return false;
  }

  canPerformTransaction(accountId: string): { canPerform: boolean; reason?: string } {
    const account = this.getAccountById(accountId);
    
    if (!account) {
      return { canPerform: false, reason: 'Compte introuvable' };
    }
    
    if (account.isBlocked) {
      return { canPerform: false, reason: 'Compte bloqué - aucune transaction autorisée' };
    }
    
    return { canPerform: true };
  }
}