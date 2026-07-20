import { RouterClass } from "../classes";
import { LoanController } from "../controllers";
import exceptionHandler from "../middlewares/exceptionHandler";
import { Validator } from "../middlewares";
import { createLoan, updateLoan, updateLoanStatus } from "../validators";
 
export class LoanRoute extends RouterClass {
  constructor() {
    super();
  }
 
  define(): void {
    this.router
      .route("/")
      .get(exceptionHandler(LoanController.getMyLoans))
      .post(Validator.check(createLoan), exceptionHandler(LoanController.create));
 
    this.router
      .route("/:id")
      .patch(Validator.check(updateLoan), exceptionHandler(LoanController.update))
      .delete(exceptionHandler(LoanController.remove));
 
    this.router
      .route("/:id/status")
      .patch(
        Validator.check(updateLoanStatus),
        exceptionHandler(LoanController.updateStatus)
      );
  }
}