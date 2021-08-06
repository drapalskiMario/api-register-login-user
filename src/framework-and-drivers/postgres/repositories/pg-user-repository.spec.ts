import { AddUserParams } from '../../../usecases/add-user/add-user'
import { UserRepository } from './pg-user-repository'
import { createConnection, getConnection } from 'typeorm'
import 'reflect-metadata'

const mockUser = (): AddUserParams => ({
  name: 'any_name',
  email: 'any_email@mail.com',
  password: 'any_password'
})

describe('UserRepository', () => {
  beforeAll(async () => {
    try {
      await createConnection()
    } catch (err) {
      console.error(err)
    }
  })

  afterAll(async () => {
    await getConnection().close()
  })

  afterEach(async () => {
    await getConnection().createQueryBuilder().delete().from('user').execute()
  })

  describe('addUserRepository', () => {
    test('should return an account on sucess', async () => {
      const sut = new UserRepository()
      const result = await sut.add(mockUser())
      expect(result.id).toBeTruthy()
      expect(result.name).toBe('any_name')
    })
  })

  describe('LoadUserByEmailRepository', () => {
    test('should return an account on sucess', async () => {
      const sut = new UserRepository()
      const createdUser = await sut.add(mockUser())

      const result = await sut.loadByEmail(createdUser.email)
      expect(result.id).toBeTruthy()
      expect(result.name).toBe('any_name')
    })

    test('should return null if loadByEmil fails ', async () => {
      const sut = new UserRepository()

      const result = await sut.loadByEmail('any_email')
      expect(result).toBeNull()
    })

    describe('SaveUserTokenRepository', () => {
      test('should update token user on sucess', async () => {
        const sut = new UserRepository()
        const user = mockUser()
        user.token = 'any_token'
        const userCreated = await sut.add(user)

        await sut.saveUserToken(userCreated.id, 'other_token')
        const result = await sut.loadByEmail(userCreated.email)
        expect(result.token).toBe('other_token')
      })
    })
  })
})
