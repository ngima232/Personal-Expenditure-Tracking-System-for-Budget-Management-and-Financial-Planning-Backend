import * as dotenv from "dotenv";
dotenv.config();
const mongoose = require("mongoose");
import { categoryModel, transactionModel } from "../models";
import { PaymentMethodEnum, TransactionTypeEnum } from "../enums";

const url = process.env.MONGO_URL!;

export const seedMarchTransactions = async () => {
  try {
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Use the same user ID (replace if needed)
    const userId = new mongoose.Types.ObjectId("6a78d0934c1c6b8378ab534f");

    // Fetch all default categories
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
    // March 2026 Transactions
    // ======================
    const transactions = [
      // ---------- INCOMES ----------
      {
        title: "Monthly Salary",
        category: getCategoryId("salary"),
        type: TransactionTypeEnum.INCOME,
        amount: 3200,
        description: "Salary for March",
        paymentMethod: PaymentMethodEnum.BANK_TRANSFER,
        date: new Date("2026-03-01"),
        user: userId,
      },
      {
        title: "Freelance Coding",
        category: getCategoryId("other-income"),
        type: TransactionTypeEnum.INCOME,
        amount: 680,
        description: "Small project",
        paymentMethod: PaymentMethodEnum.BANK_TRANSFER,
        date: new Date("2026-03-08"),
        user: userId,
      },
      {
        title: "Cash Gift",
        category: getCategoryId("other-income"),
        type: TransactionTypeEnum.INCOME,
        amount: 50,
        description: "Birthday from a friend",
        paymentMethod: PaymentMethodEnum.CASH,
        date: new Date("2026-03-12"),
        user: userId,
      },
      {
        title: "Bonus",
        category: getCategoryId("bonus"),
        type: TransactionTypeEnum.INCOME,
        amount: 300,
        description: "Monthly bonus",
        paymentMethod: PaymentMethodEnum.BANK_TRANSFER,
        date: new Date("2026-03-20"),
        user: userId,
      },
      {
        title: "Tax Refund",
        category: getCategoryId("refund"),
        type: TransactionTypeEnum.INCOME,
        amount: 180,
        description: "State tax refund",
        paymentMethod: PaymentMethodEnum.BANK_TRANSFER,
        date: new Date("2026-03-28"),
        user: userId,
      },

      // ---------- EXPENSES ----------
      {
        title: "Rent Payment",
        category: getCategoryId("rent"),
        type: TransactionTypeEnum.EXPENSE,
        amount: 950,
        description: "March rent",
        paymentMethod: PaymentMethodEnum.BANK_TRANSFER,
        date: new Date("2026-03-02"),
        user: userId,
      },
      {
        title: "Groceries - Week 1",
        category: getCategoryId("food"),
        type: TransactionTypeEnum.EXPENSE,
        amount: 87,
        description: "Supermarket",
        paymentMethod: PaymentMethodEnum.CARD,
        date: new Date("2026-03-03"),
        user: userId,
      },
      {
        title: "Taxi to Airport",
        category: getCategoryId("transportation"),
        type: TransactionTypeEnum.EXPENSE,
        amount: 35,
        description: "Ride sharing",
        paymentMethod: PaymentMethodEnum.CARD,
        date: new Date("2026-03-05"),
        user: userId,
      },
      {
        title: "Gas Bill",
        category: getCategoryId("bills"),
        type: TransactionTypeEnum.EXPENSE,
        amount: 62,
        description: "Heating bill",
        paymentMethod: PaymentMethodEnum.BANK_TRANSFER,
        date: new Date("2026-03-07"),
        user: userId,
      },
      {
        title: "New Jacket",
        category: getCategoryId("shopping"),
        type: TransactionTypeEnum.EXPENSE,
        amount: 110,
        description: "Spring coat",
        paymentMethod: PaymentMethodEnum.CARD,
        date: new Date("2026-03-10"),
        user: userId,
      },
      {
        title: "Pizza Night",
        category: getCategoryId("food"),
        type: TransactionTypeEnum.EXPENSE,
        amount: 28,
        description: "Takeout",
        paymentMethod: PaymentMethodEnum.CARD,
        date: new Date("2026-03-12"),
        user: userId,
      },
      {
        title: "Concert Tickets",
        category: getCategoryId("entertainment"),
        type: TransactionTypeEnum.EXPENSE,
        amount: 80,
        description: "Live band",
        paymentMethod: PaymentMethodEnum.CARD,
        date: new Date("2026-03-15"),
        user: userId,
      },
      {
        title: "Bus to City",
        category: getCategoryId("travel"),
        type: TransactionTypeEnum.EXPENSE,
        amount: 22,
        description: "Day trip",
        paymentMethod: PaymentMethodEnum.CARD,
        date: new Date("2026-03-18"),
        user: userId,
      },
      {
        title: "Health Insurance",
        category: getCategoryId("insurance"),
        type: TransactionTypeEnum.EXPENSE,
        amount: 95,
        description: "Monthly premium",
        paymentMethod: PaymentMethodEnum.BANK_TRANSFER,
        date: new Date("2026-03-20"),
        user: userId,
      },
      {
        title: "Water & Electricity",
        category: getCategoryId("utilities"),
        type: TransactionTypeEnum.EXPENSE,
        amount: 73,
        description: "March utilities",
        paymentMethod: PaymentMethodEnum.BANK_TRANSFER,
        date: new Date("2026-03-22"),
        user: userId,
      },
      {
        title: "Dentist Cleaning",
        category: getCategoryId("healthcare"),
        type: TransactionTypeEnum.EXPENSE,
        amount: 85,
        description: "Dental checkup",
        paymentMethod: PaymentMethodEnum.CARD,
        date: new Date("2026-03-24"),
        user: userId,
      },
      {
        title: "Coffee & Snacks",
        category: getCategoryId("food"),
        type: TransactionTypeEnum.EXPENSE,
        amount: 12,
        description: "Cafe",
        paymentMethod: PaymentMethodEnum.CASH,
        date: new Date("2026-03-26"),
        user: userId,
      },
      {
        title: "Gift for Mom",
        category: getCategoryId("gifts"),
        type: TransactionTypeEnum.EXPENSE,
        amount: 55,
        description: "Mother's Day early gift",
        paymentMethod: PaymentMethodEnum.CARD,
        date: new Date("2026-03-28"),
        user: userId,
      },
      {
        title: "Miscellaneous",
        category: getCategoryId("other-expense"),
        type: TransactionTypeEnum.EXPENSE,
        amount: 30,
        description: "Various items",
        paymentMethod: PaymentMethodEnum.CASH,
        date: new Date("2026-03-31"),
        user: userId,
      },
    ];

    await transactionModel.insertMany(transactions);
    console.log(`✅ ${transactions.length} March transactions seeded successfully.`);
  } catch (error) {
    console.error("❌ Error seeding March transactions:", error);
  } finally {
    await mongoose.disconnect();
  }
};

// Run the seeder if this file is executed directly
seedMarchTransactions();