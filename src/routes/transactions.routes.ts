import { Router } from 'express';
import multer from 'multer';
import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from '../services/CreateTransactionService';
import DeleteTransactionService from '../services/DeleteTransactionService';
import ImportTransactionsService from '../services/ImportTransactionsService';
import uploadConfig from '../config/upload';

const transactionsRouter = Router();

const upload = multer(uploadConfig);

transactionsRouter.get('/', async (request, response) => {
  const transactionRepository = new TransactionsRepository();
  const transactions = await transactionRepository.getTransactions();
  const balance = await transactionRepository.getBalance();

  response.json({ transactions, balance });
});

transactionsRouter.post('/', async (request, response) => {
  const { title, type, value, category } = request.body;
  const createTransactionService = new CreateTransactionService();
  const newTrasaction = await createTransactionService.execute({
    title,
    type,
    value,
    category,
  });
  return response.json(newTrasaction);
});

transactionsRouter.delete('/:id', async (request, response) => {
  const deleteTrasactionService = new DeleteTransactionService();
  const { id } = request.params;
  await deleteTrasactionService.execute(id);

  return response.status(204).send();
});

transactionsRouter.post(
  '/import',
  upload.single('file'),
  async (request, response) => {
    const importTransactionsService = new ImportTransactionsService();

    const transactions = await importTransactionsService.execute(
      request.file.path,
    );
    return response.json(transactions);
  },
);

export default transactionsRouter;
