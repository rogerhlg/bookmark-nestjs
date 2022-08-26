import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetUser = createParamDecorator(
  (data: null | string, ctx: ExecutionContext) => {
    const request: Express.Request = ctx.switchToHttp().getRequest();

    return data ? request.user[data] : request.user;
  },
);
