import { Request, Response, NextFunction, Router } from "express";
import * as jwt from "jsonwebtoken";

class Controller {
  protected router: Router = Router();

  public Response(
    res: Response,
    success: boolean,
    status: number,
    message: string,
    data?: object
  ) {
    return res
      .status(status)
      .json(
        Object.assign(
          { status: status, success: success },
          { message: message },
          data
        )
      )
      .end();
  }
  public CheckBlank(...data: any): boolean {
    if (
      !data.every((e) => {
        return e != null && e != "";
      })
    ) {
      return true;
    } else {
      return false;
    }
  }
  public clone(obj) {
    let output = [];
    for (let i in obj) {
      output[i] = obj[i];
    }
    return output;
  }
}

export default Controller;
