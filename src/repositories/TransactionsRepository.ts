import { EntityRepository, Repository, getRepository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const transactionRepository = getRepository(Transaction);
    const transactions = await transactionRepository.find();

    const { income, outcome } = transactions.reduce(
      (acc: Balance, cur: Transaction) => {
        switch (cur.type) {
          case 'income':
            acc.income += Number(cur.value);
            break;
          case 'outcome':
            acc.outcome += Number(cur.value);
            break;
          default:
            break;
        }
        return acc;
      },
      {
        income: 0,
        outcome: 0,
        total: 0,
      },
    );
    const total = income - outcome;

    return { income, outcome, total };
  }

  public async getTransactions(): Promise<Transaction[]> {
    const transactionRepository = getRepository(Transaction);
    const transactions = await transactionRepository.find();
    return transactions;
  }
}

export default TransactionsRepository;
