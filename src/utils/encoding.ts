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

  encode(data: string): string {
    try {
      return CryptoJS.enc.Base64.stringify(
        CryptoJS.enc.Utf8.parse(data)
      );
    } catch (error) {
      console.error('Encoding error:', error);
      throw new Error('Error encoding data');
    }
  }

  decode(encodedData: string): string {
    try {
      console.log("encodedData-->",encodedData)
      const bytes = CryptoJS.enc.Base64.parse(encodedData);
      console.log("bytes-->",bytes)
       const updatedData = CryptoJS.enc.Utf8.stringify(bytes);
          console.log("updatedData-->",updatedData)
       return updatedData
    } catch (error) {
      console.error('Decoding error:', error);
      throw new Error('Error decoding data');
    }
  }
}

const encoding = Encoding.get();

export { encoding as Encoding };