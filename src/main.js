
// pega o canvas e cria o contexto 2d pra desenhar ele
const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')


// variaveis pra largura e altura do jogo
const width = 1000
const height = 500
canvas.width = width
canvas.height = height

// outras configs do jogo

const enemySpeed = 4
const enemyDistance = 250
const enemySize = 55
const playerJump = 5
const gravity = 0.3

let debug = false

let score = 0
let hScore = localStorage.getItem('hScore') ? localStorage.getItem('hScore') : 0

let paused = false
let keyDown = false

// pra que não reuzar o mesmo elemento de imagem da logo? kkkkkk
const pexeSprite = document.getElementById('pexe')

const enemySprite = new Image()
enemySprite.src = 'assets/pexe2.png'

let player
let enemys
let updateInterval
window.addEvent)
function play() {
    canvas.style.display = 'block'
    document.getElementById('homeScreen').style.display = "none"
    document.getElementById('gameOverScreen').style.display = 'none'
    if (mobileCheck()) {
        document.body.requestFullscreen()
    }
    player = new Player()
    paused = false
    score = 0
    enemys = []
    EnemyWave()
    updateInterval = setInterval(update, 1000/60)
    
}

let times = []
let fps

function update() {

    if (!paused) {
        // medidor de fps copiado do stackoverflow
        const now = performance.now()
        while (times.length > 0 && times[0] <= now - 1000) {
            times.shift()
        }
        times.push(now)
        fps = times.length

        if (enemys[enemys.length-1].x < (width - enemyDistance)) {
            EnemyWave()
        }

        for (let i = 0; i < enemys.length; i++) {
            let enemy = enemys[i]
            if (checkCollision(player,enemy)) {
                gameOver()
            }
            enemy.update()

            // remover o obstaculo se ele sair da tela
            if (enemy.x+enemy.width < 0) {
                enemys.splice(i,1)
                score += 1
                i--
            }
        }
        player.update()

    }
    render()
}
function render() {
        ctx.fillStyle = "#3f8adb"
        ctx.fillRect(0,0,canvas.width,canvas.height)
        for (let i = 0; i < enemys.length; i++) {
            enemys[i].render()
        }
        player.render()
        // rendenizar a pontuação
        ctx.fillStyle = "black"
        ctx.font = '15px Monospace'
        ctx.textAlign = "left";
        ctx.fillText(`Score: ${score}`, 10, 25)
        ctx.fillText(`High Score: ${hScore}`, 10, 45)
        ctx.fillText(`${fps} fps`, 10, 70)
        if (paused) {
            ctx.fillStyle = "black"
            ctx.font = '40px Monospace'
            ctx.textAlign = "center";
            ctx.fillText('Pexe pausado', canvas.width/2, canvas.height / 2)

        }
}

window.addEventListener('blur', function() {
    paused = true
})
window.addEventListener('keydown', function (e) {
    // pausa o jogo com "p"
    if (e.key == "p") {
        paused = !paused
        return
    }
    keyDown = true
})
window.addEventListener('keyup', function (e) {
    if (e.key == "p") {
        return
    }
    keyDown = false
})
window.addEventListener('pointerdown', function (e) {
    keyDown = true
})
window.addEventListener('pointerup', function (e) {
    keyDown = false
    paused = false
})

function gameOver() {
    player.img = document.getElementById("pexe-morto")
    render()
    clearInterval(updateInterval)
    if (hScore < score) {
        hScore = score
        localStorage.setItem('hScore', hScore)
    }
    document.getElementById('gameOverScreen').style.display = 'block'
    document.getElementById('play-again').focus()
}
