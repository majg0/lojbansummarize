const { readFile } = require('fs')
const { promisify } = require('util')

const rf = promisify(readFile)

async function run () {
  const data = await rf('wordtablelist.md', 'utf8')

  const a = data.match(/\|---------\|--------\|\n[.\n\r]*/g)
  // const a = data.split('\n\n')

  const weeklyDictionaries = data
    .split('|---------|--------|')
    .slice(1)
    .map(x => {
      const wordList = x.split('\n\n')[0].trim().split('\n')
      const weeklyWords = wordList.map(x => x.split('|').slice(1, -1).map(w => w.trim()))
      return weeklyWords.map(([ swedish, lojban ]) => ({
        swedish, lojban
      }))
    })

  console.log(weeklyDictionaries)
}

run()
