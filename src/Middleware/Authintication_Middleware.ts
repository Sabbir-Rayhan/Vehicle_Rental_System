import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config";

const Authenticate = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader) {
        return res.status(401).json({
          success: false,
          message: "Please Login First",
        });
      }

      const token = authHeader.split(" ")[1];

      const decoded = jwt.verify(
        token as string,
        config.jwtsecret as string
      ) as JwtPayload;

       req.user = decoded;

      if (roles.length && !roles.includes(decoded.role as string)) {
        return res.status(403).json({
          success: false,
          message: "You are unauthorized for this Operation",
        });
      }

      next();
    } catch (err: any) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token",
      });
    }
  };
};

export default Authenticate;
