import { AuthenticationUser } from '../../../domain/use-cases/autentication'
import { Controller, HttpRequest, HttpResponse } from '../type-adapter/controller-adapter'

export class LoginUserController implements Controller {
  constructor (
    private readonly authentication: AuthenticationUser
  ) { }

  async handle (request: HttpRequest): Promise<HttpResponse> {
    try {
      const authResponse = await this.authentication.auth(request.body)
      if (authResponse.error) return { statusCode: 401, body: authResponse.error }
      return { statusCode: 200, body: authResponse.success }
    } catch (err) {
      return { statusCode: 500, body: null }
    }
  }
}
