const { readFile } = require('fs')
const { promisify } = require('util')
const readline = require('readline')

const rf = promisify(readFile)

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

function ask (q) {
  return new Promise(resolve => rl.question(q, resolve))
}

function rand (max) {
  return Math.floor(Math.random() * max);
}

async function run () {
  const data = await rf('wordtablelist.md', 'utf8')
  // const a = data.split('\n\n')

  const weeklyDictionaries = data
    .split('|---------|-------|-------|-----------------|---------------|')
    .slice(1, -1) // first is garbage, last is table template
    .map(x => {
      const wordList = x.split('\n\n')[0].trim().split('\n')
      const weeklyWords = wordList.map(x => x.split('|').slice(1, -1).map(w => w.trim()))
      // console.log(weeklyWords)
      return weeklyWords
        .filter(([ swedish, valsi ]) => swedish && valsi)
        .map(([ swedish, valsi, rafsi, placeStructure ]) => {
          return {
            swedish,
            valsi,
            rafsi: rafsi ? rafsi.trim().split(' ') : [],
            placeStructure
          }
        })
    })

  console.log('type the lojban words matching the swedish descriptions')

  let correct = 0
  for (let total = 1; total !== 51; ++total) {
    const week1 = weeklyDictionaries[0]
    const word = week1[rand(week1.length)]
    const a = await ask(`${word.swedish}?\n`)
    if (a === word.valsi) {
      console.log('Correct!\n')
      ++correct
    } else {
      console.log(`Nope! - ${word.valsi}\n`)
    }
    console.log(`${correct}/${total} (${(100 * correct / total).toFixed(0)}%)\n`)
  }

  rl.close()
}

run()
