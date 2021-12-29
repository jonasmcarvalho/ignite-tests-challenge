import { AppError } from "../../../../shared/errors/AppError";


export namespace CreateTransferError {
  export class SenderNotFound extends AppError {
    constructor() {
      super('User not found', 404)
    }

  }

  export class receiverNotFound extends AppError {
    constructor() {
      super('Receiver not found', 404)
    }
  }

  export class InsufficientFunds extends AppError {
    constructor() {
      super('Insufficient funds', 404)
    }
  }

  export class invalidUuid extends AppError {
    constructor() {
      super('Invalid id', 404)
    }
  }

}
