import { RouterClass } from '../classes'
import { TransactionController } from '../controllers';
import exceptionHandler from '../middlewares/exceptionHandler';
import { Validator } from '../middlewares';
import { createTransaction, updateTransaction } from '../validators';
 
 
export class TransactionRoute extends RouterClass {
  constructor() {
    super();
  }
 
  define(): void {
 
    this.router
      .route("/")
      .get(
        exceptionHandler(TransactionController.getMyTransactions)
      )
      .post(
        Validator.check(createTransaction),
        exceptionHandler(TransactionController.create))
 
    this.router
      .route("/summary")
      .get(
        exceptionHandler(TransactionController.getSummary)
      )
    this.router.get(
      '/forecast',
      exceptionHandler(TransactionController.getExpenseForecast)
    );
    
    // routes/transaction.route.ts

this.router.get(
  '/category-spending',
  exceptionHandler(TransactionController.getCategorySpending)
);

    this.router
      .route("/:id")
      .patch(
        Validator.check(updateTransaction),
        exceptionHandler(TransactionController.update))
      .delete(exceptionHandler(TransactionController.remove))
  }
 
}