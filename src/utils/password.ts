import bcrypt from 'bcrypt';

class Password {
  private static instance: Password;
  private static saltRounds = 10;

  private constructor() {}

  static get(): Password {
    if (!Password.instance) {
      Password.instance = new Password();
    }
    return Password.instance;
  }

  async generate(password: string): Promise<string> {
    try {
      const hash = await bcrypt.hash(password, Password.saltRounds);
      return hash;
    } catch (error) {
      throw new Error('Error hashing password');
    }
  }

  async validate(password: string, hashedPassword: string): Promise<boolean> {
    try {
      const match = await bcrypt.compare(password, hashedPassword);
      return match;
    } catch (error) {
      throw new Error('Error comparing passwords');
    }
  }
}

const password = Password.get();

export { password as Password };
