import { RouterClass } from '../classes'
import { SavingsGoalController } from '../controllers';
import exceptionHandler from '../middlewares/exceptionHandler';
import { Validator } from '../middlewares';
import { createSavingsGoal, updateSavingsGoal, addContribution } from '../validators';
 
 
export class SavingsGoalRoute extends RouterClass {
  constructor() {
    super();
  }
 
  define(): void {
 
    this.router
      .route("/")
      .get(
        exceptionHandler(SavingsGoalController.getMyGoals)
      )
      .post(
        Validator.check(createSavingsGoal),
        exceptionHandler(SavingsGoalController.create))
 
    this.router
      .route("/:id/contributions")
      .post(
        Validator.check(addContribution),
        exceptionHandler(SavingsGoalController.addContribution))
 
    this.router
      .route("/:id")
      .patch(
        Validator.check(updateSavingsGoal),
        exceptionHandler(SavingsGoalController.update))
      .delete(exceptionHandler(SavingsGoalController.remove))
  }
 
}