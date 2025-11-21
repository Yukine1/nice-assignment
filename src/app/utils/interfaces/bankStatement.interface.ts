import { Account } from './account.interface';
import { Transaction } from './transaction.interface';

export interface BankStatement {
  account: Account;
  currency: string;
  transactions: Transaction[];
}
