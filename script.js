import { tilesetGround, tileSize, tileImages } from './tiles.js';

// Obtenir les éléments du DOM
const startButton = document.getElementById('startButton');
const canvas = document.getElementById('gameCanvas');
const context = canvas.getContext('2d');
const backgroundMusic = document.getElementById('backgroundMusic');
const gameMusic = document.getElementById('gameMusic');
const deathMusic = document.getElementById('deathMusic');


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

// ------------------------------------------------------------- INIT -------------------------------------------------------------

let showCollision = false;

// Variables du personnage
let characterSize = 0;
const baseCharacterSize = 150; // Taille du personnage pour une carte de 10 cases
const baseMapSize = 10; // Taille de la carte de base (10 cases)
let collisionBoxSize = 50; // Taille de la boîte de collision du personnage
let collisionOffsetY = 30;
let characterX = canvas.width / 2 - characterSize / 2;
let characterY = canvas.height / 2 - characterSize / 2;
let characterWalkSpeed = 0; // Pixels par seconde
let characterRunSpeed = 0; // Pixels par seconde
let characterSpeed = 300; // Pixels par seconde
let isDead = false;

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
const characterFoot = 4;
let currentDirection = 'left';
let currentFrameIndex = 0;
let frameRate = 10; // Nombre de frames par seconde
let frameTime = 0;

// MAPS
let map;

const map1 = [
    [101, 133, 138, 138, 138, 138, 138, 138, 130, 101, 101, 101, 101],
    [133, 135, 900, 900, 900, 900, 900, 900, 136, 130, 101, 101, 101],
    [141, 900, 900, 900, 301, 900, 300, 900, 900, 139, 101, 101, 101],
    [141, 900, 302, 900, 900, 900, 900, 900, 900, 139, 101, 101, 101],
    [141, 900, 900, 900, 900, 900, 900, 900, 900, 139, 101, 101, 101],
    [141, 900, 900, 900, 900, 900, 900, 303, 900, 139, 101, 101, 101],
    [141, 900, 305, 900, 900, 900, 900, 900, 900, 139, 101, 101, 101],
    [141, 900, 900, 900, 900, 900, 900, 900, 900, 139, 101, 101, 101],
    [132, 134, 900, 900, 900, 900, 304, 900, 137, 131, 101, 101, 101],
    [101, 132, 140, 140, 140, 140, 140, 140, 131, 101, 101, 101, 101],
    [101, 101, 101, 101, 101, 101, 101, 101, 101, 101, 101, 101, 101],
    [101, 101, 101, 101, 101, 101, 101, 101, 101, 101, 101, 101, 101],
    [101, 101, 101, 101, 101, 101, 101, 101, 101, 101, 101, 101, 101]
];

// MAPS
const map2 = [
    [101, 133, 138, 138, 138, 138, 138, 138, 130, 101],
    [133, 135, 900, 900, 900, 900, 900, 900, 136, 130],
    [141, 900, 900, 900, 301, 900, 300, 900, 900, 139],
    [141, 900, 302, 900, 900, 900, 900, 900, 900, 139],
    [141, 900, 900, 900, 900, 900, 900, 900, 900, 139],
    [141, 900, 900, 900, 900, 900, 900, 303, 900, 139],
    [141, 900, 305, 900, 900, 900, 900, 900, 900, 139],
    [141, 900, 900, 900, 900, 900, 900, 900, 900, 139],
    [132, 134, 900, 900, 900, 900, 304, 900, 137, 131],
    [101, 132, 140, 140, 140, 140, 140, 140, 131, 101]
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
        if (showCollision) {
            this.drawCollisionBox(context);
        }
    }

    drawCollisionBox(context) {
        const collisionX = this.x + (this.size - this.size) / 2;
        const collisionY = this.y + (this.size - this.size) / 2;
        context.strokeStyle = 'red';
        context.lineWidth = 2;
        context.strokeRect(collisionX, collisionY, this.size, this.size);
    }

    checkCollision(characterX, characterY, characterSize) {
        const coinCenterX = this.x + this.size / 2;
        const coinCenterY = this.y + this.size / 2;
        const characterCenterX = characterX + characterSize / 2;
        const characterCenterY = characterY + characterSize / 2;
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
    const coinSize = tileWidth * 0.8; // Taille de la pièce
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
    constructor(x, y, size, speedX, speedY, image, frames, tileSize, frameRate) {
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
    new Enemy(100, 100, gRI(50, 100), gRI(50, 300), gRI(50, 300), enemyImage, enemyFrames, enemyTileSize, enemyFrameRate),
    new Enemy(700, 100, gRI(50, 100), -gRI(50, 300), gRI(50, 300), enemyImage, enemyFrames, enemyTileSize, enemyFrameRate),
    new Enemy(100, 700, gRI(50, 100), gRI(50, 300), -gRI(50, 300), enemyImage, enemyFrames, enemyTileSize, enemyFrameRate),
    new Enemy(700, 700, gRI(50, 100), -gRI(50, 300), -gRI(50, 300), enemyImage, enemyFrames, enemyTileSize, enemyFrameRate),
];


// Fonction pour ajouter un ennemi
function addEnemy() {
    const newEnemy = new Enemy(gRI(0, canvas.width), gRI(0, canvas.height), gRI(20, 70), gRI(50, 300), gRI(50, 300), enemyImage);
    enemies.push(newEnemy);
}

// Fonction pour enlever un ennemi spécifique
function removeEnemy(enemy) {
    const index = enemies.indexOf(enemy);
    if (index > -1) {
        enemies.splice(index, 1);
    }
}

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
            gameMusic.pause();
            deathMusic.play();
            if (currentDirection == 'right' || currentDirection == 'walkRight')
                currentDirection = 'deadRight';
            else if (currentDirection == 'left' || currentDirection == 'walkLeft')
                currentDirection = 'deadLeft';
        }
    }
}

// ------------------------------------------------------------- UPDATE -------------------------------------------------------------

// Vérifier si une position est valide (ne contient pas d'obstacle)
function isPositionValid(collisionX, collisionY) {
    const row = Math.floor(collisionY / (canvas.height / map.length));
    const col = Math.floor(collisionX / (canvas.width / map[0].length));
    if (row < 0 || row >= map.length || col < 0 || col >= map[0].length) {
        return false;
    }
    const tile = map[row][col];
    return tile == 900;
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
function update(deltaTime) {
    let moveX = 0;
    let moveY = 0;

    // Mouvement
    
    if ((keys['ArrowUp'] || keys['KeyW']) && characterY + (collisionBoxSize * 0.5) - characterSpeed * deltaTime >= 0) {
        moveY = -characterSpeed * deltaTime;
        if (currentDirection == 'right')
            currentDirection = 'walkRight';
        if (currentDirection == 'left')
            currentDirection = 'walkLeft';
    }
    if ((keys['ArrowDown'] || keys['KeyS']) && characterY + (collisionBoxSize * 1.5) + characterSpeed * deltaTime <= canvas.height) {
        moveY = characterSpeed * deltaTime;
        if (currentDirection == 'right')
            currentDirection = 'walkRight';
        if (currentDirection == 'left')
            currentDirection = 'walkLeft';
    }
    if ((keys['ArrowLeft'] || keys['KeyA']) && characterX + (collisionBoxSize * 0.5) - characterSpeed * deltaTime >= 0) {
        moveX = -characterSpeed * deltaTime;
        currentDirection = 'walkLeft';
    }
    if ((keys['ArrowRight'] || keys['KeyD']) && characterX + (collisionBoxSize * 1.5) + characterSpeed * deltaTime <= canvas.width) {
        moveX = characterSpeed * deltaTime;
        currentDirection = 'walkRight';
    }
    if(moveX == 0 && moveY == 0 && currentDirection != 'right' && currentDirection == 'walkRight')
    {
        currentFrameIndex = 0;
        currentDirection = 'right';
    }
    else if(moveX == 0 && moveY == 0 && currentDirection != 'left' && currentDirection == 'walkLeft')
    {
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
    if (keys['ShiftLeft']) {
        showCollision = true;
    }
    if (!keys['ShiftLeft']) {
        showCollision = false;
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

    // Vérifier les collisions avec les pièces
    if (currentCoin && currentCoin.checkCollision(characterX + (characterSize - collisionBoxSize) / 2, characterY + (characterSize - collisionBoxSize) / 2 + collisionOffsetY, collisionBoxSize)) {
        score += 1;
        updateScore();
        placeRandomCoin();
    }
    // Mettre à jour l'animation de la pièce
    if (currentCoin) {
        currentCoin.update(deltaTime);
    }
}

function updateDeath(deltaTime) {
    if (currentFrameIndex == 2)
    {
        alert('Vous vous êtes pris un sacré coup !');
        location.reload();
    }
}


// ------------------------------------------------------------- DRAW -------------------------------------------------------------

// Dessiner une boîte de collision
function drawCollisionBox(x, y, width, height) {
    context.strokeStyle = 'red';
    context.lineWidth = 2;
    context.strokeRect(x, y, width, height);
}

// Dessiner un message sur l'écran
function drawMessage(message) {
    context.font = '48px Arial';
    context.fillStyle = 'black';
    context.textAlign = 'center';
    context.fillText(message, canvas.width / 2, canvas.height / 2);
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
            context.drawImage(
                sprite.tileset,
                sprite.x * tileSize, sprite.y * tileSize, (sprite.w * tileSize), (sprite.h * tileSize), // Source rectangle
                tileWidth * (col - sprite.w + 1), tileHeight * (row - sprite.h + 1), sprite.w * tileWidth, (sprite.h * tileHeight) // Destination rectangle
            );
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
                    tileWidth * (col - (sprite.w-1)/2), tileHeight * (row - sprite.h + 1), sprite.w * tileWidth, (sprite.h * tileHeight) // Destination rectangle
                );

                // Dessiner la boîte de collision des murs
                if (showCollision)
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
        if (showCollision)
            drawCollisionBox(enemy.x, enemy.y, enemy.size, enemy.size);
    }
}

// Effacer le canevas et redessiner le personnage
function draw() {
    drawMap(map);
    drawEnemies();
}

// ------------------------------------------------------------- OTHER -------------------------------------------------------------

function gRI(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

function getAllPositions(map, tileValue) {
    const positions = [];
    for (let row = 0; row < map.length; row++) {
        for (let col = 0; col < map[row].length; col++) {
            if (map[row][col] === tileValue) {
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

// ------------------------------------------------------------- BASE -------------------------------------------------------------

// Boucle de jeu
let lastTime = 0;
let startTime = null;
function gameLoop(timestamp) {
    if (!startTime) startTime = timestamp;
    let deltaTime = (timestamp - lastTime) / 1000;
    let elapsedTime = (timestamp - startTime) / 1000;
    lastTime = timestamp;

    if (!isDead)
        update(deltaTime);
    else
    updateDeath(deltaTime);
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
    const scoreElement = document.getElementById('score');
    scoreElement.style.display = 'block';
    startButton.style.display = 'none';
    canvas.style.display = 'block';
    updateScore();
    requestAnimationFrame(gameLoop);

    backgroundMusic.pause();
    backgroundMusic.src = '';
    gameMusic.play();

    const m = gRI(1, 3);
    if (m ==1)
        map = map1;
    if (m ==2)
        map = map2;

    characterSize = baseCharacterSize * (baseMapSize / map.length);
    collisionBoxSize = characterSize / 3; // Taille de la boîte de collision du personnage
    collisionOffsetY = characterSize / 5;
    characterWalkSpeed = characterSize / 5 * 10;
    characterRunSpeed = characterSize / 3 * 10;

    // Obtenir toutes les positions des cases 900
    const positions900 = getAllPositions(map, 900);
    // Sélectionner une position aléatoire parmi les cases 900
    const randomPosition = getRandomPosition(positions900);
    // Mettre à jour les coordonnées initiales du personnage
    const tileWidth = canvas.width / map[0].length;
    const tileHeight = canvas.height / map.length;
    characterX = randomPosition.col * tileWidth - (tileWidth/2);
    characterY = randomPosition.row * tileHeight - (tileHeight);

    // Ajouter les ennemis après 3 secondes
    setTimeout(() => {
        enemies.push(...initialEnemies);
        placeRandomCoin();
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
