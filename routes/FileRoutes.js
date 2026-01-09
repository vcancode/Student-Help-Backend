import express from 'express'
import  { uploadExamFiles } from '../middlewares/upload.js';
import {FetchQuestions} from '../controllers/FileController.js';




const FileRouter = express.Router();

FileRouter.post("/getgroq",uploadExamFiles,FetchQuestions);


export default FileRouter