import categoryModel from "../category.model.js";

const findCategoryByName = async (name) => {
    return categoryModel.findOne({ cte_name: name }).lean();
}

const findCategoryByIdAndUserId = async ({ id, userId }) => {
    return categoryModel.findOne({ _id: id, cte_user: userId }).lean();
}

const findParentHasChildren = async (id) => {
    return categoryModel.exists({ cte_parent: id }).lean();
}

const deleteCategoryById = async (id) => {
    return categoryModel.findByIdAndDelete({ _id: id }).lean();
}

const deleteAllChildren = async ({ id, userId }) => {
    return categoryModel.deleteMany({ cte_parent: id, cte_user: userId });
}

export {
    findCategoryByName,
    findCategoryByIdAndUserId,
    findParentHasChildren,
    deleteCategoryById,
    deleteAllChildren
}