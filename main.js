import "./style.css";
import { BLOCK_SIZE, BOARD_HEIGHT, BOARD_WIDTH, piezas } from "./consts";

const $section = document.querySelector("section");
//Tamaño de pantalla
const axisY = window.innerHeight;
const axisX = window.innerWidth;

//Calculos para la pantalla
const downScreen = (axisY * 70) / 100;
const upScreen = (axisY * 20) / 100;
const halfScreen = axisX / 2;

//Creación del canvas
const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");

//Parametros del canvas
canvas.width = BLOCK_SIZE * BOARD_WIDTH;
canvas.height = BLOCK_SIZE * BOARD_HEIGHT;
context.scale(BLOCK_SIZE, BLOCK_SIZE);

let puntuacion = 0;
let dropTimer = 0;
let lastTime = 0;

//creación del tablero
const tablero = crearTablero(BOARD_WIDTH, BOARD_HEIGHT);
function crearTablero(width, height) {
  return Array(height)
    .fill()
    .map(() => Array(width).fill(0));
}
//pieza jugador
const jugador = {
  position: { x: 6, y: 1 },
  forma: [],
  color: [],
};

jugador.forma = piezas[Math.floor(Math.random() * piezas.length)]; //<- Se define de forma random la pieza inicial

function update(time = 0) {
  const deltaTime = time - lastTime;
  lastTime = time;
  dropTimer += deltaTime;

  if (dropTimer > 1000) {
    jugador.position.y++;
    dropTimer = 0;
    if (colision()) {
      jugador.position.y--;
      agrupar();
      lineaCompleta();
    }
  }

  draw();
  window.requestAnimationFrame(update);
}

function draw() {
  //dibujar canvas
  context.fillStyle = "#000";
  context.fillRect(0, 0, canvas.width, canvas.height);

  //dibujar piezas en el canvas
  tablero.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value === 1) {
        context.fillStyle = "white";
        context.fillRect(x, y, 1, 1);
      }
    });
  });

  //dibujar jugador
  jugador.forma.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value === 1) {
        context.fillStyle = "red";
        context.fillRect(x + jugador.position.x, y + jugador.position.y, 1, 1);
      }
    });
  });
}
//Detectar PC o Celular
if (/Mobi/.test(navigator.userAgent)) {
  //Si es celular
  document.ontouchstart = function (event) {
    if (
      event.touches[0].clientX < halfScreen &&
      event.touches[0].clientY < downScreen &&
      event.touches[0].clientY > upScreen
    ) {
      jugador.position.x--;
      if (colision()) {
        jugador.position.x++;
      }
    }
    if (
      event.touches[0].clientX > halfScreen &&
      event.touches[0].clientY < downScreen &&
      event.touches[0].clientY > upScreen
    ) {
      jugador.position.x++;
      if (colision()) {
        jugador.position.x--;
      }
    }
    if (event.touches[0].clientY > downScreen) {
      jugador.position.y++;
      if (colision()) {
        jugador.position.y--;
        agrupar();
        lineaCompleta();
      }
    }
    //rotar piezas
    if (event.touches[0].clientY < upScreen) {
      const rotacion = [];

      for (let i = 0; i < jugador.forma[0].length; i++) {
        const row = [];
        for (let j = jugador.forma.length - 1; j >= 0; j--) {
          row.push(jugador.forma[j][i]);
        }
        rotacion.push(row);
      }
      const formaPrevia = jugador.forma;
      jugador.forma = rotacion;
      if (colision()) {
        jugador.forma = formaPrevia;
      }
    }
  };
} else {
  //Si es PC
  document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
      jugador.position.x--;
      if (colision()) {
        jugador.position.x++;
      }
    }
    if (event.key === "ArrowRight") {
      jugador.position.x++;
      if (colision()) {
        jugador.position.x--;
      }
    }
    if (event.key === "ArrowDown") {
      jugador.position.y++;
      if (colision()) {
        jugador.position.y--;
        agrupar();
        lineaCompleta();
      }
    }
    //rotar piezas
    if (event.key === "ArrowUp") {
      const rotacion = [];

      for (let i = 0; i < jugador.forma[0].length; i++) {
        const row = [];

        for (let j = jugador.forma.length - 1; j >= 0; j--) {
          row.push(jugador.forma[j][i]);
        }

        rotacion.push(row);
      }
      const formaPrevia = jugador.forma;
      jugador.forma = rotacion;
      if (colision()) {
        jugador.forma = formaPrevia;
      }
    }
  });
}

//colision de piezas
function colision() {
  return jugador.forma.find((row, y) => {
    return row.find((value, x) => {
      return (
        value !== 0 &&
        tablero[y + jugador.position.y]?.[x + jugador.position.x] !== 0
      );
    });
  });
}

//Agrupar piezas
function agrupar() {
  jugador.forma.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value === 1) {
        tablero[y + jugador.position.y][x + jugador.position.x] = 1;
      }
    });
  });
  //Nueva pieza
  jugador.position.x = 6;
  jugador.position.y = 1;
  jugador.forma = piezas[Math.floor(Math.random() * piezas.length)];
  //Juego terminado
  if (colision()) {
    window.alert("Juego terminado");
    tablero.forEach((row) => row.fill(0));
  }
}

//eliminar linea completa
function lineaCompleta() {
  const eliminarLinea = [];
  tablero.forEach((row, y) => {
    if (row.every((value) => value === 1)) {
      eliminarLinea.push(y);
    }
  });
  eliminarLinea.forEach((y) => {
    tablero.splice(y, 1);
    const nuevaLinea = Array(BOARD_HEIGHT).fill(0);
    tablero.unshift(nuevaLinea);
    puntuacion += 10;
    document.querySelector("span").innerText = `Puntuación: ${puntuacion}`;
  });
}

$section.addEventListener("click", () => {
  update();
  //Audio
  $section.remove();
  const audio = new Audio("./public/tetris.mp3");
  audio.volume = 0.5;
  document.querySelector("img").addEventListener("click", () => {
    if (audio.volume > 0) {
      document.querySelector("img").src = `./public/sound-off.svg`;
      document.querySelector("img").alt = `Sonido Apagado`;
      audio.volume = 0;
    } else {
      document.querySelector("img").src = `./public/sound-high.svg`;
      document.querySelector("img").alt = `Sonido Encendido`;
      audio.volume = 0.5;
    }
  });
  audio.play();
});
