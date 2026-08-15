import CryptoJS from 'crypto-js';

class Encoding {
  private static instance: Encoding;
  private constructor() {}

  static get(): Encoding {
    if (!Encoding.instance) {
      Encoding.instance = new Encoding();
    }
    return Encoding.instance;
  }

  async encode(data: string): Promise<string> {
    try {
      const encodedData = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(data));
      return encodedData;
    } catch (error) {
      throw new Error('Error encoding data');
    }
  }

  async decode(encodedData: string): Promise<string> {
    try {
      const decodedText = CryptoJS.enc.Utf8.stringify(CryptoJS.enc.Base64.parse(encodedData));
      console.log("decodedText----->",decodedText)
      return decodedText;
    } catch (error) {
      throw new Error('Error decoding data');
    }
  }
}

const encoding = Encoding.get();

export { encoding as Encoding };
