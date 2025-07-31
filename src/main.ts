import { Component } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // nécessaire pour ngModel
import { AccountListComponent } from './components/account-list/account-list.component';
import { TransferCancellationComponent } from './components/transfer-cancellation/transfer-cancellation.component';
import { TransactionManagerComponent } from './components/transaction-form/transaction-form.component'; // ton composant

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule, // pour ngModel dans tous les sous-composants
    AccountListComponent,
    TransferCancellationComponent,
    TransactionManagerComponent
  ],
  template: `
    <div class="app">
      <header class="app-header">
        <div class="header-content">
          <h1 class="app-title">
            <span class="title-icon">⚡</span>
            Admin Panel - Maxit-221
          </h1>
          <p class="app-subtitle">Gestion des comptes principaux et transactions</p>
        </div>
      </header>

      <nav class="app-nav">
        <div class="nav-content">
          <button 
            *ngFor="let tab of tabs"
            class="nav-tab"
            [class.active]="activeTab === tab.id"
            (click)="setActiveTab(tab.id)"
          >
            <span class="tab-icon">{{ tab.icon }}</span>
            <span class="tab-label">{{ tab.label }}</span>
          </button>
        </div>
      </nav>

      <main class="app-main">
        <div class="main-content">
          <app-account-list *ngIf="activeTab === 'accounts'"></app-account-list>
          <app-transfer-cancellation *ngIf="activeTab === 'cancellations'"></app-transfer-cancellation>
          <app-transaction-manager *ngIf="activeTab === 'transactions'"></app-transaction-manager>
        </div>
      </main>

      <footer class="app-footer">
        <div class="footer-content">
          <p>&copy; 2024 Maxit-221 Admin Panel. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  `,
styles: [`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  .app {
    min-height: 100vh;
    background: #f8fafc;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  }

  .app-header {
    background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
    color: white;
    padding: 24px 0;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  .header-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 24px;
  }

  .app-title {
    font-size: 28px;
    font-weight: 700;
    margin-bottom: 8px;
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .title-icon {
    font-size: 32px;
  }

  .app-subtitle {
    font-size: 16px;
    opacity: 0.9;
    font-weight: 400;
  }

  .app-nav {
    background: white;
    border-bottom: 1px solid #e5e7eb;
    sticky: top 0;
    z-index: 100;
  }

  .nav-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 24px;
    display: flex;
    gap: 8px;
  }

  .nav-tab {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 16px 20px;
    border: none;
    background: none;
    color: #6b7280;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    border-bottom: 3px solid transparent;
    transition: all 0.2s ease;
  }

  .nav-tab:hover {
    color: #2563eb;
    background: #f8fafc;
  }

  .nav-tab.active {
    color: #2563eb;
    border-bottom-color: #2563eb;
    background: #eff6ff;
  }

  .tab-icon {
    font-size: 16px;
  }

  .app-main {
    min-height: calc(100vh - 200px);
  }

  .main-content {
    max-width: 1200px;
    margin: 0 auto;
  }

  .app-footer {
    background: #374151;
    color: white;
    padding: 20px 0;
    margin-top: 48px;
  }

  .footer-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 24px;
    text-align: center;
    font-size: 14px;
    opacity: 0.8;
  }

  @media (max-width: 768px) {
    .header-content,
    .nav-content,
    .footer-content {
      padding: 0 16px;
    }

    .app-title {
      font-size: 24px;
    }

    .nav-content {
      flex-direction: column;
      gap: 0;
    }

    .nav-tab {
      padding: 12px 16px;
      border-bottom: 1px solid #e5e7eb;
      border-right: none;
    }

    .nav-tab.active {
      border-bottom-color: #2563eb;
    }
  }
`]

})
export class App {
  activeTab = 'accounts';
  
  tabs = [
    { id: 'accounts', label: 'Comptes Principaux', icon: '👥' },
    { id: 'cancellations', label: 'Annulations Transfert', icon: '❌' },
    { id: 'transactions', label: 'Transactions', icon: '💸' }
  ];

  setActiveTab(tabId: string) {
    this.activeTab = tabId;
  }
}

bootstrapApplication(App);
