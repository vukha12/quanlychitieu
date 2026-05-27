import { buildDateFilter } from "./buildDateFilter.js";
import { findTransactionByIdAndUserId } from "../models/repositories/transaction.repo.js";
import mongoose from "mongoose";

const buildTransactionFilter = ({ userId, month, year, fromDate, toDate, type }) => {
    const filter = { trans_user: new mongoose.Types.ObjectId(userId) }

    const dateFilter = buildDateFilter({ month, year, fromDate, toDate })
    if (dateFilter) filter.trans_date = dateFilter

    if (type && ['income', 'expense'].includes(type)) {
        filter.trans_type = type
    }

    return filter
}

export { buildTransactionFilter }