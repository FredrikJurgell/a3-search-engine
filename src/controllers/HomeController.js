import fs from 'fs/promises'
import path from 'path'
import { Page } from '../models/Page.js'
import { PageDB } from '../models/PageDB.js'

/**
 * Controller for the home page.
 */
export class HomeController {
  /**
   * Renders the index page.
   *
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @param {Function} next - The next middleware function.
   */
  index(req, res, next) {
    try {
      res.render('home/index', { title: 'Express' })
    } catch (error) {
      console.error(error)
      res.status(500).send('Internal Server Error')
    }
  }

  /**
   * Performs a search based on the provided search query.
   *
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @param {Function} next - The next middleware function.
   * @returns {Promise<void>} - A promise that resolves when the search is complete.
   */
  async search(req, res, next) {
    try {
      const query = req.body.searchQuery.toLowerCase()
      if (req.body.searchQuery === '') {
        res.json({ searchResults: null })
        return
      }

      const gamesPages = await createPages('./wikipedia/Words/Games', 'games')
      const programmingPages = await createPages('./wikipedia/Words/Programming', 'programming')

      const index = {
        games: gamesPages,
        programming: programmingPages,
      }

      const pageDB = new PageDB()

      for (const category in index) {
        if (Object.prototype.hasOwnProperty.call(index, category)) {
          for (const pageData of index[category]) {
            pageDB.createPage(pageData.url, pageData.words)
          }
        }
      }

      const queryWordIds = pageDB.getIdForWord(query)
      const searchResults = pageDB.query(queryWordIds) // Using the query method from PageDB

      res.json({ searchResults })
    } catch (error) {
      console.error(error)
      res.status(500).send('Internal Server Error')
    }
  }
}

/**
 * Creates an array of Page objects by reading files from a specified folder path.
 * Each Page object contains the URL and the content of the file.
 *
 * @param {string} folderPath - The path to the folder containing the files.
 * @param {string} category - The category of the pages.
 * @returns {Promise<Array<Page>>} - A promise that resolves to an array of Page objects.
 */
async function createPages(folderPath, category) {
  const files = await fs.readdir(folderPath)
  const pages = []

  for (const file of files) {
    const filePath = path.join(folderPath, file)
    const words = await fs.readFile(filePath, 'utf8')
    const wordsToLowerCase = words.toLowerCase()
    const url = `https://wikipedia.com/wiki/${file}`

    const page = new Page(url, wordsToLowerCase.replace(/\n/g, ' ')) // Replace newlines with space
    pages.push(page)
  }

  return pages
}
