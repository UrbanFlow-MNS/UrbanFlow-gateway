import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { AxiosError } from 'axios';
import { firstValueFrom } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class PrometheusProxyService {
    private readonly baseUrl = process.env.PROMETHEUS_URL ?? 'http://localhost:9090';

    constructor(private readonly http: HttpService) {
        console.log(`[PrometheusProxyService] PROMETHEUS_URL resolved to: ${this.baseUrl}`);
    }

    private logAxiosError(context: string, error: unknown): void {
        const axiosError = error as AxiosError;
        console.error(`[PrometheusProxyService] ${context} failed`, {
            url: axiosError.config?.url,
            code: axiosError.code,
            status: axiosError.response?.status,
            message: axiosError.message,
            responseData: axiosError.response?.data,
        });
    }

    async query(query: string): Promise<unknown> {
        console.log(`[PrometheusProxyService] query -> ${this.baseUrl}/api/v1/query?query=${query}`);
        try {
            return await firstValueFrom(
                this.http
                    .get(`${this.baseUrl}/api/v1/query`, { params: { query } })
                    .pipe(map((r) => r.data)),
            );
        } catch (error) {
            this.logAxiosError('query', error);
            throw error;
        }
    }

    async queryRange(query: string, start: string, end: string, step: string): Promise<unknown> {
        console.log(`[PrometheusProxyService] queryRange -> ${this.baseUrl}/api/v1/query_range?query=${query}&start=${start}&end=${end}&step=${step}`);
        try {
            return await firstValueFrom(
                this.http
                    .get(`${this.baseUrl}/api/v1/query_range`, { params: { query, start, end, step } })
                    .pipe(map((r) => r.data)),
            );
        } catch (error) {
            this.logAxiosError('queryRange', error);
            throw error;
        }
    }

    async targets(): Promise<unknown> {
        console.log(`[PrometheusProxyService] targets -> ${this.baseUrl}/api/v1/targets`);
        try {
            return await firstValueFrom(
                this.http
                    .get(`${this.baseUrl}/api/v1/targets`)
                    .pipe(map((r) => r.data)),
            );
        } catch (error) {
            this.logAxiosError('targets', error);
            throw error;
        }
    }
}
