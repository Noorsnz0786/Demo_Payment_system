const { PrismaClient } = require("@prisma/client");
const { fundSchema, transferSchema } = require("../validation/types");

const prisma = new PrismaClient();

// Add funds to the user's balance
const addFund = async (req, res) => {
  try {
    const validateFund = fundSchema.safeParse(req.body);

    if (!validateFund.success) {
      return res.status(400).json({ errors: validateFund.error.errors });
    }

    const { amount } = validateFund.data;
    const userId = req.user.userId; // Get userId from the authenticated user

    console.log("Authenticated user ID:", userId);

    if (!userId) {
      return res
        .status(400)
        .json({ message: "User not authenticated or invalid token" });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { balance: { increment: amount } },
    });

    res.status(200).json({
      message: "Funds added successfully",
      user: {
        id: updatedUser.id,
        balance: updatedUser.balance,
      },
    });
  } catch (error) {
    console.error("Error adding funds:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

// Fund transfer functionality
const fundTransfer = async (req, res) => {
  const validateTransfer = transferSchema.safeParse(req.body);
  if (!validateTransfer.success) {
    return res.status(400).json({ errors: validateTransfer.error.errors });
  }

  const { recipientId, amount } = validateTransfer.data;
  const senderId = req.user.userId; // Automatically use authenticated user's ID

  try {
    const sender = await prisma.user.findUnique({ where: { id: senderId } });
    if (!sender) {
      return res.status(400).json({ msg: "Sender Not Found" });
    }

    if (sender.balance < amount) {
      return res.status(400).json({ msg: "Insufficient balance" });
    }

    const recipient = await prisma.user.findUnique({
      where: { id: recipientId },
    });
    if (!recipient) {
      return res.status(400).json({ msg: "Recipient Not Found" });
    }

    const transaction = await prisma.$transaction(async (prisma) => {
      const newTransaction = await prisma.transaction.create({
        data: {
          senderId,
          recipientId,
          amount,
        },
      });

      await prisma.user.update({
        where: { id: senderId },
        data: { balance: sender.balance - amount },
      });

      await prisma.user.update({
        where: { id: recipientId },
        data: { balance: recipient.balance + amount },
      });

      return newTransaction;
    });

    res.status(200).json({
      msg: "Transaction successful",
      transaction,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "An error occurred during the transfer",
      error: error.message,
    });
  }
};

module.exports = { addFund, fundTransfer };
