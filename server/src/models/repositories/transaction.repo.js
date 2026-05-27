import transactionModel from "../transaction.model.js";

const findTransactionByIdAndUserId = async ({ id, userId }) => {
    return await transactionModel.findOne({ _id: id, trans_user: userId }).lean();
}

const deleteOneTransaction = async ({ userId, transactionId }) => {
    return await transactionModel.deleteOne({
        _id: transactionId,
        trans_user: userId
    })
}

export {
    findTransactionByIdAndUserId,
    deleteOneTransaction
}