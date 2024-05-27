// Obtenir les éléments du DOM
const startButton = document.getElementById('startButton');
const canvas = document.getElementById('gameCanvas');
const context = canvas.getContext('2d');

// Désactiver le lissage d'image pour préserver la netteté des sprites en pixel art
context.imageSmoothingEnabled = false;

// Variables du personnage
const characterSize = 100;
let characterX = canvas.width / 2 - characterSize / 2;
let characterY = canvas.height / 2 - characterSize / 2;
let characterSpeed = 300; // Pixels par seconde
const characterWalkSpeed = 300; // Pixels par seconde
const characterRunSpeed = 500; // Pixels par seconde

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
    ]
};
const charactertileSize = 32; // Taille de chaque case dans le tileset
let currentDirection = 'left';
let currentFrameIndex = 0;
const frameRate = 10; // Nombre de frames par seconde
let frameTime = 0;

//Enemy
const enemyImage = new Image();
enemyImage.src = 'src/enemy.png';

// MAPS
const tilesetGround = new Image();
// const tilesetWater = new Image();
// const tilesetWall = new Image();
tilesetGround.src = 'src/forest_/forest_.png'; // Remplacez par le chemin vers votre tileset de sol
// tilesetWater.src = 'src/water_tileset.png';  // Remplacez par le chemin vers votre tileset d'eau
// tilesetWall.src = 'src/wall_tileset.png';    // Remplacez par le chemin vers votre tileset de mur
const tileSize = 16; // Taille de chaque case dans le tileset
const tileImages = {
    100: { tileset: tilesetGround, x: 1, y: 1 }, // Coordonnées (x, y) de la case 'sol' dans le tilesetGround
    101: { tileset: tilesetGround, x: 1, y: 2 }, // Coordonnées (x, y) de la case 'eau' dans le tilesetWater
    102: { tileset: tilesetGround, x: 2, y: 1 }  // Coordonnées (x, y) de la case 'mur' dans le tilesetWall
};
const map1 = [
    [100, 100, 100, 100, 100],
    [100, 102, 100, 101, 100],
    [100, 100, 100, 100, 100],
    [100, 102, 100, 101, 100],
    [100, 100, 100, 100, 100],
];
const map2 = [
    [100, 100, 100, 100, 100],
    [100, 100, 100, 100, 100],
    [100, 100, 100, 100, 100],
    [100, 100, 100, 100, 100],
    [100, 100, 100, 100, 100],
];
const m = gRI(1, 3);

// Suivre les touches enfoncées
const keys = {};
// Ajouter des écouteurs pour les événements de touche
document.addEventListener('keydown', function(event) {
    keys[event.code] = true;
});
document.addEventListener('keyup', function(event) {
    keys[event.code] = false;
});

// Classe pour les ennemis
class Enemy {
    constructor(x, y, size, speedX, speedY, image) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.speedX = speedX;
        this.speedY = speedY;
        this.image = image;
    }

    update(deltaTime) {
        this.x += this.speedX * deltaTime;
        this.y += this.speedY * deltaTime;

        // Rebondir sur les bords du canvas et ajuster la position pour éviter les glitchs
        if (this.x <= 0) {
            this.x = 0;
            this.speedX = -this.speedX;
        } else if (this.x + this.size >= canvas.width) {
            this.x = canvas.width - this.size;
            this.speedX = -this.speedX;
        }

        if (this.y <= 0) {
            this.y = 0;
            this.speedY = -this.speedY;
        } else if (this.y + this.size >= canvas.height) {
            this.y = canvas.height - this.size;
            this.speedY = -this.speedY;
        }
    }

    draw(context) {
        context.drawImage(this.image, this.x, this.y, this.size, this.size);
    }

    checkCollision(characterX, characterY, characterSize) {
        return (
            this.x < characterX + characterSize &&
            this.x + this.size > characterX &&
            this.y < characterY + characterSize &&
            this.y + this.size > characterY
        );
    }
}

// Variables pour les ennemis
const enemies = [];
const initialEnemies = [
    new Enemy(100, 100, gRI(20, 70), gRI(50, 300), gRI(50, 300), enemyImage),
    new Enemy(700, 100, gRI(20, 70), -gRI(50, 300), gRI(50, 300), enemyImage),
    new Enemy(100, 700, gRI(20, 70), gRI(50, 300), -gRI(50, 300), enemyImage),
    new Enemy(700, 700, gRI(20, 70), -gRI(50, 300), -gRI(50, 300), enemyImage),
    // new Enemy(x, y, size, speedX, speedY, enemyImage)
];

function gRI(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
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
}

function drawMap(map) {
    const rows = map.length;
    const cols = map[0].length;
    const tileWidth = canvas.width / cols;
    const tileHeight = canvas.height / rows;

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            let tile = map[row][col];
            let sprite = tileImages[tile];
            context.drawImage(
                sprite.tileset,
                sprite.x * tileSize, sprite.y * tileSize, tileSize, tileSize, // Source rectangle
                col * tileWidth, row * tileHeight, tileWidth, tileHeight // Destination rectangle
            );
        }
    }
}

// Effacer le canevas et redessiner le personnage
function draw() {
    if(m == 1)
        drawMap(map1);
    else if(m == 2)
        drawMap(map2);
    drawCharacter(characterX, characterY);
    drawEnemies();
}

// Dessiner un message sur l'écran
function drawMessage(message) {
    context.font = '48px Arial';
    context.fillStyle = 'black';
    context.textAlign = 'center';
    context.fillText(message, canvas.width / 2, canvas.height / 2);
}

// Mettre à jour la position des ennemis
function updateEnemies(deltaTime) {
    for (const enemy of enemies) {
        enemy.update(deltaTime);
    }
}

// Dessiner les ennemis
function drawEnemies() {
    for (const enemy of enemies) {
        enemy.draw(context);
    }
}

// Vérifier les collisions avec les ennemis
function checkCollisions() {
    for (const enemy of enemies) {
        if (enemy.checkCollision(characterX, characterY, characterSize)) {
            alert('Vous avez été touché par un ennemi !');
            // Réinitialiser le jeu
            location.reload();
        }
    }
}

// Mettre à jour la position du personnage
function update(deltaTime) {
    let moveX = 0;
    let moveY = 0;

    // Mouvement
    if ((keys['ArrowUp'] || keys['KeyW']) && characterY - characterSpeed * deltaTime >= 0) {
        moveY = -characterSpeed * deltaTime;
    }
    if ((keys['ArrowDown'] || keys['KeyS']) && characterY + characterSize + characterSpeed * deltaTime <= canvas.height) {
        moveY = characterSpeed * deltaTime;
    }
    if ((keys['ArrowLeft'] || keys['KeyA']) && characterX - characterSpeed * deltaTime >= 0) {
        moveX = -characterSpeed * deltaTime;
        currentDirection = 'left';
    }
    if ((keys['ArrowRight'] || keys['KeyD']) && characterX + characterSize + characterSpeed * deltaTime <= canvas.width) {
        moveX = characterSpeed * deltaTime;
        currentDirection = 'right';
    }

    // Courir
    if (keys['Space']) {
        characterSpeed = characterRunSpeed;
    }
    if (!keys['Space']) {
        characterSpeed = characterWalkSpeed;
    }

    // Ajuster la vitesse en diagonale
    if (moveX !== 0 && moveY !== 0) {
        moveX /= Math.sqrt(2);
        moveY /= Math.sqrt(2);
    }

    characterX += moveX;
    characterY += moveY;
}

// Boucle de jeu
let lastTime = 0;
let startTime = null;
function gameLoop(timestamp) {
    if (!startTime) startTime = timestamp;
    let deltaTime = (timestamp - lastTime) / 1000;
    let elapsedTime = (timestamp - startTime) / 1000;
    lastTime = timestamp;

    update(deltaTime);
    updateCharacterAnimation(deltaTime);
    updateEnemies(deltaTime);
    draw();
    if (elapsedTime < 3) {
        drawMessage("Ready?");
    } else {
        checkCollisions();
    }
    requestAnimationFrame(gameLoop);
}

// Démarrer le jeu
function startGame() {
    startButton.style.display = 'none';
    canvas.style.display = 'block';
    requestAnimationFrame(gameLoop);

    // Ajouter les ennemis après 3 secondes
    setTimeout(() => {
        enemies.push(...initialEnemies);
    }, 3000);
}

// Ajouter un écouteur d'événements pour le bouton de démarrage
startButton.addEventListener('click', startGame);

// Assurez-vous que les images sont chargées avant de démarrer la boucle de jeu
characterTileset.onload = function() {
    enemyImage.onload = function() {
        tilesetGround.onload = function() {
            // Le jeu commencera lorsque le bouton sera cliqué
        };
    };
};
