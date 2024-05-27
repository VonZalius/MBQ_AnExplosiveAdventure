import { tilesetGround, tileSize, tileImages } from './tiles.js';

// Obtenir les éléments du DOM
const startButton = document.getElementById('startButton');
const canvas = document.getElementById('gameCanvas');
const context = canvas.getContext('2d');
const backgroundMusic = document.getElementById('backgroundMusic');
const gameMusic = document.getElementById('gameMusic');


// Désactiver le lissage d'image pour préserver la netteté des sprites en pixel art
context.imageSmoothingEnabled = false;

// ------------------------------------------------------------- INIT -------------------------------------------------------------

let showCollision = false;

// Variables du personnage
let characterSize = 150;
const collisionBoxSize = 50; // Taille de la boîte de collision du personnage
const collisionOffsetY = 30;
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
enemyImage.src = 'src/mur.png';

// MAPS
const map1 = [
    [101, 133, 138, 138, 138, 138, 138, 138, 130, 101],
    [133, 135, 100, 100, 100, 100, 100, 100, 136, 130],
    [141, 100, 100, 100, 100, 100, 100, 100, 100, 139],
    [141, 100, 100, 100, 100, 100, 100, 100, 100, 139],
    [141, 100, 100, 100, 100, 100, 100, 100, 100, 139],
    [141, 100, 100, 100, 100, 100, 100, 100, 100, 139],
    [141, 100, 100, 100, 100, 100, 100, 100, 100, 139],
    [141, 100, 100, 100, 100, 100, 100, 100, 100, 139],
    [132, 134, 100, 100, 100, 100, 100, 100, 137, 131],
    [101, 132, 140, 140, 140, 140, 140, 140, 131, 101],
];

//const m = gRI(1, 1);

// Suivre les touches enfoncées
const keys = {};
// Ajouter des écouteurs pour les événements de touche
document.addEventListener('keydown', function(event) {
    keys[event.code] = true;
});
document.addEventListener('keyup', function(event) {
    keys[event.code] = false;
});

// ------------------------------------------------------------- ENEMY -------------------------------------------------------------

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
            alert('Vous avez été touché par un ennemi !');
            // Réinitialiser le jeu
            location.reload();
        }
    }
}

// ------------------------------------------------------------- UPDATE -------------------------------------------------------------

// Vérifier si une position est valide (ne contient pas d'obstacle)
function isPositionValid(collisionX, collisionY) {
    const row = Math.floor(collisionY / (canvas.height / map1.length));
    const col = Math.floor(collisionX / (canvas.width / map1[0].length));
    if (row < 0 || row >= map1.length || col < 0 || col >= map1[0].length) {
        return false;
    }
    const tile = map1[row][col];
    return tile == 100;
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
    }
    if ((keys['ArrowDown'] || keys['KeyS']) && characterY + (collisionBoxSize * 1.5) + characterSpeed * deltaTime <= canvas.height) {
        moveY = characterSpeed * deltaTime;
    }
    if ((keys['ArrowLeft'] || keys['KeyA']) && characterX + (collisionBoxSize * 0.5) - characterSpeed * deltaTime >= 0) {
        moveX = -characterSpeed * deltaTime;
        currentDirection = 'left';
    }
    if ((keys['ArrowRight'] || keys['KeyD']) && characterX + (collisionBoxSize * 1.5) + characterSpeed * deltaTime <= canvas.width) {
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
}

// ------------------------------------------------------------- OTHER -------------------------------------------------------------

function gRI(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
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

            // Dessiner la boîte de collision des murs
            if (tile != 100) {
                if (showCollision)
                    drawCollisionBox(col * tileWidth, row * tileHeight, tileWidth, tileHeight);
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
    /*if(m == 1)
        drawMap(map1);
    else if(m == 2)*/
        drawMap(map1);
    drawCharacter(characterX, characterY);
    drawEnemies();
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

    backgroundMusic.pause();
    gameMusic.play();

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
