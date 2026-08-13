const mineflayer = require('mineflayer')

const HOST = 'StealMCs2.aternos.me'
const PORT = 31949
const BOT_NAME = 'Stealbot'
const VERSION = '1.21.4'

const PASSWORD = 'Stealbot123'

let bot
let reconnectTimer

function startBot() {
  if (reconnectTimer) clearTimeout(reconnectTimer)

  console.log('Stealbot server se connect ho raha hai...')

  bot = mineflayer.createBot({
    host: HOST,
    port: PORT,
    username: BOT_NAME,
    version: VERSION,
    auth: 'offline'
  })

  bot.once('spawn', () => {
    console.log('Stealbot server me aa gaya!')

    // Register
    setTimeout(() => {
      bot.chat(`/register ${PASSWORD} ${PASSWORD}`)
    }, 1500)

    // Login
    setTimeout(() => {
      bot.chat(`/login ${PASSWORD}`)
    }, 3500)
  })

  // =========================
  // CHAT SYSTEM
  // =========================

  bot.on('chat', (username, message) => {
    if (username === bot.username) return

    const msg = message.toLowerCase().trim()

    if (msg === 'hi' || msg === 'hello' || msg === 'hey') {
      bot.chat(`Hello ${username}!`)
      return
    }

    if (msg === 'pvp' ||
        msg === 'pvp aaja' ||
        msg === 'fight') {

      const player = bot.players[username]

      if (player && player.entity) {
        bot.chat(`Aaja ${username}, PvP!`)
        attackEntity(player.entity)
      } else {
        bot.chat(`${username}, tum mujhe dikh nahi rahe ho.`)
      }

      return
    }

    if (msg === 'stop' || msg === 'pvp stop') {
      stopAttack()
      bot.chat('Theek hai, PvP stop.')
      return
    }

    if (msg.includes('kaun ho') ||
        msg.includes('who are you')) {

      bot.chat('Main Stealbot hoon!')
      return
    }

    if (msg.includes('kya kar rahe') ||
        msg.includes('what are you doing')) {

      bot.chat('Main server me players aur mobs dekh raha hoon.')
      return
    }

    if (msg.includes('help')) {
      bot.chat('Commands: pvp, pvp aaja, pvp stop')
      return
    }
  })

  // =========================
  // PLAYER ATTACK DETECTION
  // =========================

  bot.on('entityHurt', (entity) => {
    if (!bot.entity) return
    if (entity !== bot.entity) return

    const attacker = nearestPlayer(8)

    if (attacker) {
      bot.chat(`Oye ${attacker.username}, PvP aaja!`)
      attackEntity(attacker)
    }
  })

  // =========================
  // AUTO MOB KILL
  // =========================

  setInterval(() => {
    if (!bot || !bot.entity) return

    // Player ko mobs se priority
    const player = nearestPlayer(6)

    if (player) return

    const mob = nearestHostileMob(10)

    if (mob) {
      attackEntity(mob)
    }
  }, 3000)

  // =========================
  // DEATH / RESPAWN
  // =========================

  bot.on('death', () => {
    console.log('Stealbot mar gaya...')
    stopAttack()
  })

  bot.on('respawn', () => {
    console.log('Stealbot respawn ho gaya!')
  })

  // =========================
  // KICK
  // =========================

  bot.on('kicked', (reason) => {
    console.log('==============================')
    console.log('BOT KICK HUA!')
    console.log('Kick reason:')
    console.log(reason)
    console.log('==============================')
  })

  // =========================
  // ERROR
  // =========================

  bot.on('error', (err) => {
    console.log('Error:', err.message)
  })

  // =========================
  // AUTO RECONNECT
  // =========================

  bot.on('end', (reason) => {
    console.log('==============================')
    console.log('Bot disconnect ho gaya.')
    console.log('Reason:', reason)
    console.log('10 seconds baad reconnect hoga...')
    console.log('==============================')

    reconnectTimer = setTimeout(() => {
      startBot()
    }, 10000)
  })
}


// =======================================
// SIMPLE MINEFLAYER ATTACK SYSTEM
// =======================================

function attackEntity(target) {

  if (!bot) return
  if (!target) return
  if (!target.position) return

  let attacking = true

  const attackLoop = setInterval(() => {

    if (!bot ||
        !bot.entity ||
        !target ||
        !target.position ||
        !attacking) {

      clearInterval(attackLoop)
      return
    }

    const distance =
      bot.entity.position.distanceTo(target.position)

    // Target door hai
    if (distance > 4) {

      moveTowards(target)

    } else {

      try {

        bot.lookAt(
          target.position.offset(0, 1, 0),
          true
        )

        bot.attack(target)

      } catch (err) {

        // Target disappear ho gaya
      }
    }

    if (target.isValid === false) {

      attacking = false
      clearInterval(attackLoop)
    }

  }, 500)

  // 20 seconds ke baad attack stop
  setTimeout(() => {

    attacking = false
    clearInterval(attackLoop)

    stopAttack()

  }, 20000)
}


// =======================================
// STOP MOVEMENT
// =======================================

function stopAttack() {

  if (!bot) return

  try {

    bot.clearControlStates()

  } catch (err) {

  }
}


// =======================================
// TARGET KI TARAF MOVE
// =======================================

function moveTowards(target) {

  if (!bot) return
  if (!bot.entity) return
  if (!target.position) return

  const dx =
    target.position.x -
    bot.entity.position.x

  const dz =
    target.position.z -
    bot.entity.position.z

  // Left / Right
  if (Math.abs(dx) > 0.5) {

    bot.setControlState(
      'left',
      dx < 0
    )

    bot.setControlState(
      'right',
      dxconst mineflayer = require('mineflayer')

const HOST = 'StealMCs2.aternos.me'
const PORT = 31949
const BOT_NAME = 'Stealbot'
const VERSION = '1.21.4'

const PASSWORD = 'Stealbot123'

let bot
let reconnectTimer

function startBot() {
  if (reconnectTimer) clearTimeout(reconnectTimer)

  console.log('Stealbot server se connect ho raha hai...')

  bot = mineflayer.createBot({
    host: HOST,
    port: PORT,
    username: BOT_NAME,
    version: VERSION,
    auth: 'offline'
  })

  bot.once('spawn', () => {
    console.log('Stealbot server me aa gaya!')

    // Register
    setTimeout(() => {
      bot.chat(`/register ${PASSWORD} ${PASSWORD}`)
    }, 1500)

    // Login
    setTimeout(() => {
      bot.chat(`/login ${PASSWORD}`)
    }, 3500)
  })

  // =========================
  // CHAT SYSTEM
  // =========================

  bot.on('chat', (username, message) => {
    if (username === bot.username) return

    const msg = message.toLowerCase().trim()

    if (msg === 'hi' || msg === 'hello' || msg === 'hey') {
      bot.chat(`Hello ${username}!`)
      return
    }

    if (msg === 'pvp' ||
        msg === 'pvp aaja' ||
        msg === 'fight') {

      const player = bot.players[username]

      if (player && player.entity) {
        bot.chat(`Aaja ${username}, PvP!`)
        attackEntity(player.entity)
      } else {
        bot.chat(`${username}, tum mujhe dikh nahi rahe ho.`)
      }

      return
    }

    if (msg === 'stop' || msg === 'pvp stop') {
      stopAttack()
      bot.chat('Theek hai, PvP stop.')
      return
    }

    if (msg.includes('kaun ho') ||
        msg.includes('who are you')) {

      bot.chat('Main Stealbot hoon!')
      return
    }

    if (msg.includes('kya kar rahe') ||
        msg.includes('what are you doing')) {

      bot.chat('Main server me players aur mobs dekh raha hoon.')
      return
    }

    if (msg.includes('help')) {
      bot.chat('Commands: pvp, pvp aaja, pvp stop')
      return
    }
  })

  // =========================
  // PLAYER ATTACK DETECTION
  // =========================

  bot.on('entityHurt', (entity) => {
    if (!bot.entity) return
    if (entity !== bot.entity) return

    const attacker = nearestPlayer(8)

    if (attacker) {
      bot.chat(`Oye ${attacker.username}, PvP aaja!`)
      attackEntity(attacker)
    }
  })

  // =========================
  // AUTO MOB KILL
  // =========================

  setInterval(() => {
    if (!bot || !bot.entity) return

    // Player ko mobs se priority
    const player = nearestPlayer(6)

    if (player) return

    const mob = nearestHostileMob(10)

    if (mob) {
      attackEntity(mob)
    }
  }, 3000)

  // =========================
  // DEATH / RESPAWN
  // =========================

  bot.on('death', () => {
    console.log('Stealbot mar gaya...')
    stopAttack()
  })

  bot.on('respawn', () => {
    console.log('Stealbot respawn ho gaya!')
  })

  // =========================
  // KICK
  // =========================

  bot.on('kicked', (reason) => {
    console.log('==============================')
    console.log('BOT KICK HUA!')
    console.log('Kick reason:')
    console.log(reason)
    console.log('==============================')
  })

  // =========================
  // ERROR
  // =========================

  bot.on('error', (err) => {
    console.log('Error:', err.message)
  })

  // =========================
  // AUTO RECONNECT
  // =========================

  bot.on('end', (reason) => {
    console.log('==============================')
    console.log('Bot disconnect ho gaya.')
    console.log('Reason:', reason)
    console.log('10 seconds baad reconnect hoga...')
    console.log('==============================')

    reconnectTimer = setTimeout(() => {
      startBot()
    }, 10000)
  })
}


// =======================================
// SIMPLE MINEFLAYER ATTACK SYSTEM
// =======================================

function attackEntity(target) {

  if (!bot) return
  if (!target) return
  if (!target.position) return

  let attacking = true

  const attackLoop = setInterval(() => {

    if (!bot ||
        !bot.entity ||
        !target ||
        !target.position ||
        !attacking) {

      clearInterval(attackLoop)
      return
    }

    const distance =
      bot.entity.position.distanceTo(target.position)

    // Target door hai
    if (distance > 4) {

      moveTowards(target)

    } else {

      try {

        bot.lookAt(
          target.position.offset(0, 1, 0),
          true
        )

        bot.attack(target)

      } catch (err) {

        // Target disappear ho gaya
      }
    }

    if (target.isValid === false) {

      attacking = false
      clearInterval(attackLoop)
    }

  }, 500)

  // 20 seconds ke baad attack stop
  setTimeout(() => {

    attacking = false
    clearInterval(attackLoop)

    stopAttack()

  }, 20000)
}


// =======================================
// STOP MOVEMENT
// =======================================

function stopAttack() {

  if (!bot) return

  try {

    bot.clearControlStates()

  } catch (err) {

  }
}


// =======================================
// TARGET KI TARAF MOVE
// =======================================

function moveTowards(target) {

  if (!bot) return
  if (!bot.entity) return
  if (!target.position) return

  const dx =
    target.position.x -
    bot.entity.position.x

  const dz =
    target.position.z -
    bot.entity.position.z

  // Left / Right
  if (Math.abs(dx) > 0.5) {

    bot.setControlState(
      'left',
      dx < 0
    )

    bot.setControlState(
      'right',
      dx > 0
    )

  } else {

    bot.setControlState('left', false)
    bot.setControlState('right', false)
  }

  // Forward
  if (Math.abs(dz) > 0.5) {

    bot.setControlState(
      'forward',
      true
    )

  } else {

    bot.setControlState(
      'forward',
      false
    )
  }

  // Sprint
  bot.setControlState(
    'sprint',
    true
  )

  // Jump
  if (
    target.position.y >
    bot.entity.position.y + 0.8
  ) {

    bot.setControlState(
      'jump',
      true
    )

  } else {

    bot.setControlState(
      'jump',
      false
    )
  }
}


// =======================================
// NEAREST PLAYER
// =======================================

function nearestPlayer(maxDistance) {

  if (!bot) return null
  if (!bot.entity) return null

  let nearest = null
  let distance = maxDistance

  for (const username in bot.players) {

    if (username === bot.username)
      continue

    const player =
      bot.players[username]

    if (!player)
      continue

    if (!player.entity)
      continue

    const d =
      bot.entity.position.distanceTo(
        player.entity.position
      )

    if (d < distance) {

      distance = d
      nearest = player.entity
    }
  }

  return nearest
}


// =======================================
// NEAREST HOSTILE MOB
// =======================================

function nearestHostileMob(maxDistance) {

  if (!bot) return null
  if (!bot.entity) return null

  const hostile = [

    'zombie',
    'husk',
    'drowned',

    'skeleton',
    'stray',

    'creeper',

    'spider',
    'cave_spider',

    'witch',

    'pillager',
    'vindicator',
    'evoker',
    'vex',

    'phantom',

    'slime',
    'magma_cube',

    'blaze',

    'guardian',
    'elder_guardian',

    'piglin',
    'piglin_brute',

    'hoglin',
    'zoglin',

    'enderman',

    'silverfish',
    'endermite',

    'shulker',

    'warden'
  ]

  let nearest = null
  let distance = maxDistance

  for (const id in bot.entities) {

    const entity =
      bot.entities[id]

    if (!entity)
      continue

    if (!entity.name)
      continue

    if (!hostile.includes(entity.name))
      continue

    if (!entity.position)
      continue

    const d =
      bot.entity.position.distanceTo(
        entity.position
      )

    if (d < distance) {

      distance = d
      nearest = entity
    }
  }

  return nearest
}


// =======================================
// ERROR PROTECTION
// =======================================

process.on(
  'uncaughtException',
  (err) => {

    console.log(
      'Uncaught error:',
      err.message
    )
  }
)

process.on(
  'unhandledRejection',
  (err) => {

    console.log(
      'Unhandled rejection:',
      err
    )
  }
)


// =======================================
// START BOT
// =======================================

startBot()￼Enter > 0
    )

  } else {

t.setControlState('left', false)
    bot.setControlState('right', false)
  }

  // Forward
  if (Math.abs(dz) > 0.5) {

    bot.setControlState(
      'forward',
      true
    )

  } else {

    bot.setControlState(
      'forward',
      false
    )
  }

  // Sprint
  bot.setControlState(
    'sprint',
    true
  )

  // Jump
  if (
    target.position.y >
    bot.entity.position.y + 0.8
  ) {

    bot.setControlState(
      'jump',
      true
    )

  } else {

    bot.setControlState(
      'jump',
      false
    )
  }
}


// =======================================
// NEAREST PLAYER
// =======================================

function nearestPlayer(maxDistance) {

  if (!bot) return null
  if (!bot.entity) return null

  let nearest = null
  let distance = maxDistance

  for (const username in bot.players) {

    if (username === bot.username)
      continue

    const player =
      bot.players[username]

    if (!player)
      continue

    if (!player.entity)
      continue

    const d =
      bot.entity.position.distanceTo(
        player.entity.position
      )

    if (d < distance) {

      distance = d
      nearest = player.entity
    }
  }

  return nearest
}


// =======================================
// NEAREST HOSTILE MOB
// =======================================

function nearestHostileMob(maxDistance) {

  if (!bot) return null
  if (!bot.entity) return null

  const hostile = [

    'zombie',
    'husk',
    'drowned',

    'skeleton',
    'stray',
