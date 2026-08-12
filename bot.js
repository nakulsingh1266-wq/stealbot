const mineflayer = require('mineflayer')

const bot = mineflayer.createBot({
  host: 'YOUR_SERVER_IP',
  port: 25565,
  username: 'YOUR_BOT_NAME',
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
