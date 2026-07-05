import { Router } from "express";

export abstract class RouterClass {
    router: Router;
    constructor() {
        this.router = Router();
        this.define()
    }
    define(): void{}
}