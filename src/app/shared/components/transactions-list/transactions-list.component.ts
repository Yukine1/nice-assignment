import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { DividerModule } from 'primeng/divider';
import { Transaction } from '../../../utils/interfaces/transaction.interface';

@Component({
  selector: 'app-transactions-list',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    TagModule,
    DividerModule
  ],
  templateUrl: './transactions-list.component.html',
  styleUrl: './transactions-list.component.scss',
})
export class TransactionsList {
  @Input() transactions: Transaction[] = [];
  @Input() currency: string = 'EURO';

  /**
   * Determines if transaction is incoming (credit) or outgoing (debit)
   * @param transaction - Transaction object (can have null/undefined fields)
   */
  isCredit(transaction: Transaction | null | undefined): boolean {
    if (!transaction) return false;
    return !!transaction.from;
  }

  /**
   * Gets the counterparty name (from or to)
   * @param transaction - Transaction object (can have null/undefined fields)
   */
  getCounterparty(transaction: Transaction | null | undefined): string {
    if (!transaction) return 'Unknown';
    return transaction.from || transaction.to || 'Unknown';
  }

  /**
   * Formats the transaction date safely
   * @param dateString - Date string (can be null/undefined)
   */
  formatDate(dateString: string | null | undefined): string {
    if (!dateString) return 'N/A';

    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'Invalid Date';
      }
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid Date';
    }
  }

  /**
   * Formats currency amount with sign safely
   * @param amount - Amount to format (can be null/undefined)
   * @param isCredit - Whether this is a credit transaction
   */
  formatAmount(amount: number | null | undefined, isCredit: boolean): string {
    if (amount === null || amount === undefined) {
      return isCredit ? '+€0.00' : '-€0.00';
    }

    const sign = isCredit ? '+' : '-';
    const formatted = new Intl.NumberFormat('en-US', {
      style: 'decimal',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
    return `${sign}€${formatted}`;
  }

  /**
   * Gets severity for tag based on transaction type
   */
  getSeverity(isCredit: boolean): 'success' | 'danger' {
    return isCredit ? 'success' : 'danger';
  }
}

