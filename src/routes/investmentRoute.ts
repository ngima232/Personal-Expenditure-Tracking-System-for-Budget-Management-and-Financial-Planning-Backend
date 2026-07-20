import { RouterClass } from '../classes';
import { InvestmentController } from '../controllers';
import exceptionHandler from '../middlewares/exceptionHandler';
import { Validator } from '../middlewares';
import { createInvestment, updateInvestment } from '../validators';

export class InvestmentRoute extends RouterClass {
  constructor() {
    super();
  }

  define(): void {
    this.router
      .route('/')
      .get(exceptionHandler(InvestmentController.getMyInvestments))
      .post(
        Validator.check(createInvestment),
        exceptionHandler(InvestmentController.create)
      );

    this.router
      .route('/:id')
      .patch(
        Validator.check(updateInvestment),
        exceptionHandler(InvestmentController.update)
      )
      .delete(exceptionHandler(InvestmentController.remove));
  }
}