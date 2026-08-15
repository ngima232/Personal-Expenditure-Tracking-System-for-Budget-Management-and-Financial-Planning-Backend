import { RouterClass } from "../classes";
import {UserController} from "../controllers";
import { Validator } from "../middlewares";
import exceptionHandler from "../middlewares/exceptionHandler";
import { createUser ,forgotPassword} from '../validators';

import {
  login,
  changePassword,
} from "../validators";

export class AuthRouter extends RouterClass {
  constructor() {
    super();
  }

  define(): void {

     this.router
    .route("/register")
    .post(
      Validator.check(createUser),
      exceptionHandler(UserController.create))

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

    this.router.post(
      "/forgot-password",
      Validator.check(forgotPassword),
      exceptionHandler(UserController.forgotPassword)
    );


  }
}
