import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TransactionsList } from './transactions-list.component';

describe('TransactionsList', () => {
  let component: TransactionsList;
  let fixture: ComponentFixture<TransactionsList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransactionsList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransactionsList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should determine if transaction is credit', () => {
    const creditTransaction = {
      from: 'John Doe',
      description: 'Payment',
      amount: 100,
      date: '2024-01-01'
    };
    expect(component.isCredit(creditTransaction)).toBe(true);
  });

  it('should determine if transaction is debit', () => {
    const debitTransaction = {
      to: 'Store',
      description: 'Purchase',
      amount: 50,
      date: '2024-01-01'
    };
    expect(component.isCredit(debitTransaction)).toBe(false);
  });

  it('should get counterparty name from "from" field', () => {
    const transaction = {
      from: 'John Doe',
      description: 'Payment',
      amount: 100,
      date: '2024-01-01'
    };
    expect(component.getCounterparty(transaction)).toBe('John Doe');
  });

  it('should get counterparty name from "to" field', () => {
    const transaction = {
      to: 'Store',
      description: 'Purchase',
      amount: 50,
      date: '2024-01-01'
    };
    expect(component.getCounterparty(transaction)).toBe('Store');
  });

  it('should format amount with sign for credit', () => {
    const result = component.formatAmount(100.50, true);
    expect(result).toContain('+');
    expect(result).toContain('100.50');
  });

  it('should format amount with sign for debit', () => {
    const result = component.formatAmount(50.25, false);
    expect(result).toContain('-');
    expect(result).toContain('50.25');
  });

  it('should return success severity for credit', () => {
    expect(component.getSeverity(true)).toBe('success');
  });

  it('should return danger severity for debit', () => {
    expect(component.getSeverity(false)).toBe('danger');
  });
});

