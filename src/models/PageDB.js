/**
 * Represents a database for storing and querying pages.
 */
export class PageDB {
  constructor() {
    this.wordToId = new Map()
    this.pages = []
  }

  /**
   * Creates a new page in the PageDB.
   *
   * @param {string} url - The URL of the page.
   * @param {string} words - The words contained in the page.
   * @returns {void}
   */
  createPage(url, words) {
    const page = {
      url: url,
      wordIds: words.split(' ').map(word => this.getIdForWord(word)) // Convert words to word IDs
    }
    this.pages.push(page)
  }

  /**
   * Retrieves the ID associated with a given word.
   * If the word is already present in the hashmap, the corresponding ID is returned.
   * If the word is not present, it is added to the hashmap with a new ID and the new ID is returned.
   *
   * @param {string} word - The word to retrieve the ID for.
   * @returns {number} The ID associated with the word.
   */
  getIdForWord(word) {
    if (this.wordToId.has(word)) {
      // Word found in hashmap
      return this.wordToId.get(word)
    } else {
      // Add missing word to hashmap
      const id = this.wordToId.size
      this.wordToId.set(word, id)
      return id
    }
  }

  /**
   * Executes a query on the pages database and returns a sorted result list based on the scores.
   *
   * @param {string} query - The query string to search for.
   * @returns {Array} - The sorted result list containing pages and their corresponding scores.
   */
  query(query) {
    let result = []
    let scores = {
      content: [],
      location: []
    }

    // Calculate score for each page in the pages database
    for (let i = 0; i < this.pages.length; i++) {
      let p = this.pages[i]
      scores.content[i] = this.getFrequencyScore(p, query)
    }

    // Normalize scores
    this.normalize(scores.content, false)

    // Generate result list
    for (let i = 0; i < this.pages.length; i++) {
      let p = this.pages[i]

      // Only include results where the word appears at least once
      if (scores.content[i] > 0) {
        // Calculate sum of weighted scores
        let score = 1.0 * scores.content[i]
        result.push({ page: p, score: score })
      }
    }

    // Sort result list with highest score first
    result.sort((a, b) => b.score - a.score)

    // Return result list
    return result
  }

  /**
   * Normalizes an array of scores.
   *
   * @param {number[]} scores - The array of scores to be normalized.
   * @param {boolean} smallIsBetter - Indicates whether smaller scores are better.
   * @returns {void}
   */
  normalize(scores, smallIsBetter) {
    if (smallIsBetter) {
      let min_val = Math.min(...scores)
      for (let i = 0; i < scores.length; i++) {
        scores[i] = min_val / Math.max(scores[i], 0.00001)
      }
    } else {
      let max_val = Math.max(...scores)
      max_val = Math.max(max_val, 0.00001)
      for (let i = 0; i < scores.length; i++) {
        scores[i] = scores[i] / max_val
      }
    }
  }

  /**
   * Calculates the frequency score of a page based on the given query.
   *
   * @param {Object} p - The page object.
   * @param {string} query - The query string.
   * @returns {number} - The frequency score of the page.
   */
  getFrequencyScore(p, query) {
    let qws = []
    qws.push(query)
    let score = 0

    qws.forEach((q) => {
      p.wordIds.forEach((word) => {
        if (word === q) {
          score += 1
        }
      })
    })

    return score
  }

  /**
   * Searches for pages in the database based on the given query.
   *
   * @param {Array<number>} query - The query containing word IDs to search for.
   * @returns {Array<{url: string, wordIds: Array<number>}>} - An array of objects representing the search results, each containing the URL of the page and the word IDs found.
   */
  search(query) {
    const queryIds = query
    const results = this.documents.filter(page =>
      page.wordIds.some(id => queryIds.includes(id))
    )

    return results.map(page => ({ url: page.url, wordIds: page.wordIds }))
  }
}
