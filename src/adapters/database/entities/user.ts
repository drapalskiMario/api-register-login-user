import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { User } from '../../../domain/entities/user'

@Entity('user')
export class PgUser implements User {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  name: string

  @Column({ unique: true })
  email: string

  @Column()
  password: string

  @Column({ nullable: true })
  token: string
}
