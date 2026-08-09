import * as dotenv from "dotenv";
dotenv.config();
const mongoose = require("mongoose");
import { categoryModel, transactionModel } from "../models";
import { PaymentMethodEnum, TransactionTypeEnum } from "../enums";

const url = process.env.MONGO_URL!;

export const seedMayTransactions = async () => {
  try {
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Use the same user ID as before (replace with your own if needed)
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
        console.warn(`⚠️ Category slug "${slug}" not found – check your default categories.`);
      }
      return id;
    };

    // ======================
    // May 2026 Transactions
    // ======================
    const transactions = [
      // ---------- INCOMES ----------
      {
        title: "Monthly Salary",
        category: getCategoryId("salary"),
        type: TransactionTypeEnum.INCOME,
        amount: 3200,
        description: "Salary for May",
        paymentMethod: PaymentMethodEnum.BANK_TRANSFER,
        date: new Date("2026-05-01"),
        user: userId,
      },
      {
        title: "Freelance Web Project",
        category: getCategoryId("other-income"),
        type: TransactionTypeEnum.INCOME,
        amount: 600,
        description: "Client website",
        paymentMethod: PaymentMethodEnum.BANK_TRANSFER,
        date: new Date("2026-05-08"),
        user: userId,
      },
      {
        title: "Cash Gift",
        category: getCategoryId("other-income"),
        type: TransactionTypeEnum.INCOME,
        amount: 100,
        description: "Birthday gift from aunt",
        paymentMethod: PaymentMethodEnum.CASH,
        date: new Date("2026-05-14"),
        user: userId,
      },
      {
        title: "Tax Refund",
        category: getCategoryId("refund"),
        type: TransactionTypeEnum.INCOME,
        amount: 350,
        description: "State refund",
        paymentMethod: PaymentMethodEnum.BANK_TRANSFER,
        date: new Date("2026-05-22"),
        user: userId,
      },
      {
        title: "Bonus",
        category: getCategoryId("bonus"),
        type: TransactionTypeEnum.INCOME,
        amount: 450,
        description: "Project completion bonus",
        paymentMethod: PaymentMethodEnum.BANK_TRANSFER,
        date: new Date("2026-05-30"),
        user: userId,
      },

      // ---------- EXPENSES ----------
      {
        title: "Rent Payment",
        category: getCategoryId("rent"),
        type: TransactionTypeEnum.EXPENSE,
        amount: 950,
        description: "Monthly apartment rent",
        paymentMethod: PaymentMethodEnum.BANK_TRANSFER,
        date: new Date("2026-05-02"),
        user: userId,
      },
      {
        title: "Supermarket - Week 1",
        category: getCategoryId("food"),
        type: TransactionTypeEnum.EXPENSE,
        amount: 92,
        description: "Groceries",
        paymentMethod: PaymentMethodEnum.CARD,
        date: new Date("2026-05-03"),
        user: userId,
      },
      {
        title: "Monthly Bus Pass",
        category: getCategoryId("transportation"),
        type: TransactionTypeEnum.EXPENSE,
        amount: 45,
        description: "Public transport",
        paymentMethod: PaymentMethodEnum.CARD,
        date: new Date("2026-05-04"),
        user: userId,
      },
      {
        title: "Electricity Bill",
        category: getCategoryId("utilities"),
        type: TransactionTypeEnum.EXPENSE,
        amount: 78,
        description: "May electricity",
        paymentMethod: PaymentMethodEnum.BANK_TRANSFER,
        date: new Date("2026-05-06"),
        user: userId,
      },
      {
        title: "Gym Membership",
        category: getCategoryId("healthcare"),
        type: TransactionTypeEnum.EXPENSE,
        amount: 55,
        description: "Monthly gym fee",
        paymentMethod: PaymentMethodEnum.BANK_TRANSFER,
        date: new Date("2026-05-07"),
        user: userId,
      },
      {
        title: "Lunch with Colleagues",
        category: getCategoryId("food"),
        type: TransactionTypeEnum.EXPENSE,
        amount: 34,
        description: "Cafeteria",
        paymentMethod: PaymentMethodEnum.CARD,
        date: new Date("2026-05-10"),
        user: userId,
      },
      {
        title: "New Headphones",
        category: getCategoryId("shopping"),
        type: TransactionTypeEnum.EXPENSE,
        amount: 85,
        description: "Wireless headphones",
        paymentMethod: PaymentMethodEnum.CARD,
        date: new Date("2026-05-12"),
        user: userId,
      },
      {
        title: "Water Bill",
        category: getCategoryId("bills"),  // using 'bills' as per your list
        type: TransactionTypeEnum.EXPENSE,
        amount: 32,
        description: "Water utility",
        paymentMethod: PaymentMethodEnum.BANK_TRANSFER,
        date: new Date("2026-05-15"),
        user: userId,
      },
      {
        title: "Concert Tickets",
        category: getCategoryId("entertainment"),
        type: TransactionTypeEnum.EXPENSE,
        amount: 120,
        description: "Live show",
        paymentMethod: PaymentMethodEnum.CARD,
        date: new Date("2026-05-17"),
        user: userId,
      },
      {
        title: "Dentist Appointment",
        category: getCategoryId("healthcare"),
        type: TransactionTypeEnum.EXPENSE,
        amount: 140,
        description: "Dental checkup",
        paymentMethod: PaymentMethodEnum.CARD,
        date: new Date("2026-05-19"),
        user: userId,
      },
      {
        title: "Weekend Getaway",
        category: getCategoryId("travel"),
        type: TransactionTypeEnum.EXPENSE,
        amount: 210,
        description: "Hotel and transport",
        paymentMethod: PaymentMethodEnum.CARD,
        date: new Date("2026-05-23"),
        user: userId,
      },
      {
        title: "Mobile Phone Bill",
        category: getCategoryId("utilities"),
        type: TransactionTypeEnum.EXPENSE,
        amount: 22,
        description: "May phone plan",
        paymentMethod: PaymentMethodEnum.MOBILE_WALLET,
        date: new Date("2026-05-25"),
        user: userId,
      },
      {
        title: "Coffee Run",
        category: getCategoryId("food"),
        type: TransactionTypeEnum.EXPENSE,
        amount: 9,
        description: "Morning coffee",
        paymentMethod: PaymentMethodEnum.CASH,
        date: new Date("2026-05-26"),
        user: userId,
      },
      {
        title: "Car Insurance",
        category: getCategoryId("insurance"),
        type: TransactionTypeEnum.EXPENSE,
        amount: 95,
        description: "Monthly car insurance",
        paymentMethod: PaymentMethodEnum.BANK_TRANSFER,
        date: new Date("2026-05-28"),
        user: userId,
      },
      {
        title: "Mother's Day Gift",
        category: getCategoryId("gifts"),
        type: TransactionTypeEnum.EXPENSE,
        amount: 75,
        description: "Gift for mom",
        paymentMethod: PaymentMethodEnum.CARD,
        date: new Date("2026-05-29"),
        user: userId,
      },
      {
        title: "Miscellaneous",
        category: getCategoryId("other-expense"),
        type: TransactionTypeEnum.EXPENSE,
        amount: 20,
        description: "Various small items",
        paymentMethod: PaymentMethodEnum.CASH,
        date: new Date("2026-05-31"),
        user: userId,
      },
    ];

    await transactionModel.insertMany(transactions);
    console.log(`✅ ${transactions.length} May transactions seeded successfully.`);
  } catch (error) {
    console.error("❌ Error seeding May transactions:", error);
  } finally {
    await mongoose.disconnect();
  }
};


seedMayTransactions();