import jwt from 'jsonwebtoken';
import config from 'config';
let JWT_SECRET = config.get('jwt_secret')

export const  SIGN =(payload)=>{
return jwt.sign(payload, JWT_SECRET);
}
export const  VERIFY =(token)=>{
return jwt.verify(token, JWT_SECRET);
}