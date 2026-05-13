import categoryService from "../services/category.service.js";
import { CREATED, SuccessResponse, OK } from "../core/success.response.js"

const deleteCategory = async (req, res) => {
    const force = req.query.force === 'true';
    const result = await categoryService.deleteCategory({
        id: req.params.id,
        userId: req.user.userId,
        force: force
    })
    new OK({
        message: force
            ? `Đã xóa "${result.cte_name}" và toàn bộ danh mục con`
            : `Đã xóa "${result.cte_name}"`,
        metadata: true
    }).send(res)
}

const updateCategory = async (req, res) => {
    new SuccessResponse({
        message: "Update category success",
        metadata: await categoryService.updateCategory({
            id: req.params.id,
            payload: req.body,
            userId: req.user.userId
        })
    }).send(res)
}

const newCategory = async (req, res) => {
    new CREATED({
        message: "Create category success!",
        metadata: await categoryService.createCategory({
            userId: req.user.userId,
            payload: req.body
        })
    }).send(res)
}

export default {
    newCategory,
    deleteCategory,
    updateCategory
}