import { NextFunction, Request, Response } from "express";
import { CustomError } from "../../utils/errors";
import { HttpStatusCode } from "../../common/errorCodes";
import { ResponseMessages } from "../../common/erroResponse";

export const errorMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (err instanceof CustomError) {
    res.status(err.statusCode).json({
      success: false,
      error: err.name,
      message: err.message,
    });
  } else if (err.name === "TokenExpiredError") {
    res.status(HttpStatusCode.UNAUTHORIZED).json({
      success: false,
      error: "TokenExpiredError",
      message: ResponseMessages.TOKEN_EXPIRED,
    });
  } else if (err.name === "JsonWebTokenError") {
    res.status(HttpStatusCode.UNAUTHORIZED).json({
      success: false,
      error: "JsonWebTokenError",
      message: ResponseMessages.INVALID_TOKEN,
    });
  } else if (err.message === ResponseMessages.INVALID_FILE_TYPE) {
    res.status(HttpStatusCode.BAD_REQUEST).json({
      success: false,
      error: "InvalidFileType",
      message: err.message,
    });
  } else {
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: "InternalServerError",
      message: ResponseMessages.INTERNAL_SERVER_ERROR,
    });
  }
  next();
};
