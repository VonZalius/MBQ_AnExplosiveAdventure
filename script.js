// Obtenir l'élément canvas et son contexte de dessin
const canvas = document.getElementById('gameCanvas');
const context = canvas.getContext('2d');

// Variables du personnage
const characterSize = 50;
let characterX = canvas.width / 2 - characterSize / 2;
let characterY = canvas.height / 2 - characterSize / 2;
const characterSpeed = 5;

// Charger les images
const backgroundImage = new Image();
const characterImage = new Image();

backgroundImage.src = 'src/background.png';
characterImage.src = 'src/character.png';

// Suivre les touches enfoncées
const keys = {};

// Ajouter des écouteurs pour les événements de touche
document.addEventListener('keydown', function(event) {
    keys[event.key] = true;
});

document.addEventListener('keyup', function(event) {
    keys[event.key] = false;
});

// Dessiner le personnage
function drawCharacter(x, y) {
    context.drawImage(characterImage, x, y, characterSize, characterSize);
}

// Effacer le canevas et redessiner le personnage
function draw() {
    context.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
    drawCharacter(characterX, characterY);
}

// Mettre à jour la position du personnage
function update() {
    let moveX = 0;
    let moveY = 0;

    if ((keys['ArrowUp'] || keys['w']) && characterY - characterSpeed >= 0) {
        moveY = -characterSpeed;
    }
    if ((keys['ArrowDown'] || keys['s']) && characterY + characterSize + characterSpeed <= canvas.height) {
        moveY = characterSpeed;
    }
    if ((keys['ArrowLeft'] || keys['a']) && characterX - characterSpeed >= 0) {
        moveX = -characterSpeed;
    }
    if ((keys['ArrowRight'] || keys['d']) && characterX + characterSize + characterSpeed <= canvas.width) {
        moveX = characterSpeed;
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
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Assurez-vous que les images sont chargées avant de démarrer la boucle de jeu
backgroundImage.onload = function() {
    characterImage.onload = function() {
        gameLoop();
    };
};
