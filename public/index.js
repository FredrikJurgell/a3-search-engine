document.addEventListener('DOMContentLoaded', async function () {
  document.getElementById('search').addEventListener('click', async function () {
    try {
      const searchQuery = document.getElementById('searchQuery').value
      const response = await fetch('/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ searchQuery })
      })
      const { searchResults } = await response.json()

      renderData(searchResults)
    } catch (error) {
      console.error(error)
    }
  })

  function renderData(searchResults) {
    const searchResultDiv = document.getElementById('searchResult')
    searchResultDiv.textContent = ''

    const table = document.createElement('table')
    const headerRow = table.insertRow(0)

    const headers = ['Result Number', 'URL', 'Score']
    headers.forEach(headerText => {
      const header = document.createElement('th')
      header.textContent = headerText
      headerRow.appendChild(header)
    })

    if (searchResults && searchResults.length > 0) {
      const topResults = searchResults.slice(0, 5)

      topResults.forEach((result, index) => {
        const row = table.insertRow(-1)
        const cell1 = row.insertCell(0)
        const cell2 = row.insertCell(1)
        const cell3 = row.insertCell(2)

        cell1.textContent = index + 1

        // Create a clickable link for the URL
        const link = document.createElement('a')
        link.href = result.page.url
        link.textContent = result.page.url
        link.target = '_blank' // Open in new tab
        cell2.appendChild(link)

        cell3.textContent = result.score
      })

      // Number of results as a paragraph
      const paragraph = document.createElement('p')
      paragraph.textContent = `Number of results: ${searchResults.length}`
      searchResultDiv.appendChild(paragraph)
    } else {
      console.log('No results found')
      const row = table.insertRow(-1)
      const cell = row.insertCell(0)
      cell.colSpan = 3
      cell.textContent = 'No results found'
    }

    searchResultDiv.appendChild(table)
  }
})
