import { RouterClass} from '../classes'
import { UserController } from '../controllers';
import exceptionHandler from '../middlewares/exceptionHandler';
import { Validator } from '../middlewares';
import {  updateUser } from '../validators';


export class UserRoute extends RouterClass{
  constructor(){
    super();
  }

  define(): void {
    this.router
    .route("/:id")
    .patch(
        Validator.check(updateUser),
        exceptionHandler(UserController.update))
    .delete(exceptionHandler(UserController.remove))
  }

}

