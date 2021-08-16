import { PgUserRepository } from '../../../../src/adapters/database/repositories/pg-user-repository'
import { createConnection, getConnection } from 'typeorm'
import 'reflect-metadata'

const makeSut = (): PgUserRepository => {
  return new PgUserRepository()
}

const mockUser = () => ({
  name: 'any_name',
  email: 'any_email@mail.com',
  password: 'any_password',
  passwordConfirmation: 'any_password'
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
      const sut = new PgUserRepository()
      const result = await sut.register(mockUser())
      expect(result.id).toBeTruthy()
      expect(result.name).toBe('any_name')
    })
  })

  describe('LoadUserByEmailRepository', () => {
    test('should return an account on sucess', async () => {
      const sut = makeSut()
      const createdUser = await sut.register(mockUser())

      const result = await sut.loadByEmail(createdUser.email)
      expect(result.id).toBeTruthy()
      expect(result.name).toBe('any_name')
    })

    test('should return null if loadByEmil fails ', async () => {
      const sut = makeSut()

      const result = await sut.loadByEmail('any_email')
      expect(result).toBeNull()
    })

    describe('SaveUserTokenRepository', () => {
      test('should update token user on sucess', async () => {
        const sut = makeSut()
        const user = mockUser()
        const userCreated = await sut.register(user)

        await sut.saveUserToken(userCreated.id, 'other_token')
        const result = await sut.loadByEmail(userCreated.email)
        expect(result.token).toBe('other_token')
      })
    })
  })
})
