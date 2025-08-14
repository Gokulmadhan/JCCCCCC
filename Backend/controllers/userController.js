const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const Cart = require("../models/Cart");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
// Load environment variable for JWT secret
const JWT_SECRET = process.env.JWT_SECRET || "yoursecretkey";
const UserController = {
  // Register a new user
  registerUser: async (req, res) => {
    try {
      const { name, email, password, phone ,isAdmin} = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "Email already in use" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Generate user_id (UUID-like or custom)
      const randID=uuidv4();
      const userId = `USR-${randID}`;

      const newUser = new User({
        user_id: userId,
        name,
        email,
        password: hashedPassword,
        phone,
        isAdmin
      });

      await newUser.save();

      res.status(201).json({ message: "User registered successfully", user: newUser });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },

  // Login user
  loginUser: async (req, res) => {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email });
      if (!user) return res.status(404).json({ message: "User not found" });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

      // Generate JWT token
      const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, JWT_SECRET, { expiresIn: "7d" });

      res.json({ message: "Login successful", token, user });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },

  // Get all users (admin)
  getAllUsers: async (req, res) => {
    try {
      const users = await User.find().select("-password");
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },

  // Get single user by ID
  getUserById: async (req, res) => {
  try {
    const { user_id } = req.params;
    const user = await User.findOne({ user_id }).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
},

  // Update user
updateUser: async (req, res) => {
  try {
    const { user_id } = req.params;
    const {password}=req.body;
    if(password){
      const hashedPassword = await bcrypt.hash(password, 10);
            req.body.password=hashedPassword;
    }
    const user = await User.findOneAndUpdate(
      { user_id },
      req.body, // Corrected: directly passing the update object
      { new: true } // To return the updated document
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User updated", user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
},

  // Delete user
  deleteUser: async (req, res) => {
    try {
      const{user_id}=req.params;
      const user = await User.findOneAndDelete({user_id});
      if (!user) return res.status(404).json({ message: "User not found" });

      res.json({ message: "User deleted" });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },
  getCartById:async(req,res)=>{
          try {
            const{user_id}=req.params;
            if(!user_id){
                res.status('500').json({success:false,error:"id not found"});
            }
            const result= await Cart.findOne({userId:user_id});
            if(!result){
                res.status('500').json({success:false,error:"item not found"});
            }
            return res.status('200').json({success:true,data:res});
          } catch (error) {
            return res.status('500').json({success:false,error})
          }
  },
  addToCart:async(req,res)=>{
      try {
            const {user_id}=req.params;
            if(!user_id){
              return res.status(500).json({success:false,error:"User ID not provided"});
            }
         const existingUser= User.findOne({user_id});
         if(!existingUser){
          return res.status(500).json({success:false,error:"User not found"});
         }
         const payload = {
          productId: req.body?.productId,
          price: req.body?.price,
          image: req.body?.image,
          quantity:req.body?.quantity,
          size: req.body?.size,
        };
            const cart=  new Cart({userId:user_id,items:[payload]});
         const result=await cart.save();
          if(result){
            res.status(201).json({success:true,data:result});
          }
      } catch (err) { 
          return res.status(500).json({success:false,errors:err.message});
      }
  },
updateCart: async (req, res) => {
  try {
    const { user_id } = req.params;
    const { productId, price, quantity, size } = req.body;

    const cart = await Cart.findOne({ userId: user_id });

    if (!cart) {
      return res.status(404).json({ success: false, error: "Cart not found" });
    }

    // Check if product with same productId and size already exists in cart
    const existingItemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId && item.size === size
    );

    if (existingItemIndex > -1) {
      // Update quantity and price if item already exists
      cart.items[existingItemIndex].quantity += quantity;
      cart.items[existingItemIndex].price = price;
    } else {
      // Add new item
      cart.items.push({
        productId,
        price,
        quantity,
        size
      });
    }

    const updatedCart = await cart.save();

    return res.status(200).json({ success: true, data: updatedCart });
  } catch (error) {
    console.error("Error updating cart:", error);
    return res.status(500).json({ success: false, error: "Server error" });
  }
}
,
  deleteItem:async(req,res)=>{
      try {
        const {user_id,item_id}=req.params;
        const cart=await Cart.findOneAndUpdate({userId:user_id},
          {$pull:{items:{_id:item_id}}},  
          {new:true});
        if(!cart){
          return res.status(404).json({success:false,error:"Cart not found"});
        }
        return res.status(200).json({success:true,data:cart});
      } catch (error) {
        return res.status(500).json({success:false,error});
      }
},
  discardCart:async(req,res)=>{
      try {
        const {user_id}=req.params;
        const cart=await Cart.findOneAndDelete({userId:user_id});
        if(!cart){
          return res.status(404).json({success:false,error:"Cart not found"});
        }
        return res.status(200).json({success:true,message:"Cart discarded successfully"});
      } catch (error) {
        return res.status(500).json({success:false,error});
      }
  }
};
module.exports=UserController;