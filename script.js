import { tilesetGround, tileSize, tileImages } from './tiles.js';

// Obtenir les éléments du DOM
const startAdventureButton = document.getElementById('startAdventureButton');
const mainMenu = document.getElementById('mainMenu');
const initialScreen = document.getElementById('initialScreen');


const startButton = document.getElementById('startButton');
const canvas = document.getElementById('gameCanvas');
const context = canvas.getContext('2d');

const backgroundMusic = document.getElementById('backgroundMusic');
let isBackgroundMusicPlaying = false;
const gameMusic1 = document.getElementById('gameMusic1');
const gameMusic2 = document.getElementById('gameMusic2');
const gameMusic3 = document.getElementById('gameMusic3');
const deathMusic = document.getElementById('deathMusic');

const deathSound = document.getElementById('deathSound');
const coinSound = document.getElementById('coinSound');
const magicSound = document.getElementById('magicSound');
const blopSound = document.getElementById('blopSound');
const impactSound = document.getElementById('impactSound');
const footStepSound = document.getElementById('footStepSound');

let BUTTONTYPE; // Déclaration de la variable

const ruinsButton = document.getElementById('ruinsButton');
const sanctuaryButton = document.getElementById('sanctuaryButton');
const canalButton = document.getElementById('canalButton');


// Désactiver le lissage d'image pour préserver la netteté des sprites en pixel art
context.imageSmoothingEnabled = false;

// Suivre les touches enfoncées
const keys = {};
// Ajouter des écouteurs pour les événements de touche
document.addEventListener('keydown', function(event) {
    keys[event.code] = true;
});
document.addEventListener('keyup', function(event) {
    keys[event.code] = false;
});

// Afficher le menu principal et jouer la musique lorsque le bouton est cliqué
startAdventureButton.addEventListener('click', () => {
    initialScreen.style.display = 'none';
    mainMenu.style.display = 'flex';
    if (!isBackgroundMusicPlaying) {
        backgroundMusic.play();
        isBackgroundMusicPlaying = true;
    }
    playSound(impactSound);
});

document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        if (isPaused) {
            resumeGame();
        } else {
            pauseGame();
        }
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const retryButton = document.getElementById('retryButton');
    const mainMenu = document.getElementById('mainMenu');
    const gameSection = document.getElementById('gameSection');
    const initialScreen = document.getElementById('initialScreen');
    const scoreElement = document.getElementById('score');
    const volumeControl = document.getElementById('volume');
    const pauseVolumeControl = document.getElementById('pauseVolume');

    let currentVolume = 0.5; // Volume initial

    const audioElements = [
        document.getElementById('backgroundMusic'),
        document.getElementById('gameMusic1'),
        document.getElementById('gameMusic2'),
        document.getElementById('gameMusic3'),
        document.getElementById('deathMusic'),
        document.getElementById('deathSound'),
        document.getElementById('coinSound'),
        document.getElementById('magicSound'),
        document.getElementById('blopSound'),
        document.getElementById('impactSound'),
        document.getElementById('footStepSound')
    ];

    function getHighScores(map) {
        const highScores = JSON.parse(localStorage.getItem(`highScores_${map}`)) || [];
        return highScores;
    }

    function saveHighScore(map, score) {
        const highScores = getHighScores(map);
        highScores.push(score);
        highScores.sort((a, b) => b - a);
        highScores.splice(5);
        localStorage.setItem(`highScores_${map}`, JSON.stringify(highScores));
    }

    function displayHighScores(map, listId) {
        const highScores = getHighScores(map);
        const highScoresList = document.getElementById(listId);
        highScoresList.innerHTML = highScores.map(score => `<li>${score}</li>`).join('');
    }

    function displayAllHighScores() {
        displayHighScores('ruins', 'ruinsHighScoresList');
        displayHighScores('sanctuary', 'sanctuaryHighScoresList');
        displayHighScores('canal', 'canalHighScoresList');
    }

    displayAllHighScores(); // Afficher les scores lorsque le DOM est chargé

    // Charger la valeur de volume à partir du stockage local
    if (localStorage.getItem('volume')) {
        volumeControl.value = localStorage.getItem('volume');
        pauseVolumeControl.value = localStorage.getItem('volume');
        setVolume(localStorage.getItem('volume'));
    }

    // Vérifier si on doit afficher directement le menu de sélection des cartes
    if (localStorage.getItem('showMainMenu') === 'true') {
        initialScreen.style.display = 'none';
        mainMenu.style.display = 'flex';
        localStorage.removeItem('showMainMenu'); // Supprimer la variable après utilisation
        if (!isBackgroundMusicPlaying) {
            backgroundMusic.play();
            isBackgroundMusicPlaying = true;
        }
    }

    // Enregistrer la valeur de volume dans le stockage local
    volumeControl.addEventListener('input', () => {
        localStorage.setItem('volume', volumeControl.value);
        setVolume(volumeControl.value);
    });

    pauseVolumeControl.addEventListener('input', () => {
        localStorage.setItem('volume', pauseVolumeControl.value);
        setVolume(pauseVolumeControl.value);
    });

    function setVolume(volume) {
        currentVolume = volume; // Mettre à jour la variable globale
        audioElements.forEach(audio => {
            audio.volume = volume;
        });
    }

    document.addEventListener('keydown', function(event) {
        if (!isBackgroundMusicPlaying) {
            backgroundMusic.play();
            isBackgroundMusicPlaying = true;
        }
    });

    ruinsButton.addEventListener('click', () => {
        BUTTONTYPE = 1;
        mainMenu.style.display = 'none';
        gameSection.style.display = 'flex';
        gameCanvas.style.display = 'block';
        scoreElement.style.display = 'block';
        startGame();
    });

    sanctuaryButton.addEventListener('click', () => {
        BUTTONTYPE = 2;
        mainMenu.style.display = 'none';
        gameSection.style.display = 'flex';
        gameCanvas.style.display = 'block';
        scoreElement.style.display = 'block';
        startGame();
    });

    canalButton.addEventListener('click', () => {
        BUTTONTYPE = 3;
        mainMenu.style.display = 'none';
        gameSection.style.display = 'flex';
        gameCanvas.style.display = 'block';
        scoreElement.style.display = 'block';
        startGame();
    });

    retryButton.addEventListener('click', () => {
        localStorage.setItem('showMainMenu', 'true');
        location.reload();
    });

    document.getElementById('retryButton').addEventListener('click', function() {
        if (BUTTONTYPE === 1) {
            saveHighScore('ruins', score);
        } else if (BUTTONTYPE === 2) {
            saveHighScore('sanctuary', score);
        } else if (BUTTONTYPE === 3) {
            saveHighScore('canal', score);
        }
        location.reload();
    });

    // Ajuster le volume dès le chargement
    setVolume(currentVolume);

    // Jouer le son d'impact avec le volume défini
    startAdventureButton.addEventListener('click', () => {
        initialScreen.style.display = 'none';
        mainMenu.style.display = 'flex';
        if (!isBackgroundMusicPlaying) {
            backgroundMusic.play();
            isBackgroundMusicPlaying = true;
        }
        playSound(impactSound); // Utiliser la fonction playSound pour appliquer le volume
    });

    function playSound(sound) {
        const soundClone = sound.cloneNode();
        soundClone.volume = currentVolume; // Définir le volume du clone
        soundClone.play();
    }
});





// ------------------------------------------------------------- VOLUME -------------------------------------------------------------

let currentVolume = 0.5; // Volume initial

// Obtenez l'élément input de contrôle du volume
const volumeControl = document.getElementById('volume');

// Liste des éléments audio
const audioElements = [
    document.getElementById('backgroundMusic'),
    document.getElementById('gameMusic1'),
    document.getElementById('gameMusic2'),
    document.getElementById('gameMusic3'),
    document.getElementById('deathMusic'),
    document.getElementById('deathSound'),
    document.getElementById('coinSound'),
    document.getElementById('magicSound'),
    document.getElementById('blopSound'),
    document.getElementById('impactSound'),
    document.getElementById('footStepSound')
];

// Fonction pour mettre à jour le volume de tous les éléments audio
function updateVolume() {
    currentVolume = volumeControl.value; // Mettre à jour la variable globale
    audioElements.forEach(audio => {
        audio.volume = currentVolume;
    });
}


// Ajoutez un écouteur d'événements pour modifier le volume lorsque l'utilisateur change la valeur de la barre de volume
volumeControl.addEventListener('input', () => {
    localStorage.setItem('volume', volumeControl.value);
    updateVolume();
});

// Appelez la fonction pour définir le volume initial
updateVolume();


// ------------------------------------------------------------- INIT -------------------------------------------------------------

let showCollision = false;
let GameMusic;

// Variables du personnage
let characterSize = 0;
const baseCharacterSize = 150; // Taille du personnage pour une carte de 10 cases
const baseMapSize = 10; // Taille de la carte de base (10 cases)
let collisionBoxSize = 10; // Taille de la boîte de collision du personnage
let collisionOffsetY = 3.2;
let characterX = canvas.width / 2 - characterSize / 2;
let characterY = canvas.height / 2 - characterSize / 2;
let characterWalkSpeed = 4; // Pixels par seconde
let characterRunSpeed = 2.5; // Pixels par seconde
let characterSpeed = 300; // Pixels par seconde
let isDead = false;

let lastFootstepTime = 0;
let footstepInterval = 0.5; // Intervalle de base pour la marche (en secondes)

// Charger les images
//Player
const characterTileset = new Image();
characterTileset.src = 'src/camelot_/mordred_.png';
const characterFrames = {
    right: [
        { x: 0, y: 0 }, // Frame 1
        { x: 1, y: 0 }, // Frame 2
        { x: 2, y: 0 }, // Frame 3
        { x: 3, y: 0 }  // Frame 4
    ],
    left: [
        { x: 4, y: 0 }, // Frame 1
        { x: 5, y: 0 }, // Frame 2
        { x: 6, y: 0 }, // Frame 3
        { x: 7, y: 0 }  // Frame 4
    ],
    walkRight: [
        { x: 0, y: 1 }, // Frame 1
        { x: 1, y: 1 }, // Frame 2
        { x: 2, y: 1 }, // Frame 3
        { x: 3, y: 1 },  // Frame 4
        { x: 0, y: 2 }, // Frame 1
        { x: 1, y: 2 }, // Frame 2
        { x: 2, y: 2 }, // Frame 3
        { x: 3, y: 2 }  // Frame 4
    ],
    walkLeft: [
        { x: 4, y: 1 }, // Frame 1
        { x: 5, y: 1 }, // Frame 2
        { x: 6, y: 1 }, // Frame 3
        { x: 7, y: 1 },  // Frame 4
        { x: 4, y: 2 }, // Frame 1
        { x: 5, y: 2 }, // Frame 2
        { x: 6, y: 2 }, // Frame 3
        { x: 7, y: 2 }  // Frame 4
    ],
    deadRight: [
        { x: 2, y: 8 }, // Frame 2
        { x: 2, y: 9 }, // Frame 3
        { x: 3, y: 9 },  // Frame 4
    ],
    deadLeft: [
        { x: 6, y: 8 }, // Frame 2
        { x: 6, y: 9 }, // Frame 3
        { x: 7, y: 9 },  // Frame 4
    ]
};
const charactertileSize = 32; // Taille de chaque case dans le tileset
const characterFoot = 3.5;
let currentDirection = 'left';
let currentFrameIndex = 0;
let frameRate = 10; // Nombre de frames par seconde
let frameTime = 0;

// MAPS
let map;

const Ruines = [
 [100, 502, 501, 100, 304, 503, 100, 149, 152, 152, 152, 152, 152, 152, 152, 152, 152, 152, 146, 507],
 [301, 149, 152, 152, 152, 152, 152, 143, 305, 911, 906, 906, 901, 913, 301, 314, 312, 902, 144, 146],
 [149, 143, 305, 301, 312, 901, 313, 915, 907, 900, 913, 301, 902, 900, 904, 903, 900, 901, 301, 153],
 [151, 301, 916, 904, 906, 904, 904, 900, 314, 901, 216, 212, 209, 213, 214, 212, 217, 910, 901, 153],
 [151, 902, 900, 903, 902, 301, 900, 902, 903, 900, 203, 305, 304, 909, 310, 905, 203, 902, 913, 144],
 [151, 216, 224, 900, 914, 208, 219, 209, 213, 214, 220, 900, 910, 900, 907, 906, 202, 906, 208, 217],
 [151, 202, 900, 901, 900, 304, 203, 906, 903, 301, 202, 900, 900, 908, 900, 900, 909, 900, 912, 203],
 [151, 909, 301, 907, 906, 900, 202, 306, 900, 908, 900, 906, 908, 900, 208, 212, 217, 911, 905, 203],
 [151, 901, 905, 900, 911, 307, 900, 912, 909, 920, 900, 905, 900, 907, 900, 912, 203, 900, 901, 202],
 [151, 306, 900, 910, 900, 909, 908, 900, 900, 906, 907, 900, 917, 305, 903, 216, 218, 908, 900, 307],
 [151, 928, 900, 907, 900, 900, 208, 217, 905, 900, 306, 908, 900, 902, 900, 203, 902, 900, 300, 508],
 [148, 142, 910, 900, 910, 908, 311, 203, 900, 912, 900, 900, 901, 900, 300, 203, 900, 901, 918, 149],
 [300, 151, 906, 307, 927, 900, 906, 215, 224, 909, 225, 212, 209, 213, 214, 218, 300, 910, 904, 151],
 [305, 151, 900, 909, 137, 134, 900, 911, 907, 900, 901, 304, 300, 920, 900, 901, 900, 903, 900, 151],
 [149, 143, 902, 137, 131, 132, 140, 134, 902, 900, 904, 900, 902, 907, 300, 900, 901, 900, 300, 151],
 [143, 926, 900, 136, 130, 101, 101, 132, 140, 134, 900, 901, 903, 900, 902, 904, 900, 300, 919, 151],
 [300, 903, 901, 304, 136, 138, 130, 101, 133, 135, 300, 900, 904, 304, 903, 906, 903, 902, 900, 151],
 [304, 900, 902, 900, 300, 925, 136, 138, 135, 305, 908, 918, 300, 902, 900, 901, 300, 917, 149, 143],
 [216, 207, 900, 904, 900, 901, 906, 912, 920, 901, 903, 900, 901, 919, 149, 152, 152, 152, 143, 149],
 [202, 503, 300, 305, 149, 152, 152, 152, 152, 152, 152, 152, 152, 152, 143, 300, 149, 152, 152, 143]
];

const Sanctuaire = [
 [101, 101, 101, 101, 101, 101, 101, 101, 101, 101, 101, 101, 101, 101, 101, 101, 101, 101, 101, 101],
 [101, 101, 101, 101, 101, 133, 138, 138, 138, 138, 138, 138, 138, 138, 130, 101, 101, 101, 101, 101],
 [101, 101, 133, 138, 138, 135, 302, 924, 904, 903, 900, 921, 900, 903, 136, 138, 130, 101, 101, 101],
 [101, 101, 141, 921, 905, 901, 902, 900, 900, 921, 302, 901, 924, 900, 302, 922, 136, 130, 101, 101],
 [101, 101, 132, 134, 302, 922, 905, 903, 302, 900, 904, 908, 904, 302, 900, 901, 922, 139, 101, 101],
 [101, 101, 101, 132, 140, 140, 134, 302, 902, 901, 922, 900, 900, 902, 905, 900, 904, 139, 101, 101],
 [101, 101, 133, 138, 138, 138, 135, 901, 900, 908, 902, 302, 900, 924, 903, 302, 900, 136, 130, 101],
 [101, 101, 141, 900, 905, 912, 904, 923, 302, 903, 900, 901, 902, 900, 900, 924, 302, 912, 139, 101],
 [101, 133, 135, 302, 923, 901, 910, 900, 924, 900, 901, 910, 900, 302, 904, 909, 901, 900, 139, 101],
 [101, 141, 921, 905, 909, 900, 216, 209, 209, 224, 900, 902, 225, 209, 209, 217, 921, 302, 139, 101],
 [101, 141, 907, 906, 900, 307, 203, 905, 900, 909, 910, 900, 907, 901, 304, 203, 902, 137, 131, 101],
 [101, 141, 306, 900, 908, 313, 202, 900, 907, 500, 100, 100, 100, 906, 900, 202, 900, 139, 101, 101],
 [101, 141, 908, 307, 900, 910, 306, 911, 906, 100, 100, 100, 100, 900, 910, 305, 904, 136, 130, 101],
 [101, 141, 907, 900, 912, 911, 900, 910, 900, 100, 100, 100, 100, 900, 911, 900, 908, 906, 139, 101],
 [101, 132, 134, 906, 900, 307, 909, 900, 302, 100, 100, 100, 100, 302, 923, 902, 912, 304, 139, 101],
 [101, 101, 141, 307, 905, 908, 900, 906, 905, 924, 311, 305, 901, 908, 900, 905, 305, 137, 131, 101],
 [101, 101, 132, 140, 134, 900, 907, 306, 900, 912, 900, 910, 900, 900, 909, 911, 903, 139, 101, 101],
 [101, 101, 101, 101, 132, 140, 134, 900, 908, 305, 911, 908, 905, 304, 137, 140, 140, 131, 101, 101],
 [101, 101, 101, 101, 101, 101, 132, 140, 140, 140, 140, 140, 140, 140, 131, 101, 101, 101, 101, 101],
 [101, 101, 101, 101, 101, 101, 101, 101, 101, 101, 101, 101, 101, 101, 101, 101, 101, 101, 101, 101]
];

const Canal = [
 [502, 515, 149, 152, 143, 504, 149, 143, 306, 100, 139, 101, 101, 141, 515, 229, 227, 227, 227, 230],
 [100, 149, 143, 901, 307, 303, 151, 915, 901, 303, 139, 101, 101, 141, 505, 226, 304, 905, 906, 226],
 [303, 151, 902, 914, 902, 900, 151, 903, 904, 137, 131, 101, 101, 141, 305, 226, 900, 909, 907, 226],
 [503, 151, 303, 900, 903, 149, 143, 902, 909, 139, 101, 101, 133, 135, 910, 226, 910, 900, 908, 226],
 [149, 143, 911, 904, 900, 151, 303, 900, 915, 139, 101, 101, 141, 303, 902, 228, 233, 900, 235, 231],
 [151, 303, 901, 900, 902, 151, 908, 901, 400, 403, 406, 406, 409, 412, 901, 928, 911, 900, 907, 311],
 [151, 916, 904, 903, 149, 143, 902, 900, 929, 930, 931, 931, 932, 933, 908, 910, 900, 912, 908, 145],
 [151, 901, 900, 900, 303, 914, 904, 907, 402, 405, 408, 408, 411, 414, 907, 900, 905, 926, 928, 153],
 [151, 900, 903, 900, 901, 903, 900, 901, 303, 415, 101, 101, 416, 910, 304, 906, 907, 900, 305, 153],
 [143, 303, 902, 904, 910, 902, 900, 902, 307, 139, 101, 101, 141, 900, 909, 900, 911, 304, 905, 153],
 [100, 307, 912, 901, 900, 914, 303, 908, 909, 139, 101, 101, 141, 300, 900, 911, 900, 907, 906, 153],
 [303, 900, 911, 900, 904, 900, 901, 900, 137, 131, 101, 101, 141, 928, 236, 900, 100, 900, 300, 153],
 [216, 224, 901, 208, 217, 900, 900, 303, 139, 101, 101, 133, 135, 909, 900, 910, 925, 908, 145, 147],
 [203, 902, 900, 914, 202, 303, 905, 400, 403, 406, 406, 409, 412, 305, 907, 900, 909, 900, 153, 507],
 [203, 903, 904, 910, 900, 904, 908, 929, 930, 931, 931, 932, 933, 908, 900, 905, 906, 307, 153, 100],
 [203, 303, 900, 902, 908, 906, 900, 402, 405, 408, 408, 411, 414, 900, 910, 900, 315, 145, 147, 300],
 [215, 217, 913, 901, 907, 900, 909, 915, 415, 101, 101, 416, 307, 925, 911, 906, 900, 153, 304, 526],
 [504, 203, 905, 900, 900, 901, 306, 900, 139, 101, 101, 132, 134, 905, 304, 908, 927, 144, 146, 506],
 [303, 215, 207, 901, 900, 902, 903, 303, 136, 130, 101, 101, 132, 140, 134, 912, 910, 900, 153, 305],
 [501, 502, 516, 307, 225, 209, 207, 501, 525, 136, 130, 101, 101, 101, 132, 140, 134, 300, 144, 146]
];
//const m = gRI(1, 1);

// ------------------------------------------------------------- COINS -------------------------------------------------------------

let score = 0;

const coinImage = new Image();
coinImage.src = 'src/coin.png'; // Assurez-vous d'avoir une image de pièce
const coinFrames = {
    spin: [
        { x: 0, y: 0 }, // Frame 1
        { x: 1, y: 0 }, // Frame 2
        { x: 2, y: 0 }, // Frame 3
        { x: 3, y: 0 },  // Frame 4
        { x: 4, y: 0 }  // Frame 4
    ]
};
const coinTileSize = 16; // Taille de chaque case dans le tileset de la pièce
const coinFrameRate = 10; // Nombre de frames par seconde pour les pièces
const coinOffset = 10;

let currentCoin = null;

class Coin {
    constructor(x, y, size, image, frames, tileSize, frameRate) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.image = image;
        this.frames = frames;
        this.tileSize = tileSize;
        this.frameRate = frameRate;
        this.currentFrameIndex = 0;
        this.frameTime = 0;
    }

    update(deltaTime) {
        // Mettre à jour l'animation
        this.frameTime += deltaTime;
        if (this.frameTime >= 1 / this.frameRate) {
            this.currentFrameIndex = (this.currentFrameIndex + 1) % this.frames.spin.length;
            this.frameTime = 0;
        }
    }

    draw(context) {
        const frame = this.frames.spin[this.currentFrameIndex];
        context.drawImage(
            this.image,
            frame.x * this.tileSize, frame.y * this.tileSize, this.tileSize, this.tileSize,
            this.x, this.y, this.size, this.size
        );
    }

    drawCollisionBox(context) {
        const collisionX = this.x + (this.size - this.size) / 2;
        const collisionY = this.y + (this.size - this.size) / 2  + coinOffset;
        context.strokeStyle = 'red';
        context.lineWidth = 2;
        context.strokeRect(collisionX, collisionY, this.size, this.size);
    }

    checkCollision(characterX, characterY, characterSize) {
        const coinCenterX = this.x + this.size / 2;
        const coinCenterY = this.y + this.size / 2;
        const characterCenterX = characterX + characterSize / 2;
        const characterCenterY = characterY + characterSize / 2 - coinOffset;
        const distance = Math.sqrt(
            Math.pow(coinCenterX - characterCenterX, 2) + Math.pow(coinCenterY - characterCenterY, 2)
        );
        return distance < (this.size / 2 + characterSize / 2);
    }
}

function placeRandomCoin() {
    const positions100 = getAllPositions(map, 900);
    const randomPosition = getRandomPosition(positions100);
    const tileWidth = canvas.width / map[0].length;
    const tileHeight = canvas.height / map.length;
    const coinSize = tileWidth; // Taille de la pièce
    currentCoin = new Coin(
        randomPosition.col * tileWidth + (tileWidth - coinSize) / 2,
        randomPosition.row * tileHeight + (tileHeight - coinSize) / 2,
        coinSize,
        coinImage,
        coinFrames,
        coinTileSize,
        coinFrameRate
    );
}

// ------------------------------------------------------------- SCORES -------------------------------------------------------------

function getHighScores() {
    const highScores = JSON.parse(localStorage.getItem('highScores')) || [];
    return highScores;
}

function saveHighScore(score) {
    const highScores = getHighScores();
    highScores.push(score);
    highScores.sort((a, b) => b - a); // Trier les scores par ordre décroissant
    highScores.splice(5); // Conserver uniquement les 5 meilleurs scores
    localStorage.setItem('highScores', JSON.stringify(highScores));
}

function updateScore() {
    const scoreElement = document.getElementById('score');
    scoreElement.textContent = `Pièces collectées : ${score}`;
}


// ------------------------------------------------------------- ENEMY -------------------------------------------------------------

//Enemy
const enemyImage = new Image();
enemyImage.src = 'src/Impact.png';
const enemyFrames = {
    walk: [
        { x: 16, y: 8 }, // Frame 1
        { x: 17, y: 8 }, // Frame 2
        { x: 18, y: 8 }, // Frame 3
        { x: 19, y: 8 },  // Frame 4
    ]
};
const enemyTileSize = 32; // Taille de chaque case dans le tileset de l'ennemi
const enemyFrameRate = 10; // Nombre de frames par seconde pour les ennemis

// Classe pour les ennemis
class Enemy {
    constructor(x, y, size, speedX, speedY, image, frames, tileSize, frameRate, hitboxScale = 0.7) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.speedX = speedX;
        this.speedY = speedY;
        this.image = image;
        this.frames = frames;
        this.tileSize = tileSize;
        this.frameRate = frameRate;
        this.currentFrameIndex = 0;
        this.frameTime = 0;
        this.hitboxScale = hitboxScale; // Scale for the hitbox size
        this.isInsideMap = false;
    }

    update(deltaTime) {

        this.x += this.speedX * deltaTime;
        this.y += this.speedY * deltaTime;

        const hitboxSize = this.size * this.hitboxScale;
        const hitboxX = this.x + (this.size - hitboxSize) / 2;
        const hitboxY = this.y + (this.size - hitboxSize) / 2;

        // Vérifier si l'ennemi est complètement à l'intérieur de la carte
        if (
            hitboxX >= 0 && hitboxX + hitboxSize <= canvas.width &&
            hitboxY >= 0 && hitboxY + hitboxSize <= canvas.height
        ) {
            this.isInsideMap = true;
        }

        if (this.isInsideMap) {
            // Appliquer la logique de rebond seulement quand l'ennemi est complètement à l'intérieur de la carte
            if (hitboxX <= 0 || hitboxX + hitboxSize >= canvas.width) {
                this.speedX = -this.speedX;
            }
            if (hitboxY <= 0 || hitboxY + hitboxSize >= canvas.height) {
                this.speedY = -this.speedY;
            }
        }

        // Mettre à jour l'animation
        this.frameTime += deltaTime;
        if (this.frameTime >= 1 / this.frameRate) {
            this.currentFrameIndex = (this.currentFrameIndex + 1) % this.frames.walk.length;
            this.frameTime = 0;
        }
    }

    draw(context) {
        const frame = this.frames.walk[this.currentFrameIndex];
        context.drawImage(
            this.image,
            frame.x * this.tileSize, frame.y * this.tileSize, this.tileSize, this.tileSize,
            this.x, this.y, this.size, this.size
        );
        if (showCollision) {
            this.drawCollisionBox(context);
        }
    }

    drawCollisionBox(context) {
        const hitboxSize = this.size * this.hitboxScale;
        const hitboxX = this.x + (this.size - hitboxSize) / 2;
        const hitboxY = this.y + (this.size - hitboxSize) / 2;
        context.strokeStyle = 'red';
        context.lineWidth = 2;
        context.strokeRect(hitboxX, hitboxY, hitboxSize, hitboxSize);
    }

    checkCollision(characterX, characterY, characterSize) {
        const hitboxSize = this.size * this.hitboxScale;
        const hitboxX = this.x + (this.size - hitboxSize) / 2;
        const hitboxY = this.y + (this.size - hitboxSize) / 2;
        return (
            hitboxX < characterX + characterSize &&
            hitboxX + hitboxSize > characterX &&
            hitboxY < characterY + characterSize &&
            hitboxY + hitboxSize > characterY
        );
    }
}




// Variables pour les ennemis
const enemies = [];
/*const initialEnemies = [
    new Enemy(1, 1, gRI(50, 100), gRI(50, 300), gRI(50, 300), enemyImage, enemyFrames, enemyTileSize, enemyFrameRate, 0.7),
    new Enemy(800, 1, gRI(50, 100), -gRI(50, 300), gRI(50, 300), enemyImage, enemyFrames, enemyTileSize, enemyFrameRate, 0.7),
    new Enemy(1, 800, gRI(50, 100), gRI(50, 300), -gRI(50, 300), enemyImage, enemyFrames, enemyTileSize, enemyFrameRate, 0.7),
    new Enemy(800, 800, gRI(50, 100), -gRI(50, 300), -gRI(50, 300), enemyImage, enemyFrames, enemyTileSize, enemyFrameRate, 0.7),
];*/

function spawnEnemy() {
    if (!isDead) {
        // Distance en dehors de la carte pour le spawn
        const spawnDistance = 50;
        const spawnPositions = [
            { x: canvas.width / 2, y: -spawnDistance }, // Haut de la carte
            { x: canvas.width / 2, y: canvas.height + spawnDistance }, // Bas de la carte
            { x: -spawnDistance, y: canvas.height / 2 }, // Gauche de la carte
            { x: canvas.width + spawnDistance, y: canvas.height / 2 } // Droite de la carte
        ];

        // Sélectionner une position de spawn aléatoire
        const spawnPosition = spawnPositions[Math.floor(Math.random() * spawnPositions.length)];

        // Calculer la direction légèrement aléatoire vers l'intérieur de la carte
        let directionX = 0;
        let directionY = 0;
        
        if (spawnPosition.y < 0) {
            directionY = gRI(20, 300); // Aller vers le bas
            directionX = gRI(-160, 160); // Légèrement à gauche ou à droite
            warningPosition = 1;
        } else if (spawnPosition.y > canvas.height) {
            directionY = -gRI(20, 300); // Aller vers le haut
            directionX = gRI(-160, 160); // Légèrement à gauche ou à droite
            warningPosition = 3;
        } else if (spawnPosition.x < 0) {
            directionX = gRI(20, 300); // Aller vers la droite
            directionY = gRI(-160, 160); // Légèrement en haut ou en bas
            warningPosition = 4;
        } else if (spawnPosition.x > canvas.width) {
            directionX = -gRI(20, 300); // Aller vers la gauche
            directionY = gRI(-160, 160); // Légèrement en haut ou en bas
            warningPosition = 2;
        }

        // Afficher l'avertissement au bord de la carte
        warning = true;

        setTimeout(() => {
            const newEnemy = new Enemy(
                spawnPosition.x,
                spawnPosition.y,
                gRI(50, 100),
                directionX,
                directionY,
                enemyImage,
                enemyFrames,
                enemyTileSize,
                enemyFrameRate,
                0.7
            );

            enemies.push(newEnemy);

            // Retirer l'avertissement après l'apparition de l'ennemi
            warning = false;
        }, 3000); // 3000 ms = 3 secondes
    }
}







// Fonction pour ajouter un ennemi
/*function addEnemy() {
    const newEnemy = new Enemy(gRI(0, canvas.width), gRI(0, canvas.height), gRI(20, 70), gRI(50, 300), gRI(50, 300), enemyImage);
    enemies.push(newEnemy);
}

// Fonction pour enlever un ennemi spécifique
function removeEnemy(enemy) {
    const index = enemies.indexOf(enemy);
    if (index > -1) {
        enemies.splice(index, 1);
    }
}*/

// Mettre à jour la position des ennemis
function updateEnemies(deltaTime) {
    for (const enemy of enemies) {
        enemy.update(deltaTime);
    }
}

// Vérifier les collisions avec les ennemis
function checkCollisions() {
    const collisionX = characterX + (characterSize - collisionBoxSize) / 2;
    const collisionY = characterY + (characterSize - collisionBoxSize) / 2 + collisionOffsetY;
    for (const enemy of enemies) {
        if (enemy.checkCollision(collisionX, collisionY, collisionBoxSize)) {
            //alert('Vous avez été touché par un ennemi !');
            // Réinitialiser le jeu
            enemies.length = 0;
            currentFrameIndex = 0;
            frameRate = 2;
            isDead = true;
            playSound(deathSound); // Jouer le son de mort
            GameMusic.pause();
            deathMusic.currentTime = 0;
            deathMusic.play();
            if (currentDirection == 'right' || currentDirection == 'walkRight')
                currentDirection = 'deadRight';
            else if (currentDirection == 'left' || currentDirection == 'walkLeft')
                currentDirection = 'deadLeft';
        }
    }
}
// ------------------------------------------------------------- WARNING -------------------------------------------------------------

let warning = false; // Avertissement initialisé à null
let warningPosition;


// ------------------------------------------------------------- UPDATE -------------------------------------------------------------

let hasBeenRelease = true;

// Vérifier si une position est valide (ne contient pas d'obstacle)
function isPositionValid(collisionX, collisionY) {
    const row = Math.floor(collisionY / (canvas.height / map.length));
    const col = Math.floor(collisionX / (canvas.width / map[0].length));
    if (row < 0 || row >= map.length || col < 0 || col >= map[0].length) {
        return false;
    }
    const tile = map[row][col];
    return (tile >= 900);
}

// Vérifier si une boîte de collision est entièrement dans une position valide
function isCollisionBoxValid(x, y, width, height) {
    return (
        isPositionValid(x, y) &&
        isPositionValid(x + width, y) &&
        isPositionValid(x, y + height) &&
        isPositionValid(x + width, y + height)
    );
}

// Mettre à jour la position du personnage
function update(deltaTime, timestamp) {

    if (isPaused) return;

    let moveX = 0;
    let moveY = 0;

    // Déterminer la cadence en fonction de la vitesse de déplacement
    footstepInterval = (keys['Space']) ? 0.2 : 0.4; // Réduire l'intervalle lorsque le personnage court

    // Mouvement
    let moving = false;
    if ((keys['ArrowUp'] || keys['KeyW']) && characterY + (collisionBoxSize * 0.5) - characterSpeed * deltaTime >= 0) {
        moveY = -characterSpeed * deltaTime;
        moving = true;
        if (currentDirection == 'right')
            currentDirection = 'walkRight';
        if (currentDirection == 'left')
            currentDirection = 'walkLeft';
    }
    if ((keys['ArrowDown'] || keys['KeyS']) && characterY + (collisionBoxSize * 1.5) + characterSpeed * deltaTime <= canvas.height) {
        moveY = characterSpeed * deltaTime;
        moving = true;
        if (currentDirection == 'right')
            currentDirection = 'walkRight';
        if (currentDirection == 'left')
            currentDirection = 'walkLeft';
    }
    if ((keys['ArrowLeft'] || keys['KeyA']) && characterX + (collisionBoxSize * 0.5) - characterSpeed * deltaTime >= 0) {
        moveX = -characterSpeed * deltaTime;
        moving = true;
        currentDirection = 'walkLeft';
    }
    if ((keys['ArrowRight'] || keys['KeyD']) && characterX + (collisionBoxSize * 1.5) + characterSpeed * deltaTime <= canvas.width) {
        moveX = characterSpeed * deltaTime;
        moving = true;
        currentDirection = 'walkRight';
    }
    if(moveX == 0 && moveY == 0 && currentDirection != 'right' && currentDirection == 'walkRight') {
        currentFrameIndex = 0;
        currentDirection = 'right';
    }
    else if(moveX == 0 && moveY == 0 && currentDirection != 'left' && currentDirection == 'walkLeft') {
        currentFrameIndex = 0;
        currentDirection = 'left';
    }
    
    // Courir
    if (keys['Space']) {
        characterSpeed = characterRunSpeed;
    }
    if (!keys['Space']) {
        characterSpeed = characterWalkSpeed;
    }

    // Montrer les collisions
    if (keys['ShiftLeft'] &&  showCollision == false && hasBeenRelease == true) {
        showCollision = true;
        hasBeenRelease = false;
    }
    else if (keys['ShiftLeft'] &&  showCollision == true && hasBeenRelease == true) {
        showCollision = false;
        hasBeenRelease = false;
    }
    if (!keys['ShiftLeft'])
    {
        hasBeenRelease = true;
    }

    // Ajuster la vitesse en diagonale
    if (moveX !== 0 && moveY !== 0) {
        moveX /= Math.sqrt(2);
        moveY /= Math.sqrt(2);
    }
    
    // Calculer la nouvelle position de la boîte de collision
    const newCollisionX = characterX + moveX + (characterSize - collisionBoxSize) / 2;
    const newCollisionY = characterY + moveY + (characterSize - collisionBoxSize) / 2 + collisionOffsetY;
    
    // Vérifier les nouvelles positions
    if (isCollisionBoxValid(newCollisionX, characterY + (characterSize - collisionBoxSize) / 2 + collisionOffsetY, collisionBoxSize, collisionBoxSize)) {
        characterX += moveX;
    }
    if (isCollisionBoxValid(characterX + (characterSize - collisionBoxSize) / 2, newCollisionY, collisionBoxSize, collisionBoxSize)) {
        characterY += moveY;
    }

    // Jouer le son de pas si le personnage se déplace et que l'intervalle est écoulé
    if (moving && (timestamp - lastFootstepTime) / 1000 > footstepInterval) {
        playSound(footStepSound);
        lastFootstepTime = timestamp;
    }

    // Vérifier les collisions avec les pièces
    if (currentCoin && currentCoin.checkCollision(characterX + (characterSize - collisionBoxSize) / 2, characterY + (characterSize - collisionBoxSize) / 2 + collisionOffsetY, collisionBoxSize)) {
        score += 1;
        playSound(coinSound); // Jouer le son de pièce
        updateScore();
        placeRandomCoin();
    }
    // Mettre à jour l'animation de la pièce
    if (currentCoin) {
        currentCoin.update(deltaTime);
    }
}

// ------------------------------------------------------------- DEATH -------------------------------------------------------------

function updateDeath(deltaTime) {
    if (currentFrameIndex == 2) {
        frameRate = 0;
        // Afficher le bouton de retour au menu principal
        const retryButton = document.getElementById('retryButton');
        retryButton.style.display = 'block';
    }
}

// Ajouter un écouteur d'événements au bouton pour recharger la page
document.getElementById('retryButton').addEventListener('click', function() {
    /*GameMusic.pause();
    deathMusic.pause()
    backgroundMusic.currentTime = 0;
    backgroundMusic.play();*/
    blopSound.play();
    localStorage.setItem('showMainMenu', 'true');
    location.reload();
});

// ------------------------------------------------------------- DRAW -------------------------------------------------------------

// Dessiner une boîte de collision
function drawCollisionBox(x, y, width, height) {
    context.strokeStyle = 'red';
    context.lineWidth = 2;
    context.strokeRect(x, y, width, height);
}

function updateCharacterAnimation(deltaTime) {
    frameTime += deltaTime;
    if (frameTime >= 1 / frameRate) {
        currentFrameIndex = (currentFrameIndex + 1) % characterFrames[currentDirection].length;
        frameTime = 0;
    }
}

// Dessiner le personnage à partir du tileset
function drawCharacter(x, y) {
    const frame = characterFrames[currentDirection][currentFrameIndex];
    context.drawImage(
        characterTileset,
        frame.x * charactertileSize, frame.y * charactertileSize, charactertileSize, charactertileSize, // Source rectangle
        x, y, characterSize, characterSize // Destination rectangle
    );
    // Dessiner la boîte de collision du personnage
    const collisionX = x + (characterSize - collisionBoxSize) / 2;
    const collisionY = y + (characterSize - collisionBoxSize) / 2 + collisionOffsetY;
    if (showCollision)
        drawCollisionBox(collisionX, collisionY, collisionBoxSize, collisionBoxSize);
}

function drawBackground(map) {
    const rows = map.length;
    const cols = map[0].length;
    const tileWidth = canvas.width / cols;
    const tileHeight = canvas.height / rows;
    
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            let sprite = tileImages[900];
            let tile = map[row][col];
            /*if(tile != 100)
            {*/
                context.drawImage(
                    sprite.tileset,
                    sprite.x * tileSize, sprite.y * tileSize, (sprite.w * tileSize), (sprite.h * tileSize), // Source rectangle
                    tileWidth * (col - sprite.w + 1), tileHeight * (row - sprite.h + 1), sprite.w * tileWidth, (sprite.h * tileHeight) // Destination rectangle
                );
            //}
        }
    }
}

function drawMap(map) {

    drawBackground(map);
    
    const rows = map.length;
    const cols = map[0].length;
    const tileWidth = canvas.width / cols;
    const tileHeight = canvas.height / rows;

    const characterBaseY = characterY + characterSize - (characterSize / charactertileSize * characterFoot) - 3; // Position en bas à droite du sprite
    const characterRow = Math.floor(characterBaseY / tileHeight);

    for (let row = 0; row < rows; row++)
    {
        for (let col = 0; col < cols; col++)
        {
            let tile = map[row][col];
            if (tile != 900)
            {
                    let sprite = tileImages[tile];
                context.drawImage(
                    sprite.tileset,
                    sprite.x * tileSize, sprite.y * tileSize, (sprite.w * tileSize), (sprite.h * tileSize), // Source rectangle
                    tileWidth * (col - (sprite.w-1)/2 + sprite.bonus), tileHeight * (row - sprite.h + 1 + sprite.bonus2), sprite.w * tileWidth, (sprite.h * tileHeight) // Destination rectangle
                );

                // Dessiner la boîte de collision des murs
                if (showCollision && (tile < 900))
                    drawCollisionBox(col * tileWidth, row * tileHeight, tileWidth, tileHeight);
            }

            // Appeler drawCharacter juste après avoir dessiné la case du personnage
            if (row === characterRow) {
                drawCharacter(characterX, characterY);
            }

            // Appeler drawCoin juste après avoir dessiné la case de la pièce
            if (currentCoin) {
                const coinRow = Math.floor(currentCoin.y / tileHeight);
                if (row === coinRow) {
                    currentCoin.draw(context);
                }
            }
        }
    }
}

// Dessiner les ennemis
function drawEnemies() {
    for (const enemy of enemies) {
        enemy.draw(context);
    }
}

function draw() {
    drawMap(map);
    drawEnemies();
    if(currentCoin && showCollision)
        currentCoin.drawCollisionBox(context);

    // Dessiner l'avertissement si présent
    if (warning) { // Afficher l'avertissement pendant 3 secondes
        drawWarning();
    }
}

// Fonction pour dessiner l'avertissement
const warningImage = new Image();
warningImage.src = 'src/warning.png'; // Chemin vers l'image de l'avertissement
const width = 80; // Largeur 2x plus grande
const height = 80; // Hauteur 2x plus grande
function drawWarning() {

    // Attendez que l'image soit chargée avant de la dessiner
        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;

        let x = 0;
        let y = 0;

        if (warningPosition == 1) {
            // Bord nord (haut)
            x = (canvasWidth - width) / 2;
            y = 0;
        } else if (warningPosition == 2) {
            // Bord est (droite)
            x = canvasWidth - width;
            y = (canvasHeight - height) / 2;
        } else if (warningPosition == 3) {
            // Bord sud (bas)
            x = (canvasWidth - width) / 2;
            y = canvasHeight - height;
        } else if (warningPosition == 4) {
            // Bord ouest (gauche)
            x = 0;
            y = (canvasHeight - height) / 2;
        }

        context.drawImage(warningImage, x, y, width, height);
}


// ------------------------------------------------------------- PAUSE -------------------------------------------------------------
let isPaused = false;
let lastPauseTime = 0;

const pauseButton = document.getElementById('pauseButton');
const resumeButton = document.getElementById('resumeButton');
const pauseMenu = document.getElementById('pauseMenu');
const gameSection = document.getElementById('gameSection');
const pauseVolume = document.getElementById('pauseVolume');
//const volumeControl = document.getElementById('volume'); // Assurez-vous que cet élément existe

pauseButton.addEventListener('click', () => {
    pauseGame();
});

resumeButton.addEventListener('click', () => {
    resumeGame();
});

// Pause the game
function pauseGame() {
    isPaused = true;
    playSound(blopSound);
    lastPauseTime = performance.now(); // Enregistre le temps actuel
    pauseMenu.style.display = 'flex';
    gameSection.classList.add('paused');

    pauseTimers();

    // Synchronize the volume slider
    pauseVolume.value = volumeControl.value;
}

// Resume the game
function resumeGame() {
    isPaused = false;
    playSound(blopSound);
    const pauseDuration = (performance.now() - lastPauseTime) / 1000; // Temps écoulé pendant la pause en secondes
    lastTime += pauseDuration * 1000; // Ajuste lastTime en ajoutant la durée de la pause

    pauseMenu.style.display = 'none';
    gameSection.classList.remove('paused');

    resumeTimers(); // Resume the custom timers
    // Update volume from the pause menu slider
    volumeControl.value = pauseVolume.value;
    updateVolume();
}

// ------------------------------------------------------------- TIMER -------------------------------------------------------------

let customTimeouts = [];
let customIntervals = [];

function customSetTimeout(callback, delay) {
    const timeout = {
        id: Date.now() + Math.random(),
        callback,
        delay,
        start: performance.now(),
        remaining: delay,
        running: true
    };
    customTimeouts.push(timeout);

    timeout.id = setTimeout(() => {
        callback();
        customTimeouts = customTimeouts.filter(t => t.id !== timeout.id);
    }, delay);

    return timeout.id;
}

function customSetInterval(callback, interval) {
    const intervalObj = {
        id: Date.now() + Math.random(),
        callback,
        interval,
        start: performance.now(),
        running: true
    };
    customIntervals.push(intervalObj);

    intervalObj.id = setInterval(callback, interval);

    return intervalObj.id;
}

function pauseTimers() {
    customTimeouts.forEach(timeout => {
        if (timeout.running) {
            clearTimeout(timeout.id);
            timeout.remaining -= performance.now() - timeout.start;
            timeout.running = false;
        }
    });

    customIntervals.forEach(interval => {
        if (interval.running) {
            clearInterval(interval.id);
            interval.running = false;
        }
    });
}

function resumeTimers() {
    customTimeouts.forEach(timeout => {
        if (!timeout.running) {
            timeout.start = performance.now();
            timeout.id = setTimeout(() => {
                timeout.callback();
                customTimeouts = customTimeouts.filter(t => t.id !== timeout.id);
            }, timeout.remaining);
            timeout.running = true;
        }
    });

    customIntervals.forEach(interval => {
        if (!interval.running) {
            interval.id = setInterval(interval.callback, interval.interval);
            interval.running = true;
        }
    });
}

function clearCustomTimeout(id) {
    customTimeouts = customTimeouts.filter(timeout => {
        if (timeout.id === id) {
            clearTimeout(timeout.id);
            return false;
        }
        return true;
    });
}

function clearCustomInterval(id) {
    customIntervals = customIntervals.filter(interval => {
        if (interval.id === id) {
            clearInterval(interval.id);
            return false;
        }
        return true;
    });
}


// ------------------------------------------------------------- OTHER -------------------------------------------------------------

function gRI(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

function getAllPositions(map, tileValue) {
    const positions = [];
    for (let row = 0; row < map.length; row++) {
        for (let col = 0; col < map[row].length; col++) {
            if (map[row][col] >= tileValue ) {
                positions.push({ row: row, col: col });
            }
        }
    }
    return positions;
}

function getRandomPosition(positions) {
    const randomIndex = Math.floor(Math.random() * positions.length);
    return positions[randomIndex];
}

function playSound(sound) {
    const soundClone = sound.cloneNode();
    soundClone.volume = currentVolume; // Définir le volume du clone
    soundClone.play();
}


// ------------------------------------------------------------- BASE -------------------------------------------------------------

// Boucle de jeu
let lastTime = 0;
let startTime = null;
function gameLoop(timestamp)
{
    if (isPaused) {
        requestAnimationFrame(gameLoop);
        return;
    }

    if (!startTime) startTime = timestamp;
    let deltaTime = (timestamp - lastTime) / 1000;
    let elapsedTime = (timestamp - startTime) / 1000;
    lastTime = timestamp;

    if (!isDead)
        update(deltaTime, timestamp);
    else
    updateDeath(deltaTime);
    updateCharacterAnimation(deltaTime);
    updateEnemies(deltaTime);
    draw();

    checkCollisions();

    requestAnimationFrame(gameLoop);
}

// Démarrer le jeu
function startGame()
{
    const scoreElement = document.getElementById('score');
    scoreElement.style.display = 'block';
    ruinsButton.style.display = 'none'; // Masquer le bouton Ruines
    sanctuaryButton.style.display = 'none'; // Masquer le bouton Sanctuaire
    canvas.style.display = 'block';
    updateScore();
    requestAnimationFrame(gameLoop);

    backgroundMusic.pause();
    //backgroundMusic.src = '';

    
    
    const m = BUTTONTYPE;
    if (m ==1)
    {
        GameMusic = gameMusic1;
        map = Ruines;
    }
    if (m ==2)
    {
        GameMusic = gameMusic2;
        map = Sanctuaire;
    }
    if (m ==3)
    {
        GameMusic = gameMusic3;
        map = Canal;
    }

    GameMusic.currentTime = 0;
    GameMusic.play();

    characterSize = baseCharacterSize * (baseMapSize / map.length);
    collisionBoxSize = characterSize / collisionBoxSize; // Taille de la boîte de collision du personnage
    collisionOffsetY = characterSize / collisionOffsetY;
    characterWalkSpeed = characterSize / characterWalkSpeed * 10;
    characterRunSpeed = characterSize / characterRunSpeed * 10;

    // Obtenir toutes les positions des cases 900
    const positions900 = getAllPositions(map, 900);
    // Sélectionner une position aléatoire parmi les cases 900
    const randomPosition = getRandomPosition(positions900);
    // Mettre à jour les coordonnées initiales du personnage
    const tileWidth = canvas.width / map[0].length;
    const tileHeight = canvas.height / map.length;
    characterX = randomPosition.col * tileWidth - (tileWidth/2);
    characterY = randomPosition.row * tileHeight - (tileHeight);

    playSound(blopSound);


    customSetTimeout(() => {
        spawnEnemy();
        placeRandomCoin();
    
        // Then spawn enemies every 10 seconds
        customSetInterval(spawnEnemy, 10000); // 10000 ms = 10 seconds
    }, 5000); // 5000 ms = 5 seconds    
}

// Assurez-vous que les images sont chargées avant de démarrer la boucle de jeu
characterTileset.onload = function() {
    enemyImage.onload = function() {
        tilesetGround.onload = function() {
            // Le jeu commencera lorsque le bouton sera cliqué
        };
    };
};
