import { BcrypterAdapter } from '../../../../src/adapters/criptography/bcrypt-adapter/bcrypter-adapter'
import bcrypt from 'bcrypt'

const makeSut = (): BcrypterAdapter => {
  const salt = 12
  return new BcrypterAdapter(salt)
}

describe('Bcrypter Adapter', () => {
  test('should call hash with correct values', async () => {
    const sut = makeSut()
    const hashSpy = jest.spyOn(bcrypt, 'hashSync')
    await sut.hash('any_value')
    expect(hashSpy).toHaveBeenCalledWith('any_value', 12)
  })

  test('should return hash on success', async () => {
    const sut = makeSut()
    jest.spyOn(bcrypt, 'hashSync').mockReturnValueOnce(('hash'))
    const result = await sut.hash('any_value')
    expect(result).toBe('hash')
  })

  test('should call hashCompare with correct values', async () => {
    const sut = makeSut()
    const comapreSpy = jest.spyOn(bcrypt, 'compareSync')
    await sut.compare('any_value', 'hash')
    expect(comapreSpy).toHaveBeenCalledWith('any_value', 'hash')
  })

  test('should return true when comparer succeeds', async () => {
    const sut = makeSut()
    jest.spyOn(bcrypt, 'compareSync').mockReturnValueOnce(true)
    const result = await sut.compare('any_value', 'hash')
    expect(result).toBeTruthy()
  })

  test('should return false when comparer fails', async () => {
    const sut = makeSut()
    jest.spyOn(bcrypt, 'compareSync').mockReturnValueOnce(false)
    const result = await sut.compare('any_value', 'hash')
    expect(result).toBeFalsy()
  })
})
