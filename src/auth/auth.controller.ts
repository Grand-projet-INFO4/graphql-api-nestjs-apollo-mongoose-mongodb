import { Controller, Post } from "@nestjs/common";

@Controller('api')
export class AuthController{
@Post('greeting')
    sayHello() {
        return 'hello word';
    }
 }