import {Router} from 'express';
import {IRouteInterface } from '../interfaces';
import { authenticateToken } from "../middlewares";
// import routes
import { AuthRouter} from './authRoute'
import {CategoryRoute } from './categoryRoute'
import {TransactionRoute } from './transactionRoute'
import { UserRoute} from './userRoute'

class ProxyRouter {
 private static instance: ProxyRouter
 private router: Router = Router();

private readonly authRoute = { segment: "/", provider: AuthRouter };
 private readonly routes = [
    {segment : '/category/', provider:CategoryRoute },
    {segment : '/income-expense/', provider:TransactionRoute },
    {segment : '/user/', provider:UserRoute },
 ]

  private constructor (){}

  static get(): ProxyRouter {
    if(!ProxyRouter.instance){
        ProxyRouter.instance = new ProxyRouter()
    }
    return ProxyRouter.instance
  }

  
  map(): Router {
    this.routes.forEach((route: IRouteInterface) => {
      const instance = new route.provider() as { router: Router };
      this.router.use(route.segment, authenticateToken, instance.router);
    });
    return this.router;
  }

    auth(): Router {
    const authRoute = this.authRoute;
    const instance = new authRoute.provider() as { router: Router };
    return instance.router;
  }
}

const proxyRouter = ProxyRouter.get();
 
export { proxyRouter as proxyRouter}