import { InputeUserInterface, UserInterface,ChangePassword ,UserLogin,GetUserInterface} from '../interfaces';
import { userModel } from '../models'
import { Password,  Encoding,EmailService} from "../utils";
export class UserService {

  async create(input: InputeUserInterface): Promise<UserInterface> {
    const originalEmail = input.email
    if (input.email) {
               input.email = await Encoding.encode(input.email).toLowerCase();
          }
    const dataExists = await  userModel.findOne({ email: input.email, deletedAt: null });
    if (dataExists) throw new Error(`user with email: ${originalEmail} is already exists!`);
    const hashedPassword = await Password.generate(input.password);
    input.password = hashedPassword;
    const created = await  userModel.create(input);
    return created;
  }

  async update(id: string, updates: Partial<InputeUserInterface>): Promise<UserInterface | null> {
    const dataExists = await  userModel.findOne({
      _id: id,
      deletedAt: { $ne: null },
    })
    if (dataExists) throw new Error(`Given id: ${id} is not found or already deleted`);
     if (updates.email) {
          updates.email = await Encoding.encode(updates.email).toLowerCase();
      }

    const updatedData = await  userModel.findByIdAndUpdate(id, updates, { new: true });
    if (!updatedData) throw new Error(`Failed to update id : ${id} `)
    return updatedData;
  }

  async changePassword(
    input: ChangePassword,
  ): Promise<UserInterface | null> {
    const EncryptedEmail = await Encoding.encode(input.email);
    const emailExist = await userModel.findOne({
      email: EncryptedEmail,
      deletedAt: null,
    });
    if (!emailExist) throw new Error(`${input.email} does not exist`);

    const isMatch = await Password.validate(
      input.oldPassword,
      emailExist.password,
    );
    if (!isMatch) throw new Error("incorrect password!!! try agin");
    const hashedPassword = await Password.generate(input.newPassword);
   
    const updatedEmployee = await userModel.findByIdAndUpdate(emailExist._id, {
             password: hashedPassword
                }, { new: true })

    if (!updatedEmployee)
      throw new Error(`Failed to update id : ${input.email} `);
    return updatedEmployee;
  }

  async delete(id: string): Promise<boolean> {
    const data = await  userModel.findOne({ _id: id, deletedAt: { $ne: null }, })
    if (data) throw new Error(`Given id: ${id} is not found or already deleted`);
    const deleted = await  userModel.findByIdAndUpdate(
      id,
      { $set: { deletedAt: new Date() } },
      { new: true }
    );
    return true;
  }

   async login(
    input: UserLogin,
  ): Promise<UserInterface | null> {

    const EncryptedEmail = await Encoding.encode(input.email);
   
    const emailExist = await userModel.findOne({
      email: EncryptedEmail,
      deletedAt: null,
    });
    if (!emailExist) throw new Error(`${input.email} does not exist`);

    const isMatch = await Password.validate(
        input.password,
        emailExist.password,
      );
      if (!isMatch) throw new Error("Incorrect password!");

      // save device token
      if (input.deviceToken && input.deviceToken !== emailExist?.deviceToken ) {
      
          const updatedData = await userModel.findByIdAndUpdate(
            emailExist._id,
            {
              deviceToken: input.deviceToken,
            },
            { new: true },
          );
          if (!updatedData) throw new Error(`Failed to update device Token `);
       
      }
       
        let decodedEmail;
        try {
          decodedEmail = await Encoding.decode(emailExist.email);
        } catch (err) {
          console.warn('Failed to decode email, returning encoded version as fallback');
          decodedEmail = emailExist.email; // fallback: keep encoded
        }
        emailExist.email = decodedEmail;
      return emailExist;
  }

  async findOne(query: object): Promise<UserInterface | null> {
    const dataExists = await  userModel.findOne(query);
    if (!dataExists) throw new Error(`Data not found for the given query: ${JSON.stringify(query)}`)
    return dataExists;
  }

   async getById(id: string): Promise<GetUserInterface | null> {
    try {
      const userExist = await userModel
        .findOne({ _id: id, deletedAt: null })
        .select("_id name");

      if (!userExist) {
        throw new Error(`user id : ${id} is not found`);
      }
     
      const data = {
        id: userExist._id,
        name: userExist.name
      };

      return data;
    } catch (error: any) {
      throw new Error(`Error fetching user: ${error.message}`);
    }
  }

   async forgotPassword(email: string): Promise<Boolean> {
    try {
      console.log("email===>",email)
      const encodedInputEmail = await Encoding.encode(email);
      console.log("encodedInputEmail===>",encodedInputEmail)
      const userExist = await userModel.findOne({
        email: encodedInputEmail,
        deletedAt: null,
      });
  console.log("userExist===>",userExist)
      if (!userExist)
        throw new Error(`User with email ${email} does not exist.`);
      const otp = Math.floor(Math.random() * 9000) + 1000;
      const updates = { otp };
      console.log("updates===>",updates)
      const updatedEmployee = await userModel.findByIdAndUpdate(
        userExist._id,
        updates,
        { new: true },
      );
      if (!updatedEmployee) {
        return false;
      }
      try {
          console.log("userExist.emaill===>",userExist.email)
     //   const email = await Encoding.decode(userExist.email);
         console.log("updates email===>",email)
        const subject = "Password Reset Request";
        const body = `<p>Dear ${userExist.name},\n\nYour OTP for password reset is: ${otp}\n\n Thank You</P>`;
        await new EmailService().sendEmail(email, subject, body);
      } catch (error: any) {
        throw new Error(`${error.message}`);
      }
      return true;
    } catch (error: any) {
      throw new Error(`${error.message}`);
    }
  }

}
