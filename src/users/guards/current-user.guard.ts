import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class CurrentUserGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    if (context.getArgs()) {
      if (
        context.switchToHttp().getRequest().user.id === context.getArgs()[0]
      ) {
        return true;
      } else {
        return false;
      }
    }
    return true;
  }
}
