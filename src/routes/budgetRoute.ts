import { RouterClass } from '../classes'
import { BudgetController } from '../controllers';
import exceptionHandler from '../middlewares/exceptionHandler';
import { Validator } from '../middlewares';
import { createBudget, updateBudget } from '../validators';
 
 
export class BudgetRoute extends RouterClass {
  constructor() {
    super();
  }
 
  define(): void {
 
    this.router
      .route("/")
      .get(
        exceptionHandler(BudgetController.getMyBudgets)
      )
      .post(
        Validator.check(createBudget),
        exceptionHandler(BudgetController.create))
 
    this.router
      .route("/:id/status")
      .get(
        exceptionHandler(BudgetController.getBudgetStatus)
      )
 
    this.router
      .route("/:id")
      .patch(
        Validator.check(updateBudget),
        exceptionHandler(BudgetController.update))
      .delete(exceptionHandler(BudgetController.remove))
  }
 
}