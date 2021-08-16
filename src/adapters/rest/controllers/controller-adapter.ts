export type HttpResponse = {
  statusCode: number,
  body: any
}

export type HttpRequest = {
  header?: any,
  body?: any,
  params?: any,
}

export interface Controller {
  handle(request: HttpRequest): Promise<HttpResponse>
}
