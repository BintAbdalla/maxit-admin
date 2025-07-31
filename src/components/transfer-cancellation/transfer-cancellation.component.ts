import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Transfer } from '../../models/interfaces';
import { TransferService } from '../../services/transfer.service';
import { AccountService } from '../../services/account.service';

@Component({
  selector: 'app-transfer-cancellation',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="transfer-cancellation">
      <h2 class="section-title">Demandes d'Annulation de Transfert</h2>

      <!-- Message d'information -->
      <div *ngIf="message" class="message-box" [ngClass]="messageType">
        {{ message }}
      </div>

      <!-- Boîte de confirmation -->
      <div class="dialog-backdrop" *ngIf="confirmDialog.show">
        <div class="dialog-box">
          <h4>Confirmation</h4>
       <p>{{ confirmationMessage }}</p>

          <div class="dialog-actions">
            <button (click)="confirmAction()" class="btn btn-success">Confirmer</button>
            <button (click)="closeDialog()" class="btn btn-secondary">Annuler</button>
          </div>
        </div>
      </div>

      <div *ngIf="cancellationRequests.length === 0" class="empty-state">
        <p>Aucune demande d'annulation en attente</p>
      </div>

      <div class="requests-list" *ngIf="cancellationRequests.length > 0">
        <div *ngFor="let transfer of cancellationRequests" class="request-card">
          <div class="request-header">
            <div class="transfer-id">
              <h3>Transfert {{ transfer.id }}</h3>
              <span class="request-date">
                Demande le {{ transfer.cancelRequestedAt | date:'short' }}
              </span>
            </div>
            <span class="amount">{{ transfer.amount | currency:'EUR':'symbol':'1.2-2' }}</span>
          </div>

          <div class="transfer-details">
            <div class="transfer-info">
              <div class="participant">
                <span class="label">Expéditeur:</span>
                <span class="name">{{ transfer.fromAccountName }}</span>
              </div>
              <div class="participant">
                <span class="label">Récepteur:</span>
                <span class="name">{{ transfer.toAccountName }}</span>
              </div>
              <div class="fees">
                <span class="label">Frais:</span>
                <span class="fee-amount">{{ transfer.fees | currency:'EUR':'symbol':'1.2-2' }}</span>
              </div>
            </div>

            <div class="cancel-reason" *ngIf="transfer.cancelReason">
              <span class="label">Motif d'annulation:</span>
              <p>{{ transfer.cancelReason }}</p>
            </div>
          </div>

          <div class="validation-status">
            <div 
              class="status-check"
              [ngClass]="{
                'valid': getValidationStatus(transfer).canCancel,
                'invalid': !getValidationStatus(transfer).canCancel
              }"
            >
              <span class="status-icon">
                {{ getValidationStatus(transfer).canCancel ? '✓' : '✗' }}
              </span>
              <span class="status-text">
                {{ getValidationStatus(transfer).reason || 'Annulation possible' }}
              </span>
            </div>
          </div>

          <div class="request-actions">
            <button 
              class="btn btn-success"
              [disabled]="!getValidationStatus(transfer).canCancel"
              (click)="openConfirmation(transfer, 'approve')"
            >
              Approuver l'annulation
            </button>
            <button class="btn btn-secondary" (click)="openConfirmation(transfer, 'reject')">
              Rejeter
            </button>
          </div>

          <div class="refund-info" *ngIf="getValidationStatus(transfer).canCancel">
            <span class="refund-label">Montant de remboursement:</span>
            <span class="refund-amount">
              {{ (transfer.amount - transfer.fees) | currency:'EUR':'symbol':'1.2-2' }}
            </span>
            <small class="refund-note">
              (Montant original {{ transfer.amount | currency:'EUR':'symbol':'1.2-2' }} - Frais {{ transfer.fees | currency:'EUR':'symbol':'1.2-2' }})
            </small>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .transfer-cancellation {
      padding: 24px;
    }

    .section-title {
      font-size: 24px;
      font-weight: 600;
      color: #1f2937;
      margin-bottom: 24px;
    }

    .empty-state {
      text-align: center;
      padding: 48px;
      color: #6b7280;
      background: #f9fafb;
      border-radius: 12px;
    }

    .requests-list {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .request-card {
      background: white;
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      border-left: 4px solid #f59e0b;
    }

    .request-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 16px;
    }

    .transfer-id h3 {
      font-size: 18px;
      font-weight: 600;
      color: #1f2937;
      margin-bottom: 4px;
    }

    .request-date {
      font-size: 12px;
      color: #6b7280;
    }

    .amount {
      font-size: 20px;
      font-weight: 700;
      color: #1f2937;
    }

    .transfer-details {
      margin-bottom: 16px;
    }

    .transfer-info {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 12px;
      margin-bottom: 12px;
    }

    .participant, .fees {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .label {
      font-size: 12px;
      color: #6b7280;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .name, .fee-amount {
      font-weight: 500;
      color: #1f2937;
    }

    .cancel-reason {
      background: #fef3c7;
      padding: 12px;
      border-radius: 8px;
      border-left: 4px solid #f59e0b;
    }

    .cancel-reason p {
      margin-top: 4px;
      color: #92400e;
    }

    .validation-status {
      margin-bottom: 16px;
    }

    .status-check {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px;
      border-radius: 8px;
    }

    .status-check.valid {
      background: #d1fae5;
      color: #065f46;
    }

    .status-check.invalid {
      background: #fee2e2;
      color: #991b1b;
    }

    .status-icon {
      font-weight: bold;
      font-size: 16px;
    }

    .request-actions {
      display: flex;
      gap: 12px;
      margin-bottom: 16px;
    }

    .btn {
      padding: 10px 20px;
      border-radius: 6px;
      border: none;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .btn-success {
      background: #10b981;
      color: white;
    }

    .btn-success:hover:not(:disabled) {
      background: #059669;
    }

    .btn-secondary {
      background: #6b7280;
      color: white;
    }

    .btn-secondary:hover {
      background: #4b5563;
    }

    .refund-info {
      background: #ecfdf5;
      padding: 16px;
      border-radius: 8px;
      border: 1px solid #a7f3d0;
    }

    .refund-label {
      font-size: 14px;
      color: #065f46;
      font-weight: 500;
    }

    .refund-amount {
      font-size: 18px;
      font-weight: 700;
      color: #059669;
      margin-left: 8px;
    }

    .refund-note {
      display: block;
      margin-top: 4px;
      color: #047857;
      font-size: 12px;
    }

    .message-box {
      padding: 16px;
      border-radius: 8px;
      margin-bottom: 16px;
      font-weight: 500;
    }

    .message-box.success {
      background-color: #d1fae5;
      color: #065f46;
      border: 1px solid #10b981;
    }

    .message-box.error {
      background-color: #fee2e2;
      color: #991b1b;
      border: 1px solid #ef4444;
    }

    .dialog-backdrop {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 50;
    }

    .dialog-box {
      background: white;
      padding: 24px;
      border-radius: 8px;
      width: 90%;
      max-width: 400px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      text-align: center;
    }

    .dialog-box h4 {
      margin-bottom: 12px;
      font-size: 18px;
    }

    .dialog-actions {
      margin-top: 20px;
      display: flex;
      justify-content: space-around;
    }

    @media (max-width: 768px) {
      .transfer-cancellation {
        padding: 16px;
      }

      .request-header {
        flex-direction: column;
        gap: 8px;
      }

      .transfer-info {
        grid-template-columns: 1fr;
      }

      .request-actions {
        flex-direction: column;
      }
    }
  `]
})
export class TransferCancellationComponent implements OnInit {
  cancellationRequests: Transfer[] = [];
  message: string = '';
  messageType: 'success' | 'error' | '' = '';
  confirmDialog = {
    show: false,
    transfer: null as Transfer | null,
    action: '' as 'approve' | 'reject' | ''
  };

  constructor(
    private transferService: TransferService,
    private accountService: AccountService
  ) {}

  ngOnInit() {
    this.loadCancellationRequests();
  }

  loadCancellationRequests() {
    this.cancellationRequests = this.transferService.getCancellationRequests();
  }

  getValidationStatus(transfer: Transfer): { canCancel: boolean; reason?: string } {
    const receiverAccount = this.accountService.getAccountById(transfer.toAccountId);
    if (!receiverAccount) {
      return { canCancel: false, reason: 'Compte récepteur introuvable' };
    }
    return this.transferService.canCancelTransfer(transfer.id, receiverAccount.balance);
  }

  openConfirmation(transfer: Transfer, action: 'approve' | 'reject') {
    this.confirmDialog = {
      show: true,
      transfer,
      action
    };
  }

  closeDialog() {
    this.confirmDialog = {
      show: false,
      transfer: null,
      action: ''
    };
  }
  get confirmationMessage(): string {
  if (!this.confirmDialog.transfer) return '';
  const actionText = this.confirmDialog.action === 'approve'
    ? "approuver l'annulation"
    : 'rejeter';
  return `Voulez-vous vraiment ${actionText} du transfert ${this.confirmDialog.transfer.id} ?`;
}


  confirmAction() {
    const transfer = this.confirmDialog.transfer!;
    const action = this.confirmDialog.action;
    this.closeDialog();

    if (action === 'approve') {
      this.handleApproval(transfer);
    } else {
      this.handleRejection(transfer);
    }
  }

  handleApproval(transfer: Transfer) {
    const validationStatus = this.getValidationStatus(transfer);
    if (!validationStatus.canCancel) {
      this.messageType = 'error';
      this.message = `Annulation refusée: ${validationStatus.reason}`;
      return;
    }

    const result = this.transferService.processTransferCancellation(transfer.id);
    if (result.success) {
      const sender = this.accountService.getAccountById(transfer.fromAccountId);
      const receiver = this.accountService.getAccountById(transfer.toAccountId);

      if (sender && result.refundAmount) {
        this.accountService.updateAccountBalance(sender.id, sender.balance + result.refundAmount);
      }
      if (receiver) {
        this.accountService.updateAccountBalance(receiver.id, receiver.balance - transfer.amount);
      }

      this.messageType = 'success';
      this.message = `Annulation approuvée. Montant remboursé: ${result.refundAmount}€`;
      this.loadCancellationRequests();
    } else {
      this.messageType = 'error';
      this.message = `Erreur: ${result.reason}`;
    }
  }

  handleRejection(transfer: Transfer) {
    this.messageType = 'success';
    this.message = `Demande d'annulation rejetée pour le transfert ${transfer.id}.`;
  }
}
