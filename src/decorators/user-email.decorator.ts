import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const UserEmail = createParamDecorator(
  (date: unknown, contex: ExecutionContext) => {
    const request = contex.switchToHttp().getRequest();
    return request.user;
  },
);
