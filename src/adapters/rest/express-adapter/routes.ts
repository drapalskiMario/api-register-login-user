import { Router } from 'express'
import { makeLoginUserController } from '../factories/login-user-controllet'
import { makeRegisterUserController } from '../factories/register-user-controller'
import { adaptRoute } from './adapter-controller'

const router = Router()

router.post('/user/register', adaptRoute(makeRegisterUserController()))
router.post('/user/login', adaptRoute(makeLoginUserController()))

export default router
