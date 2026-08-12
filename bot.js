const mineflayer = require('mineflayer')

const HOST = 'StealMCs2.aternos.me'
const PORT = 31949
const BOT_NAME = 'Stealbot'
const VERSION = '1.21.4'

let bot
let actionTimer

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

    startPlayerActions()
  })

  bot.on('error', (err) => {
    console.log('Error:', err.message)
  })

  bot.on('end', () => {
    stopPlayerActions()

    console.log('Bot disconnect ho gaya.')
    console.log('10 seconds baad dobara connect hoga...')

    setTimeout(() => {
      startBot()
    }, 10000)
  })
}

function startPlayerActions() {
  stopPlayerActions()

  actionTimer = setInterval(() => {
    if (!bot || !bot.entity) return

    bot.setControlState('forward', true)

    setTimeout(() => {
      if (!bot || !bot.entity) return
      bot.setControlState('forward', false)
    }, 800 + Math.floor(Math.random() * 1800))

    if (Math.random() < 0.65) {
      setTimeout(() => {
        if (!bot || !bot.entity) return

        bot.setControlState('jump', true)

        setTimeout(() => {
          if (bot) bot.setControlState('jump', false)
        }, 250)
      }, 300)
    }

    const direction = Math.random() < 0.5 ? 'left' : 'right'

    if (Math.random() < 0.5) {
      bot.setControlState(direction, true)

      setTimeout(() => {
        if (bot) bot.setControlState(direction, false)
      }, 500 + Math.floor(Math.random() * 900))
    }

  }, 4000 + Math.floor(Math.random() * 5000))
}

function stopPlayerActions() {
  if (actionTimer) {
    clearInterval(actionTimer)
    actionTimer = null
  }

  if (bot) {
    bot.setControlState('forward', false)
    bot.setControlState('back', false)
    bot.setControlState('left', false)
    bot.setControlState('right', false)
    bot.setControlState('jump', false)
  }
}

startBot()
