import 'reflect-metadata'
import 'dotenv/config'
import { createConnection } from 'typeorm'
import app from './app'

createConnection()
  .then(() => {
    app.listen(process.env.PORT, () => console.log('Server Running'))
  })
  .catch(console.error)
