export interface CustomErrorResponse {
  message: string | string[];
  statusCode: number;
}

export class CustomError {
  response: CustomErrorResponse;
  status: number;
  options: Record<string, any>;
  message: string | string[];
  name: string;

  constructor(
    message: string | string[],
    statusCode: number = 500,
    name: string = 'Error',
    options: Record<string, any> = {}
  ) {
    this.response = { message, statusCode };
    this.status = statusCode;
    this.message = message;
    this.name = name;
    this.options = options;
  }
}