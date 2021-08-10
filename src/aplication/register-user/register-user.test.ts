
import { User } from '../../domain/entities/user'
import { RegisterUserParams } from '../../domain/use-cases/register-user'
import { Hasher } from '../../ports/cryptography/hasher'
import { LoadUserByEmailRepository } from '../../ports/repositories/load-by-email'
import { RegisterUserRepository } from '../../ports/repositories/register'
import { RegisterUserValidator } from '../../ports/validators/register-user-validator'
import { RegisterUserUseCase } from './register-user'

type SutTypes = {
  sut: RegisterUserUseCase,
  validatorStub: RegisterUserValidator,
  loadUserByEmailRepositoryStub: LoadUserByEmailRepository,
  hasherStub: Hasher,
  RegisterUserRepositoryStub: RegisterUserRepository
}

const mockRegisterValidator = (): RegisterUserValidator => {
  class ValidatorStub implements RegisterUserValidator {
    async validate (userParams: RegisterUserParams): Promise<boolean> {
      return null
    }
  }
  return new ValidatorStub()
}

const mockLoadUserByEmailRepository = (): LoadUserByEmailRepository => {
  class LoadUserByEmailRepositoryStub implements LoadUserByEmailRepository {
    async loadByEmail (email: string): Promise<User> {
      return Promise.resolve(null)
    }
  }

  return new LoadUserByEmailRepositoryStub()
}

const mockHasher = (): Hasher => {
  class HasherStub implements Hasher {
    async hash (value: string): Promise<string> {
      return Promise.resolve('any_hash')
    }
  }

  return new HasherStub()
}

const mockRegisterUserRepository = (): RegisterUserRepository => {
  class RegisterUserRepositoryStub implements RegisterUserRepository {
    async register (user: RegisterUserParams): Promise<User> {
      return Promise.resolve({
        id: 'any_id',
        name: 'any_name',
        email: 'any_email',
        password: 'any_hash'
      })
    }
  }

  return new RegisterUserRepositoryStub()
}

const makeSut = (): SutTypes => {
  const validatorStub = mockRegisterValidator()
  const loadUserByEmailRepositoryStub = mockLoadUserByEmailRepository()
  const hasherStub = mockHasher()
  const RegisterUserRepositoryStub = mockRegisterUserRepository()
  const sut = new RegisterUserUseCase(validatorStub, loadUserByEmailRepositoryStub, hasherStub, RegisterUserRepositoryStub)

  return { sut, validatorStub, loadUserByEmailRepositoryStub, hasherStub, RegisterUserRepositoryStub }
}

const mockRegisterUserParams = (): RegisterUserParams => ({
  name: 'any_name',
  email: 'any_email@mail.com',
  password: 'any_password',
  passwordConfirmation: 'any_password'
})

describe('RegisterUserUseCase', () => {
  test('should call validador with correct values', async () => {
    const { sut, validatorStub } = makeSut()
    const validatorSpy = jest.spyOn(validatorStub, 'validate')
    const userParams = mockRegisterUserParams()
    await sut.register(userParams)
    expect(validatorSpy).toHaveBeenCalledWith(userParams)
  })

  test('should return Error if Validator not return null', async () => {
    const { sut, validatorStub } = makeSut()
    jest.spyOn(validatorStub, 'validate').mockReturnValue(Promise.resolve(true))
    const response = await sut.register(mockRegisterUserParams())
    expect(response).toEqual({ error: 'invalid params' })
  })

  test('should call loadUserByEmailRepository with correct email', async () => {
    const { sut, loadUserByEmailRepositoryStub } = makeSut()
    const loadSpy = jest.spyOn(loadUserByEmailRepositoryStub, 'loadByEmail')
    await sut.register(mockRegisterUserParams())
    expect(loadSpy).toHaveBeenCalledWith('any_email@mail.com')
  })

  test('should return null if LoadUserByEmailRepository not return null', async () => {
    const { sut, loadUserByEmailRepositoryStub } = makeSut()
    jest.spyOn(loadUserByEmailRepositoryStub, 'loadByEmail').mockReturnValue(Promise.resolve({
      id: 'any_id',
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'hash_password'
    }))
    const response = await sut.register(mockRegisterUserParams())
    expect(response).toEqual({ error: 'user already exists' })
  })

  test('should call hasher with correct value', async () => {
    const { sut, hasherStub } = makeSut()
    const hasherSpy = jest.spyOn(hasherStub, 'hash')
    await sut.register(mockRegisterUserParams())
    expect(hasherSpy).toHaveBeenCalledWith('any_password')
  })

  test('should call RegisterUserRepository with correct values', async () => {
    const { sut, RegisterUserRepositoryStub } = makeSut()
    const addUserSpy = jest.spyOn(RegisterUserRepositoryStub, 'register')
    await sut.register(mockRegisterUserParams())
    expect(addUserSpy).toHaveBeenCalledWith({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_hash'
    })
  })

  test('should return an user on sucess', async () => {
    const { sut } = makeSut()
    const user = await sut.register(mockRegisterUserParams())
    expect(user).toEqual({
      id: 'any_id',
      name: 'any_name',
      email: 'any_email',
      password: 'any_hash'
    })
  })
})
