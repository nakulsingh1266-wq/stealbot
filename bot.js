const mineflayer = require('mineflayer')

/*
================================
STEALBOT - MINEFLAYER ONLY
Minecraft: 1.21.4
================================

Required:
npm install mineflayer

Extra packages की जरूरत नहीं:
- mineflayer-pvp ❌
- mineflayer-pathfinder ❌
- minecraft-data ❌
*/

const HOST = 'StealMCs2.aternos.me'
const PORT = 31949
const VERSION = '1.21.4'

const BOT_NAME = 'Stealbot'
const PASSWORD = 'Stealbot123'

const RECONNECT_DELAY = 10000

let bot = null
let reconnectTimer = null
let combatTimer = null
let mobTimer = null

let currentTarget = null
let spawned = false


// =================================
// START BOT
// =================================

function startBot() {

  if (reconnectTimer) {
    clearTimeout(reconnectTimer)
    reconnectTimer = null
  }

  console.log('==============================')
  console.log('Stealbot start ho raha hai...')
  console.log('Server:', HOST)
  console.log('Port:', PORT)
  console.log('Version:', VERSION)
  console.log('==============================')

  bot = mineflayer.createBot({

    host: HOST,
    port: PORT,
    username: BOT_NAME,
    version: VERSION,
    auth: 'offline'

  })


  // =================================
  // SPAWN
  // =================================

  bot.once('spawn', () => {

    spawned = true

    console.log('Stealbot server me join ho gaya!')

    // REGISTER
    setTimeout(() => {

      if (!bot || !spawned) return

      bot.chat(
        `/register ${PASSWORD} ${PASSWORD}`
      )

    }, 1500)


    // LOGIN
    setTimeout(() => {

      if (!bot || !spawned) return

      bot.chat(
        `/login ${PASSWORD}`
      )

    }, 3500)


    startMobSystem()

  })


  // =================================
  // CHAT SYSTEM
  // =================================

  bot.on('chat', (username, message) => {

    if (!bot) return
    if (username === bot.username) return

    const msg =
      String(message)
        .toLowerCase()
        .trim()

    console.log(
      `[CHAT] ${username}: ${message}`
    )


    // HI
    if (
      msg === 'hi' ||
      msg === 'hello' ||
      msg === 'hey' ||
      msg === 'hii'
    ) {

      bot.chat(
        `Hello ${username}!`
      )

      return
    }


    // BOT KAUN HAI
    if (
      msg.includes('kaun ho') ||
      msg.includes('kon ho') ||
      msg.includes('who are you')
    ) {

      bot.chat(
        'Main Stealbot hoon!'
      )

      return
    }


    // HELP
    if (
      msg === 'help' ||
      msg === 'bot help'
    ) {

      bot.chat(
        'Commands: pvp, pvp aaja, pvp stop'
      )

      return
    }


    // PVP
    if (
      msg === 'pvp' ||
      msg === 'pvp aaja' ||
      msg === 'pvp aja' ||
      msg === 'fight'
    ) {

      const player =
        getPlayerEntity(username)

      if (!player) {

        bot.chat(
          `${username}, tum mujhe dikh nahi rahe ho.`
        )

        return
      }

      bot.chat(
        `Aaja ${username}, PvP!`
      )

      attackTarget(player)

      return
    }


    // STOP PVP
    if (
      msg === 'pvp stop' ||
      msg === 'stop pvp' ||
      msg === 'stop'
    ) {

      stopCombat()

      bot.chat(
        'Theek hai, PvP stop.'
      )

      return
    }


    // BOT KYA KAR RAHA HAI
    if (
      msg.includes('kya kar rahe') ||
      msg.includes('kya kr rahe') ||
      msg.includes('what are you doing')
    ) {

      bot.chat(
        'Main server me players aur mobs dekh raha hoon.'
      )

      return
    }


    // HOW ARE YOU
    if (
      msg.includes('kaise ho') ||
      msg.includes('how are you')
    ) {

      bot.chat(
        'Main bilkul theek hoon!'
      )

      return
    }


    // BOT NAME
    if (
      msg.includes('naam kya') ||
      msg.includes('name kya') ||
      msg.includes('your name')
    ) {

      bot.chat(
        'Mera naam Stealbot hai!'
      )

      return
    }

  })


  // =================================
  // PLAYER ATTACKS BOT
  // =================================

  bot.on('entityHurt', (entity) => {

    if (!bot) return
    if (!bot.entity) return

    if (entity !== bot.entity) {
      return
    }

    const attacker =
      findNearestPlayer(8)

    if (!attacker) {
      return
    }

    const username =
      attacker.username || 'player'

    console.log(
      `${username} ne Stealbot ko hit kiya!`
    )

    bot.chat(
      `Oye ${username}, PvP aaja!`
    )

    attackTarget(attacker)

  })


  // =================================
  // DEATH
  // =================================

  bot.on('death', () => {

    console.log(
      'Stealbot mar gaya.'
    )

    stopCombat()

  })


  // =================================
  // RESPAWN
  // =================================

  bot.on('respawn', () => {

    console.log(
      'Stealbot respawn ho gaya!'
    )

  })


  // =================================
  // KICK
  // =================================

  bot.on('kicked', (reason) => {

    console.log(
      '=============================='
    )

    console.log(
      'BOT KICK HUA!'
    )

    console.log(
      'Reason:'
    )

    console.log(reason)

    console.log(
      '=============================='
    )

  })


  // =================================
  // ERROR
  // =================================

  bot.on('error', (err) => {

    console.log(
      'Mineflayer error:',
      err.message
    )

  })


  // =================================
  // DISCONNECT
  // =================================

  bot.on('end', (reason) => {

    spawned = false

    stopCombat()
    stopMobSystem()

    console.log(
      '=============================='
    )

    console.log(
      'Bot disconnect ho gaya.'
    )

    console.log(
      'Reason:',
      reason
    )

    console.log(
      '10 seconds baad reconnect hoga...'
    )

    console.log(
      '=============================='
    )


    if (!reconnectTimer) {

      reconnectTimer =
        setTimeout(() => {

          reconnectTimer = null

          startBot()

        }, RECONNECT_DELAY)

    }

  })

}


// =================================
// GET PLAYER ENTITY
// =================================

function getPlayerEntity(username) {

  if (!bot) return null
  if (!bot.players) return null

  const player =
    bot.players[username]

  if (!player) return null
  if (!player.entity) return null

  return player.entity
}


// =================================
// ATTACK TARGET
// =================================

function attackTarget(target) {

  if (!bot) return
  if (!bot.entity) return

  if (!target) return
  if (!target.position) return


  stopCombat()

  currentTarget = target


  combatTimer =
    setInterval(() => {

      if (!bot || !bot.entity) {

        stopCombat()

        return
      }


      if (
        !currentTarget ||
        !currentTarget.position
      ) {

        stopCombat()

        return
      }


      if (
        currentTarget.isValid === false
      ) {

        stopCombat()

        return
      }


      const distance =
        bot.entity.position.distanceTo(
          currentTarget.position
        )


      // TARGET DOOR HAI
      if (distance > 4.2) {

        moveTowardsTarget(
          currentTarget
        )

        return
      }


      // TARGET PAAS HAI
      clearMovement()


      try {

        bot.lookAt(
          currentTarget.position.offset(
            0,
            1,
            0
          ),
          true
        )

        bot.attack(
          currentTarget
        )

      } catch (err) {

        // Target disappear hone par ignore

      }

    }, 450)


  // Maximum 20 seconds fight
  setTimeout(() => {

    if (
      currentTarget === target
    ) {

      stopCombat()

    }

  }, 20000)

}


// =================================
// MOVE TOWARDS TARGET
// =================================

function moveTowardsTarget(target) {

  if (!bot) return
  if (!bot.entity) return

  if (!target) return
  if (!target.position) return


  const botPos =
    bot.entity.position

  const targetPos =
    target.position


  const dx =
    targetPos.x -
    botPos.x

  const dz =
    targetPos.z -
    botPos.z


  const distanceXZ =
    Math.sqrt(
      (dx * dx) +
      (dz * dz)
    )


  if (distanceXZ < 0.8) {

    clearMovement()

    return
  }


  // TARGET KI TARAF LOOK
  const yaw =
    Math.atan2(
      -dx,
      -dz
    )


  try {

    bot.look(
      yaw,
      0,
      true
    )

  } catch (err) {}


  bot.setControlState(
    'forward',
    true
  )


  bot.setControlState(
    'sprint',
    distanceXZ > 2.5
  )


  // SIMPLE JUMP
  if (
    targetPos.y >
    botPos.y + 0.8
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


// =================================
// STOP COMBAT
// =================================

function stopCombat() {

  if (combatTimer) {

    clearInterval(
      combatTimer
    )

    combatTimer = null
  }


  currentTarget = null

  clearMovement()

}


// =================================
// CLEAR MOVEMENT
// =================================

function clearMovement() {

  if (!bot) return


  try {

    bot.setControlState(
      'forward',
      false
    )

    bot.setControlState(
      'back',
      false
    )

    bot.setControlState(
      'left',
      false
    )

    bot.setControlState(
      'right',
      false
    )

    bot.setControlState(
      'jump',
      false
    )

    bot.setControlState(
      'sprint',
      false
    )

    bot.setControlState(
      'sneak',
      false
    )

  } catch (err) {}

}


// =================================
// FIND NEAREST PLAYER
// =================================

function findNearestPlayer(maxDistance) {

  if (!bot) return null
  if (!bot.entity) return null


  let nearest = null

  let nearestDistance =
    maxDistance


  for (
    const username in bot.players
  ) {

    if (
      username === bot.username
    ) {

      continue
    }


    const player =
      bot.players[username]


    if (!player) continue
    if (!player.entity) continue


    const distance =
      bot.entity.position.distanceTo(
        player.entity.position
      )


    if (
      distance < nearestDistance
    ) {

      nearestDistance =
        distance

      nearest =
        player.entity

    }

  }


  return nearest
}


// =================================
// HOSTILE MOBS
// =================================

const HOSTILE_MOBS =
  new Set([

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

  ])


// =================================
// FIND NEAREST MOB
// =================================

function findNearestHostileMob(
  maxDistance
) {

  if (!bot) return null
  if (!bot.entity) return null


  let nearest = null

  let nearestDistance =
    maxDistance


  for (
    const id in bot.entities
  ) {

    const entity =
      bot.entities[id]


    if (!entity) continue
    if (!entity.name) continue
    if (!entity.position) continue


    if (
      !HOSTILE_MOBS.has(
        entity.name
      )
    ) {

      continue
    }


    const distance =
      bot.entity.position.distanceTo(
        entity.position
      )


    if (
      distance < nearestDistance
    ) {

      nearestDistance =
        distance

      nearest =
        entity

    }

  }


  return nearest
}


// =================================
// AUTO MOB SYSTEM
// =================================

function startMobSystem() {

  stopMobSystem()


  mobTimer =
    setInterval(() => {

      if (
        !bot ||
        !bot.entity ||
        !spawned
      ) {

        return
      }


      // PvP chal raha ho to mob attack nahi
      if (currentTarget) {
        return
      }


      // Player paas hai to automatic
      // player attack nahi karega
      const player =
        findNearestPlayer(6)


      if (player) {
        return
      }


      const mob =
        findNearestHostileMob(10)


      if (mob) {

        console.log(
          `Nearby mob mila: ${mob.name}`
        )

        attackTarget(mob)

      }

    }, 3000)

}


// =================================
// STOP MOB SYSTEM
// =================================

function stopMobSystem() {

  if (mobTimer) {

    clearInterval(
      mobTimer
    )

    mobTimer = null

  }

}


// =================================
// ERROR PROTECTION
// =================================

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


// =================================
// START
// =================================

startBot()
