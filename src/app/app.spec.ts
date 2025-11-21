import { TestBed, ComponentFixture } from '@angular/core/testing';
import { App } from './app';
import { TransactionsService } from './core/services/transactions.service';
import { of, throwError } from 'rxjs';
import { BankStatement } from './utils/interfaces/bankStatement.interface';

describe('App', () => {
  let component: App;
  let fixture: ComponentFixture<App>;
  let mockTransactionsService: jasmine.SpyObj<TransactionsService>;

  const mockData: BankStatement = {
    account: {
      name: 'Test User',
      iban: 'NL28ABNA0719200833',
      balance: 1000
    },
    currency: 'EURO',
    transactions: []
  };

  beforeEach(async () => {
    // Create mock service
    mockTransactionsService = jasmine.createSpyObj('TransactionsService', ['getTransactions']);
    // Set default return value for all tests
    mockTransactionsService.getTransactions.and.returnValue(of(mockData));

    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        { provide: TransactionsService, useValue: mockTransactionsService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(App);
    component = fixture.componentInstance;
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should have title signal initialized', () => {
    expect((component as any).title()).toBe('angular-project-nice');
  });

  it('should render account-page component', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-account-page')).toBeTruthy();
  });

  it('should render without errors when data is available', () => {
    expect(() => {
      fixture.detectChanges();
    }).not.toThrow();
  });

  it('should render without errors when service returns error', () => {
    mockTransactionsService.getTransactions.and.returnValue(
      throwError(() => new Error('Test error'))
    );

    expect(() => {
      fixture.detectChanges();
    }).not.toThrow();
  });

  it('should successfully integrate with AccountPageComponent with transactions', () => {
    const mockDataWithTransactions: BankStatement = {
      account: {
        name: 'Integration Test User',
        iban: 'NL28ABNA0719200833',
        balance: 5000
      },
      currency: 'EURO',
      transactions: [
        {
          from: 'Test Sender',
          description: 'Test transaction',
          amount: 100,
          date: '2024-01-01T10:00:00.000Z'
        }
      ]
    };

    mockTransactionsService.getTransactions.and.returnValue(of(mockDataWithTransactions));
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const accountPage = compiled.querySelector('app-account-page');
    expect(accountPage).toBeTruthy();
  });
});

