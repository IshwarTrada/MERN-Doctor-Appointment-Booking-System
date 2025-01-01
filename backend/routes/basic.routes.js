import express, { Router } from "express";
import { checkRole, logout } from "../controllers/basic.controller.js";

const basicRouter = Router();

basicRouter.get("/check-role", checkRole);

basicRouter.post("/logout", logout);

export default basicRouter;
