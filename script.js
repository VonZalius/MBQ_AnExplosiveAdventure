
// Obtenir les éléments du DOM
const startButton = document.getElementById('startButton');
const canvas = document.getElementById('gameCanvas');
const context = canvas.getContext('2d');

// Variables du personnage
const characterSize = 50;
let characterX = canvas.width / 2 - characterSize / 2;
let characterY = canvas.height / 2 - characterSize / 2;
const characterSpeed = 300; // Pixels par seconde

// Charger les images
const backgroundImage = new Image();
const characterImage = new Image();
const enemyImage = new Image();

backgroundImage.src = 'src/background.png';
characterImage.src = 'src/character.png';
enemyImage.src = 'src/enemy.png';

// Suivre les touches enfoncées
const keys = {};

// Ajouter des écouteurs pour les événements de touche
document.addEventListener('keydown', function(event) {
    keys[event.key] = true;
});

document.addEventListener('keyup', function(event) {
    keys[event.key] = false;
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

// Dessiner le personnage
function drawCharacter(x, y) {
    context.drawImage(characterImage, x, y, characterSize, characterSize);
}

// Effacer le canevas et redessiner le personnage
function draw() {
    context.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
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

    if ((keys['ArrowUp'] || keys['w']) && characterY - characterSpeed * deltaTime >= 0) {
        moveY = -characterSpeed * deltaTime;
    }
    if ((keys['ArrowDown'] || keys['s']) && characterY + characterSize + characterSpeed * deltaTime <= canvas.height) {
        moveY = characterSpeed * deltaTime;
    }
    if ((keys['ArrowLeft'] || keys['a']) && characterX - characterSpeed * deltaTime >= 0) {
        moveX = -characterSpeed * deltaTime;
    }
    if ((keys['ArrowRight'] || keys['d']) && characterX + characterSize + characterSpeed * deltaTime <= canvas.width) {
        moveX = characterSpeed * deltaTime;
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
backgroundImage.onload = function() {
    characterImage.onload = function() {
        enemyImage.onload = function() {
            // Le jeu commencera lorsque le bouton sera cliqué
        };
    };
};
