class MongooseQueryGenerator {
  private static instance: MongooseQueryGenerator;
  private constructor() { }

  public static get(): MongooseQueryGenerator {
    if (!MongooseQueryGenerator.instance) {
      MongooseQueryGenerator.instance = new MongooseQueryGenerator();
    }
    return MongooseQueryGenerator.instance;
  }

  public searchRegex({ query, fields }: { query: string; fields: string[] }): any {
    const filter = [];
    for (const field of fields) {
      filter.push({ [field]: { $regex: new RegExp(query, 'i') } });
    }
    return filter;
  }
}

const mongooseQueryGenerator = MongooseQueryGenerator.get();

export { mongooseQueryGenerator as MongooseQueryGenerator };
