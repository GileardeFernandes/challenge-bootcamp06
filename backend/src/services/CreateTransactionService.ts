import { getCustomRepository, getRepository } from 'typeorm';
import AppError from '../errors/AppError';

import TrasationRepository from '../repositories/TransactionsRepository';
import Transaction from '../models/Transaction';
import Category from '../models/Category';

interface Request {
  title: string;
  type: 'income' | 'outcome';
  value: number;
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    type,
    value,
    category,
  }: Request): Promise<Transaction> {
    const categoryRepository = getRepository(Category);
    const trasactionRepository = getCustomRepository(TrasationRepository);

    const { total } = await trasactionRepository.getBalance();

    if (total < value && type === 'outcome')
      throw new AppError('insufficient balance !!', 400);

    const categoryExists = await categoryRepository.findOne({
      where: { title: category },
    });

    if (!categoryExists) {
      const newCategory = categoryRepository.create({ title: category });
      await categoryRepository.save(newCategory);

      const newTrasaction = trasactionRepository.create({
        title,
        value,
        type,
        category_id: newCategory.id,
      });

      await trasactionRepository.save(newTrasaction);

      return newTrasaction;
    }

    const trasaction = trasactionRepository.create({
      title,
      value,
      type,
      category_id: categoryExists.id,
    });
    await trasactionRepository.save(trasaction);
    return trasaction;
  }
}

export default CreateTransactionService;
