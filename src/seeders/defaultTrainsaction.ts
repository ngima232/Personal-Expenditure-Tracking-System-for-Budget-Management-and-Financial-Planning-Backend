import * as dotenv from "dotenv";
dotenv.config();
const mongoose = require("mongoose");
import { categoryModel,userModel,transactionModel } from "../models";

const url = process.env.MONGO_URL!;
import {
  PaymentMethodEnum,
  TransactionTypeEnum,
} from "../enums";

export const seedTransactions = async () => {
  
    try {
        
  mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
   
  // Get user
  const user = await userModel.findOne({});

  if (!user) {
    throw new Error("User not found");
  }

  // Get all default categories
  const categories = await categoryModel.find({ isDefault: true});

  // Create category lookup map
  const categoryMap = new Map(
    categories.map((category) => [category.slug, category._id])
  );

  const transactions = [
    // =========================
    // Income
    // =========================

    {
      title: "Monthly Salary",
      category: categoryMap.get("salary"),
      type: TransactionTypeEnum.INCOME,
      amount: 3200,
      description: "Salary for May",
      paymentMethod: PaymentMethodEnum.BANK_TRANSFER,
      date: new Date("2026-05-01"),
      user: user._id,
    },
    {
      title: "Freelance Project",
      category: categoryMap.get("freelance"),
      type: TransactionTypeEnum.INCOME,
      amount: 850,
      description: "Website development",
      paymentMethod: PaymentMethodEnum.BANK_TRANSFER,
      date: new Date("2026-05-12"),
      user: user._id,
    },
    {
      title: "Performance Bonus",
      category: categoryMap.get("bonus"),
      type: TransactionTypeEnum.INCOME,
      amount: 400,
      description: "Quarterly bonus",
      paymentMethod: PaymentMethodEnum.BANK_TRANSFER,
      date: new Date("2026-05-25"),
      user: user._id,
    },
    {
      title: "Monthly Salary",
      category: categoryMap.get("salary"),
      type: TransactionTypeEnum.INCOME,
      amount: 3200,
      description: "Salary for June",
      paymentMethod: PaymentMethodEnum.BANK_TRANSFER,
      date: new Date("2026-06-01"),
      user: user._id,
    },
    {
      title: "Investment Dividend",
      category: categoryMap.get("investment"),
      type: TransactionTypeEnum.INCOME,
      amount: 180,
      description: "Investment return",
      paymentMethod: PaymentMethodEnum.BANK_TRANSFER,
      date: new Date("2026-06-18"),
      user: user._id,
    },
    {
      title: "Birthday Gift",
      category: categoryMap.get("gift"),
      type: TransactionTypeEnum.INCOME,
      amount: 250,
      description: "Gift from family",
      paymentMethod: PaymentMethodEnum.BANK_TRANSFER,
      date: new Date("2026-06-28"),
      user: user._id,
    },
    {
      title: "Monthly Salary",
      category: categoryMap.get("salary"),
      type: TransactionTypeEnum.INCOME,
      amount: 3200,
      description: "Salary for July",
      paymentMethod: PaymentMethodEnum.BANK_TRANSFER,
      date: new Date("2026-07-01"),
      user: user._id,
    },
    {
      title: "Tax Refund",
      category: categoryMap.get("refund"),
      type: TransactionTypeEnum.INCOME,
      amount: 300,
      description: "Government refund",
      paymentMethod: PaymentMethodEnum.BANK_TRANSFER,
      date: new Date("2026-07-15"),
      user: user._id,
    },

    // =========================
    // Expenses
    // =========================

    {
      title: "Apartment Rent",
      category: categoryMap.get("rent"),
      type: TransactionTypeEnum.EXPENSE,
      amount: 950,
      description: "Monthly rent",
      paymentMethod: PaymentMethodEnum.BANK_TRANSFER,
      date: new Date("2026-05-02"),
      user: user._id,
    },
    {
      title: "Groceries",
      category: categoryMap.get("food"),
      type: TransactionTypeEnum.EXPENSE,
      amount: 95,
      description: "Weekly groceries",
      paymentMethod: PaymentMethodEnum.CARD,
      date: new Date("2026-05-03"),
      user: user._id,
    },
    {
      title: "Bus Pass",
      category: categoryMap.get("transportation"),
      type: TransactionTypeEnum.EXPENSE,
      amount: 45,
      description: "Monthly bus pass",
      paymentMethod: PaymentMethodEnum.CARD,
      date: new Date("2026-05-04"),
      user: user._id,
    },
    {
      title: "Electricity Bill",
      category: categoryMap.get("utilities"),
      type: TransactionTypeEnum.EXPENSE,
      amount: 80,
      description: "Electricity bill",
      paymentMethod: PaymentMethodEnum.BANK_TRANSFER,
      date: new Date("2026-05-07"),
      user: user._id,
    },
    {
      title: "Restaurant",
      category: categoryMap.get("food"),
      type: TransactionTypeEnum.EXPENSE,
      amount: 65,
      description: "Dinner with friends",
      paymentMethod: PaymentMethodEnum.CARD,
      date: new Date("2026-05-15"),
      user: user._id,
    },
    {
      title: "Movie",
      category: categoryMap.get("entertainment"),
      type: TransactionTypeEnum.EXPENSE,
      amount: 30,
      description: "Weekend movie",
      paymentMethod: PaymentMethodEnum.CARD,
      date: new Date("2026-05-20"),
      user: user._id,
    },
    {
      title: "Fuel",
      category: categoryMap.get("transportation"),
      type: TransactionTypeEnum.EXPENSE,
      amount: 72,
      description: "Petrol",
      paymentMethod: PaymentMethodEnum.CARD,
      date: new Date("2026-06-03"),
      user: user._id,
    },
    {
      title: "Internet Bill",
      category: categoryMap.get("utilities"),
      type: TransactionTypeEnum.EXPENSE,
      amount: 45,
      description: "Broadband",
      paymentMethod: PaymentMethodEnum.BANK_TRANSFER,
      date: new Date("2026-06-05"),
      user: user._id,
    },
    {
      title: "Shopping",
      category: categoryMap.get("shopping"),
      type: TransactionTypeEnum.EXPENSE,
      amount: 180,
      description: "Summer clothes",
      paymentMethod: PaymentMethodEnum.CARD,
      date: new Date("2026-06-11"),
      user: user._id,
    },
    {
      title: "Doctor Visit",
      category: categoryMap.get("healthcare"),
      type: TransactionTypeEnum.EXPENSE,
      amount: 120,
      description: "Health checkup",
      paymentMethod: PaymentMethodEnum.CARD,
      date: new Date("2026-06-16"),
      user: user._id,
    },
    {
      title: "Coffee",
      category: categoryMap.get("food"),
      type: TransactionTypeEnum.EXPENSE,
      amount: 8,
      description: "Coffee shop",
      paymentMethod: PaymentMethodEnum.MOBILE_WALLET,
      date: new Date("2026-06-19"),
      user: user._id,
    },
    {
      title: "Gym Membership",
      category: categoryMap.get("personal-care"),
      type: TransactionTypeEnum.EXPENSE,
      amount: 55,
      description: "Monthly membership",
      paymentMethod: PaymentMethodEnum.BANK_TRANSFER,
      date: new Date("2026-06-25"),
      user: user._id,
    },
    {
      title: "Groceries",
      category: categoryMap.get("food"),
      type: TransactionTypeEnum.EXPENSE,
      amount: 110,
      description: "Weekly groceries",
      paymentMethod: PaymentMethodEnum.CARD,
      date: new Date("2026-07-02"),
      user: user._id,
    },
    {
      title: "Phone Bill",
      category: categoryMap.get("utilities"),
      type: TransactionTypeEnum.EXPENSE,
      amount: 22,
      description: "Monthly mobile bill",
      paymentMethod: PaymentMethodEnum.MOBILE_WALLET,
      date: new Date("2026-07-05"),
      user: user._id,
    },
    {
      title: "Laptop Backpack",
      category: categoryMap.get("shopping"),
      type: TransactionTypeEnum.EXPENSE,
      amount: 65,
      description: "Office accessories",
      paymentMethod: PaymentMethodEnum.CARD,
      date: new Date("2026-07-08"),
      user: user._id,
    },
    {
      title: "Train Ticket",
      category: categoryMap.get("travel"),
      type: TransactionTypeEnum.EXPENSE,
      amount: 90,
      description: "Business trip",
      paymentMethod: PaymentMethodEnum.CARD,
      date: new Date("2026-07-11"),
      user: user._id,
    },
    {
      title: "Pizza Dinner",
      category: categoryMap.get("food"),
      type: TransactionTypeEnum.EXPENSE,
      amount: 26,
      description: "Weekend dinner",
      paymentMethod: PaymentMethodEnum.CASH,
      date: new Date("2026-07-17"),
      user: user._id,
    },
    {
      title: "Birthday Gift",
      category: categoryMap.get("gifts"),
      type: TransactionTypeEnum.EXPENSE,
      amount: 75,
      description: "Gift for friend",
      paymentMethod: PaymentMethodEnum.CARD,
      date: new Date("2026-07-20"),
      user: user._id,
    },
  ];

  await transactionModel.insertMany(transactions);

  console.log(`${transactions.length} transactions seeded successfully.`);

 } catch (error){
    console.error("Error seeding default categories:", error);
  } finally {
    mongoose.disconnect();
  }
}

seedTransactions()