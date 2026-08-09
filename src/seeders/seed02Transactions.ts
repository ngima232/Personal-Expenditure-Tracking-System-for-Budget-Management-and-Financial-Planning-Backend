import * as dotenv from "dotenv";
dotenv.config();
const mongoose = require("mongoose");
import { categoryModel, transactionModel } from "../models";
import { PaymentMethodEnum, TransactionTypeEnum } from "../enums";

const url = process.env.MONGO_URL!;

export const seedFebruaryTransactions = async () => {
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
    // February 2026 Transactions
    // ======================
    const transactions = [
      // ---------- INCOMES ----------
      {
        title: "Monthly Salary",
        category: getCategoryId("salary"),
        type: TransactionTypeEnum.INCOME,
        amount: 3200,
        description: "Salary for February",
        paymentMethod: PaymentMethodEnum.BANK_TRANSFER,
        date: new Date("2026-02-01"),
        user: userId,
      },
      {
        title: "Freelance Design",
        category: getCategoryId("other-income"),
        type: TransactionTypeEnum.INCOME,
        amount: 550,
        description: "UI mockups",
        paymentMethod: PaymentMethodEnum.BANK_TRANSFER,
        date: new Date("2026-02-08"),
        user: userId,
      },
      {
        title: "Valentine's Gift Money",
        category: getCategoryId("other-income"),
        type: TransactionTypeEnum.INCOME,
        amount: 100,
        description: "Gift from partner",
        paymentMethod: PaymentMethodEnum.CASH,
        date: new Date("2026-02-14"),
        user: userId,
      },
      {
        title: "Bonus",
        category: getCategoryId("bonus"),
        type: TransactionTypeEnum.INCOME,
        amount: 400,
        description: "Quarterly bonus",
        paymentMethod: PaymentMethodEnum.BANK_TRANSFER,
        date: new Date("2026-02-22"),
        user: userId,
      },
      {
        title: "Tax Refund",
        category: getCategoryId("refund"),
        type: TransactionTypeEnum.INCOME,
        amount: 150,
        description: "Federal refund",
        paymentMethod: PaymentMethodEnum.BANK_TRANSFER,
        date: new Date("2026-02-27"),
        user: userId,
      },

      // ---------- EXPENSES ----------
      {
        title: "Rent",
        category: getCategoryId("rent"),
        type: TransactionTypeEnum.EXPENSE,
        amount: 950,
        description: "February rent",
        paymentMethod: PaymentMethodEnum.BANK_TRANSFER,
        date: new Date("2026-02-02"),
        user: userId,
      },
      {
        title: "Groceries - Week 1",
        category: getCategoryId("food"),
        type: TransactionTypeEnum.EXPENSE,
        amount: 90,
        description: "Supermarket",
        paymentMethod: PaymentMethodEnum.CARD,
        date: new Date("2026-02-03"),
        user: userId,
      },
      {
        title: "Gas for Car",
        category: getCategoryId("transportation"),
        type: TransactionTypeEnum.EXPENSE,
        amount: 40,
        description: "Fuel",
        paymentMethod: PaymentMethodEnum.CARD,
        date: new Date("2026-02-05"),
        user: userId,
      },
      {
        title: "Electricity Bill",
        category: getCategoryId("bills"),
        type: TransactionTypeEnum.EXPENSE,
        amount: 68,
        description: "February electricity",
        paymentMethod: PaymentMethodEnum.BANK_TRANSFER,
        date: new Date("2026-02-07"),
        user: userId,
      },
      {
        title: "New Sweater",
        category: getCategoryId("shopping"),
        type: TransactionTypeEnum.EXPENSE,
        amount: 75,
        description: "Winter clothing",
        paymentMethod: PaymentMethodEnum.CARD,
        date: new Date("2026-02-10"),
        user: userId,
      },
      {
        title: "Valentine's Dinner",
        category: getCategoryId("food"),
        type: TransactionTypeEnum.EXPENSE,
        amount: 85,
        description: "Romantic dinner",
        paymentMethod: PaymentMethodEnum.CARD,
        date: new Date("2026-02-14"),
        user: userId,
      },
      {
        title: "Movie & Popcorn",
        category: getCategoryId("entertainment"),
        type: TransactionTypeEnum.EXPENSE,
        amount: 30,
        description: "Date night",
        paymentMethod: PaymentMethodEnum.CARD,
        date: new Date("2026-02-15"),
        user: userId,
      },
      {
        title: "Train to City",
        category: getCategoryId("travel"),
        type: TransactionTypeEnum.EXPENSE,
        amount: 45,
        description: "Weekend trip",
        paymentMethod: PaymentMethodEnum.CARD,
        date: new Date("2026-02-17"),
        user: userId,
      },
      {
        title: "Health Insurance",
        category: getCategoryId("insurance"),
        type: TransactionTypeEnum.EXPENSE,
        amount: 95,
        description: "Monthly premium",
        paymentMethod: PaymentMethodEnum.BANK_TRANSFER,
        date: new Date("2026-02-19"),
        user: userId,
      },
      {
        title: "Phone & Internet",
        category: getCategoryId("utilities"),
        type: TransactionTypeEnum.EXPENSE,
        amount: 58,
        description: "Broadband + mobile",
        paymentMethod: PaymentMethodEnum.BANK_TRANSFER,
        date: new Date("2026-02-21"),
        user: userId,
      },
      {
        title: "Pharmacy",
        category: getCategoryId("healthcare"),
        type: TransactionTypeEnum.EXPENSE,
        amount: 35,
        description: "Medicines",
        paymentMethod: PaymentMethodEnum.CARD,
        date: new Date("2026-02-23"),
        user: userId,
      },
      {
        title: "Coffee & Pastry",
        category: getCategoryId("food"),
        type: TransactionTypeEnum.EXPENSE,
        amount: 9,
        description: "Cafe",
        paymentMethod: PaymentMethodEnum.CASH,
        date: new Date("2026-02-25"),
        user: userId,
      },
      {
        title: "Gift for Friend",
        category: getCategoryId("gifts"),
        type: TransactionTypeEnum.EXPENSE,
        amount: 60,
        description: "Birthday present",
        paymentMethod: PaymentMethodEnum.CARD,
        date: new Date("2026-02-27"),
        user: userId,
      },
      {
        title: "Miscellaneous",
        category: getCategoryId("other-expense"),
        type: TransactionTypeEnum.EXPENSE,
        amount: 20,
        description: "Random items",
        paymentMethod: PaymentMethodEnum.CASH,
        date: new Date("2026-02-28"),
        user: userId,
      },
    ];

    await transactionModel.insertMany(transactions);
    console.log(`✅ ${transactions.length} February transactions seeded successfully.`);
  } catch (error) {
    console.error("❌ Error seeding February transactions:", error);
  } finally {
    await mongoose.disconnect();
  }
};

// Run the seeder if this file is executed directly
seedFebruaryTransactions();