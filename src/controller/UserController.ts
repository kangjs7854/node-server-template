import { JsonController , Req, Get, Post, BodyParam ,HeaderParam} from "routing-controllers";
const axios = require("axios")
const jwtToken = require('jsonwebtoken')//生成用户签名和验证
import {userModel} from '../model'

@JsonController()
export class UserController {

   @Get("/users")
   getAll() {
      return userModel.find({}).exec()
   }

   @Post('/wxLogin')
   wxLogin(
      @BodyParam("code") JSCODE: string,
      @Req() requst: any,
      @HeaderParam('referer') referer:string
   ) {
      const reg = /wx[0-9a-zA-Z]+/g
      const APPID = referer.match(reg)[0]//小程序appid
      const SECRET = 'xxx'//小程序密钥
      return axios.get('https://api.weixin.qq.com/sns/jscode2session', {
         params: {
            appid: APPID,
            secret: SECRET,
            js_code: JSCODE,
            grant_type: "authorization_code"
         }
      })
   }

   @Post('/auth')
   async auth(
      @BodyParam("code") code: string,

   ) {
      //github授权所需要的申请的两个字段
      const clientID = '50ab343567bd310005df'
      const clientSecret = 'deea41faa0a55396c16f7679e16e61c2229f2f6a'
      let accessToken
      //根据临时code换取令牌
      const tokenResponse = await axios({
         method: 'post',
         url: 'https://github.com/login/oauth/access_token?' +
            `client_id=${clientID}&` +
            `client_secret=${clientSecret}&` +
            `code=${code}`,
         headers: {
            accept: 'application/json'
         }
      });
      accessToken = tokenResponse.data.access_token;
      if (!accessToken) {
         return tokenResponse.data
      }
      //使用令牌请求gitHub的接口
      const result = await axios({
         method: 'get',
         url: `https://api.github.com/user`,
         headers: {
            accept: 'application/json',
            Authorization: `token ${accessToken}`
         }
      })
      const token = this.createToken({ name: result.data.name })
      return Object.assign(result.data,{token})
   }

   createToken(target) {
      const secretKey = 'mock_platform_666'
      return jwtToken.sign(target, secretKey, { expiresIn: 60 * 60 * 24 }) // 授权时效24小时
   }

   @Post('/login')
   async login(
      @BodyParam('userName') name:string,
      @BodyParam("passWord") passWord:string,
   ){
      const user = await userModel.findOne({name}).exec()
      if(!user){//新用户
         const newUser = await userModel.findOneAndUpdate(
            {name},
            {name},
            {
               upsert: true,
               new: true,
               setDefaultsOnInsert: true
            }
         ).exec()
         return Object.assign(newUser,{token:this.createToken({name:newUser.name})})
      }
      if(user.passWord != passWord){
         return '账号密码错误'
      }
      return Object.assign(user,{token:this.createToken({name:user.name})})
   }


}