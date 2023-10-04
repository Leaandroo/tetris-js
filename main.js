import './style.css'

//1.Canvas
const canvas = document.querySelector('canvas')
const context = canvas.getContext('2d')
let puntuacion = 0
const BLOCK_SIZE = 20
const BOARD_WIDTH = 14
const BOARD_HEIGHT = 30

canvas.width = BLOCK_SIZE * BOARD_WIDTH
canvas.height = BLOCK_SIZE * BOARD_HEIGHT

context.scale(BLOCK_SIZE, BLOCK_SIZE)

//2. Board
const board = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
]

//pieza jugador
const pieza = {
    position: {x:5, y:5},
    forma:[
        [1,1],
        [1,1]
    ]   
}

const piezas = [
    [
        [1, 1],
        [1, 1]
    ],
    [
        [1, 1, 1, 1]
    ],
    [
        [0, 1, 0],
        [1, 1, 1]
    ],
    [
        [1, 1, 0],
        [0, 1, 1]
    ],
    [
        [1, 0],
        [1, 0],
        [1, 1]
    ]
]

// Game loop
let dropTimer = 0
let lastTime = 0
function update(time = 0) {
    const deltaTime = time - lastTime
    lastTime = time
    dropTimer += deltaTime

    if (dropTimer > 1000){
        pieza.position.y++
        dropTimer = 0

        if (colision()){
            pieza.position.y--
            agrupar()
            lineCompleta()
        }
    }
    
    draw()
    window.requestAnimationFrame(update)
}

function draw(){

    //dibujar canvas
    context.fillStyle = '#000'
    context.fillRect(0,0, canvas.width, canvas.height)

    //dibujar piezas en el canvas
    board.forEach((row, y) => {
        row.forEach((value, x) =>{
            if (value === 1){
                context.fillStyle = 'white'
                context.fillRect(x, y, 1, 1)
            }
        })
    })

    //dibujar jugador
    pieza.forma.forEach((row, y) => {
        row.forEach((value, x) =>{
            if (value === 1){
                context.fillStyle = 'red'
                context.fillRect(x + pieza.position.x, y + pieza.position.y, 1, 1)
            }
        });
    });
}

//mover pieza
document.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft') {
        pieza.position.x--
        if (colision()){
            pieza.position.x++
        }
    }
    if (event.key === 'ArrowRight') {
        pieza.position.x++
        if (colision()){
            pieza.position.x--
        }
    }
    if (event.key === 'ArrowDown') {
        pieza.position.y++
        if (colision()){
            pieza.position.y--
            agrupar()
            lineCompleta()
        }
    }
    //rotar piezas
    if (event.key === 'ArrowUp'){
        const rotacion = []
     
        for (let i = 0; i < pieza.forma[0].length; i++){
            const row = []

            for (let j = pieza.forma.length - 1; j >= 0; j--){
                row.push(pieza.forma[j][i])

            }

            rotacion.push(row)
        }
        const formaPrevia = pieza.forma
        pieza.forma = rotacion
        if (colision()){
            pieza.forma = formaPrevia
        }
    }
})

//colision de piezas
function colision (){
    return pieza.forma.find((row,y) =>{
        return row.find((value, x) => {
            return (
                value !== 0 && 
                board[y + pieza.position.y]?.[x + pieza.position.x] !== 0
            )
        })
    })
}

//Agrupar piezas
function agrupar (){
    pieza.forma.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value === 1) {
                board[y + pieza.position.y][x + pieza.position.x] = 1
            }
        })
    })

    pieza.position.x = 0
    pieza.position.y = 0
    pieza.forma = piezas[Math.floor(Math.random()* piezas.length)]

    if (colision()){
        window.alert('Juego terminado')
        board.forEach((row) => row.fill(0))
    }
}

//eliminar linea completa
function lineCompleta() {
    const eliminarLinea = []

    board.forEach((row, y) => {
        if (row.every(value => value === 1)) {
            eliminarLinea.push(y)
        }
    })

    eliminarLinea.forEach(y => {
        board.splice(y, 1)
        const nuevaLinea = Array(BOARD_HEIGHT).fill(0)
        board.unshift(nuevaLinea)
        puntuacion += 10
        document.querySelector('span').innerText = `Puntuación: ${puntuacion}`
    })
}

update()
