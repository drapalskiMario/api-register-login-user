import { User } from '../../entities/user'
import { HashComparer } from '../../interface-adapters/cryptography/hash-comparer'
import { Encrypter } from '../../interface-adapters/cryptography/encrypter'
import { LoadUserByEmailRepository } from '../../interface-adapters/repositories/load-by-email'
import { SaveUserTokenRepository } from '../../interface-adapters/repositories/save-user-token'
import { Authentication } from './authentication'

type SutTypes = {
  sut: Authentication,
  loadUserByEmailRepositoryStub: LoadUserByEmailRepository,
  hasherComparerStub: HashComparer,
  encrypterStub: Encrypter,
  saveUserTokenRepositoryStub: SaveUserTokenRepository
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
  const loadUserByEmailRepositoryStub = mockLoadUserByEmailRepository()
  const hasherComparerStub = mockHasherCompare()
  const saveUserTokenRepositoryStub = mockSaveUserTokenRepository()
  const encrypterStub = mockEncrypter()
  const sut = new Authentication(
    loadUserByEmailRepositoryStub,
    hasherComparerStub,
    encrypterStub,
    saveUserTokenRepositoryStub
  )

  return { sut, loadUserByEmailRepositoryStub, hasherComparerStub, encrypterStub, saveUserTokenRepositoryStub }
}

describe('Authentication User Service', () => {
  test('should call loadUserByEmail with correct email', async () => {
    const { sut, loadUserByEmailRepositoryStub } = makeSut()
    const loadByEmailSpy = jest.spyOn(loadUserByEmailRepositoryStub, 'loadByEmail')
    await sut.auth('any_email@mail.com', 'any_password')
    expect(loadByEmailSpy).toHaveBeenCalledWith('any_email@mail.com')
  })

  test('should return null if loadUserByEmail return null', async () => {
    const { sut, loadUserByEmailRepositoryStub } = makeSut()
    jest.spyOn(loadUserByEmailRepositoryStub, 'loadByEmail').mockResolvedValueOnce(Promise.resolve(null))
    const user = await sut.auth('any_email@mail.com', 'any_password')
    expect(user).toBeNull()
  })

  test('should call hashComparer with correct values', async () => {
    const { sut, hasherComparerStub } = makeSut()
    const hashComparerSpy = jest.spyOn(hasherComparerStub, 'compare')
    await sut.auth('any_email@mail.com', 'any_password')
    expect(hashComparerSpy).toHaveBeenCalledWith('any_password', 'any_hash')
  })

  test('should return null if hashCompare return null', async () => {
    const { sut, hasherComparerStub } = makeSut()
    jest.spyOn(hasherComparerStub, 'compare').mockResolvedValueOnce(Promise.resolve(null))
    const user = await sut.auth('any_email@mail.com', 'any_password')
    expect(user).toBeNull()
  })

  test('should call encrypter with correct value', async () => {
    const { sut, encrypterStub } = makeSut()
    const encrypterSpay = jest.spyOn(encrypterStub, 'encrypt')
    await sut.auth('any_email@mail.com', 'any_password')
    expect(encrypterSpay).toHaveBeenCalledWith('any_id')
  })

  test('should call saveuserToken with correct value', async () => {
    const { sut, saveUserTokenRepositoryStub } = makeSut()
    const saveUserTokenSpay = jest.spyOn(saveUserTokenRepositoryStub, 'saveUserToken')
    await sut.auth('any_id', 'any_password')
    expect(saveUserTokenSpay).toHaveBeenCalledWith('any_id', 'any_token')
  })
})
