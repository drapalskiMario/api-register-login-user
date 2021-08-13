import { RegisterUser } from '../../../domain/use-cases/register-user'
import { Controller, HttpRequest, HttpResponse } from './controller-adapter'

export class RegisterUserController implements Controller {
  constructor (
    private readonly registerUser: RegisterUser
  ) {}

  async handle (request: HttpRequest): Promise <HttpResponse> {
    try {
      const registerResponse = await this.registerUser.register(request.body)
      if (registerResponse.error) return { statusCode: 400, body: registerResponse.error }
      return { statusCode: 200, body: registerResponse.success }
    } catch (err) {
      return { statusCode: 500, body: null }
    }
  }
}
