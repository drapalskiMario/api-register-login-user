import { User } from '../entities/user'
import { Hasher } from '../interface-adapters/cryptography/hasher'
import { AddUserRepository } from '../interface-adapters/repositories/add'
import { LoadUserByEmailRepository } from '../interface-adapters/repositories/load-by-email'
import { AddUser, AddUserParams } from './add-user'

type SutTypes = {
  sut: AddUser,
  loadUserByEmailRepositoryStub: LoadUserByEmailRepository,
  hasherStub: Hasher,
  addUserRepositoryStub: AddUserRepository
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

const mockAddUserRepository = (): AddUserRepository => {
  class AddUserRepositoryStub implements AddUserRepository {
    async add (user: AddUserParams): Promise<User> {
      return Promise.resolve({
        id: 'any_id',
        name: 'any_name',
        email: 'any_email',
        password: 'any_hash'
      })
    }
  }

  return new AddUserRepositoryStub()
}

const makeSut = (): SutTypes => {
  const loadUserByEmailRepositoryStub = mockLoadUserByEmailRepository()
  const hasherStub = mockHasher()
  const addUserRepositoryStub = mockAddUserRepository()
  const sut = new AddUser(loadUserByEmailRepositoryStub, hasherStub, addUserRepositoryStub)

  return { sut, loadUserByEmailRepositoryStub, hasherStub, addUserRepositoryStub }
}

const mockAddUserParams = (): AddUserParams => ({
  name: 'any_name',
  email: 'any_email@mail.com',
  password: 'any_password'
})

describe('Add Account Service', () => {
  test('should call loadUserByEmailRepository with correct email', async () => {
    const { sut, loadUserByEmailRepositoryStub } = makeSut()
    const loadSpy = jest.spyOn(loadUserByEmailRepositoryStub, 'loadByEmail')
    await sut.add(mockAddUserParams())
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
    const user = await sut.add(mockAddUserParams())
    expect(user).toBeNull()
  })

  test('should call hasher with correct value', async () => {
    const { sut, hasherStub } = makeSut()
    const hasherSpy = jest.spyOn(hasherStub, 'hash')
    await sut.add(mockAddUserParams())
    expect(hasherSpy).toHaveBeenCalledWith('any_password')
  })

  test('should call addUserRepository with correct values', async () => {
    const { sut, addUserRepositoryStub } = makeSut()
    const addUserSpy = jest.spyOn(addUserRepositoryStub, 'add')
    await sut.add(mockAddUserParams())
    expect(addUserSpy).toHaveBeenCalledWith({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_hash'
    })
  })

  test('should return an user on sucess', async () => {
    const { sut } = makeSut()
    const user = await sut.add(mockAddUserParams())
    expect(user).toEqual({
      id: 'any_id',
      name: 'any_name',
      email: 'any_email',
      password: 'any_hash'
    })
  })
})
