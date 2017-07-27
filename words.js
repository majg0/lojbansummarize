const { readFile } = require('fs')
const { promisify } = require('util')
// const process = require('process')
const readline = require('readline')

const rf = promisify(readFile)
// const args = process.argv.slice(2)

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

async function getinput (q) {
  return new Promise(resolve => rl.question(`${q}?\n`, resolve))
}

async function ask (word, [from, to]) {
  const answer = await getinput(word[from])
  const correct = word[to]
  if (answer === correct) {
    return true
  } else {
    return correct
  }
}

function rand (max) {
  return Math.floor(Math.random() * max)
}

const swedishToValsi = ['swedish', 'valsi']
// const exampleToValsi = ['example', 'valsi']
// const placeStructureToValsi = ['placeStructure', 'valsi']

// const allTypes = [
//   swedishToValsi,
//   placeStructureToValsi,
//   exampleToValsi
// ]

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
        .map(([ swedish, valsi, rafsi, placeStructure, example ]) => {
          return {
            swedish,
            valsi,
            rafsi: rafsi ? rafsi.trim().split(' ') : [],
            placeStructure,
            example
          }
        })
    })

  console.log('type the lojban words matching the swedish descriptions')

  const week = Number(await getinput('What week')) - 1

  let numCorrect = 0
  for (let total = 1; total !== 51; ++total) {
    const week1 = weeklyDictionaries[week]
    const word = week1[rand(week1.length)]
    const correct = await ask(word, swedishToValsi)
    if (correct === true) {
      console.log('Correct!\n')
      ++numCorrect
    } else {
      console.log(`Nope! - ${correct}\n`)
    }
    console.log(`${numCorrect}/${total} (${(100 * numCorrect / total).toFixed(0)}%)\n`)
  }

  rl.close()
}

run()
