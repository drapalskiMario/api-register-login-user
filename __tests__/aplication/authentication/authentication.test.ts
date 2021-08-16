
import { User } from '../../../src/domain/entities/user'
import { AuthenticationUser, AuthenticationUserParams } from '../../../src/domain/use-cases/autentication'
import { Encrypter } from '../../../src/ports/cryptography/encrypter'
import { HashComparer } from '../../../src/ports/cryptography/hash-comparer'
import { LoadUserByEmailRepository } from '../../../src/ports/repositories/load-by-email'
import { SaveUserTokenRepository } from '../../../src/ports/repositories/save-user-token'
import { AuthUserValidator } from '../../../src/ports/validators/auth-user-validator'
import { AuthenticationUserUseCase } from '../../../src/aplication/authentication/authentication'

type SutTypes = {
  sut: AuthenticationUser,
  validatorStub: AuthUserValidator,
  loadUserByEmailRepositoryStub: LoadUserByEmailRepository,
  hasherComparerStub: HashComparer,
  encrypterStub: Encrypter,
  saveUserTokenRepositoryStub: SaveUserTokenRepository
}

const mockRegisterValidator = (): AuthUserValidator => {
  class ValidatorStub implements AuthUserValidator {
    async validate (userParams: AuthenticationUserParams): Promise<boolean> {
      return null
    }
  }
  return new ValidatorStub()
}

const mockLoadUserByEmailRepository = (): LoadUserByEmailRepository => {
  class LoadUserByEmailRepositoryStub implements LoadUserByEmailRepository {
    async loadByEmail (email: string): Promise<User> {
      return Promise.resolve({
        id: 'any_id',
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_hash'
      })
    }
  }

  return new LoadUserByEmailRepositoryStub()
}

const mockHasherCompare = (): HashComparer => {
  class HashComparerStub implements HashComparer {
    async compare (value: string, hash: string): Promise<boolean> {
      return Promise.resolve(true)
    }
  }

  return new HashComparerStub()
}

const mockEncrypter = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt (value: string): Promise<string> {
      return Promise.resolve('any_token')
    }
  }

  return new EncrypterStub()
}

const mockSaveUserTokenRepository = (): SaveUserTokenRepository => {
  class SaveUserTokenRepositoryStub implements SaveUserTokenRepository {
    async saveUserToken (email: string, token: string): Promise<void> {
      return Promise.resolve()
    }
  }

  return new SaveUserTokenRepositoryStub()
}

const makeSut = (): SutTypes => {
  const validatorStub = mockRegisterValidator()
  const loadUserByEmailRepositoryStub = mockLoadUserByEmailRepository()
  const hasherComparerStub = mockHasherCompare()
  const saveUserTokenRepositoryStub = mockSaveUserTokenRepository()
  const encrypterStub = mockEncrypter()
  const sut = new AuthenticationUserUseCase(
    validatorStub,
    loadUserByEmailRepositoryStub,
    hasherComparerStub,
    encrypterStub,
    saveUserTokenRepositoryStub
  )

  return { sut, validatorStub, loadUserByEmailRepositoryStub, hasherComparerStub, encrypterStub, saveUserTokenRepositoryStub }
}

const mockAuthenticationUserParams = (): AuthenticationUserParams => ({
  email: 'valid_email@mail.com',
  password: 'valid_password'
})

describe('Authentication User Service', () => {
  test('should call validador with correct values', async () => {
    const { sut, validatorStub } = makeSut()
    const validatorSpy = jest.spyOn(validatorStub, 'validate')
    const userParams = mockAuthenticationUserParams()
    await sut.auth(userParams)
    expect(validatorSpy).toHaveBeenCalledWith(userParams)
  })

  test('should return Error if Validator not return null', async () => {
    const { sut, validatorStub } = makeSut()
    jest.spyOn(validatorStub, 'validate').mockReturnValue(Promise.resolve(true))
    const response = await sut.auth(mockAuthenticationUserParams())
    expect(response).toEqual({ error: 'invalid params', success: null })
  })

  test('should call loadUserByEmail with correct email', async () => {
    const { sut, loadUserByEmailRepositoryStub } = makeSut()
    const loadByEmailSpy = jest.spyOn(loadUserByEmailRepositoryStub, 'loadByEmail')
    await sut.auth(mockAuthenticationUserParams())
    expect(loadByEmailSpy).toHaveBeenCalledWith('valid_email@mail.com')
  })

  test('should return null if loadUserByEmail return null', async () => {
    const { sut, loadUserByEmailRepositoryStub } = makeSut()
    jest.spyOn(loadUserByEmailRepositoryStub, 'loadByEmail').mockResolvedValueOnce(Promise.resolve(null))
    const response = await sut.auth(mockAuthenticationUserParams())
    expect(response).toEqual({ error: 'invalid params', success: null })
  })

  test('should call hashComparer with correct values', async () => {
    const { sut, hasherComparerStub } = makeSut()
    const hashComparerSpy = jest.spyOn(hasherComparerStub, 'compare')
    await sut.auth(mockAuthenticationUserParams())
    expect(hashComparerSpy).toHaveBeenCalledWith('valid_password', 'any_hash')
  })

  test('should return null if hashCompare return null', async () => {
    const { sut, hasherComparerStub } = makeSut()
    jest.spyOn(hasherComparerStub, 'compare').mockResolvedValueOnce(Promise.resolve(null))
    const response = await sut.auth(mockAuthenticationUserParams())
    expect(response).toEqual({ error: 'invalid params', success: null })
  })

  test('should call encrypter with correct value', async () => {
    const { sut, encrypterStub } = makeSut()
    const encrypterSpay = jest.spyOn(encrypterStub, 'encrypt')
    await sut.auth(mockAuthenticationUserParams())
    expect(encrypterSpay).toHaveBeenCalledWith('any_id')
  })

  test('should call saveuserToken with correct value', async () => {
    const { sut, saveUserTokenRepositoryStub } = makeSut()
    const saveUserTokenSpay = jest.spyOn(saveUserTokenRepositoryStub, 'saveUserToken')
    await sut.auth(mockAuthenticationUserParams())
    expect(saveUserTokenSpay).toHaveBeenCalledWith('any_id', 'any_token')
  })
})
