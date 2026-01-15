import { generatetoken } from "../middlewares/JwtMiddleware.js";
import User from "../Models/UserSchema.js";
import Document from "../Models/GroqDataSchema.js";

const SignUp = async (req, res) => {
  try {
    const data = req.body;

    let user = await User.findOne({ email:data.email });

    if (user) {
      return res.status(200).json({ message: "User already exists", user });
    }

    const NewUser = new User(data);
    const response = await NewUser.save();


    const payload = {
        name : response.name,
        email:response.email,
        id : response.id
    }

    

    const token = generatetoken(payload);

    res.status(200).json({response:response,token:token});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}


const Login= async (req, res) => {
  try {
    const { email, password } = req.body;

    // Ensure both name and password are provided
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find the user by name (or email if unique identifier is preferred)
  const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(400).json({ error: 'Invalid username or password' });
    }

    // Check the password using the comparePassword method
    if (!(await user.comparePassword(password))) {
      return res.status(400).json({ error: 'Invalid username or password' });
    }

    // Generate a token for the user
    const payload = {
      name: user.name,
      email:user.email,
      id: user._id,  // Use the user ID as the identifier
    };
    
    const token = generatetoken(payload);

    // Return the token
    res.status(200).json({ token,user });


  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

const GetUser=async(req,res)=>{
    const jwtaccount=req.userdata
    const user= await User.findOne({email:jwtaccount.email})
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.send(user)
    
}

const GetDocuments = async (req, res) => {
  try {
    const userId = req.userdata.id; 
    const documents = await Document.find({ userId });
    return res.status(200).json(documents);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};



export {SignUp,Login,GetUser,GetDocuments}