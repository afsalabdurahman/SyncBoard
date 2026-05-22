import { Response } from 'express';

const ACCESS_TOKEN_MAX_AGE = 15 * 60 * 1000;
const REFRESH_TOKEN_MAX_AGE = 7 * 24 * 60 * 60 * 1000;

export const setTokensInCookies = (res: Response, accessToken: string, refreshToken: string): void => {
  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
    maxAge: ACCESS_TOKEN_MAX_AGE,
  });

       
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
    maxAge: REFRESH_TOKEN_MAX_AGE,
  });
};
export const removeTokensInCookies = (res:Response):void=>{
     res.clearCookie('accessToken', {
        httpOnly: true,
      secure: false,
        sameSite: 'lax',
      });
      res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
      });
}
