import { Router } from "express";
import CategoryController from "../../controllers/category.controller.js";
import { checkAuth } from "../../auth/checkAuth.js";

const router = Router()
    .use(checkAuth)
    .post('/new', CategoryController.newCategory)
    .delete('/:id', CategoryController.deleteCategory)



export default router;