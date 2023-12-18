/**
 * The routes.
 *
 * @author Fredrik Jurgell
 * @version 1.0.0
 */

import express from 'express'
import { router as HomeRouter } from './HomeRouter.js'

export const router = express.Router()

router.use('/', HomeRouter)
