/**
 * Home routes.
 *
 * @author Fredrik Jurgell
 * @version 1.0.0
 */

import express from 'express'
import { HomeController } from '../controllers/HomeController.js'

export const router = express.Router()

const controller = new HomeController()

// Map HTTP verbs and route paths to controller actions.
router.get('/', controller.index)
router.post('/search', controller.search)