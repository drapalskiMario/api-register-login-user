import { AuthenticationUserParams } from '../../../src/domain/use-cases/autentication'
import { AuthUserValidator } from '../../../src/ports/validators/auth-user-validator'
import { ValidatorAuthUserAdapter } from '../../../src/adapters/validator/validator-auth-user-adapter'

const makeSut = (): AuthUserValidator => {
  return new ValidatorAuthUserAdapter()
}

const mockUserParams = (): AuthenticationUserParams => ({
  email: 'valid_email@mail.com',
  password: 'valid_password'
})

describe('ValidatorAuthUserAdapter', () => {
  test('should return true if no email is provider', async () => {
    const sut = makeSut()
    const userParams = mockUserParams()
    delete userParams.email
    const error = await sut.validate(userParams)
    expect(error).toBeTruthy()
  })

  test('should return true if email provider is no valid email', async () => {
    const sut = makeSut()
    const userParams = mockUserParams()
    userParams.email = 'email_invalid'
    const error = await sut.validate(userParams)
    expect(error).toBeTruthy()
  })

  test('should return true if no password is provider', async () => {
    const sut = makeSut()
    const userParams = mockUserParams()
    delete userParams.password
    const error = await sut.validate(userParams)
    expect(error).toBeTruthy()
  })

  test('should return false if valid email and password is provider', async () => {
    const sut = makeSut()
    const error = await sut.validate(mockUserParams())
    expect(error).toBeFalsy()
  })
})
