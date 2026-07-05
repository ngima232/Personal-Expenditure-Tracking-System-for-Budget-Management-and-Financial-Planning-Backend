import mongoose from 'mongoose';

class Database {
  private static instance: Database;
  private url: string;

  private constructor() {
    this.url = process.env.MONGO_URL!;
    mongoose.Promise = global.Promise;
  }

  static get(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  async connect(): Promise<void> {
    try {
      await mongoose.connect(this.url);
      console.log('✔ Database Connected');
    } catch (error: any) {
      console.error('✘ MONGODB ERROR: ', error.message);
      throw error;
    }
  }
}

const database = Database.get();

export { database as Database };
