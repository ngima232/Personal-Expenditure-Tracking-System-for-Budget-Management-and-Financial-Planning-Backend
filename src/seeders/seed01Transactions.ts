import * as dotenv from "dotenv";
dotenv.config();
const mongoose = require("mongoose");
import { categoryModel, transactionModel } from "../models";
import { PaymentMethodEnum, TransactionTypeEnum } from "../enums";

const url = process.env.MONGO_URL!;

export const seedJanuaryTransactions = async () => {
  try {
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Use the same user ID (replace if needed)
    const userId = new mongoose.Types.ObjectId("6a78d0934c1c6b8378ab534f");

    // Get all default categories
    const categories = await categoryModel.find({ isDefault: true });

    // Build slug -> _id map
    const categoryMap = new Map(
      categories.map((cat) => [cat.slug, cat._id])
    );

    const getCategoryId = (slug: string) => {
      const id = categoryMap.get(slug);
      if (!id) {
        console.warn(`⚠️ Category slug "${slug}" not found.`);
      }
      return id;
    };

    // ======================
    // January 2026 Transactions
    // ======================
    const transactions = [
      // ---------- INCOMES ----------
      {
        title: "Monthly Salary",
        category: getCategoryId("salary"),
        type: TransactionTypeEnum.INCOME,
        amount: 3200,
        description: "Salary for January",
        paymentMethod: PaymentMethodEnum.BANK_TRANSFER,
        date: new Date("2026-01-02"),
        user: userId,
      },
      {
        title: "Freelance Project",
        category: getCategoryId("other-income"),
        type: TransactionTypeEnum.INCOME,
        amount: 450,
        description: "Web development",
        paymentMethod: PaymentMethodEnum.BANK_TRANSFER,
        date: new Date("2026-01-10"),
        user: userId,
      },
      {
        title: "New Year Gift",
        category: getCategoryId("other-income"),
        type: TransactionTypeEnum.INCOME,
        amount: 80,
        description: "Cash gift from family",
        paymentMethod: PaymentMethodEnum.CASH,
        date: new Date("2026-01-14"),
        user: userId,
      },
      {
        title: "Bonus",
        category: getCategoryId("bonus"),
        type: TransactionTypeEnum.INCOME,
        amount: 500,
        description: "Year-end bonus (paid Jan)",
        paymentMethod: PaymentMethodEnum.BANK_TRANSFER,
        date: new Date("2026-01-20"),
        user: userId,
      },
      {
        title: "Tax Refund",
        category: getCategoryId("refund"),
        type: TransactionTypeEnum.INCOME,
        amount: 120,
        description: "State refund",
        paymentMethod: PaymentMethodEnum.BANK_TRANSFER,
        date: new Date("2026-01-28"),
        user: userId,
      },

      // ---------- EXPENSES ----------
      {
        title: "Rent",
        category: getCategoryId("rent"),
        type: TransactionTypeEnum.EXPENSE,
        amount: 950,
        description: "January rent",
        paymentMethod: PaymentMethodEnum.BANK_TRANSFER,
        date: new Date("2026-01-03"),
        user: userId,
      },
      {
        title: "Groceries - Week 1",
        category: getCategoryId("food"),
        type: TransactionTypeEnum.EXPENSE,
        amount: 85,
        description: "Supermarket",
        paymentMethod: PaymentMethodEnum.CARD,
        date: new Date("2026-01-04"),
        user: userId,
      },
      {
        title: "Bus Pass (Monthly)",
        category: getCategoryId("transportation"),
        type: TransactionTypeEnum.EXPENSE,
        amount: 45,
        description: "Public transport",
        paymentMethod: PaymentMethodEnum.CARD,
        date: new Date("2026-01-05"),
        user: userId,
      },
      {
        title: "Electricity Bill",
        category: getCategoryId("bills"),
        type: TransactionTypeEnum.EXPENSE,
        amount: 72,
        description: "January electricity",
        paymentMethod: PaymentMethodEnum.BANK_TRANSFER,
        date: new Date("2026-01-07"),
        user: userId,
      },
      {
        title: "Winter Jacket",
        category: getCategoryId("shopping"),
        type: TransactionTypeEnum.EXPENSE,
        amount: 130,
        description: "Heavy coat",
        paymentMethod: PaymentMethodEnum.CARD,
        date: new Date("2026-01-09"),
        user: userId,
      },
      {
        title: "New Year Dinner",
        category: getCategoryId("food"),
        type: TransactionTypeEnum.EXPENSE,
        amount: 68,
        description: "Celebration",
        paymentMethod: PaymentMethodEnum.CARD,
        date: new Date("2026-01-12"),
        user: userId,
      },
      {
        title: "Cinema",
        category: getCategoryId("entertainment"),
        type: TransactionTypeEnum.EXPENSE,
        amount: 25,
        description: "Movie tickets",
        paymentMethod: PaymentMethodEnum.CARD,
        date: new Date("2026-01-15"),
        user: userId,
      },
      {
        title: "Flight to Parents",
        category: getCategoryId("travel"),
        type: TransactionTypeEnum.EXPENSE,
        amount: 180,
        description: "Holiday visit",
        paymentMethod: PaymentMethodEnum.CARD,
        date: new Date("2026-01-18"),
        user: userId,
      },
      {
        title: "Health Insurance",
        category: getCategoryId("insurance"),
        type: TransactionTypeEnum.EXPENSE,
        amount: 95,
        description: "Monthly premium",
        paymentMethod: PaymentMethodEnum.BANK_TRANSFER,
        date: new Date("2026-01-20"),
        user: userId,
      },
      {
        title: "Water & Gas",
        category: getCategoryId("utilities"),
        type: TransactionTypeEnum.EXPENSE,
        amount: 60,
        description: "January utilities",
        paymentMethod: PaymentMethodEnum.BANK_TRANSFER,
        date: new Date("2026-01-22"),
        user: userId,
      },
      {
        title: "Pharmacy",
        category: getCategoryId("healthcare"),
        type: TransactionTypeEnum.EXPENSE,
        amount: 28,
        description: "Cold medicine",
        paymentMethod: PaymentMethodEnum.CARD,
        date: new Date("2026-01-24"),
        user: userId,
      },
      {
        title: "Coffee & Pastry",
        category: getCategoryId("food"),
        type: TransactionTypeEnum.EXPENSE,
        amount: 10,
        description: "Cafe",
        paymentMethod: PaymentMethodEnum.CASH,
        date: new Date("2026-01-26"),
        user: userId,
      },
      {
        title: "Gift for Friend",
        category: getCategoryId("gifts"),
        type: TransactionTypeEnum.EXPENSE,
        amount: 50,
        description: "Birthday present",
        paymentMethod: PaymentMethodEnum.CARD,
        date: new Date("2026-01-28"),
        user: userId,
      },
      {
        title: "Miscellaneous",
        category: getCategoryId("other-expense"),
        type: TransactionTypeEnum.EXPENSE,
        amount: 15,
        description: "Random items",
        paymentMethod: PaymentMethodEnum.CASH,
        date: new Date("2026-01-31"),
        user: userId,
      },
    ];

    await transactionModel.insertMany(transactions);
    console.log(`✅ ${transactions.length} January transactions seeded successfully.`);
  } catch (error) {
    console.error("❌ Error seeding January transactions:", error);
  } finally {
    await mongoose.disconnect();
  }
};

// Run the seeder if this file is executed directly
seedJanuaryTransactions();