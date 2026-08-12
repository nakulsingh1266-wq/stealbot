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
    console.log('Stealbot server me aa gaya! ✅')
  })

  // Bot ko server kick kare to exact reason dikhayega
  bot.on('kicked', (reason) => {
    console.log('==============================')
    console.log('BOT KICK HUA!')
    console.log('Kick reason:')
    console.log(reason)
    console.log('==============================')
  })

  bot.on('error', (err) => {
    console.log('Error:', err.message)
  })

  // Disconnect hone ka reason dikhayega
  bot.on('end', (reason) => {
    console.log('==============================')
    console.log('Bot disconnect ho gaya.')
    console.log('Disconnect reason:')
    console.log(reason)
    console.log('10 seconds baad dobara connect hoga...')
    console.log('==============================')

    setTimeout(() => {
      startBot()
    }, 10000)
  })
}

startBot()
