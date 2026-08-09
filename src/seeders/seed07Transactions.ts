import * as dotenv from "dotenv";
dotenv.config();
const mongoose = require("mongoose");
import { categoryModel, transactionModel } from "../models";
import { PaymentMethodEnum, TransactionTypeEnum } from "../enums";

const url = process.env.MONGO_URL!;

export const seedJulyTransactions = async () => {
  try {
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Use the same user ID (replace if needed)
    const userId = new mongoose.Types.ObjectId("6a78d0934c1c6b8378ab534f");

    // Get all default categories
    const categories = await categoryModel.find({ isDefault: true });

    // Map slug -> _id
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
    // July 2026 Transactions
    // ======================
    const transactions = [
      // ---------- INCOMES ----------
      {
        title: "Monthly Salary",
        category: getCategoryId("salary"),
        type: TransactionTypeEnum.INCOME,
        amount: 3200,
        description: "Salary for July",
        paymentMethod: PaymentMethodEnum.BANK_TRANSFER,
        date: new Date("2026-07-01"),
        user: userId,
      },
      {
        title: "Freelance Writing",
        category: getCategoryId("other-income"),
        type: TransactionTypeEnum.INCOME,
        amount: 500,
        description: "Blog articles",
        paymentMethod: PaymentMethodEnum.BANK_TRANSFER,
        date: new Date("2026-07-07"),
        user: userId,
      },
      {
        title: "Bonus",
        category: getCategoryId("bonus"),
        type: TransactionTypeEnum.INCOME,
        amount: 350,
        description: "Team bonus",
        paymentMethod: PaymentMethodEnum.BANK_TRANSFER,
        date: new Date("2026-07-15"),
        user: userId,
      },
      {
        title: "Rental Income",
        category: getCategoryId("other-income"),
        type: TransactionTypeEnum.INCOME,
        amount: 200,
        description: "Room sublet",
        paymentMethod: PaymentMethodEnum.BANK_TRANSFER,
        date: new Date("2026-07-20"),
        user: userId,
      },
      {
        title: "Tax Refund",
        category: getCategoryId("refund"),
        type: TransactionTypeEnum.INCOME,
        amount: 220,
        description: "Local tax refund",
        paymentMethod: PaymentMethodEnum.BANK_TRANSFER,
        date: new Date("2026-07-28"),
        user: userId,
      },

      // ---------- EXPENSES ----------
      {
        title: "Rent Payment",
        category: getCategoryId("rent"),
        type: TransactionTypeEnum.EXPENSE,
        amount: 950,
        description: "July rent",
        paymentMethod: PaymentMethodEnum.BANK_TRANSFER,
        date: new Date("2026-07-02"),
        user: userId,
      },
      {
        title: "Groceries - Week 1",
        category: getCategoryId("food"),
        type: TransactionTypeEnum.EXPENSE,
        amount: 105,
        description: "Supermarket",
        paymentMethod: PaymentMethodEnum.CARD,
        date: new Date("2026-07-03"),
        user: userId,
      },
      {
        title: "Uber Rides",
        category: getCategoryId("transportation"),
        type: TransactionTypeEnum.EXPENSE,
        amount: 38,
        description: "Rideshare",
        paymentMethod: PaymentMethodEnum.CARD,
        date: new Date("2026-07-05"),
        user: userId,
      },
      {
        title: "Internet Bill",
        category: getCategoryId("bills"),
        type: TransactionTypeEnum.EXPENSE,
        amount: 45,
        description: "Broadband",
        paymentMethod: PaymentMethodEnum.BANK_TRANSFER,
        date: new Date("2026-07-08"),
        user: userId,
      },
      {
        title: "New Sandals",
        category: getCategoryId("shopping"),
        type: TransactionTypeEnum.EXPENSE,
        amount: 60,
        description: "Summer footwear",
        paymentMethod: PaymentMethodEnum.CARD,
        date: new Date("2026-07-10"),
        user: userId,
      },
      {
        title: "Barbecue with Friends",
        category: getCategoryId("food"),
        type: TransactionTypeEnum.EXPENSE,
        amount: 52,
        description: "Grill party",
        paymentMethod: PaymentMethodEnum.CARD,
        date: new Date("2026-07-12"),
        user: userId,
      },
      {
        title: "Amusement Park",
        category: getCategoryId("entertainment"),
        type: TransactionTypeEnum.EXPENSE,
        amount: 90,
        description: "Tickets and food",
        paymentMethod: PaymentMethodEnum.CARD,
        date: new Date("2026-07-14"),
        user: userId,
      },
      {
        title: "Flight to Beach",
        category: getCategoryId("travel"),
        type: TransactionTypeEnum.EXPENSE,
        amount: 230,
        description: "Summer vacation flight",
        paymentMethod: PaymentMethodEnum.CARD,
        date: new Date("2026-07-17"),
        user: userId,
      },
      {
        title: "Car Insurance",
        category: getCategoryId("insurance"),
        type: TransactionTypeEnum.EXPENSE,
        amount: 100,
        description: "Monthly car insurance",
        paymentMethod: PaymentMethodEnum.BANK_TRANSFER,
        date: new Date("2026-07-19"),
        user: userId,
      },
      {
        title: "Electricity & Water",
        category: getCategoryId("utilities"),
        type: TransactionTypeEnum.EXPENSE,
        amount: 88,
        description: "July utilities",
        paymentMethod: PaymentMethodEnum.BANK_TRANSFER,
        date: new Date("2026-07-22"),
        user: userId,
      },
      {
        title: "Gym Equipment",
        category: getCategoryId("healthcare"),
        type: TransactionTypeEnum.EXPENSE,
        amount: 45,
        description: "Resistance bands",
        paymentMethod: PaymentMethodEnum.CARD,
        date: new Date("2026-07-24"),
        user: userId,
      },
      {
        title: "Ice Cream & Treats",
        category: getCategoryId("food"),
        type: TransactionTypeEnum.EXPENSE,
        amount: 15,
        description: "Summer treats",
        paymentMethod: PaymentMethodEnum.CASH,
        date: new Date("2026-07-25"),
        user: userId,
      },
      {
        title: "Gift for Friend",
        category: getCategoryId("gifts"),
        type: TransactionTypeEnum.EXPENSE,
        amount: 70,
        description: "Birthday present",
        paymentMethod: PaymentMethodEnum.CARD,
        date: new Date("2026-07-27"),
        user: userId,
      },
      {
        title: "Miscellaneous",
        category: getCategoryId("other-expense"),
        type: TransactionTypeEnum.EXPENSE,
        amount: 25,
        description: "Random purchases",
        paymentMethod: PaymentMethodEnum.CASH,
        date: new Date("2026-07-30"),
        user: userId,
      },
    ];

    await transactionModel.insertMany(transactions);
    console.log(`✅ ${transactions.length} July transactions seeded successfully.`);
  } catch (error) {
    console.error("❌ Error seeding July transactions:", error);
  } finally {
    await mongoose.disconnect();
  }
};

// Run the seeder if this file is executed directly
seedJulyTransactions();