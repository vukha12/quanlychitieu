import { Router } from "express";
import TransactionController from "../../controllers/transaction.controller.js";
import { checkAuth } from "../../auth/checkAuth.js";
import { validateObjectId } from "../../middleware/validateObjectId.js";

const router = Router()
    .use(checkAuth)
    .get('/balance', TransactionController.getBalance)
    .get('/list', TransactionController.getTransactions)
    .post('/create', TransactionController.createTransaction)
    .get('/:transactionId', validateObjectId('transactionId'), TransactionController.getTransactionById)
    .delete('/:transactionId', validateObjectId('transactionId'), TransactionController.deleteTransaction)
    .patch('/:transactionId', validateObjectId('transactionId'), TransactionController.updateTransaction)

export default router;