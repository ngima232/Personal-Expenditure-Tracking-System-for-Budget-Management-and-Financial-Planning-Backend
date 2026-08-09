import * as dotenv from "dotenv";
dotenv.config();
const mongoose = require("mongoose");
import { categoryModel, transactionModel } from "../models";
import { PaymentMethodEnum, TransactionTypeEnum } from "../enums";

const url = process.env.MONGO_URL!;

export const seedJuneTransactions = async () => {
  try {
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Use the same user ID as before (replace if needed)
    const userId = new mongoose.Types.ObjectId("6a78d0934c1c6b8378ab534f");

    // Fetch default categories
    const categories = await categoryModel.find({ isDefault: true });

    // Map slug -> _id
    const categoryMap = new Map(
      categories.map((cat) => [cat.slug, cat._id])
    );

    const getCategoryId = (slug: string) => {
      const id = categoryMap.get(slug);
      if (!id) {
        console.warn(`⚠️ Category slug "${slug}" not found – check your default categories.`);
      }
      return id;
    };

    // ======================
    // June 2026 Transactions
    // ======================
    const transactions = [
      // ---------- INCOMES ----------
      {
        title: "Monthly Salary",
        category: getCategoryId("salary"),
        type: TransactionTypeEnum.INCOME,
        amount: 3200,
        description: "Salary for June",
        paymentMethod: PaymentMethodEnum.BANK_TRANSFER,
        date: new Date("2026-06-01"),
        user: userId,
      },
      {
        title: "Freelance Design",
        category: getCategoryId("other-income"),
        type: TransactionTypeEnum.INCOME,
        amount: 720,
        description: "Logo design project",
        paymentMethod: PaymentMethodEnum.BANK_TRANSFER,
        date: new Date("2026-06-09"),
        user: userId,
      },
      {
        title: "Stock Dividend",
        category: getCategoryId("other-income"),
        type: TransactionTypeEnum.INCOME,
        amount: 150,
        description: "Quarterly dividend",
        paymentMethod: PaymentMethodEnum.BANK_TRANSFER,
        date: new Date("2026-06-15"),
        user: userId,
      },
      {
        title: "Bonus",
        category: getCategoryId("bonus"),
        type: TransactionTypeEnum.INCOME,
        amount: 600,
        description: "Annual performance bonus",
        paymentMethod: PaymentMethodEnum.BANK_TRANSFER,
        date: new Date("2026-06-25"),
        user: userId,
      },
      {
        title: "Tax Refund",
        category: getCategoryId("refund"),
        type: TransactionTypeEnum.INCOME,
        amount: 280,
        description: "Federal refund",
        paymentMethod: PaymentMethodEnum.BANK_TRANSFER,
        date: new Date("2026-06-29"),
        user: userId,
      },

      // ---------- EXPENSES ----------
      {
        title: "Apartment Rent",
        category: getCategoryId("rent"),
        type: TransactionTypeEnum.EXPENSE,
        amount: 950,
        description: "June rent",
        paymentMethod: PaymentMethodEnum.BANK_TRANSFER,
        date: new Date("2026-06-02"),
        user: userId,
      },
      {
        title: "Groceries - Week 1",
        category: getCategoryId("food"),
        type: TransactionTypeEnum.EXPENSE,
        amount: 98,
        description: "Supermarket",
        paymentMethod: PaymentMethodEnum.CARD,
        date: new Date("2026-06-03"),
        user: userId,
      },
      {
        title: "Gas for Car",
        category: getCategoryId("transportation"),
        type: TransactionTypeEnum.EXPENSE,
        amount: 55,
        description: "Fuel",
        paymentMethod: PaymentMethodEnum.CARD,
        date: new Date("2026-06-05"),
        user: userId,
      },
      {
        title: "Electricity Bill",
        category: getCategoryId("bills"),
        type: TransactionTypeEnum.EXPENSE,
        amount: 82,
        description: "June electricity",
        paymentMethod: PaymentMethodEnum.BANK_TRANSFER,
        date: new Date("2026-06-07"),
        user: userId,
      },
      {
        title: "Summer Clothes",
        category: getCategoryId("shopping"),
        type: TransactionTypeEnum.EXPENSE,
        amount: 145,
        description: "New summer outfits",
        paymentMethod: PaymentMethodEnum.CARD,
        date: new Date("2026-06-10"),
        user: userId,
      },
      {
        title: "Dinner at Steakhouse",
        category: getCategoryId("food"),
        type: TransactionTypeEnum.EXPENSE,
        amount: 78,
        description: "Celebration dinner",
        paymentMethod: PaymentMethodEnum.CARD,
        date: new Date("2026-06-12"),
        user: userId,
      },
      {
        title: "Movie & Popcorn",
        category: getCategoryId("entertainment"),
        type: TransactionTypeEnum.EXPENSE,
        amount: 35,
        description: "Cinema with friends",
        paymentMethod: PaymentMethodEnum.CARD,
        date: new Date("2026-06-14"),
        user: userId,
      },
      {
        title: "Train to Beach",
        category: getCategoryId("travel"),
        type: TransactionTypeEnum.EXPENSE,
        amount: 68,
        description: "Weekend trip",
        paymentMethod: PaymentMethodEnum.CARD,
        date: new Date("2026-06-17"),
        user: userId,
      },
      {
        title: "Health Insurance Premium",
        category: getCategoryId("insurance"),
        type: TransactionTypeEnum.EXPENSE,
        amount: 120,
        description: "Monthly health insurance",
        paymentMethod: PaymentMethodEnum.BANK_TRANSFER,
        date: new Date("2026-06-19"),
        user: userId,
      },
      {
        title: "Phone & Internet Bundle",
        category: getCategoryId("utilities"),
        type: TransactionTypeEnum.EXPENSE,
        amount: 65,
        description: "Broadband + mobile",
        paymentMethod: PaymentMethodEnum.BANK_TRANSFER,
        date: new Date("2026-06-21"),
        user: userId,
      },
      {
        title: "Gym Personal Trainer",
        category: getCategoryId("healthcare"),
        type: TransactionTypeEnum.EXPENSE,
        amount: 80,
        description: "Fitness session",
        paymentMethod: PaymentMethodEnum.CARD,
        date: new Date("2026-06-23"),
        user: userId,
      },
      {
        title: "Coffee & Pastry",
        category: getCategoryId("food"),
        type: TransactionTypeEnum.EXPENSE,
        amount: 11,
        description: "Cafe",
        paymentMethod: PaymentMethodEnum.CASH,
        date: new Date("2026-06-24"),
        user: userId,
      },
      {
        title: "Birthday Gift for Dad",
        category: getCategoryId("gifts"),
        type: TransactionTypeEnum.EXPENSE,
        amount: 85,
        description: "Father's Day gift",
        paymentMethod: PaymentMethodEnum.CARD,
        date: new Date("2026-06-26"),
        user: userId,
      },
      {
        title: "Bus Pass (Monthly)",
        category: getCategoryId("transportation"),
        type: TransactionTypeEnum.EXPENSE,
        amount: 45,
        description: "Public transport pass",
        paymentMethod: PaymentMethodEnum.CARD,
        date: new Date("2026-06-27"),
        user: userId,
      },
      {
        title: "Miscellaneous Expenses",
        category: getCategoryId("other-expense"),
        type: TransactionTypeEnum.EXPENSE,
        amount: 40,
        description: "Various small purchases",
        paymentMethod: PaymentMethodEnum.CASH,
        date: new Date("2026-06-30"),
        user: userId,
      },
    ];

    await transactionModel.insertMany(transactions);
    console.log(`✅ ${transactions.length} June transactions seeded successfully.`);
  } catch (error) {
    console.error("❌ Error seeding June transactions:", error);
  } finally {
    await mongoose.disconnect();
  }
};

// Execute the seeder if this file is run directly
seedJuneTransactions();