import categoryModel from "../models/category.model.js";
import {
    findCategoryByName,
    findCategoryByIdAndUserId,
    findParentHasChildren,
    deleteCategoryById,
    deleteAllChildren
} from "../models/repositories/category.repo.js";
import {
    BadRequestError,
    NotFoundError
} from "../core/error.response.js";
import { getDataInfo } from "../helpers/index.js"

const _handleNotFoundCategoryByIdAndUserId = async (id, userId, message = "") => {
    const result = await findCategoryByIdAndUserId({ id, userId });
    if (!result) return message;
}


const deleteCategory = async ({ id, userId, force }) => {
    return force
        ? await deleteCategoryWithChildren({ id, userId })
        : await deleteCategoryFirstChildren({ id, userId })
}

const deleteCategoryWithChildren = async ({ id, userId }) => {

    const existing = await findCategoryByIdAndUserId({ id, userId })
    if (!existing) throw new NotFoundError("Category not found")

    if (existing.cte_parent !== null)
        throw new BadRequestError('Only parent category can be deleted')

    await deleteAllChildren({ id, userId })

    const result = await deleteCategoryById(id)

    return getDataInfo(result, ['cte_name'])
}

const deleteCategoryFirstChildren = async ({ id, userId }) => {

    const existing = await findCategoryByIdAndUserId({ id, userId })
    if (!existing) throw new NotFoundError("Category not found")

    const hasChildren = await findParentHasChildren(id);
    if (hasChildren)
        throw new BadRequestError("Category has children, delete them first")

    const result = await deleteCategoryById(id)

    return getDataInfo(result, ['cte_name'])
}

const updateCategory = async ({ id, payload, userId }) => {

    const { name, color, icon, parent_id } = payload

    _handleNotFoundCategoryByIdAndUserId(id, userId, "Category Not Found!")

    if (parent_id !== undefined) {

        //1. không thể làm cha của mình
        if (parent_id === id) throw new BadRequestError('Cannot make category its own parent')

        if (parent_id !== null) {
            const parent = await findCategoryByIdAndUserId({ id: parent_id, userId: userId })
            if (!parent) throw new BadRequestError("Category parent not exist");

            //2. Cha không thể làm con
            if (parent.cte_parent?.toString() === id)
                throw new BadRequestError("Cannot create circular reference")

            //3. con không thể làm cha của con
            if (parent.cte_parent !== null)
                throw new BadRequestError("Parent category cannot be a child category")
        }

        const hasChildren = await findParentHasChildren(id)
        if (hasChildren) throw new BadRequestError("A category that has children cannot be converted into a child category")
    }

    const updateFields = {}
    if (name !== undefined) updateFields.cte_name = name
    if (icon !== undefined) updateFields.cte_icon = icon
    if (color !== undefined) updateFields.cte_color = color
    if (parent_id !== undefined) updateFields.cte_parent = parent_id

    const updated = await categoryModel.findByIdAndUpdate(
        id,
        { $set: updateFields },
        { new: true } // trả về document sau khi update
    ).populate('cte_parent', 'cte_name cte_icon cte_color cte_parent')

    return getDataInfo(updated, ["_id", "cte_name", "cte_icon", "cte_color", "cte_parent"])
}

const createCategory = async ({ userId, payload }) => {

    const { name, color, icon, parent } = payload;

    const existing = await findCategoryByName(name)
    if (existing) throw new BadRequestError("Category name already exists")

    if (parent) {
        const parentCategory = await findCategoryByIdAndUserId({
            id: parent,
            userId: userId
        })

        if (!parentCategory) throw new NotFoundError("Parent category not found")

        if (parentCategory.cte_parent !== null)
            throw new BadRequestError("Cannot use a child category as parent")
    }

    const newCategory = await categoryModel.create({
        cte_user: userId,
        cte_name: name,
        cte_color: color,
        cte_icon: icon,
        cte_parent: parent || null,
    })

    return getDataInfo(newCategory, ["_id", "cte_name", "cte_color", "cte_icon", "cte_parent", "createdAt", "updatedAt"]);
}

export default {
    createCategory,
    updateCategory,
    deleteCategory
}