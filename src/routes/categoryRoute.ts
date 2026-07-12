import { RouterClass} from '../classes'
import { CategoryController } from '../controllers';
import exceptionHandler from '../middlewares/exceptionHandler';
import { Validator } from '../middlewares';
import {createCategory, updateCategory } from '../validators';


export class CategoryRoute extends RouterClass{
  constructor(){
    super();
  }

  define(): void {

    this.router
    .route("/")
    .get(
        exceptionHandler(CategoryController.getMyCategory)
      )
    .post(
      Validator.check(createCategory),
      exceptionHandler(CategoryController.create))

    this.router
    .route("/:id")
    .patch(
        Validator.check(updateCategory),
        exceptionHandler(CategoryController.update))
    .delete(exceptionHandler(CategoryController.remove))
  }

}
