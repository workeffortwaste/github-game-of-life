// GitHub Game of Life - 1.0.4
// Chris Johnson
// @defaced / defaced.dev / github.com/workeffortwaste
(function () {
  const startGgol = () => {
    // Settings
    const cols = 7
    const rows = 53

    // Pull down the contributions from the graph.
    const contributions = document.getElementsByClassName('js-calendar-graph')[0].children[0].querySelectorAll('tbody tr')
   
    // Read contributions as rows from the contribution frame.
    const readContributions = (contributions) => {
      // Init output Arr.
      const output = []

      for (const contribution of contributions) {
        const days = contribution.getElementsByTagName('td')
        const lifeRow = []
        for (const day of days) {
          // Convert to live or dead cells.
          lifeRow.push(day.getAttribute('data-level') > 0 ? 1 : 0)
        }
        // Add column to output.
        output.push(lifeRow)
      }

      //Fill in any blanks in the first and last rows.
      for (let i = 0; i < 54; i++) {
        if (!output[0][i]) {
          output[0][i] = 0
        }
        if (!output[output.length - 1][i]) {
          output[output.length - 1][i] = 0
        }
      }

      return output
    }

    // Our initial game of life state.
    let lifeArray = readContributions(contributions)

    // Write to the contributions graphic.
    const writeContributions = (contributions, nextGenerationArray) => {
      for (let i = 0; i < contributions.length; i++) {
        const days = contributions[i].getElementsByTagName('td')
        for (let d = 0; d < 54; d++) { // Magic number - 7 days of the week.
          if (document.getElementsByTagName('html')[0].getAttribute('data-color-mode') === 'dark') {
            try { days[d].setAttribute('data-level', nextGenerationArray[i][d] ? '2' : '0') } catch {}
          } else {
            try { days[d].setAttribute('data-level', nextGenerationArray[i][d] ? '2' : '0') } catch {}
          }
        }
      }
    }

    const countNeighbors = (grid, x, y) => {
      let sum = 0

      for (let i = -1; i < 2; i++) {
        for (let j = -1; j < 2; j++) {
          const col = (x + i + cols) % cols
          const row = (y + j + rows) % rows
          sum += grid[col][row]
        }
      }

      sum -= grid[x][y]
      return sum
    }

    const generateNextIteration = (grid) => {
      // Make empty array
      const next = [...Array(7)].map(e => Array(54))

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const state = grid[i][j]
          const neighbors = countNeighbors(grid, i, j)

          if (state === 0 && neighbors === 3) {
            next[i][j] = 1
          } else if (state === 1 && (neighbors < 2 || neighbors > 3)) {
            next[i][j] = 0
          } else {
            next[i][j] = state
          }
        }
      }

      return next
    }

    const update = () => {
      // Generate the next iteration.
      const next = generateNextIteration(lifeArray)

      // If the output is the same as the input we've reached a stable state so kill the interval.
      if (JSON.stringify(next) === JSON.stringify(lifeArray)) {
        clearInterval(timer)
      }

      // Update the lifeArray with the next generation.
      lifeArray = next
      writeContributions(contributions, lifeArray)
    }

    // Update every 500 ms.
    const timer = setInterval(function () { update() }, 500)
  }

  const observerGgol = (entry) => {
    if (entry[0].intersectionRatio > 0) {
      // Kill the observer.
      observer.disconnect()
      // Start the game of life.
      startGgol()
    }
  }

  const observer = new IntersectionObserver(observerGgol)
  try { observer.observe(document.getElementsByClassName('js-calendar-graph')[0]) } catch {}
})()