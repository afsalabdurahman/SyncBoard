import { Response } from 'express';
import { envConfig} from "../infrastructure/config/env.config"

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
