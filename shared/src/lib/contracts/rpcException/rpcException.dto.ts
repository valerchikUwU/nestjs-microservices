import { RpcException } from '@nestjs/microservices';

export class RpcInternalServerException extends RpcException {
  private readonly statusCode = 500;
  
  constructor(message: string) {
    super({ message, statusCode: 500 });
  }

  getStatusCode(): number {
    return this.statusCode;
  }
}

export class RpcNotFoundException extends RpcException {
  private readonly statusCode = 404;
  
  constructor(message: string) {
    super({ message, statusCode: 404 });
  }

  getStatusCode(): number {
    return this.statusCode;
  }
}

export class RpcBadRequestException extends RpcException {
  private readonly statusCode = 400;
  
  constructor(message: string) {
    super({ message, statusCode: 400 });
  }

  getStatusCode(): number {
    return this.statusCode;
  }
}

export class RpcUnauthorizedException extends RpcException {
  private readonly statusCode = 401;
  
  constructor(message: string) {
    super({ message, statusCode: 401 });
  }

  getStatusCode(): number {
    return this.statusCode;
  }
}

export class RpcForbiddenException extends RpcException {
  private readonly statusCode = 403;
  
  constructor(message: string) {
    super({ message, statusCode: 403 });
  }

  getStatusCode(): number {
    return this.statusCode;
  }
}

export class RpcConflictException extends RpcException {
  private readonly statusCode = 409;
  
  constructor(message: string) {
    super({ message, statusCode: 409 });
  }

  getStatusCode(): number {
    return this.statusCode;
  }
}