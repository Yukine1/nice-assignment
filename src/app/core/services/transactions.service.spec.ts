import { TestBed } from '@angular/core/testing';
import { TransactionsService } from './transactions.service';
import { BankStatement } from '../../utils/interfaces/bankStatement.interface';

describe('TransactionsService', () => {
  let service: TransactionsService;
  let originalFetch: typeof fetch;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TransactionsService]
    });
    service = TestBed.inject(TransactionsService);

    // Store original fetch
    originalFetch = window.fetch;
  });

  afterEach(() => {
    // Restore original fetch
    window.fetch = originalFetch;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getTransactions', () => {
    it('should return Observable<BankStatement>', (done) => {
      const mockData: BankStatement = {
        account: {
          name: 'Test User',
          iban: 'NL28ABNA0719200833',
          balance: 1000.50
        },
        currency: 'EURO',
        transactions: [
          {
            from: 'John Doe',
            description: 'Payment',
            amount: 100.00,
            date: '2024-01-01T10:00:00.000Z'
          }
        ]
      };

      // Mock fetch
      window.fetch = jasmine.createSpy('fetch').and.returnValue(
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockData)
        } as Response)
      );

      service.getTransactions().subscribe({
        next: (data) => {
          expect(data).toEqual(mockData);
          expect(data.account.name).toBe('Test User');
          expect(data.transactions.length).toBe(1);
          done();
        },
        error: (error) => {
          fail('Should not have failed: ' + error);
        }
      });
    });

    it('should fetch from /api/getbalance endpoint', (done) => {
      const mockData: BankStatement = {
        account: {
          name: 'Test User',
          iban: 'NL28ABNA0719200833',
          balance: 1000.50
        },
        currency: 'EURO',
        transactions: []
      };

      const fetchSpy = jasmine.createSpy('fetch').and.returnValue(
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockData)
        } as Response)
      );
      window.fetch = fetchSpy;

      service.getTransactions().subscribe({
        next: () => {
          expect(fetchSpy).toHaveBeenCalledWith('/api/getbalance');
          done();
        }
      });
    });

    it('should handle empty transactions array', (done) => {
      const mockData: BankStatement = {
        account: {
          name: 'Test User',
          iban: 'NL28ABNA0719200833',
          balance: 0
        },
        currency: 'EURO',
        transactions: []
      };

      window.fetch = jasmine.createSpy('fetch').and.returnValue(
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockData)
        } as Response)
      );

      service.getTransactions().subscribe({
        next: (data) => {
          expect(data.transactions).toEqual([]);
          expect(data.transactions.length).toBe(0);
          done();
        }
      });
    });

    it('should handle multiple transactions', (done) => {
      const mockData: BankStatement = {
        account: {
          name: 'Test User',
          iban: 'NL28ABNA0719200833',
          balance: 5000.00
        },
        currency: 'EURO',
        transactions: [
          {
            from: 'Sender 1',
            description: 'Payment 1',
            amount: 100.00,
            date: '2024-01-01T10:00:00.000Z'
          },
          {
            to: 'Recipient 1',
            description: 'Payment 2',
            amount: 50.00,
            date: '2024-01-02T10:00:00.000Z'
          },
          {
            from: 'Sender 2',
            description: 'Payment 3',
            amount: 200.00,
            date: '2024-01-03T10:00:00.000Z'
          }
        ]
      };

      window.fetch = jasmine.createSpy('fetch').and.returnValue(
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockData)
        } as Response)
      );

      service.getTransactions().subscribe({
        next: (data) => {
          expect(data.transactions.length).toBe(3);
          expect(data.transactions[0].from).toBe('Sender 1');
          expect(data.transactions[1].to).toBe('Recipient 1');
          done();
        }
      });
    });
  });

  describe('Error Handling', () => {
    it('should throw error when response is not ok (404)', (done) => {
      window.fetch = jasmine.createSpy('fetch').and.returnValue(
        Promise.resolve({
          ok: false,
          status: 404
        } as Response)
      );

      service.getTransactions().subscribe({
        next: () => {
          fail('Should have thrown an error');
        },
        error: (error) => {
          expect(error).toBeTruthy();
          expect(error.message).toContain('HTTP error');
          done();
        }
      });
    });

    it('should throw error when response is not ok (500)', (done) => {
      window.fetch = jasmine.createSpy('fetch').and.returnValue(
        Promise.resolve({
          ok: false,
          status: 500
        } as Response)
      );

      service.getTransactions().subscribe({
        next: () => {
          fail('Should have thrown an error');
        },
        error: (error) => {
          expect(error).toBeTruthy();
          expect(error.message).toContain('500');
          done();
        }
      });
    });

    it('should throw error when response is not ok (503)', (done) => {
      window.fetch = jasmine.createSpy('fetch').and.returnValue(
        Promise.resolve({
          ok: false,
          status: 503
        } as Response)
      );

      service.getTransactions().subscribe({
        next: () => {
          fail('Should have thrown an error');
        },
        error: (error) => {
          expect(error).toBeTruthy();
          expect(error.message).toContain('503');
          done();
        }
      });
    });

    it('should throw error when data structure is invalid (missing account)', (done) => {
      const invalidData = {
        currency: 'EURO',
        transactions: []
      };

      window.fetch = jasmine.createSpy('fetch').and.returnValue(
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(invalidData)
        } as Response)
      );

      service.getTransactions().subscribe({
        next: () => {
          fail('Should have thrown an error');
        },
        error: (error) => {
          expect(error).toBeTruthy();
          expect(error.message).toContain('Invalid data structure');
          done();
        }
      });
    });

    it('should throw error when data structure is invalid (missing transactions)', (done) => {
      const invalidData = {
        account: {
          name: 'Test User',
          iban: 'NL28ABNA0719200833',
          balance: 1000
        },
        currency: 'EURO'
      };

      window.fetch = jasmine.createSpy('fetch').and.returnValue(
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(invalidData)
        } as Response)
      );

      service.getTransactions().subscribe({
        next: () => {
          fail('Should have thrown an error');
        },
        error: (error) => {
          expect(error).toBeTruthy();
          expect(error.message).toContain('Invalid data structure');
          done();
        }
      });
    });

    it('should throw error when data is null', (done) => {
      window.fetch = jasmine.createSpy('fetch').and.returnValue(
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(null)
        } as Response)
      );

      service.getTransactions().subscribe({
        next: () => {
          fail('Should have thrown an error');
        },
        error: (error) => {
          expect(error).toBeTruthy();
          expect(error.message).toContain('Invalid data structure');
          done();
        }
      });
    });

    it('should handle network errors', (done) => {
      window.fetch = jasmine.createSpy('fetch').and.returnValue(
        Promise.reject(new Error('Network error'))
      );

      service.getTransactions().subscribe({
        next: () => {
          fail('Should have thrown an error');
        },
        error: (error) => {
          expect(error).toBeTruthy();
          expect(error.message).toContain('Network error');
          done();
        }
      });
    });

    it('should handle JSON parsing errors', (done) => {
      window.fetch = jasmine.createSpy('fetch').and.returnValue(
        Promise.resolve({
          ok: true,
          json: () => Promise.reject(new Error('Invalid JSON'))
        } as Response)
      );

      service.getTransactions().subscribe({
        next: () => {
          fail('Should have thrown an error');
        },
        error: (error) => {
          expect(error).toBeTruthy();
          expect(error.message).toContain('Invalid JSON');
          done();
        }
      });
    });

    it('should log errors to console', (done) => {
      spyOn(console, 'error');

      window.fetch = jasmine.createSpy('fetch').and.returnValue(
        Promise.reject(new Error('Test error'))
      );

      service.getTransactions().subscribe({
        next: () => {
          fail('Should have thrown an error');
        },
        error: () => {
          expect(console.error).toHaveBeenCalledWith(
            'Error fetching transactions:',
            jasmine.any(Error)
          );
          done();
        }
      });
    });
  });

  describe('Data Validation', () => {
    it('should accept valid BankStatement with all required fields', (done) => {
      const validData: BankStatement = {
        account: {
          name: 'John Doe',
          iban: 'GB82WEST12345698765432',
          balance: 2500.75
        },
        currency: 'GBP',
        transactions: [
          {
            from: 'Employer',
            description: 'Salary',
            amount: 3000.00,
            date: '2024-01-15T09:00:00.000Z'
          }
        ]
      };

      window.fetch = jasmine.createSpy('fetch').and.returnValue(
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(validData)
        } as Response)
      );

      service.getTransactions().subscribe({
        next: (data) => {
          expect(data).toEqual(validData);
          expect(data.account).toBeTruthy();
          expect(data.transactions).toBeTruthy();
          done();
        }
      });
    });

    it('should handle transaction with "from" field (credit)', (done) => {
      const mockData: BankStatement = {
        account: {
          name: 'Test User',
          iban: 'NL28ABNA0719200833',
          balance: 1000
        },
        currency: 'EURO',
        transactions: [
          {
            from: 'Sender',
            description: 'Incoming payment',
            amount: 500.00,
            date: '2024-01-01T10:00:00.000Z'
          }
        ]
      };

      window.fetch = jasmine.createSpy('fetch').and.returnValue(
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockData)
        } as Response)
      );

      service.getTransactions().subscribe({
        next: (data) => {
          expect(data.transactions[0].from).toBe('Sender');
          expect(data.transactions[0].to).toBeUndefined();
          done();
        }
      });
    });

    it('should handle transaction with "to" field (debit)', (done) => {
      const mockData: BankStatement = {
        account: {
          name: 'Test User',
          iban: 'NL28ABNA0719200833',
          balance: 1000
        },
        currency: 'EURO',
        transactions: [
          {
            to: 'Recipient',
            description: 'Outgoing payment',
            amount: 200.00,
            date: '2024-01-01T10:00:00.000Z'
          }
        ]
      };

      window.fetch = jasmine.createSpy('fetch').and.returnValue(
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockData)
        } as Response)
      );

      service.getTransactions().subscribe({
        next: (data) => {
          expect(data.transactions[0].to).toBe('Recipient');
          expect(data.transactions[0].from).toBeUndefined();
          done();
        }
      });
    });

    it('should handle different currency types', (done) => {
      const mockData: BankStatement = {
        account: {
          name: 'Test User',
          iban: 'US12345678901234567890',
          balance: 5000
        },
        currency: 'USD',
        transactions: []
      };

      window.fetch = jasmine.createSpy('fetch').and.returnValue(
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockData)
        } as Response)
      );

      service.getTransactions().subscribe({
        next: (data) => {
          expect(data.currency).toBe('USD');
          done();
        }
      });
    });

    it('should handle zero balance', (done) => {
      const mockData: BankStatement = {
        account: {
          name: 'Test User',
          iban: 'NL28ABNA0719200833',
          balance: 0
        },
        currency: 'EURO',
        transactions: []
      };

      window.fetch = jasmine.createSpy('fetch').and.returnValue(
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockData)
        } as Response)
      );

      service.getTransactions().subscribe({
        next: (data) => {
          expect(data.account.balance).toBe(0);
          done();
        }
      });
    });

    it('should handle negative balance', (done) => {
      const mockData: BankStatement = {
        account: {
          name: 'Test User',
          iban: 'NL28ABNA0719200833',
          balance: -150.50
        },
        currency: 'EURO',
        transactions: []
      };

      window.fetch = jasmine.createSpy('fetch').and.returnValue(
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockData)
        } as Response)
      );

      service.getTransactions().subscribe({
        next: (data) => {
          expect(data.account.balance).toBe(-150.50);
          done();
        }
      });
    });

    it('should handle large balance amounts', (done) => {
      const mockData: BankStatement = {
        account: {
          name: 'Test User',
          iban: 'NL28ABNA0719200833',
          balance: 1000000.99
        },
        currency: 'EURO',
        transactions: []
      };

      window.fetch = jasmine.createSpy('fetch').and.returnValue(
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockData)
        } as Response)
      );

      service.getTransactions().subscribe({
        next: (data) => {
          expect(data.account.balance).toBe(1000000.99);
          done();
        }
      });
    });
  });

  describe('Observable Behavior', () => {
    it('should complete the observable after emitting data', (done) => {
      const mockData: BankStatement = {
        account: {
          name: 'Test User',
          iban: 'NL28ABNA0719200833',
          balance: 1000
        },
        currency: 'EURO',
        transactions: []
      };

      window.fetch = jasmine.createSpy('fetch').and.returnValue(
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockData)
        } as Response)
      );

      service.getTransactions().subscribe({
        next: (data) => {
          expect(data).toEqual(mockData);
        },
        complete: () => {
          done();
        }
      });
    });

    it('should allow multiple independent subscriptions', (done) => {
      const mockData: BankStatement = {
        account: {
          name: 'Test User',
          iban: 'NL28ABNA0719200833',
          balance: 1000
        },
        currency: 'EURO',
        transactions: []
      };

      window.fetch = jasmine.createSpy('fetch').and.returnValue(
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockData)
        } as Response)
      );

      // First subscription
      service.getTransactions().subscribe({
        next: (data) => {
          expect(data).toEqual(mockData);
        },
        complete: () => {
          // Second independent subscription
          service.getTransactions().subscribe({
            next: (data) => {
              expect(data).toEqual(mockData);
              expect(window.fetch).toHaveBeenCalledTimes(2); // Two separate calls
              done();
            }
          });
        }
      });
    });
  });
});

