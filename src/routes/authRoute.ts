import { RouterClass } from "../classes";
import {UserController} from "../controllers";
import { Validator } from "../middlewares";
import exceptionHandler from "../middlewares/exceptionHandler";


import {
  login,
  changePassword,
} from "../validators";

export class AuthRouter extends RouterClass {
  constructor() {
    super();
  }

  define(): void {
    this.router.post(
      "/login",
      Validator.check(login),
      exceptionHandler(UserController.login)
    );
   

    this.router.post(
      "/change-password",
      Validator.check(changePassword),
      exceptionHandler(UserController.changePassword)
    );


  }
}
