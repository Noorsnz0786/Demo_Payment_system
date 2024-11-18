const { userSchema, loginSchema } = require("../validation/types");
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const prisma = new PrismaClient();

// FUNCTION TO generate random balance after registering

const generateRandomBalance = ()=>{
  return Math.floor(Math.random() * (50000 - 1000 + 1)) + 1000;
}

const newUser = async (req, res) => {
  try {
    const typeUser = userSchema.safeParse(req.body);

    if (!typeUser.success) {
      return res
        .status(400)
        .json({ message: "Invalid input", errors: typeUser.error.errors });
    }

    const { name, email, password } = typeUser.data;

    const existingUser = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const balance = generateRandomBalance();

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        balance: balance,
      },
    });

    return res.status(201).json({ message: "User created successfully", user });
  } catch (error) {
    console.error("Error creating user:", error);
    return res
      .status(500)
      .json({ message: "Server error. Please try again later." });
  }
};

const loginUser = async (req, res) => {
  try {
    const validateUser = loginSchema.safeParse(req.body);

    if (!validateUser.success) {
      return res
        .status(400)
        .json({ message: "Invalid input", errors: validateUser.error.errors });
    }

    const { email, password } = validateUser.data;

    const existingUser = await prisma.user.findUnique({
      where: { email: email },
    });

    if (!existingUser) {
      return res
        .status(401)
        .json({ message: "Wrong email or password. Please try again." });
    }

    const isValidPassword = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (!isValidPassword) {
      return res
        .status(401)
        .json({ message: "Wrong email or password. Please try again." });
    }

    const token = jwt.sign(
      { userId: existingUser.id, email: existingUser.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.status(200).json({
      message: "Login successful",
      token: token,
    });
  } catch (error) {
    console.error("Error during login:", error);
    return res
      .status(500)
      .json({ message: "Server error. Please try again later." });
  }
};

// GET ALL USERS like name email id
getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    return res.status(200).json(users);
   }
    catch (error) {
      console.error("Error during getAllUsers:", error);
}
}
module.exports = {
  newUser,
  loginUser,
getAllUsers}
