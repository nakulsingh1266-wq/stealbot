const mineflayer = require('mineflayer')

const bot = mineflayer.createBot({
  host: 'StealMCs2.aternos.me',
  port: 31949,
  username: 'Stealbot',
  version: '1.21.4'
})

bot.on('spawn', () => {
  console.log('Bot server me aa gaya!')
})

bot.on('error', (err) => {
  console.log('Error:', err.message)
})

bot.on('end', () => {
  console.log('Bot disconnect ho gaya.')
})
