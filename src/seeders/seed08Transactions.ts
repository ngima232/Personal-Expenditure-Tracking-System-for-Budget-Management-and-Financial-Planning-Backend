import * as dotenv from "dotenv";
dotenv.config();
const mongoose = require("mongoose");
import { categoryModel, transactionModel } from "../models";
import { PaymentMethodEnum, TransactionTypeEnum } from "../enums";

const url = process.env.MONGO_URL!;

export const seedAugustTransactions = async () => {
  try {
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Use the same user ID (replace with a valid one)
    const userId = new mongoose.Types.ObjectId("6a78ccbc493c827f2ac5c14c");

    // Fetch default categories
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

    // ==========================
    // August 2026 (1st – 10th)
    // ==========================
    const transactions = [
      // ---------- INCOMES ----------
      {
        title: "Monthly Salary",
        category: getCategoryId("salary"),
        type: TransactionTypeEnum.INCOME,
        amount: 3200,
        description: "Salary for August",
        paymentMethod: PaymentMethodEnum.BANK_TRANSFER,
        date: new Date("2026-08-01"),
        user: userId,
      },
      {
        title: "Freelance Consulting",
        category: getCategoryId("other-income"),
        type: TransactionTypeEnum.INCOME,
        amount: 420,
        description: "Business advisory",
        paymentMethod: PaymentMethodEnum.BANK_TRANSFER,
        date: new Date("2026-08-05"),
        user: userId,
      },
      {
        title: "Cash Gift",
        category: getCategoryId("other-income"),
        type: TransactionTypeEnum.INCOME,
        amount: 60,
        description: "Birthday gift",
        paymentMethod: PaymentMethodEnum.CASH,
        date: new Date("2026-08-08"),
        user: userId,
      },

      // ---------- EXPENSES ----------
      {
        title: "Rent Payment",
        category: getCategoryId("rent"),
        type: TransactionTypeEnum.EXPENSE,
        amount: 950,
        description: "August rent",
        paymentMethod: PaymentMethodEnum.BANK_TRANSFER,
        date: new Date("2026-08-02"),
        user: userId,
      },
      {
        title: "Groceries",
        category: getCategoryId("food"),
        type: TransactionTypeEnum.EXPENSE,
        amount: 102,
        description: "Weekly groceries",
        paymentMethod: PaymentMethodEnum.CARD,
        date: new Date("2026-08-03"),
        user: userId,
      },
      {
        title: "Uber to Office",
        category: getCategoryId("transportation"),
        type: TransactionTypeEnum.EXPENSE,
        amount: 22,
        description: "Ride sharing",
        paymentMethod: PaymentMethodEnum.CARD,
        date: new Date("2026-08-04"),
        user: userId,
      },
      {
        title: "Electricity Bill",
        category: getCategoryId("bills"),
        type: TransactionTypeEnum.EXPENSE,
        amount: 70,
        description: "August electricity",
        paymentMethod: PaymentMethodEnum.BANK_TRANSFER,
        date: new Date("2026-08-06"),
        user: userId,
      },
      {
        title: "New Backpack",
        category: getCategoryId("shopping"),
        type: TransactionTypeEnum.EXPENSE,
        amount: 65,
        description: "Work bag",
        paymentMethod: PaymentMethodEnum.CARD,
        date: new Date("2026-08-07"),
        user: userId,
      },
      {
        title: "Dinner with Colleagues",
        category: getCategoryId("food"),
        type: TransactionTypeEnum.EXPENSE,
        amount: 45,
        description: "Restaurant",
        paymentMethod: PaymentMethodEnum.CARD,
        date: new Date("2026-08-08"),
        user: userId,
      },
      {
        title: "Movie Night",
        category: getCategoryId("entertainment"),
        type: TransactionTypeEnum.EXPENSE,
        amount: 28,
        description: "Cinema",
        paymentMethod: PaymentMethodEnum.CARD,
        date: new Date("2026-08-09"),
        user: userId,
      },
      {
        title: "Miscellaneous",
        category: getCategoryId("other-expense"),
        type: TransactionTypeEnum.EXPENSE,
        amount: 18,
        description: "Various small items",
        paymentMethod: PaymentMethodEnum.CASH,
        date: new Date("2026-08-10"),
        user: userId,
      },
    ];

    await transactionModel.insertMany(transactions);
    console.log(`✅ ${transactions.length} August transactions (1st–10th) seeded successfully.`);
  } catch (error) {
    console.error("❌ Error seeding August transactions:", error);
  } finally {
    await mongoose.disconnect();
  }
};

// Execute the seeder if this file is run directly
seedAugustTransactions();