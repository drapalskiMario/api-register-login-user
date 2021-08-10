import { RegisterUserParams } from '../../domain/use-cases/register-user'
import { RegisterUserValidator } from '../../ports/validators/register-user-validator'
import { ValidatorRegisterUserAdapter } from './validator-register-user-adapter'

const makeSut = (): RegisterUserValidator => {
  return new ValidatorRegisterUserAdapter()
}

const mockUserParams = (): RegisterUserParams => ({
  name: 'valid_name',
  email: 'valid_email@mail.com',
  password: 'valid_password',
  passwordConfirmation: 'valid_password'
})

describe('ValidatorAuthUserAdapter', () => {
  test('should return true if no name is provider', async () => {
    const sut = makeSut()
    const userParams = mockUserParams()
    delete userParams.name
    const error = await sut.validate(userParams)
    expect(error).toBeTruthy()
  })

  test('should return true if no email is provider', async () => {
    const sut = makeSut()
    const userParams = mockUserParams()
    delete userParams.email
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

  test('should return true if no passwordConfirmation is provider', async () => {
    const sut = makeSut()
    const userParams = mockUserParams()
    delete userParams.passwordConfirmation
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

  test('should return true if password is diferent to password confirmation', async () => {
    const sut = makeSut()
    const userParams = mockUserParams()
    userParams.passwordConfirmation = 'invalid_password_confirmation'
    const error = await sut.validate(userParams)
    expect(error).toBeTruthy()
  })

  test('should return false if valid name, email, password and passwordConfirmation is provider', async () => {
    const sut = makeSut()
    const error = await sut.validate(mockUserParams())
    expect(error).toBeFalsy()
  })
})
