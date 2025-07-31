import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Account } from '../../models/interfaces';
import { AccountService } from '../../services/account.service';

@Component({
  selector: 'app-account-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="account-list">
      <h2 class="section-title">Gestion des Comptes Principaux</h2>
      
      <div class="controls-bar">
        <button 
          class="btn btn-toggle-balance"
          (click)="toggleBalanceVisibility()"
        >
          <span class="toggle-icon">{{ showBalances ? '👁️' : '🙈' }}</span>
          {{ showBalances ? 'Masquer les soldes' : 'Afficher les soldes' }}
        </button>
      </div>
      
      <div class="accounts-grid">
        <div 
          *ngFor="let account of accounts" 
          class="account-card"
          [class.blocked]="account.isBlocked"
        >
          <div class="account-header">
            <div class="account-info">
              <h3>{{ account.ownerName }}</h3>
              <p class="account-number">{{ account.accountNumber }}</p>
              <p class="phone">{{ account.phoneNumber }}</p>
            </div>
            <div class="account-status">
              <span 
                class="status-badge"
                [class.active]="!account.isBlocked"
                [class.blocked]="account.isBlocked"
              >
                {{ account.isBlocked ? 'BLOQUÉ' : 'ACTIF' }}
              </span>
            </div>
          </div>
          
          <div class="account-balance">
            <span class="balance-label">Solde disponible</span>
            <span 
              class="balance-amount"
              [class.hidden-balance]="!showBalances"
            >
              {{ showBalances ? (account.balance | currency:'EUR':'symbol':'1.2-2') : '••••••' }}
            </span>
          </div>
          
          <div class="account-meta">
            <small>Dernière activité: {{ account.lastActivity | date:'short' }}</small>
          </div>
          
          <div class="account-actions">
            <button 
              class="btn btn-toggle"
              [class.btn-danger]="!account.isBlocked"
              [class.btn-success]="account.isBlocked"
              (click)="toggleAccountBlock(account.id)"
            >
              {{ account.isBlocked ? 'Débloquer' : 'Bloquer' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .account-list {
      padding: 24px;
    }

    .section-title {
      font-size: 24px;
      font-weight: 600;
      color: #1f2937;
      margin-bottom: 24px;
    }

    .controls-bar {
      display: flex;
      justify-content: flex-end;
      margin-bottom: 20px;
    }

    .btn-toggle-balance {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 16px;
      background: #f3f4f6;
      color: #374151;
      border: 1px solid #d1d5db;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .btn-toggle-balance:hover {
      background: #e5e7eb;
      border-color: #9ca3af;
    }

    .toggle-icon {
      font-size: 16px;
    }

    .accounts-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 20px;
    }

    .account-card {
      background: white;
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      border: 2px solid transparent;
      transition: all 0.3s ease;
    }

    .account-card:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      transform: translateY(-2px);
    }

    .account-card.blocked {
      border-color: #ef4444;
      background: #fef2f2;
    }

    .account-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 16px;
    }

    .account-info h3 {
      font-size: 18px;
      font-weight: 600;
      color: #1f2937;
      margin-bottom: 4px;
    }

    .account-number {
      font-family: monospace;
      color: #6b7280;
      font-size: 14px;
      margin-bottom: 2px;
    }

    .phone {
      color: #6b7280;
      font-size: 14px;
    }

    .status-badge {
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .status-badge.active {
      background: #d1fae5;
      color: #065f46;
    }

    .status-badge.blocked {
      background: #fee2e2;
      color: #991b1b;
    }

    .account-balance {
      display: flex;
      flex-direction: column;
      margin-bottom: 16px;
      padding: 16px;
      background: #f9fafb;
      border-radius: 8px;
    }

    .balance-label {
      font-size: 12px;
      color: #6b7280;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 4px;
    }

    .balance-amount {
      font-size: 24px;
      font-weight: 700;
      color: #1f2937;
    }

    .balance-amount.hidden-balance {
      font-family: monospace;
      letter-spacing: 2px;
      color: #9ca3af;
      transition: all 0.3s ease;
    }

    .account-meta {
      margin-bottom: 16px;
      color: #6b7280;
      font-size: 12px;
    }

    .account-actions {
      display: flex;
      gap: 8px;
    }

    .btn {
      padding: 8px 16px;
      border-radius: 6px;
      border: none;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .btn-toggle {
      flex: 1;
    }

    .btn-danger {
      background: #ef4444;
      color: white;
    }

    .btn-danger:hover {
      background: #dc2626;
    }

    .btn-success {
      background: #10b981;
      color: white;
    }

    .btn-success:hover {
      background: #059669;
    }

    @media (max-width: 768px) {
      .accounts-grid {
        grid-template-columns: 1fr;
      }
      
      .account-list {
        padding: 16px;
      }
    }
  `]
})
export class AccountListComponent implements OnInit {
  accounts: Account[] = [];
  showBalances = true;

  constructor(private accountService: AccountService) {}

  ngOnInit() {
    this.accountService.getAccounts().subscribe(accounts => {
      this.accounts = accounts;
    });
  }

  toggleAccountBlock(accountId: string) {
    const success = this.accountService.toggleAccountBlock(accountId);
    if (success) {
      console.log('État du compte modifié avec succès');
    }
  }

  toggleBalanceVisibility() {
    this.showBalances = !this.showBalances;
  }
}