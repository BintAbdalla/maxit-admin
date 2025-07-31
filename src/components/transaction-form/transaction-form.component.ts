import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Account {
  id: string;
  accountNumber: string;
  ownerName: string;
  balance: number;
  isBlocked: boolean;
}

interface Transaction {
  type: 'deposit' | 'withdrawal' | 'codePurchase';
  amount: number;
  description: string;
  account: Account;
  phoneNumber?: string;
  code?: string;
}

@Component({
  selector: 'app-transaction-manager',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container">
      <h2>Gestion des Transactions</h2>

      <div class="btn-group">
        <button (click)="openModal('deposit')" class="btn btn-deposit">Dépôt</button>
        <button (click)="openModal('withdrawal')" class="btn btn-withdrawal">Retrait</button>
        <button (click)="openModal('codePurchase')" class="btn btn-codePurchase">Achat de code</button>
      </div>

      <table>
        <thead>
          <tr>
            <th>Type</th>
            <th>Montant</th>
            <th>Compte</th>
            <th>Description / Téléphone</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let t of transactions" [ngClass]="getTransactionClass(t.type)">
            <td>{{ formatType(t.type) }}</td>
            <td>{{ t.amount | number:'1.0-0' }} F</td>
            <td>{{ t.account.accountNumber }}</td>
            <td>{{ t.type === 'codePurchase' ? t.phoneNumber : t.description }}</td>
          </tr>
          <tr *ngIf="transactions.length === 0">
            <td colspan="4" class="no-transaction">Aucune transaction enregistrée.</td>
          </tr>
        </tbody>
      </table>

      <!-- Modal -->
      <div *ngIf="showModal" class="modal-backdrop" (click)="closeModalOnBackdrop($event)">
        <div class="modal" (click)="$event.stopPropagation()">
          <h3>
            {{ modalType === 'deposit' ? 'Dépôt' : modalType === 'withdrawal' ? 'Retrait' : 'Achat de code' }}
          </h3>

          <form (ngSubmit)="modalType === 'codePurchase' ? submitCodePurchase() : submitTransaction()">
            <label>Compte :</label>
            <select [(ngModel)]="selectedAccount" name="account" required>
              <option [ngValue]="null" disabled>-- Sélectionner un compte --</option>
              <option *ngFor="let account of accounts" [ngValue]="account">
                {{ account.ownerName }} - {{ account.accountNumber }} ({{ account.balance | number:'1.0-0' }} F CFA)
              </option>
            </select>
            <!-- <div *ngIf="errors.account" class="error-msg">{{ errors.account }}</div> -->

            <ng-container *ngIf="modalType !== 'codePurchase'">
              <label>Montant :</label>
              <input type="number" [(ngModel)]="amount" name="amount" min="1" required />
              <!-- <div *ngIf="errors.amount" class="error-msg">{{ errors.amount }}</div> -->

              <label>Description :</label>
              <input type="text" [(ngModel)]="description" name="description" required />
              <!-- <div *ngIf="errors.description" class="error-msg">{{ errors.description }}</div> -->
            </ng-container>

            <ng-container *ngIf="modalType === 'codePurchase'">
              <label>Téléphone :</label>
              <input type="tel" [(ngModel)]="phoneNumber" name="phone" required />
              <!-- <div *ngIf="errors.phoneNumber" class="error-msg">{{ errors.phoneNumber }}</div> -->

              <label>Montant :</label>
              <input type="number" [(ngModel)]="amount" name="codeAmount" min="1" required />
              <!-- <div *ngIf="errors.amount" class="error-msg">{{ errors.amount }}</div> -->
            </ng-container>

            <div class="modal-buttons">
              <button type="submit" class="btn btn-submit">
                {{ modalType === 'codePurchase' ? 'Acheter' : 'Valider' }}
              </button>
              <button type="button" (click)="closeModal()" class="btn btn-cancel">Annuler</button>
            </div>

            <div *ngIf="formError" class="form-error">
              {{ formError }}
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
 styles: [`
  .container {
    max-width: 1100px;
    margin: 2rem auto;
    padding: 1.5rem;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  }

  h2 {
    text-align: center;
    font-size: 2.5rem;
    font-weight: bold;
    margin-bottom: 2rem;
  }

  .btn-group {
    display: flex;
    justify-content: center;
    gap: 1.5rem;
    margin-bottom: 2rem;
  }

  .btn {
    padding: 0.75rem 2rem;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 600;
    color: white;
    border: none;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  }

  .btn:hover {
    box-shadow: 0 6px 18px rgba(0,0,0,0.25);
  }

  .btn-deposit {
    background: linear-gradient(135deg, #16a34a, #22c55e);
  }

  .btn-withdrawal {
    background: linear-gradient(135deg, #b91c1c, #ef4444);
  }

  .btn-codePurchase {
    background: linear-gradient(135deg, #1e40af, #3b82f6);
  }

  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 1.1rem;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  }

  th, td {
    padding: 1rem 1.25rem;
    border-bottom: 1px solid #e5e7eb;
  }

  thead {
    background-color: #f1f5f9;
  }

  thead th {
    text-align: left;
    color: #1f2937;
    font-size: 1.15rem;
  }

  tbody tr:nth-child(even) {
    background-color: #f9fafb;
  }

  .deposit {
    background-color: #ecfdf5;
    color: #065f46;
    font-weight: 600;
  }

  .withdrawal {
    background-color: #fef2f2;
    color: #991b1b;
    font-weight: 600;
  }

  .codePurchase {
    background-color: #eff6ff;
    color: #1e3a8a;
    font-weight: 600;
  }

  .no-transaction {
    text-align: center;
    padding: 2rem;
    font-style: italic;
    color: #6b7280;
  }

  .modal-backdrop {
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: 1rem;
  }

  .modal {
    background: white;
    border-radius: 1rem;
    padding: 2rem 2.5rem;
    max-width: 600px;
    width: 100%;
    box-shadow: 0 8px 24px rgba(0,0,0,0.3);
  }

  .modal h3 {
    font-size: 1.75rem;
    font-weight: bold;
    margin-bottom: 1.5rem;
    text-align: center;
  }

  label {
    display: block;
    font-weight: 600;
    margin-bottom: 0.5rem;
    color: #374151;
  }

  input, select {
    width: 100%;
    padding: 0.7rem 1rem;
    font-size: 1rem;
    border: 1px solid #d1d5db;
    border-radius: 0.5rem;
    margin-bottom: 1.25rem;
    box-sizing: border-box;
  }

  input:focus, select:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
  }

  .modal-buttons {
    display: flex;
    gap: 1rem;
    justify-content: space-between;
  }

  .btn-submit {
    background: linear-gradient(135deg, #16a34a, #15803d);
    color: white;
    font-weight: 700;
    border: none;
    border-radius: 0.5rem;
    padding: 0.8rem 1.5rem;
    flex: 1;
    cursor: pointer;
  }

  .btn-cancel {
    background: #6b7280;
    color: white;
    font-weight: 700;
    border: none;
    border-radius: 0.5rem;
    padding: 0.8rem 1.5rem;
    flex: 1;
    cursor: pointer;
  }

  .btn-submit:hover {
    background: linear-gradient(135deg, #15803d, #166534);
  }

  .btn-cancel:hover {
    background: #4b5563;
  }

  .error-msg {
    color: #dc2626;
    font-weight: 600;
    font-size: 0.875rem;
    margin-top: -1rem;
    margin-bottom: 1rem;
  }

  .form-error {
    margin-top: 1rem;
    padding: 1rem;
    background-color: #fee2e2;
    color: #991b1b;
    border-radius: 0.5rem;
    text-align: center;
    font-weight: bold;
    box-shadow: 0 2px 6px rgba(185, 28, 28, 0.3);
  }
`]

})
export class TransactionManagerComponent {
  accounts: Account[] = [
    { id: '1', accountNumber: '1001', ownerName: 'Aissatou', balance: 100000, isBlocked: false },
    { id: '2', accountNumber: '1002', ownerName: 'Fatou', balance: 50000, isBlocked: false },
  ];

  transactions: Transaction[] = [
    {
      type: 'deposit',
      amount: 5000,
      description: 'Dépôt initial',
      account: this.accounts[0],
    }
  ];

  selectedAccount: Account | null = null;
  amount = 0;
  description = '';
  phoneNumber = '';

  modalType: 'deposit' | 'withdrawal' | 'codePurchase' | undefined;
  showModal = false;

  errors: {[key:string]: string} = {};
  formError = '';

  openModal(type: 'deposit' | 'withdrawal' | 'codePurchase') {
    this.modalType = type;
    this.amount = 0;
    this.description = '';
    this.phoneNumber = '';
    this.selectedAccount = null;
    this.errors = {};
    this.formError = '';
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  closeModalOnBackdrop(event: MouseEvent) {
    // ferme le modal si clic en dehors du contenu
    this.closeModal();
  }

  validateCommonFields(): boolean {
    this.errors = {};
    let valid = true;

    if (!this.selectedAccount) {
      this.errors['account'] = 'Veuillez sélectionner un compte.';
      valid = false;
    } else if (this.selectedAccount.isBlocked) {
      this.formError = 'Ce compte est bloqué.';
      valid = false;
    }

    if (this.amount <= 0) {
      this.errors['amount'] = 'Le montant doit être supérieur à 0.';
      valid = false;
    }

    return valid;
  }

  submitTransaction() {
    this.formError = '';
    if (!this.validateCommonFields()) return;

    if (this.modalType === 'withdrawal' && this.selectedAccount!.balance < this.amount) {
      this.formError = 'Fonds insuffisants.';
      return;
    }

    if (!this.description || this.description.trim().length === 0) {
      this.errors['description'] = 'La description est requise.';
      return;
    }

    const newTransaction: Transaction = {
      type: this.modalType!,
      amount: this.amount,
      description: this.description.trim(),
      account: this.selectedAccount!,
    };

    if (this.modalType === 'deposit') {
      this.selectedAccount!.balance += this.amount;
    } else if (this.modalType === 'withdrawal') {
      this.selectedAccount!.balance -= this.amount;
    }

    this.transactions.unshift(newTransaction);
    this.closeModal();
  }

  submitCodePurchase() {
    this.formError = '';
    this.errors = {};

    if (!this.validateCommonFields()) return;

    if (!this.phoneNumber || this.phoneNumber.trim().length === 0) {
      this.errors['phoneNumber'] = 'Le numéro de téléphone est requis.';
      return;
    }

    if (this.selectedAccount!.balance < this.amount) {
      this.formError = 'Fonds insuffisants.';
      return;
    }

    const code = Math.random().toString(36).substring(2, 10).toUpperCase();

    const newTransaction: Transaction = {
      type: 'codePurchase',
      amount: this.amount,
      phoneNumber: this.phoneNumber.trim(),
      description: `Achat de code pour ${this.phoneNumber.trim()}`,
      account: this.selectedAccount!,
      code,
    };

    this.selectedAccount!.balance -= this.amount;
    this.transactions.unshift(newTransaction);
    this.closeModal();
  }

  getTransactionClass(type: string) {
    switch(type) {
      case 'deposit': return 'deposit';
      case 'withdrawal': return 'withdrawal';
      case 'codePurchase': return 'codePurchase';
      default: return '';
    }
  }

  formatType(type: string) {
    switch(type) {
      case 'deposit': return 'Dépôt';
      case 'withdrawal': return 'Retrait';
      case 'codePurchase': return 'Achat de code';
      default: return type;
    }
  }
}
