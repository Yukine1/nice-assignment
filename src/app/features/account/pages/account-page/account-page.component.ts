import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { SkeletonModule } from 'primeng/skeleton';
import { TransactionsService } from '../../../../core/services/transactions.service';
import { BankStatement } from '../../../../utils/interfaces/bankStatement.interface';
import { Account as AccountInterface } from '../../../../utils/interfaces/account.interface';
import { Transaction } from '../../../../utils/interfaces/transaction.interface';
import { TransactionsList } from '../../../../shared/components/transactions-list/transactions-list.component';

@Component({
  selector: 'app-account-page',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    CardModule,
    SkeletonModule,
    TransactionsList
  ],
  templateUrl: './account-page.component.html',
  styleUrl: './account-page.component.scss',
})
export class AccountPageComponent implements OnInit {
  bankStatement = signal<BankStatement | null>(null);
  accountData = signal<AccountInterface | null>(null);
  transactions = signal<Transaction[]>([]);
  currency = signal<string>('');
  isLoading = signal<boolean>(false);
  error = signal<string | null>(null);

  constructor(private transactionsService: TransactionsService) {}

  ngOnInit(): void {
    this.loadBankStatement();
  }

  /**
   * Loads bank statement data from the service
   * Validates data before setting state
   */
  loadBankStatement(): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.transactionsService.getTransactions().subscribe({
      next: (data: BankStatement) => {
        // Validate data structure
        if (!data || !data.account) {
          console.warn('Invalid data structure received:', data);
          this.error.set('Received invalid data from server.');
          this.isLoading.set(false);
          return;
        }

        this.bankStatement.set(data);
        this.accountData.set(data.account);
        this.transactions.set(data.transactions || []);
        this.currency.set(data.currency || 'EUR');
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error loading bank statement:', err);
        this.error.set('Failed to load bank statement. Please try again.');
        this.isLoading.set(false);
      }
    });
  }

  /**
   * Formats currency amount safely
   * @param amount - The amount to format (can be null/undefined)
   * @returns Formatted amount or '0.00' if null/undefined
   */
  formatAmount(amount: number | null | undefined): string {
    if (amount === null || amount === undefined) {
      return '0.00';
    }

    return new Intl.NumberFormat('en-US', {
      style: 'decimal',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  }
}

