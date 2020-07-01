import { getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';
import TransactionRepository from '../repositories/TransactionsRepository';
import Transaction from '../models/Transaction';

class DeleteTransactionService {
  public async execute(id: string): Promise<void> {
    const trasactionRepository = getCustomRepository(TransactionRepository);
    const transaction = await trasactionRepository.findOne(id);

    if (!transaction) {
      throw new AppError('Id is missing !!', 400);
    }

    await trasactionRepository.delete(transaction.id);
  }
}

export default DeleteTransactionService;
