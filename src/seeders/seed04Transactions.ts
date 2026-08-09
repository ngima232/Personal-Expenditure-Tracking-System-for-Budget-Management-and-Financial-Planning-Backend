import * as dotenv from "dotenv";
dotenv.config();
const mongoose = require("mongoose");
import { categoryModel, userModel, transactionModel } from "../models";
import { PaymentMethodEnum, TransactionTypeEnum } from "../enums";

const url = process.env.MONGO_URL!;

export const seedAprilTransactions = async () => {
  try {
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Use the same user ID as in your original seeder
    const userId = new mongoose.Types.ObjectId("6a78d0934c1c6b8378ab534f");

    // Fetch all default categories
    const categories = await categoryModel.find({ isDefault: true });


// #expenses 
// food, transportation, shopping ,bills , rent, healthcare, entertainment, travel, utilities,
// insurance, gifts, other-expense

// #Income
// salary, bonus, refund, other-income,

    // Build a map: slug -> _id
    const categoryMap = new Map(
      categories.map((cat) => [cat.slug, cat._id])
    );

    // Helper to safely get category ID; if missing, fallback to null (you may want to handle this)
    const getCategoryId = (slug: string) => {
      const id = categoryMap.get(slug);
      if (!id) {
        console.warn(`Category slug "${slug}" not found – check your default categories.`);
      }
      return id;
    };

    // April transactions (2026-04-01 to 2026-04-30)
    const transactions = [
      // --------------------------
      // INCOMES
      // --------------------------
      {
        title: "Monthly Salary",
        category: getCategoryId("salary"),
        type: TransactionTypeEnum.INCOME,
        amount: 3200,
        description: "Salary for April",
        paymentMethod: PaymentMethodEnum.BANK_TRANSFER,
        date: new Date("2026-04-01"),
        user: userId,
      },
      {
        title: "Freelance Project",
        category: getCategoryId("other-income"),
        type: TransactionTypeEnum.INCOME,
        amount: 450,
        description: "Website design",
        paymentMethod: PaymentMethodEnum.BANK_TRANSFER,
        date: new Date("2026-04-10"),
        user: userId,
      },
      {
        title: "Tax Refund",
        category: getCategoryId("refund"),
        type: TransactionTypeEnum.INCOME,
        amount: 200,
        description: "Annual tax refund",
        paymentMethod: PaymentMethodEnum.BANK_TRANSFER,
        date: new Date("2026-04-20"),
        user: userId,
      },
      {
        title: "Bonus",
        category: getCategoryId("bonus"),
        type: TransactionTypeEnum.INCOME,
        amount: 500,
        description: "Performance bonus",
        paymentMethod: PaymentMethodEnum.BANK_TRANSFER,
        date: new Date("2026-04-28"),
        user: userId,
      },

      // --------------------------
      // EXPENSES
      // --------------------------
      {
        title: "Apartment Rent",
        category: getCategoryId("rent"),
        type: TransactionTypeEnum.EXPENSE,
        amount: 950,
        description: "Monthly rent",
        paymentMethod: PaymentMethodEnum.BANK_TRANSFER,
        date: new Date("2026-04-02"),
        user: userId,
      },
      {
        title: "Groceries - Week 1",
        category: getCategoryId("food"),
        type: TransactionTypeEnum.EXPENSE,
        amount: 85,
        description: "Weekly groceries",
        paymentMethod: PaymentMethodEnum.CARD,
        date: new Date("2026-04-03"),
        user: userId,
      },
      {
        title: "Bus Pass",
        category: getCategoryId("transportation"),
        type: TransactionTypeEnum.EXPENSE,
        amount: 45,
        description: "Monthly bus pass",
        paymentMethod: PaymentMethodEnum.CARD,
        date: new Date("2026-04-04"),
        user: userId,
      },
      {
        title: "Electricity Bill",
        category: getCategoryId("utilities"),
        type: TransactionTypeEnum.EXPENSE,
        amount: 75,
        description: "Electricity bill",
        paymentMethod: PaymentMethodEnum.BANK_TRANSFER,
        date: new Date("2026-04-05"),
        user: userId,
      },
      {
        title: "Gym Membership",
        category: getCategoryId("healthcare"), // or personal-care; you listed healthcare
        type: TransactionTypeEnum.EXPENSE,
        amount: 55,
        description: "Monthly gym",
        paymentMethod: PaymentMethodEnum.BANK_TRANSFER,
        date: new Date("2026-04-07"),
        user: userId,
      },
      {
        title: "Dinner with Friends",
        category: getCategoryId("food"),
        type: TransactionTypeEnum.EXPENSE,
        amount: 48,
        description: "Restaurant",
        paymentMethod: PaymentMethodEnum.CARD,
        date: new Date("2026-04-09"),
        user: userId,
      },
      {
        title: "New Shoes",
        category: getCategoryId("shopping"),
        type: TransactionTypeEnum.EXPENSE,
        amount: 120,
        description: "Sport shoes",
        paymentMethod: PaymentMethodEnum.CARD,
        date: new Date("2026-04-12"),
        user: userId,
      },
      {
        title: "Internet Bill",
        category: getCategoryId("bills"), // you listed bills as a separate slug
        type: TransactionTypeEnum.EXPENSE,
        amount: 45,
        description: "Broadband",
        paymentMethod: PaymentMethodEnum.BANK_TRANSFER,
        date: new Date("2026-04-14"),
        user: userId,
      },
      {
        title: "Movie Tickets",
        category: getCategoryId("entertainment"),
        type: TransactionTypeEnum.EXPENSE,
        amount: 28,
        description: "Cinema",
        paymentMethod: PaymentMethodEnum.CARD,
        date: new Date("2026-04-16"),
        user: userId,
      },
      {
        title: "Doctor Visit",
        category: getCategoryId("healthcare"),
        type: TransactionTypeEnum.EXPENSE,
        amount: 110,
        description: "Check-up",
        paymentMethod: PaymentMethodEnum.CARD,
        date: new Date("2026-04-18"),
        user: userId,
      },
      {
        title: "Weekend Trip",
        category: getCategoryId("travel"),
        type: TransactionTypeEnum.EXPENSE,
        amount: 150,
        description: "Train and hotel",
        paymentMethod: PaymentMethodEnum.CARD,
        date: new Date("2026-04-22"),
        user: userId,
      },
      {
        title: "Phone Bill",
        category: getCategoryId("utilities"),
        type: TransactionTypeEnum.EXPENSE,
        amount: 22,
        description: "Mobile plan",
        paymentMethod: PaymentMethodEnum.MOBILE_WALLET,
        date: new Date("2026-04-24"),
        user: userId,
      },
      {
        title: "Coffee & Snacks",
        category: getCategoryId("food"),
        type: TransactionTypeEnum.EXPENSE,
        amount: 12,
        description: "Cafe",
        paymentMethod: PaymentMethodEnum.CASH,
        date: new Date("2026-04-26"),
        user: userId,
      },
      {
        title: "Insurance Premium",
        category: getCategoryId("insurance"),
        type: TransactionTypeEnum.EXPENSE,
        amount: 85,
        description: "Health insurance",
        paymentMethod: PaymentMethodEnum.BANK_TRANSFER,
        date: new Date("2026-04-28"),
        user: userId,
      },
      {
        title: "Birthday Present",
        category: getCategoryId("gifts"),
        type: TransactionTypeEnum.EXPENSE,
        amount: 60,
        description: "Gift for colleague",
        paymentMethod: PaymentMethodEnum.CARD,
        date: new Date("2026-04-29"),
        user: userId,
      },
      {
        title: "Miscellaneous",
        category: getCategoryId("other-expense"),
        type: TransactionTypeEnum.EXPENSE,
        amount: 30,
        description: "Other small expenses",
        paymentMethod: PaymentMethodEnum.CASH,
        date: new Date("2026-04-30"),
        user: userId,
      },
    ];

    // Insert all transactions
    await transactionModel.insertMany(transactions);

    console.log(`${transactions.length} April transactions seeded successfully.`);
  } catch (error) {
    console.error("Error seeding April transactions:", error);
  } finally {
    await mongoose.disconnect();
  }
};

// Execute the seeder if this file is run directly
seedAprilTransactions();