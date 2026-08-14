const mineflayer = require('mineflayer')

/*
====================================================
STEALBOT - STRONG JUMP + WALK
Minecraft 1.21.4
====================================================

Removed:
- Mob killing
- Bot chat replies
- PvP/combat

Added:
- Register/Login
- Automatic reconnect
- Strong Walk + Jump
- Random direction changes
- Respawn movement restart
====================================================
*/

const HOST = 'StealMCs2.aternos.me'
const PORT = 31949
const VERSION = '1.21.4'

const BOT_NAME = 'Stealbot'
const PASSWORD = 'Stealbot123'

const RECONNECT_DELAY = 10000
const LOGIN_DELAY = 3500
const MOVEMENT_START_DELAY = 5500

const WALK_DURATION = 6500
const PAUSE_DURATION = 1000

const JUMP_MIN = 1800
const JUMP_MAX = 3200

const TURN_MIN = 4500
const TURN_MAX = 8500

let bot = null

let reconnectTimer = null
let movementTimer = null
let jumpTimer = null
let turnTimer = null

let jumpTimeout = null
let sideTimeout = null

let spawned = false
let walking = false
let reconnecting = false


// ================================================
// START BOT
// ================================================

function startBot() {

  if (reconnectTimer) {
    clearTimeout(reconnectTimer)
    reconnectTimer = null
  }

  stopMovement()

  console.log('================================')
  console.log('Stealbot START')
  console.log('Server:', HOST)
  console.log('Port:', PORT)
  console.log('Version:', VERSION)
  console.log('================================')


  bot = mineflayer.createBot({

    host: HOST,
    port: PORT,

    username: BOT_NAME,

    version: VERSION,

    auth: 'offline'

  })


  // ==============================================
  // SPAWN
  // ==============================================

  bot.once('spawn', () => {

    spawned = true
    reconnecting = false

    console.log(
      'Stealbot server me join ho gaya!'
    )


    // REGISTER

    setTimeout(() => {

      if (!isReady()) return

      try {

        bot.chat(
          `/register ${PASSWORD} ${PASSWORD}`
        )

        console.log(
          'Register command sent.'
        )

      } catch (err) {

        console.log(
          'Register error:',
          err.message
        )

      }

    }, 1500)


    // LOGIN

    setTimeout(() => {

      if (!isReady()) return

      try {

        bot.chat(
          `/login ${PASSWORD}`
        )

        console.log(
          'Login command sent.'
        )

      } catch (err) {

        console.log(
          'Login error:',
          err.message
        )

      }

    }, LOGIN_DELAY)


    // START MOVEMENT

    setTimeout(() => {

      if (!isReady()) return

      startMovement()

    }, MOVEMENT_START_DELAY)

  })


  // ==============================================
  // DEATH
  // ==============================================

  bot.on('death', () => {

    console.log(
      'Stealbot mar gaya.'
    )

    console.log(
      'Respawn ka wait...'
    )

    stopMovement()

  })


  // ==============================================
  // RESPAWN
  // ==============================================

  bot.on('respawn', () => {

    console.log(
      'Stealbot respawn ho gaya!'
    )


    setTimeout(() => {

      if (!isReady()) return

      startMovement()

    }, 2500)

  })


  // ==============================================
  // KICK
  // ==============================================

  bot.on('kicked', (reason) => {

    console.log(
      '================================'
    )

    console.log(
      'BOT KICK HUA'
    )

    console.log(
      'Reason:',
      reason
    )

    console.log(
      '================================'
    )

  })


  // ==============================================
  // ERROR
  // ==============================================

  bot.on('error', (err) => {

    console.log(
      'Mineflayer error:',
      err.message
    )

  })


  // ==============================================
  // DISCONNECT
  // ==============================================

  bot.on('end', (reason) => {

    spawned = false

    stopMovement()


    console.log(
      '================================'
    )

    console.log(
      'Bot disconnect ho gaya.'
    )

    console.log(
      'Reason:',
      reason
    )

    console.log(
      'Reconnect schedule ho raha hai...'
    )

    console.log(
      '================================'
    )


    scheduleReconnect()

  })

}


// ================================================
// READY CHECK
// ================================================

function isReady() {

  return !!(

    bot &&

    bot.entity &&

    spawned

  )

}


// ================================================
// RECONNECT
// ================================================

function scheduleReconnect() {

  if (
    reconnectTimer ||
    reconnecting
  ) {

    return

  }


  reconnecting = true


  reconnectTimer = setTimeout(() => {

    reconnectTimer = null

    reconnecting = false

    startBot()

  }, RECONNECT_DELAY)

}


// ================================================
// STRONG MOVEMENT SYSTEM
// ================================================

function startMovement() {

  stopMovement()


  if (!isReady()) return


  walking = true


  console.log(
    '================================'
  )

  console.log(
    'JUMP + WALK SYSTEM ON'
  )

  console.log(
    '================================'
  )


  // ----------------------------------------------
  // MAIN WALK CYCLE
  // ----------------------------------------------

  movementTimer = setInterval(() => {

    if (!isReady()) return


    if (walking) {

      stopSideMovement()


      bot.setControlState(
        'forward',
        true
      )


      bot.setControlState(
        'sprint',
        false
      )


      setTimeout(() => {

        if (!isReady()) return


        bot.setControlState(
          'forward',
          false
        )


        walking = false

      }, WALK_DURATION)


    } else {

      bot.setControlState(
        'forward',
        true
      )


      walking = true

    }

  }, WALK_DURATION + PAUSE_DURATION)


  // ----------------------------------------------
  // START WALKING IMMEDIATELY
  // ----------------------------------------------

  bot.setControlState(
    'forward',
    true
  )


  bot.setControlState(
    'sprint',
    false
  )


  // ----------------------------------------------
  // START JUMP SYSTEM
  // ----------------------------------------------

  scheduleJump()


  // ----------------------------------------------
  // START TURN SYSTEM
  // ----------------------------------------------

  scheduleTurn()

}


// ================================================
// RANDOM JUMP
// ================================================

function scheduleJump() {

  if (!isReady()) return


  const delay =

    JUMP_MIN +

    Math.floor(

      Math.random() *

      (
        JUMP_MAX -
        JUMP_MIN
      )

    )


  jumpTimer = setTimeout(() => {

    if (!isReady()) return


    try {

      bot.setControlState(
        'jump',
        true
      )


      jumpTimeout = setTimeout(() => {

        if (!bot) return


        try {

          bot.setControlState(
            'jump',
            false
          )

        } catch (err) {}

      }, 300)


    } catch (err) {}


    scheduleJump()


  }, delay)

}


// ================================================
// RANDOM TURN
// ================================================

function scheduleTurn() {

  if (!isReady()) return


  const delay =

    TURN_MIN +

    Math.floor(

      Math.random() *

      (
        TURN_MAX -
        TURN_MIN
      )

    )


  turnTimer = setTimeout(() => {

    if (!isReady()) return


    randomTurn()


    scheduleTurn()


  }, delay)

}


// ================================================
// CHANGE DIRECTION
// ================================================

function randomTurn() {

  if (!isReady()) return


  const amount =

    (
      Math.random() * 1.8
    ) -

    0.9


  try {

    bot.look(

      bot.entity.yaw +
      amount,

      0,

      true

    )

  } catch (err) {}


  // Random side movement

  const side =

    Math.random() < 0.5

      ? 'left'

      : 'right'


  try {

    bot.setControlState(
      side,
      true
    )


    sideTimeout = setTimeout(() => {

      if (!bot) return


      try {

        bot.setControlState(
          side,
          false
        )

      } catch (err) {}

    }, 350)


  } catch (err) {}

}


// ================================================
// STOP SIDE MOVEMENT
// ================================================

function stopSideMovement() {

  if (!bot) return


  try {

    bot.setControlState(
      'left',
      false
    )


    bot.setControlState(
      'right',
      false
    )

  } catch (err) {}

}


// ================================================
// STOP MOVEMENT
// ================================================

function stopMovement() {

  if (movementTimer) {

    clearInterval(
      movementTimer
    )

    movementTimer = null

  }


  if (jumpTimer) {

    clearTimeout(
      jumpTimer
    )

    jumpTimer = null

  }


  if (turnTimer) {

    clearTimeout(
      turnTimer
    )

    turnTimer = null

  }


  if (jumpTimeout) {

    clearTimeout(
      jumpTimeout
    )

    jumpTimeout = null

  }


  if (sideTimeout) {

    clearTimeout(
      sideTimeout
    )

    sideTimeout = null

  }


  walking = false


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


// ================================================
// ERROR PROTECTION
// ================================================

process.on(
  'uncaughtException',
  (err) => {

    console.log(
      'Uncaught error:',
      err.message
    )


    if (!reconnectTimer) {

      spawned = false

      stopMovement()

      scheduleReconnect()

    }

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


// ================================================
// START
// ================================================

startBot()
