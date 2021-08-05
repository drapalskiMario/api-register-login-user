import bcrypt from 'bcrypt'
import { HashComparer } from '../../interface-adapters/cryptography/hash-comparer'
import { Hasher } from '../../interface-adapters/cryptography/hasher'

export class BcrypterAdapter implements Hasher, HashComparer {
  constructor (private readonly salt: number) {}

  async hash (value: string): Promise <string> {
    const hash = bcrypt.hashSync(value, this.salt)
    return hash
  }

  async compare (value: string, hash: string): Promise<boolean> {
    const isValid = bcrypt.compareSync(value, hash)
    return isValid
  }
}
