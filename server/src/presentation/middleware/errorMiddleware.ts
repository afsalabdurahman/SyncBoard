import { NextFunction, Request, Response } from "express";
import { CustomError } from "../../utils/errors";
import { HttpStatusCode } from "../../common/errorCodes";
import { ResponseMessages } from "../../common/erroResponse";
import { ILogger } from "../../application/repositories/ilogger/ILogger";
import { container } from "tsyringe";
const logger = container.resolve<ILogger>('ILogger');
export const errorMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.log(err,"err")
  if (err instanceof CustomError) {
    
    res.status(err.statusCode).json({
      success: false,
      error: err.name,
      message: err.message,
      data:err.data
    });
  } else if (err.name === "TokenExpiredError") {
    logger.error(err.name)
    res.status(HttpStatusCode.UNAUTHORIZED).json({
      success: false,
      error: "TokenExpiredError",
      message: ResponseMessages.TOKEN_EXPIRED,
    });
  } else if (err.name === "JsonWebTokenError") {
        logger.error(err.name)
    res.status(HttpStatusCode.UNAUTHORIZED).json({
      success: false,
      error: "JsonWebTokenError",
      message: ResponseMessages.INVALID_TOKEN,
    });
  } else if (err.message === ResponseMessages.INVALID_FILE_TYPE) {
        logger.error(err.name)
    res.status(HttpStatusCode.BAD_REQUEST).json({
      success: false,
      error: "InvalidFileType",
      message: err.message,
    });
  } else {
        logger.error("Internal ServerError")
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      
      success: false,
      error: "InternalServerError",
      message: ResponseMessages.INTERNAL_SERVER_ERROR,
    });
  }
  next();
};
