import { initializeApp } from "https://www.gstatic.com/firebasejs/10.15.0/firebase-app.js";
import { getDatabase, ref, set, onValue, off } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";

// Config firebase
const firebaseConfig = {
  apiKey: "AIzaSyBtbP9FJMWbqWIiNyW6pCQddx8LxpR-Iqw",
  authDomain: "bingo-japon.firebaseapp.com",
  databaseURL: "https://bingo-japon-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "bingo-japon",
  storageBucket: "bingo-japon.firebasestorage.app",
  messagingSenderId: "391006558118",
  appId: "1:391006558118:web:2e0fc84cc24f94fc82a167"
};

//Inicializo FB
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const tablero = document.getElementById("tablero");
const casillasTablero = {
    "tableroDAMN": {
        tamanyo: 4,
        frases: [
            "+20€ en una sola máquina de gachapon", "Saltarse un plan", "Dejarte la mochila/cartera", "Pedirle foto a un cosplayer",
            "Ser el dormilón 2 días seguidos", "5 famichickis en 1 dia", "beber alcohol antes del mediodia", "No ducharse 2 días seguidos",
            "Que te acomoden un gacha", "Cantar un OP de Naturo en un karaoke", "+100€ en una sola figura", "+7 cosas de máquinas expendedoras en 1 dia",
            "Comprar una figura con bragas visibles", "+100€ en cartas (1 compra)", "Que te roben", "Comprar una katana"
        ]
    },
    "tableroComida": {
        tamanyo: 7,
        frases: [
            "Kaarage", "Melon Pan", "Maccas", "Ramen", "Unagi", "Pan de Tokyo", "Okonomiyaki",
            "Tonkatsu", "Takoyaki", "Dorayaki", "Kobe", "Pez Globo", "Dangos", "Yakisoba",
            "Wagyu", "KBBQ", "Tempura", "Sashimi", "Kushiage", "Mochis", "Nabe",
            "Bao", "711", "Lawson", "Fluffy Chesscake", "Fluffy Pancakes", "Dumplings", "Teppanyaki",
            "Gyozas", "Shabu Shabu", "Yakiniku", "Crepas Callejeras", "Wonton", "Burger", "Bento",
            "Curry", "Sushi", "Udon", "Helado de Matcha", "Taiyaki", "Katsudon", "Onigiri",
            "FREE", "Family Mart", "Omurice", "Natto", "Cheese Coin", "Tsukemen", "Yakitori"
        ]
    }
};
//Selector de jugador y de tablero
let playerId = document.getElementById("selectorJugador").value;
let tableroActual = document.getElementById("selectorTablero").value;

document.getElementById("selectorJugador").addEventListener("change", (e) =>{
    playerId = e.target.value;
});

document.getElementById("selectorTablero").addEventListener("change", (e) =>{
    tableroActual = e.target.value;
});

//Creo el tablero dinámico según el tamaño
function crearTablero() {
    const tablero = document.getElementById("tablero");
    const {tamanyo, frases} = casillasTablero[tableroActual];
    tablero.innerHTML = "";
    tablero.style.gridTemplateColumns = `repeat(${tamanyo},80px)`;

    for (let r = 0; r < tamanyo; r++) {
        for (let c = 0; c < tamanyo; c++){
            const celda = document.createElement("div");
            celda.classList.add("celda");
            celda.dataset.row = r;
            celda.dataset.col = c;
            celda.textContent = frases[r * tamanyo * c];

            const imagen = document.createElement("div");
            imagen.classList.add("contenedorImagen");
            celda.appendChild(imagen);

            celda.addEventListener("click", () => {
                const markRef = ref(db, `${tableroActual}/userMarks/${playerId}/${r}_${c}`);
                set(markRef, true);
            });

            tablero.appendChild(celda);

        }
    }
}

function marcarCasillas() {
    onValue(ref(db), (snapshot) => {
        const dbData = snapshot.val() || {};
        const marcas = dbData[tableroActual]?.userMarks || {};

        document.querySelectorAll(".celda .contenedorImagen").forEach(div => div.innerHTML = "");
        for (let jugador in marcas) {
            for (let claveCelda in marcas[jugador]) {
                const [r, c] = claveCelda.split("_");
                const celda = document.querySelector(`.celda[data-row='${r}'][data-col='${c}']`);
                if (celda) {
                    const imagenContenedor = celda.querySelector(".contenedorImagen");
                    const img = document.createElement("img");
                    img.src = `images/${jugador}.png`;
                    img.alt = jugador;
                    imagenContenedor.appendChild(img);
                }
            }
        }
    })
}

//Inicializo
crearTablero();
marcarCasillas();