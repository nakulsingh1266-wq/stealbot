const mineflayer = require('mineflayer')

const HOST = 'StealMCs2.aternos.me'
const PORT = 31949
const BOT_NAME = 'Stealbot'
const VERSION = '1.21.4'

let bot

function startBot() {
  console.log('Stealbot server se connect ho raha hai...')

  bot = mineflayer.createBot({
    host: HOST,
    port: PORT,
    username: BOT_NAME,
    version: VERSION
  })

  bot.once('spawn', () => {
  console.log('Stealbot server me aa gaya!')

  setTimeout(() => {
    bot.chat('/login stealbotpro0071')
  }, 3000)
})

  bot.on('error', (err) => {
    console.log('Error:', err.message)
  })

  bot.on('end', () => {
    console.log('Bot disconnect ho gaya. 🔄')
    console.log('10 seconds baad dobara connect hoga...')

    setTimeout(() => {
      startBot()
    }, 10000)
  })
}

startBot()
