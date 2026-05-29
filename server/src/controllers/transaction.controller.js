import { CREATED, OK, SuccessResponse } from "../core/success.response.js";
import transactionService from "../services/transaction.service.js";

const getBalanceByCategory = async (req, res) => {
    const { month, year } = req.query

    new SuccessResponse({
        message: "Get Balance By Category Successfully",
        metadata: await transactionService.handleBalanceByCategory({
            userId: req.user.userId,
            month: month ? parseInt(month) : undefined,
            year: year ? parseInt(year) : undefined
        })
    }).send(res)
}

const getBalance = async (req, res) => {
    const { month, year } = req.query

    new SuccessResponse({
        message: "Get Balance Successfully",
        metadata: await transactionService.handleBalance({
            userId: req.user.userId,
            month: month ? parseInt(month) : undefined,
            year: year ? parseInt(year) : undefined
        })
    }).send(res)
}

const getTransactionById = async (req, res) => {
    new SuccessResponse({
        message: "Get Transaction Successfully",
        metadata: await transactionService.aTransactionById({
            userId: req.user.userId,
            transactionId: req.params.transactionId
        })
    }).send(res)
}

const getTransactions = async (req, res) => {
    const { month, year, fromDate, toDate, type } = req.query

    new SuccessResponse({
        message: "Get List Transactions Successfully",
        metadata: await transactionService.listTransaction({
            userId: req.user.userId,
            month: month ? parseInt(month) : undefined,
            year: year ? parseInt(req.query.year) : undefined,
            fromDate,
            toDate,
            type,
            page: req.query.page ? parseInt(req.query.page) : 1,
            limit: req.query.limit ? parseInt(req.query.limit) : 20
        })
    }).send(res)
}

const updateTransaction = async (req, res) => {
    new SuccessResponse({
        message: "Update Transaction Successfully",
        metadata: await transactionService.updateTransactionById({
            userId: req.user.userId,
            transactionId: req.params.transactionId,
            payload: req.body
        })
    }).send(res)
}

const deleteTransaction = async (req, res) => {
    new OK({
        message: "Delete Transaction Successfully",
        metadata: await transactionService.deleteTransactionById({
            userId: req.user.userId,
            transactionId: req.params.transactionId
        })
    }).send(res)
}

const createTransaction = async (req, res,) => {
    new CREATED({
        message: "New Transaction Successfully",
        metadata: await transactionService.newTransaction({
            userId: req.user.userId,
            payload: req.body
        })
    }).send(res);
}

export default {
    createTransaction,
    deleteTransaction,
    updateTransaction,
    getTransactions,
    getTransactionById,
    getBalance,
    getBalanceByCategory
}