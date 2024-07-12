import { Controller, Get, VERSION_NEUTRAL } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  HealthCheckService,
  HealthCheck,
  HttpHealthIndicator,
} from '@nestjs/terminus';

@Controller({
  version: VERSION_NEUTRAL,
})
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly http: HttpHealthIndicator,
  ) {}

  @Get('health')
  @HealthCheck()
  @ApiTags('HealthCheck')
  check() {
    return this.health.check([
      () => this.http.pingCheck('local', 'http://localhost:3000'),
    ]);
  }
}
