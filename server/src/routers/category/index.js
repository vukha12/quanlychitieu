import { Router } from "express";
import CategoryController from "../../controllers/category.controller.js";
import { checkAuth } from "../../auth/checkAuth.js";
import { validateObjectId } from "../../middleware/validateObjectId.js"

const router = Router()
    .use(checkAuth)
    .post('/new', CategoryController.newCategory)
    .patch('/update/:id', validateObjectId('id'), CategoryController.updateCategory)
    .delete('/:id', validateObjectId('id'), CategoryController.deleteCategory)

export default router;