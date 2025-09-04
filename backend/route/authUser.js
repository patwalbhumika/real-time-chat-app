import express from "express"
import { userRegister } from "../routeControllers/userRouteController.js";

const router = express.Router();

router.post('/register',userRegister)

export default router;