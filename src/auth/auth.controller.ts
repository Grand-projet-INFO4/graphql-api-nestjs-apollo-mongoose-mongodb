import { PrismaClient } from '@prisma/client';
import { Controller,Post} from "@nestjs/common";

const prisma = new PrismaClient();

@Controller('api')
export class AuthController{
@Post('test')
async sayHello() {
    const post = await prisma.post.create({
        data: {
        numero:'01',
        name :'fitiavana'
           
       }
     })
    console.log(post)
    }
 }