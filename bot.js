const mineflayer = require('mineflayer')

/*
========================================================
STEALBOT - SIMPLE PLAYER STYLE
Minecraft: 1.21.4
Owner: NT_Gamer56

ONLY REQUIRED PACKAGE:
npm install mineflayer
========================================================
*/

const HOST = 'StealMCs2.aternos.me'
const PORT = 31949
const VERSION = '1.21.4'

const BOT_NAME = 'Stealbot'
const PASSWORD = 'Stealbot123'
const OWNER = 'NT_Gamer56'

const RECONNECT_DELAY = 10000

let bot = null
let reconnectTimer = null
let spawned = false

let currentTarget = null
let combatTimer = null
let wanderTimer = null
let mineTimer = null

let followingOwner = false
let grinding = false
let mining = false


// ======================================================
// START BOT
// ======================================================

function startBot() {

  if (reconnectTimer) {
    clearTimeout(reconnectTimer)
    reconnectTimer = null
  }

  console.log('================================')
  console.log('STEALBOT START HO RAHA HAI')
  console.log('SERVER:', HOST)
  console.log('PORT:', PORT)
  console.log('VERSION:', VERSION)
  console.log('OWNER:', OWNER)
  console.log('================================')

  try {

    bot = mineflayer.createBot({
      host: HOST,
      port: PORT,
      username: BOT_NAME,
      version: VERSION,
      auth: 'offline'
    })

  } catch (err) {

    console.log('Bot create error:', err.message)
    scheduleReconnect()
    return
  }


  // ====================================================
  // SPAWN
  // ====================================================

  bot.once('spawn', () => {

    spawned = true

    console.log(
      'Stealbot server me join ho gaya!'
    )


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

  })


  // ====================================================
  // CHAT
  // ====================================================

  bot.on('chat', (username, message) => {

    if (!bot) return
    if (username === bot.username) return

    console.log(
      `[CHAT] ${username}: ${message}`
    )


    if (username === OWNER) {

      ownerCommand(
        String(message).trim()
      )

      return
    }


    normalChat(
      username,
      String(message)
    )

  })


  // ====================================================
  // BOT HIT
  // ====================================================

  bot.on('entityHurt', entity => {

    if (!bot || !bot.entity) return

    if (entity !== bot.entity) return

    const attacker =
      findNearestPlayer(8)

    if (!attacker) return

    const username =
      attacker.username || 'player'

    console.log(
      `${username} ne Stealbot ko hit kiya!`
    )

    bot.chat(
      `Oye ${username}, PvP aaja!`
    )

    startPvP(attacker)

  })


  // ====================================================
  // DEATH
  // ====================================================

  bot.on('death', () => {

    console.log(
      'Stealbot mar gaya.'
    )

    stopAll()

  })


  // ====================================================
  // RESPAWN
  // ====================================================

  bot.on('respawn', () => {

    console.log(
      'Stealbot respawn ho gaya!'
    )

  })


  // ====================================================
  // KICK
  // ====================================================

  bot.on('kicked', reason => {

    console.log(
      'BOT KICK HUA!'
    )

    console.log(
      'Reason:',
      reason
    )

  })


  // ====================================================
  // ERROR
  // ====================================================

  bot.on('error', err => {

    console.log(
      'Mineflayer error:',
      err.message
    )

  })


  // ====================================================
  // DISCONNECT
  // ====================================================

  bot.on('end', reason => {

    spawned = false

    stopAll()

    console.log(
      'Bot disconnect ho gaya.'
    )

    console.log(
      'Reason:',
      reason
    )

    console.log(
      '10 second baad reconnect hoga...'
    )

    scheduleReconnect()

  })

}


// ======================================================
// RECONNECT
// ======================================================

function scheduleReconnect() {

  if (reconnectTimer) return

  reconnectTimer =
    setTimeout(() => {

      reconnectTimer = null

      startBot()

    }, RECONNECT_DELAY)

}


// ======================================================
// NORMAL CHAT
// ======================================================

function normalChat(
  username,
  message
) {

  const msg =
    message
      .toLowerCase()
      .trim()


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


  if (
    msg.includes('naam kya') ||
    msg.includes('your name')
  ) {

    bot.chat(
      'Mera naam Stealbot hai!'
    )

    return
  }


  if (
    msg === 'help' ||
    msg === 'bot help'
  ) {

    bot.chat(
      'Mere owner NT_Gamer56 hain.'
    )

  }

}


// ======================================================
// OWNER COMMANDS
// ======================================================

function ownerCommand(raw) {

  const msg =
    raw
      .toLowerCase()
      .trim()


  // STOP

  if (
    msg === 'stop' ||
    msg === 'ruk' ||
    msg === 'ruko' ||
    msg === 'pvp stop' ||
    msg === 'stop pvp'
  ) {

    stopAll()

    bot.chat(
      'Theek hai NT_Gamer56, sab kaam rok diya.'
    )

    return
  }


  // IDHAR AA

  if (
    msg.includes('idhar aa') ||
    msg.includes('idhar a') ||
    msg.includes('mere paas aa') ||
    msg.includes('mere pas aa') ||
    msg === 'come'
  ) {

    goToOwner()

    return
  }


  // FOLLOW

  if (
    msg.includes('mere peeche aa') ||
    msg.includes('mere piche aa') ||
    msg === 'follow'
  ) {

    followOwner()

    return
  }


  // JUMP

  if (
    msg === 'jump' ||
    msg.includes('jump kar') ||
    msg.includes('kood')
  ) {

    jump()

    bot.chat(
      'Haan NT_Gamer56, jump kar raha hoon!'
    )

    return
  }


  // WALK

  if (
    msg.includes('walk kar') ||
    msg.includes('walk karo') ||
    msg.includes('chal') ||
    msg.includes('ghoom') ||
    msg.includes('wander')
  ) {

    startWalk()

    bot.chat(
      'Theek hai NT_Gamer56, walk kar raha hoon.'
    )

    return
  }


  // PVP

  if (
    msg.includes('pvp') ||
    msg.includes('fight') ||
    msg.includes('lad')
  ) {

    const target =
      findNearestPlayer(16)

    if (!target) {

      bot.chat(
        'NT_Gamer56, aas-paas PvP target nahi mila.'
      )

      return
    }

    bot.chat(
      'Aaja! Crazy PvP start!'
    )

    startPvP(target)

    return
  }


  // BLOCK TOD

  if (
    msg.includes('block tod') ||
    msg.includes('block todna') ||
    msg.includes('mine kar') ||
    msg.includes('mining kar')
  ) {

    startMining()

    return
  }


  // GRIND

  if (
    msg.includes('grind kar') ||
    msg.includes('grinding kar') ||
    msg.includes('grind karo')
  ) {

    startGrind()

    return
  }


  // COMMAND

  if (
    msg.startsWith('command ') ||
    msg.startsWith('cmd ') ||
    msg.startsWith('/')
  ) {

    let command = raw

    if (
      command
        .toLowerCase()
        .startsWith('command ')
    ) {

      command =
        command.substring(8)

    }

    if (
      command
        .toLowerCase()
        .startsWith('cmd ')
    ) {

      command =
        command.substring(4)

    }

    command =
      command.trim()


    if (
      !command.startsWith('/')
    ) {

      command =
        '/' + command

    }


    bot.chat(command)

    return
  }


  // STATUS

  if (
    msg.includes('kya kar rahe') ||
    msg.includes('kya kr rahe')
  ) {

    bot.chat(
      'NT_Gamer56, jo aap bolenge wahi kaam karunga.'
    )

    return
  }


  // MERE PAAS

  if (
    msg.includes('mere paas') ||
    msg.includes('mere pas')
  ) {

    goToOwner()

    return
  }


  bot.chat(
    `Samajh gaya NT_Gamer56: ${raw}`
  )

}


// ======================================================
// GO TO OWNER
// ======================================================

function goToOwner() {

  followingOwner = false

  stopCombat()


  const owner =
    getPlayer(OWNER)


  if (!owner) {

    bot.chat(
      'NT_Gamer56 abhi mujhe dikh nahi rahe.'
    )

    return
  }


  bot.chat(
    'Aa raha hoon NT_Gamer56!'
  )


  moveToPosition(
    owner.position
  )

}


// ======================================================
// FOLLOW OWNER
// ======================================================

function followOwner() {

  stopCombat()

  followingOwner = true

  bot.chat(
    'Theek hai, NT_Gamer56 ke peeche aa raha hoon.'
  )


  if (wanderTimer) {

    clearInterval(
      wanderTimer
    )

    wanderTimer = null

  }


  wanderTimer =
    setInterval(() => {

      if (
        !bot ||
        !spawned ||
        !followingOwner
      )
        return


      const owner =
        getPlayer(OWNER)


      if (!owner)
        return


      const distance =
        bot.entity.position.distanceTo(
          owner.position
        )


      if (distance > 3) {

        moveToPosition(
          owner.position
        )

      } else {

        stopMovement()

      }


      if (
        distance > 5 &&
        Math.random() < 0.15
      ) {

        jump()

      }

    }, 500)

}


// ======================================================
// MOVE TO POSITION
// ======================================================

function moveToPosition(position) {

  if (
    !bot ||
    !bot.entity
  )
    return


  const botPos =
    bot.entity.position


  const dx =
    position.x -
    botPos.x


  const dz =
    position.z -
    botPos.z


  const distance =
    Math.sqrt(
      dx * dx +
      dz * dz
    )


  if (distance < 1.5) {

    stopMovement()

    return
  }


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
    distance > 5
  )


  if (
    position.y >
    botPos.y + 0.7
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


// ======================================================
// JUMP
// ======================================================

function jump() {

  if (!bot)
    return


  bot.setControlState(
    'jump',
    true
  )


  setTimeout(() => {

    if (bot) {

      bot.setControlState(
        'jump',
        false
      )

    }

  }, 400)

}


// ======================================================
// WALK
// ======================================================

function startWalk() {

  followingOwner = false

  stopCombat()


  if (wanderTimer) {

    clearInterval(
      wanderTimer
    )

  }


  function randomWalk() {

    if (
      !bot ||
      !spawned
    )
      return


    const yaw =
      Math.random() *
      Math.PI *
      2


    const distance =
      5 +
      Math.random() * 8


    const pos =
      bot.entity.position


    const dx =
      Math.cos(yaw) *
      distance


    const dz =
      Math.sin(yaw) *
      distance


    const target = {

      x:
        pos.x + dx,

      y:
        pos.y,

      z:
        pos.z + dz

    }


    moveToPosition(
      target
    )


    if (
      Math.random() < 0.25
    ) {

      jump()

    }

  }


  randomWalk()


  wanderTimer =
    setInterval(
      randomWalk,
      6000
    )

}


// ======================================================
// MINING
// ======================================================

async function startMining() {

  if (
    !bot ||
    !bot.entity ||
    mining
  )
    return


  mining = true

  followingOwner = false

  stopCombat()


  const block =
    bot.findBlock({

      matching: block => {

        if (!block)
          return false

        if (
          block.name === 'air'
        )
          return false

        if (
          block.name === 'water'
        )
          return false

        if (
          block.name === 'lava'
        )
          return false

        return true

      },

      maxDistance: 5

    })


  if (!block) {

    bot.chat(
      'NT_Gamer56, paas mein block nahi mila.'
    )

    mining = false

    return
  }


  try {

    await bot.lookAt(
      block.position.offset(
        0.5,
        0.5,
        0.5
      ),
      true
    )


    await bot.dig(
      block
    )


    bot.chat(
      'Block tod diya NT_Gamer56.'
    )

  } catch (err) {

    console.log(
      'Mining error:',
      err.message
    )

  }


  mining = false

}


// ======================================================
// GRIND
// ======================================================

function startGrind() {

  grinding = true

  startWalk()


  bot.chat(
    'Grind mode chalu kar diya.'
  )


  if (mineTimer) {

    clearInterval(
      mineTimer
    )

  }


  mineTimer =
    setInterval(() => {

      if (
        !bot ||
        !spawned ||
        !grinding
      )
        return


      if (
        currentTarget
      )
        return


      if (
        !mining
      ) {

        startMining()

      }

    }, 10000)

}


// ======================================================
// PVP
// ======================================================

function startPvP(target) {

  if (
    !bot ||
    !bot.entity ||
    !target
  )
    return


  stopCombat()

  followingOwner = false

  currentTarget =
    target


  function fight() {

    if (
      !bot ||
      !bot.entity ||
      !currentTarget
    )
      return


    if (
      currentTarget.isValid === false
    ) {

      stopCombat()

      return
    }


    const targetPos =
      currentTarget.position


    const botPos =
      bot.entity.position


    const dx =
      targetPos.x -
      botPos.x


    const dz =
      targetPos.z -
      botPos.z


    const distance =
      bot.entity.position.distanceTo(
        targetPos
      )


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


    if (
      distance > 3.2
    ) {

      bot.setControlState(
        'forward',
        true
      )

      bot.setControlState(
        'sprint',
        distance > 4
      )


      if (
        targetPos.y >
        botPos.y + 0.6
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

    } else {

      bot.setControlState(
        'forward',
        false
      )

      bot.setControlState(
        'sprint',
        false
      )


      if (
        Math.random() < 0.12
      ) {

        bot.setControlState(
          'left',
          true
        )

        setTimeout(() => {

          if (bot) {

            bot.setControlState(
              'left',
              false
            )

          }

        }, 250)

      }


      if (
        Math.random() < 0.15
      ) {

        jump()

      }


      try {

        bot.attack(
          currentTarget
        )

      } catch (err) {}

    }

  }


  fight()


  combatTimer =
    setInterval(
      fight,
      350
    )


  setTimeout(() => {

    if (
      currentTarget === target
    ) {

      stopCombat()

    }

  }, 30000)

}


// ======================================================
// STOP COMBAT
// ======================================================

function stopCombat() {

  if (combatTimer) {

    clearInterval(
      combatTimer
    )

    combatTimer = null

  }


  currentTarget = null

  stopMovement()

}


// ======================================================
// STOP ALL
// ======================================================

function stopAll() {

  stopCombat()

  followingOwner = false
  grinding = false
  mining = false


  if (wanderTimer) {

    clearInterval(
      wanderTimer
    )

    wanderTimer = null

  }


  if (mineTimer) {

    clearInterval(
      mineTimer
    )

    mineTimer = null

  }


  stopMovement()

}


// ======================================================
// STOP MOVEMENT
// ======================================================

function stopMovement() {

  if (!bot)
    return


  try {

    const states = [
      'forward',
      'back',
      'left',
      'right',
      'jump',
      'sprint',
      'sneak'
    ]


    for (
      const state of states
    ) {

      bot.setControlState(
        state,
        false
      )

    }

  } catch (err) {}

}


// ======================================================
// GET PLAYER
// ======================================================

function getPlayer(username) {

  if (
    !bot ||
    !bot.players
  )
    return null


  const player =
    bot.players[
      username
    ]


  if (!player)
    return null


  if (!player.entity)
    return null


  return player.entity

}


// ======================================================
// FIND NEAREST PLAYER
// ======================================================

function findNearestPlayer(
  maxDistance
) {

  if (
    !bot ||
    !bot.entity ||
    !bot.players
  )
    return null


  let nearest = null

  let nearestDistance =
    maxDistance


  for (
    const username in bot.players
  ) {

    if (
      username === bot.username
    )
      continue


    const player =
      bot.players[
        username
      ]


    if (!player)
      continue


    if (!player.entity)
      continue


    const distance =
      bot.entity.position.distanceTo(
        player.entity.position
      )


    if (
      distance <
      nearestDistance
    ) {

      nearestDistance =
        distance

      nearest =
        player.entity

    }

  }


  // YAHI TUMHARI FILE ME MISSING THA
  return nearest
}


// ======================================================
// START
// ======================================================

startBot()
