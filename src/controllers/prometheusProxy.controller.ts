import { Controller, Get, Query } from '@nestjs/common';
import { PrometheusProxyService } from '../services/prometheusProxy.service';

@Controller('prometheus')
export class PrometheusProxyController {
    constructor(private readonly prometheusProxyService: PrometheusProxyService) {}

    @Get('api/v1/query')
    query(@Query('query') query: string) {
        return this.prometheusProxyService.query(query);
    }

    @Get('api/v1/query_range')
    queryRange(
        @Query('query') query: string,
        @Query('start') start: string,
        @Query('end') end: string,
        @Query('step') step: string,
    ) {
        return this.prometheusProxyService.queryRange(query, start, end, step);
    }

    @Get('api/v1/targets')
    targets() {
        return this.prometheusProxyService.targets();
    }
}
