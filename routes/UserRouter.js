import express from 'express'
import { jwtauthmiddleware } from '../middlewares/JwtMiddleware.js';
import {SignUp,Login,GetUser,GetDocuments} from '../controllers/UserControllers.js';



const UserRouter = express.Router();

UserRouter.post("/signup",SignUp);
UserRouter.post("/login",Login);
UserRouter.post("/getuser",jwtauthmiddleware,GetUser);


UserRouter.post("/getdocuments",jwtauthmiddleware,GetDocuments);

export default UserRouter