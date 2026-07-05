import { InputeUserInterface, UserInterface,ChangePassword ,UserLogin} from '../interfaces';
import { userModel } from '../models'
import { Password,  Encoding} from "../utils";
export class userService {
  async create(input: InputeUserInterface): Promise<UserInterface> {
    const originalEmail = input.email
    if (input.email) {
               input.email = await Encoding.encode(input.email);
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
          updates.email = await Encoding.encode(updates.email);
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
      return emailExist;
  }

  async findOne(query: object): Promise<UserInterface | null> {
    const dataExists = await  userModel.findOne(query);
    if (!dataExists) throw new Error(`Data not found for the given query: ${JSON.stringify(query)}`)
    return dataExists;
  }

}
