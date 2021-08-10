import { Request, Response } from 'express'
import { AuthenticationUser } from '../../../domain/use-cases/autentication'

export class SignupController {
  constructor (
    private readonly authentication: AuthenticationUser
  ) {}

  async handle (request: Request, response: Response): Promise <Response> {
    try {
      const authResponse = await this.authentication.auth(request.body)
      if ('error' in authResponse) response.status(400).json({ authResponse })
      return response.status(200).json({ authResponse })
    } catch (err) {
      response.status(500)
    }
  }
}
