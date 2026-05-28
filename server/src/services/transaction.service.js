import { BadRequestError, NotFoundError } from "../core/error.response.js";
import { getDataInfo } from "../helpers/index.js";
import { findCategoryByIdAndUserId } from "../models/repositories/category.repo.js";
import transactionModel from "../models/transaction.model.js";
import { deleteOneTransaction, findTransactionByIdAndUserId } from "../models/repositories/transaction.repo.js";
import { buildTransactionFilter } from "../helpers/buildTransactionFilter.js";
import { paginate } from "../helpers/paginate.js";

const handleBalance = async ({ userId, month, year }) => {
    const filter = buildTransactionFilter({ userId, month, year })

    const result = await transactionModel.aggregate([
        { $match: filter },
        {
            $group: {
                _id: null,

                // Tính totalIncome
                totalIncome: {
                    $sum: {
                        $cond: [{ $eq: ['$trans_type', 'income'] }, '$trans_amount', 0]
                    }
                },

                // Tính totalExpense
                totalExpense: {
                    $sum: {
                        $cond: [{ $eq: ['$trans_type', 'expense'] }, '$trans_amount', 0]
                    }
                }
            }
        },
        {
            $project: {
                _id: 0,
                totalIncome: 1,
                totalExpense: 1,
                balance: { $subtract: ['$totalIncome', '$totalExpense'] }
            }
        }
    ])

    return result[0] || { totalIncome: 0, totalExpense: 0, balance: 0 }
}

const listTransaction = async ({ userId, month, year, fromDate, toDate, type, page, limit }) => {
    const filter = buildTransactionFilter({ userId, month, year, fromDate, toDate, type, page, limit })
    return paginate(transactionModel, filter, { page, limit, select: '-__v -updatedAt' })
}

const aTransactionById = async ({ userId, transactionId }) => {
    const transaction = await findTransactionByIdAndUserId({ id: transactionId, userId })
    if (!transaction) throw new NotFoundError(`Không tìm thấy transaction`)
    return getDataInfo(transaction, ['_id', 'trans_type', 'trans_amount', 'trans_date', 'trans_note', 'trans_category']);
}

const updateTransactionById = async ({ userId, transactionId, payload }) => {

    const { category, amount, date, note, type } = payload

    const transaction = await findTransactionByIdAndUserId({ id: transactionId, userId })
    if (!transaction) throw new NotFoundError(`Không tìm thấy transaction`)

    // validate amount 
    if (amount !== undefined) {
        if (amount <= 0) throw new BadRequestError(`Số tiền phải lớn hơn 0`)
        if (!Number.isFinite(amount)) throw new BadRequestError(`Số tiền không hợp lệ`)
    }

    // validate type
    if (type !== undefined) {
        if (!['income', 'expense'].includes(type)) throw new BadRequestError(`Không rõ thu hay chi.`)
    }

    // validate category
    if (category) {
        const categoryExist = await findCategoryByIdAndUserId({ id: category, userId })
        if (!categoryExist) throw new NotFoundError(`Không tìm thấy category`)
    }

    const updateData = {
        ...(amount !== undefined && { trans_amount: amount }),
        ...(type !== undefined && { trans_type: type }),
        ...(date !== undefined && { trans_date: date }),
        ...(note !== undefined && { trans_note: note }),
        ...(category !== undefined && { trans_category: category }),
    }

    const updatedTransaction = await transactionModel.findOneAndUpdate(
        { _id: transactionId, trans_user: userId },
        { $set: updateData },
        { new: true }
    ).lean()

    return getDataInfo(updatedTransaction, ['_id', 'trans_type', 'trans_amount', 'trans_date', 'trans_note', 'trans_category']);

}

const deleteTransactionById = async ({ userId, transactionId }) => {
    const transaction = await findTransactionByIdAndUserId({ id: transactionId, userId })
    if (!transaction) throw new NotFoundError(`Không tìm thấy transaction`)

    return await deleteOneTransaction({ userId, transactionId })
}

const newTransaction = async ({ userId, payload }) => {
    const { category, amount, date, note, type } = payload

    // validate amount
    if (!amount || amount <= 0) throw new BadRequestError(`Số tiền phải lớn hơn 0`)
    if (!Number.isFinite(amount)) throw new BadRequestError(`Số tiền không hợp lệ`)

    // validate type
    if (!['income', 'expense'].includes(type)) throw new BadRequestError(`Không rõ thu hay chi.`)

    // validate category
    if (category) {
        const categoryExist = await findCategoryByIdAndUserId({ id: category, userId })
        if (!categoryExist) throw new NotFoundError(`Không tìm thấy category`)
    }

    const createTransaction = await transactionModel.create({
        trans_user: userId,
        trans_type: type,
        trans_amount: amount,
        trans_date: date || new Date(),
        trans_note: note,
        trans_category: category
    })

    return getDataInfo(createTransaction, ['_id', 'trans_type', 'trans_amount', 'trans_date', 'trans_note', 'trans_category']);
}

export default {
    newTransaction,
    deleteTransactionById,
    updateTransactionById,
    aTransactionById,
    listTransaction,
    handleBalance
}