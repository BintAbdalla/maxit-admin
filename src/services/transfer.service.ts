import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Transfer } from '../models/interfaces';

@Injectable({
  providedIn: 'root'
})
export class TransferService {
  private transfersSubject = new BehaviorSubject<Transfer[]>([
    {
      id: 'T001',
      fromAccountId: '1',
      toAccountId: '2',
      fromAccountName: 'Jean Dupont',
      toAccountName: 'Marie Martin',
      amount: 500,
      fees: 25,
      status: 'cancellation_requested',
      createdAt: new Date('2024-12-20T10:30:00'),
      cancelRequestedAt: new Date('2024-12-21T14:15:00'),
      cancelReason: 'Erreur de destinataire'
    },
    {
      id: 'T002',
      fromAccountId: '3',
      toAccountId: '1',
      fromAccountName: 'Pierre Bernard',
      toAccountName: 'Jean Dupont',
      amount: 200,
      fees: 10,
      status: 'completed',
      createdAt: new Date('2024-12-19T16:45:00')
    },
    {
      id: 'T003',
      fromAccountId: '2',
      toAccountId: '3',
      fromAccountName: 'Marie Martin',
      toAccountName: 'Pierre Bernard',
      amount: 1000,
      fees: 50,
      status: 'cancellation_requested',
      createdAt: new Date('2024-12-18T09:20:00'),
      cancelRequestedAt: new Date('2024-12-21T11:30:00'),
      cancelReason: 'Montant incorrect'
    }
  ]);

  transfers$ = this.transfersSubject.asObservable();

  getTransfers(): Observable<Transfer[]> {
    return this.transfers$;
  }

  getCancellationRequests(): Transfer[] {
    return this.transfersSubject.value.filter(t => t.status === 'cancellation_requested');
  }

  canCancelTransfer(transferId: string, receiverBalance: number): { canCancel: boolean; reason?: string } {
    const transfer = this.transfersSubject.value.find(t => t.id === transferId);
    
    if (!transfer) {
      return { canCancel: false, reason: 'Transfert introuvable' };
    }

    if (transfer.status !== 'cancellation_requested') {
      return { canCancel: false, reason: 'Aucune demande d\'annulation en cours' };
    }

    if (receiverBalance < transfer.amount) {
      return { canCancel: false, reason: 'Fonds insuffisants sur le compte du récepteur' };
    }

    return { canCancel: true };
  }

  processTransferCancellation(transferId: string): { success: boolean; refundAmount?: number; reason?: string } {
    const transfers = this.transfersSubject.value;
    const transferIndex = transfers.findIndex(t => t.id === transferId);
    
    if (transferIndex !== -1) {
      const transfer = transfers[transferIndex];
      const refundAmount = transfer.amount - transfer.fees;
      
      transfers[transferIndex].status = 'cancelled';
      this.transfersSubject.next([...transfers]);
      
      return { success: true, refundAmount };
    }
    
    return { success: false, reason: 'Échec du traitement de l\'annulation' };
  }
}