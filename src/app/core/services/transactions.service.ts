import { Injectable } from '@angular/core';
import { BankStatement } from '../../utils/interfaces/bankStatement.interface';
import { Observable, from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TransactionsService {

  /**
   * Fetches bank statement data from the server
   * @returns Observable with BankStatement data
   */
  getTransactions(): Observable<BankStatement> {
    return from(this.fetchBankStatement());
  }

  /**
   * Private method to fetch data using fetch API
   * Uses proxied path to avoid CORS issues
   */
  private async fetchBankStatement(): Promise<BankStatement> {
    try {
      const response = await fetch('/api/getbalance');

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: BankStatement = await response.json();

      if (data && data.account && data.transactions) {
        return data;
      } else {
        throw new Error('Invalid data structure received');
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
      throw error;
    }
  }
}
