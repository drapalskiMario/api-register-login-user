import { AuthenticationUser, AuthenticationUserParams, AuthenticationUserResponse } from '../../../../src/domain/use-cases/autentication'
import { HttpRequest } from '../../../../src/adapters/rest/type-adapter/controller-adapter'
import { LoginUserController } from '../../../../src/adapters/rest/controllers/login-user-controller'

type SutTypes = {
  sut: LoginUserController,
  authenticationUserStub: AuthenticationUser
}

const mockAuthenticationUser = (): AuthenticationUser => {
  class AuthenticationUserStub implements AuthenticationUser {
    async auth (authenticationUserParams: AuthenticationUserParams): Promise<AuthenticationUserResponse> {
      return Promise.resolve({ error: null, success: 'any_token' })
    }
  }
  return new AuthenticationUserStub()
}

const makeSut = (): SutTypes => {
  const authenticationUserStub = mockAuthenticationUser()
  const sut = new LoginUserController(authenticationUserStub)
  return { sut, authenticationUserStub }
}

const mockRequest = (): HttpRequest => ({
  body: {
    name: 'valid_name',
    email: 'valid_email@mail.com'
  }
})

describe('LoginUserController', () => {
  test('should call AuthenticationUser with correct values', async () => {
    const { sut, authenticationUserStub } = makeSut()
    const authenticationUserSpy = jest.spyOn(authenticationUserStub, 'auth')
    const mockRequestUser = mockRequest()
    await sut.handle(mockRequestUser)
    expect(authenticationUserSpy).toHaveBeenCalledWith(mockRequestUser.body)
  })

  test('should return 400 if AuthenticationUser return error', async () => {
    const { sut, authenticationUserStub } = makeSut()
    jest.spyOn(authenticationUserStub, 'auth').mockReturnValue(Promise.resolve({ error: 'invalid params', success: null }))
    const response = await sut.handle(mockRequest())
    expect(response).toEqual({ statusCode: 401, body: 'invalid params' })
  })

  test('should return 500 if AuthenticationUser throws', async () => {
    const { sut, authenticationUserStub } = makeSut()
    jest.spyOn(authenticationUserStub, 'auth').mockReturnValue(Promise.reject(new Error()))
    const response = await sut.handle(mockRequest())
    expect(response).toEqual({ statusCode: 500, body: null })
  })
})
