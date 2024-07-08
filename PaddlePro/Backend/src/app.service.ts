import { Injectable, Req, Query, HttpException,HttpStatus } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import {HttpService} from '@nestjs/axios'
import { ConfigService } from '@nestjs/config';

const prisma = new PrismaClient()
const url = "https://api.intra.42.fr/oauth/token"


export class AlreadyExistException extends HttpException {
  constructor(user:any) {
    super(user['username'], HttpStatus.FORBIDDEN);
  }
}


async function auth_get_token(client_id:string, secret:string, code:String, httpService:HttpService) {
  
  const data = {
    grant_type: 'authorization_code',
    client_id: client_id,
    client_secret: secret,
    code: code,
    redirect_uri: 'http://127.0.0.1:3000/',
  };

  try {
    const response = await httpService.post(url, data).toPromise();
    return response.data;
  } catch (error) {
    throw error.data
  }
}

async function store_user(data:any, httpService:HttpService) {
  const token = data["access_token"]
  const url = "https://api.intra.42.fr/v2/me"
  const headersRequest = {
    'Authorization': `Bearer ${token}`,
};
  const response = await httpService.get(url,{headers:headersRequest}).toPromise();
  try {
    const check = await prisma.user.findFirst({
      where:{
        fusername: response.data['login'],
      },
      select:{
        id: true,
        username: true,
        tfwactivated: true,
        ftime: true
      }
    })
    if (check)
    {
      return check
    }
    const user = await prisma.user.create({
      data:{
        real_name:response.data["displayname"],
        username: response.data["login"],
        fusername: response.data["login"],
        image: response.data["image"]["versions"]["medium"],
      }
    })
    return user
  }catch(err)
  {
    throw err
  }
}

@Injectable()
export class AppService {
  constructor(private readonly httpService: HttpService, private confiService:ConfigService){}
  async getHello(Request:Request) {
    return Request.headers
  }
  async getUserToken(Request:Request, query:any)
  {
    if (query["code"] !== undefined){
      let data:any;
      try{
        const clientid = this.confiService.get<string>('CLIENTID')
        const secret = this.confiService.get<string>('CLIENTSECRET')
        data = await auth_get_token(clientid, secret,query["code"],this.httpService)
        const user = await store_user(data, this.httpService)
        return user;
      }catch(error)
      {
        throw error;
      }
    }
  }
}
