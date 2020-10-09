
import { Controller, Get } from "routing-controllers";

@Controller()
export class IndexController{
    @Get("/")
    renderIndex() {
       return "hello";
    }
}