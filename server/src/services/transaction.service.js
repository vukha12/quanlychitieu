import { BadRequestError, NotFoundError } from "../core/error.response.js";
import { getDataInfo } from "../helpers/index.js";
import { findCategoryByIdAndUserId } from "../models/repositories/category.repo.js";
import transactionModel from "../models/transaction.model.js";
import { deleteOneTransaction, findTransactionByIdAndUserId } from "../models/repositories/transaction.repo.js";
import { buildTransactionFilter } from "../helpers/buildTransactionFilter.js";
import { paginate } from "../helpers/paginate.js";

const handleBalanceByCategory = async ({ userId, month, year }) => {
    const filter = buildTransactionFilter({ userId, month, year })

    // query 1 - tính tổng số tiền và số lượng giao dịch theo từng category
    const categoryTotals = await transactionModel.aggregate([
        { $match: filter },
        {
            $group: {
                _id: {
                    categoryId: '$trans_category',
                    categoryName: '$trans_categorySnapshot.name',
                    categoryParentId: '$trans_categorySnapshot.parentId'
                },
                total: { $sum: '$trans_amount' },
                count: { $sum: 1 }
            }
        }
    ])

    console.table(categoryTotals);

    // query 2 xử  lý trong JS, gom con vào cha
    const parentMap = {}

    categoryTotals.forEach(({ _id, total, count }) => {
        const { categoryId, categoryName, categoryParentId } = _id;

        if (!categoryParentId) {
            // Nếu là category cha, lưu vào parentMap
            if (!parentMap[categoryId]) {
                parentMap[categoryId] = {
                    categoryId,
                    categoryName,
                    total: 0,
                    count: 0,
                    subCategories: []
                }
            }
            parentMap[categoryId].total += total
            parentMap[categoryId].count += count
        } else {
            // Là category con -> gộp vào cha
            if (!parentMap[categoryParentId]) {
                parentMap[categoryParentId] = {
                    categoryId: categoryParentId,
                    total: 0,
                    count: 0,
                    subCategories: []
                }
            }
            parentMap[categoryParentId].total += total
            parentMap[categoryParentId].count += count
            parentMap[categoryParentId].subCategories.push({
                categoryId,
                categoryName,
                total,
                count
            })
        }
    })

    return Object.values(parentMap).sort((a, b) => b.categoryName - a.categoryName) // sắp xếp theo tên 
}

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
    let categorySnapshot = null;
    if (category) {
        const categoryExist = await findCategoryByIdAndUserId({ id: category, userId })
        if (!categoryExist) throw new NotFoundError(`Không tìm thấy category`)
        categorySnapshot = {
            name: categoryExist.cte_name,
            icon: categoryExist.cte_icon,
            parentId: categoryExist.cte_parent || null
        }
    }

    const createTransaction = await transactionModel.create({
        trans_user: userId,
        trans_type: type,
        trans_amount: amount,
        trans_date: date || new Date(),
        trans_note: note,
        trans_category: category,
        trans_categorySnapshot: categorySnapshot
    })

    return getDataInfo(createTransaction, ['_id', 'trans_type', 'trans_amount', 'trans_date', 'trans_note', 'trans_category']);
}

export default {
    newTransaction,
    deleteTransactionById,
    updateTransactionById,
    aTransactionById,
    listTransaction,
    handleBalance,
    handleBalanceByCategory
}