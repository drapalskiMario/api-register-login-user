import { RegisterUser, RegisterUserParams, RegisterUserResponse } from '../../../../src/domain/use-cases/register-user'
import { HttpRequest } from '../../../../src/adapters/rest/type-adapter/controller-adapter'
import { RegisterUserController } from '../../../../src/adapters/rest/controllers/register-user-controller'

type SutTypes = {
  sut: RegisterUserController,
  registerUserStub: RegisterUser
}

const mockRegisterUser = (): RegisterUser => {
  class RegisterUserStub implements RegisterUser {
    async register (registerUserParams: RegisterUserParams): Promise<RegisterUserResponse> {
      return Promise.resolve({
        error: null,
        success: {
          id: 'any_id',
          name: 'any_name',
          email: 'any_email@mail.com',
          password: 'any_hash'
        }
      })
    }
  }
  return new RegisterUserStub()
}

const makeSut = (): SutTypes => {
  const registerUserStub = mockRegisterUser()
  const sut = new RegisterUserController(registerUserStub)
  return { sut, registerUserStub }
}

const mockRequest = (): HttpRequest => ({
  body: {
    name: 'valid_name',
    email: 'valid_email@mail.com',
    password: 'any_password',
    passwordConfirmation: 'any_password'
  }
})

describe('SignupController', () => {
  test('should call RegisterUser with correct values', async () => {
    const { sut, registerUserStub } = makeSut()
    const authenticationUserSpy = jest.spyOn(registerUserStub, 'register')
    const mockRequestUser = mockRequest()
    await sut.handle(mockRequestUser)
    expect(authenticationUserSpy).toHaveBeenCalledWith(mockRequestUser.body)
  })

  test('should return 400 if AuthenticationUser return error', async () => {
    const { sut, registerUserStub } = makeSut()
    jest.spyOn(registerUserStub, 'register').mockReturnValue(Promise.resolve({ error: 'invalid params', success: null }))
    const response = await sut.handle(mockRequest())
    expect(response).toEqual({ statusCode: 400, body: 'invalid params' })
  })

  test('should return 400 if AuthenticationUser return error', async () => {
    const { sut, registerUserStub } = makeSut()
    jest.spyOn(registerUserStub, 'register').mockReturnValue(Promise.resolve({ error: 'user already exists', success: null }))
    const response = await sut.handle(mockRequest())
    expect(response).toEqual({ statusCode: 400, body: 'user already exists' })
  })

  test('should return 500 if AuthenticationUser throws', async () => {
    const { sut, registerUserStub } = makeSut()
    jest.spyOn(registerUserStub, 'register').mockReturnValue(Promise.reject(new Error()))
    const response = await sut.handle(mockRequest())
    expect(response).toEqual({ statusCode: 500, body: null })
  })
})
