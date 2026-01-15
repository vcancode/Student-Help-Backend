import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const jwtauthmiddleware = (req, res, next) => {

  
  const authHeader = req.headers.authorization;
  
  

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "TOKEN_MISSING" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.secretkey);

    req.userdata = {
      id: decoded.id,
      email: decoded.email,
      name: decoded.name
    };
  
    
    next();
  } catch (error) {
    return res.status(401).json({ error: error.message });
  }
};

const generatetoken = (userdata) => {
  return jwt.sign(
    userdata,
    process.env.secretkey,
    { expiresIn: "7d" }
  );
};

export { jwtauthmiddleware, generatetoken };





//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiQW1hbiBLdW1hciIsImVtYWlsIjoiYW1hbi5rdW1hckB0ZXN0LmNvbSIsImlkIjoiNjk2N2VjOGRkYzQ4MTAwOGZmMDVmNmVkIiwiaWF0IjoxNzY4NDE4NDQ1LCJleHAiOjE3NjkwMjMyNDV9.oqjNnTq92OMvhvl9qeub5xsX-T5GoCdBe-8UieZ8cfA