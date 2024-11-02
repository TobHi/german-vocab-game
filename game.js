import vocabulary from './data/vocabulary.js';

// Constants and configurations
const COLORS = {
    WHITE: '#FFFFFF',
    BLACK: '#000000',
    RED: '#FF0000',
    GRAY: '#808080',
    BLUE: '#6464FF',
    GREEN: '#00FF00',
    GREEN_CHECK: '#00FF00',
    RED_X: '#FF0000'
};

class VocabQuiz {
    constructor() {
        this.currentWord = null;
        this.options = [];
        this.correctAnswer = null;
        this.score = 0;
        this.wordSuccess = {};
        this.feedbackTimer = 0;
        this.feedbackType = null;
        this.availableVocab = { ...vocabulary };
        this.newQuestion();
    }

    newQuestion() {
        if (Object.keys(this.availableVocab).length === 0) return false;
        
        const words = Object.keys(this.availableVocab);
        this.currentWord = words[Math.floor(Math.random() * words.length)];
        this.options = [...this.availableVocab[this.currentWord]];
        this.correctAnswer = this.options[0];
        this.shuffleArray(this.options);
        
        if (!this.wordSuccess[this.currentWord]) {
            this.wordSuccess[this.currentWord] = 0;
        }
        return true;
    }

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    updateScore(isCorrect) {
        if (isCorrect) {
            this.score += 10;
            this.wordSuccess[this.currentWord]++;
            if (this.wordSuccess[this.currentWord] >= 3) {
                delete this.availableVocab[this.currentWord];
            }
        } else {
            this.score = Math.max(0, this.score - 1);
        }
    }

    draw(ctx, canvas, scaleX) {
        const fontSize = Math.floor(96 * scaleX);
        ctx.font = `${fontSize}px 'Open Sans', Arial, sans-serif`;
        ctx.fillStyle = COLORS.BLACK;
        
        // Draw word background
        const textMetrics = ctx.measureText(this.currentWord);
        const padding = 20 * scaleX;
        const x = canvas.width / 2;
        const y = 50 * scaleX;
        
        ctx.fillStyle = COLORS.WHITE;
        ctx.fillRect(
            x - textMetrics.width/2 - padding,
            y - fontSize/2 - padding,
            textMetrics.width + 2*padding,
            fontSize + 2*padding
        );
        
        // Draw word
        ctx.fillStyle = COLORS.BLACK;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.currentWord, x, y);

        if (this.feedbackTimer > 0) {
            this.feedbackTimer--;
            if (this.feedbackType === 'correct') {
                this.drawCheckmark(ctx, scaleX);
            } else {
                this.drawX(ctx, scaleX);
            }
        }
    }

    showFeedback(isCorrect) {
        this.feedbackType = isCorrect ? 'correct' : 'incorrect';
        this.feedbackTimer = 60;
    }

    drawCheckmark(ctx, scaleX) {
        const startX = ctx.canvas.width - Math.floor(50 * scaleX);
        const startY = Math.floor(30 * scaleX);
        const lineWidth = Math.floor(5 * scaleX);
        
        ctx.strokeStyle = COLORS.GREEN_CHECK;
        ctx.lineWidth = lineWidth;
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(startX - Math.floor(20 * scaleX), startY + Math.floor(20 * scaleX));
        ctx.lineTo(startX - Math.floor(40 * scaleX), startY - Math.floor(20 * scaleX));
        ctx.stroke();
    }

    drawX(ctx, scaleX) {
        const centerX = ctx.canvas.width - Math.floor(50 * scaleX);
        const centerY = Math.floor(30 * scaleX);
        const size = Math.floor(20 * scaleX);
        const lineWidth = Math.floor(5 * scaleX);
        
        ctx.strokeStyle = COLORS.RED_X;
        ctx.lineWidth = lineWidth;
        ctx.beginPath();
        ctx.moveTo(centerX - size, centerY - size);
        ctx.lineTo(centerX + size, centerY + size);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(centerX - size, centerY + size);
        ctx.lineTo(centerX + size, centerY - size);
        ctx.stroke();
    }

    // ... rest of VocabQuiz methods ...
}

class Car {
    constructor(canvas) {
        this.canvas = canvas;
        this.baseWidth = 30;
        this.baseHeight = 45;
        this.baseX = 400 - this.baseWidth / 2;
        this.baseY = 500;
        this.baseSpeed = 5;
        this.scaleX = 1;
        this.scaleY = 1;
        this.movingLeft = false;
        this.movingRight = false;
        this.updateScale(1, 1);
    }

    updateScale(scaleX, scaleY) {
        this.scaleX = scaleX;
        this.scaleY = scaleY;
        this.width = Math.floor(this.baseWidth * scaleX);
        this.height = Math.floor(this.baseHeight * scaleY);
        this.x = Math.floor(this.baseX * scaleX);
        this.y = Math.floor(this.baseY * scaleY);
        this.speed = Math.floor(this.baseSpeed * scaleX);
    }

    startMoving(direction) {
        if (direction === "left") this.movingLeft = true;
        if (direction === "right") this.movingRight = true;
    }

    stopMoving(direction) {
        if (direction === "left") this.movingLeft = false;
        if (direction === "right") this.movingRight = false;
    }

    update() {
        if (this.movingLeft && this.baseX > 0) {
            this.baseX -= this.baseSpeed;
        }
        if (this.movingRight && this.baseX < (this.canvas.width / this.scaleX) - this.baseWidth) {
            this.baseX += this.baseSpeed;
        }
        this.x = Math.floor(this.baseX * this.scaleX);
    }

    draw(ctx) {
        ctx.fillStyle = COLORS.RED;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

class Obstacle {
    constructor(word = null, isCorrect = false) {
        this.baseWidth = 100;
        this.baseHeight = 50;
        this.baseY = -this.baseHeight;
        this.baseSpeed = 1.36;
        this.word = word;
        this.isCorrect = isCorrect;
        this.x = 0;
        this.scaleX = 1;
        this.scaleY = 1;
        this.updateScale(1, 1);
    }

    updateScale(scaleX, scaleY) {
        this.scaleX = scaleX;
        this.scaleY = scaleY;
        this.width = Math.floor(this.baseWidth * scaleX);
        this.height = Math.floor(this.baseHeight * scaleY);
        this.y = Math.floor(this.baseY * scaleY);
        this.speed = this.baseSpeed * scaleY;
    }

    move() {
        this.baseY += this.baseSpeed;
        this.y = Math.floor(this.baseY * this.scaleY);
    }

    draw(ctx) {
        ctx.fillStyle = COLORS.BLACK;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        if (this.word) {
            const fontSize = Math.floor(24 * this.scaleX);
            ctx.font = `${fontSize}px 'Open Sans', Arial, sans-serif`;
            ctx.fillStyle = COLORS.WHITE;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(this.word, this.x + this.width/2, this.y + this.height/2);
        }
    }
}

class ObstacleManager {
    constructor() {
        this.spawnQueue = [];
        this.spawnTimer = 0;
        this.spawnInterval = 45;
        this.wordsBeingSpawned = false;
    }

    queueNewWords(options, correctAnswer, canvasWidth) {
        const laneWidth = canvasWidth / 5;
        const xPositions = Array.from({length: 5}, (_, i) => i * laneWidth);
        this.shuffleArray(xPositions);
        
        this.spawnQueue = options.map((option, i) => ({
            word: option,
            x: xPositions[i],
            isCorrect: option === correctAnswer
        }));
        this.wordsBeingSpawned = true;
    }

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    update(obstacles) {
        if (this.spawnQueue.length === 0) {
            this.wordsBeingSpawned = false;
            return false;
        }

        this.spawnTimer++;
        if (this.spawnTimer >= this.spawnInterval) {
            const wordData = this.spawnQueue.shift();
            const obstacle = new Obstacle(wordData.word, wordData.isCorrect);
            obstacle.x = wordData.x;
            obstacles.push(obstacle);
            this.spawnTimer = 0;
        }
        
        return true;
    }
}

// Update the Game class's update and draw methods
class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.baseWidth = 800;
        this.baseHeight = 600;
        
        // Initialize empty arrays and objects first
        this.obstacles = [];
        
        // Initialize game objects
        this.car = new Car(this.canvas);  // Pass canvas to Car
        this.vocabQuiz = new VocabQuiz();
        this.obstacleManager = new ObstacleManager();
        
        // Game state
        this.score = 0;
        this.gameOver = false;
        this.lastSpawnTime = 0;
        this.spawnCooldown = 3000; // 3 seconds
        
        // Now call resize after everything is initialized
        this.resize();
        
        // Event listeners
        window.addEventListener('resize', () => this.resize());
        this.setupControls();
        
        // Add orientation change listener
        window.addEventListener('orientationchange', () => {
            setTimeout(() => this.resize(), 100); // Small delay to ensure new dimensions are available
        });
        
        // Start game loop
        this.gameLoop();
    }

    resize() {
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;

        // Calculate scale while maintaining aspect ratio
        const gameAspectRatio = this.baseWidth / this.baseHeight;
        const windowAspectRatio = windowWidth / windowHeight;

        let newWidth, newHeight;

        if (windowAspectRatio > gameAspectRatio) {
            // Window is wider than game ratio
            newHeight = windowHeight;
            newWidth = newHeight * gameAspectRatio;
        } else {
            // Window is taller than game ratio
            newWidth = windowWidth;
            newHeight = newWidth / gameAspectRatio;
        }

        this.canvas.width = newWidth;
        this.canvas.height = newHeight;

        // Update scale factors
        this.scaleX = newWidth / this.baseWidth;
        this.scaleY = newHeight / this.baseHeight;

        // Scale the context to maintain crisp rendering
        this.ctx.scale(this.scaleX, this.scaleY);

        // Update game objects with new scale
        if (this.car) {
            this.car.updateScale(this.scaleX, this.scaleY);
        }
        if (this.obstacles && this.obstacles.length > 0) {
            this.obstacles.forEach(obstacle => obstacle.updateScale(this.scaleX, this.scaleY));
        }
    }

    setupControls() {
        // Touch controls
        document.addEventListener('touchstart', (e) => {
            e.preventDefault();  // Prevent default touch behavior
            const touch = e.touches[0];
            if (touch.clientX < window.innerWidth / 2) {
                this.car.startMoving("left");
                document.getElementById('touchLeft').classList.add('touch-active');
            } else {
                this.car.startMoving("right");
                document.getElementById('touchRight').classList.add('touch-active');
            }
        });

        document.addEventListener('touchend', (e) => {
            e.preventDefault();  // Prevent default touch behavior
            this.car.stopMoving("left");
            this.car.stopMoving("right");
            document.getElementById('touchLeft').classList.remove('touch-active');
            document.getElementById('touchRight').classList.remove('touch-active');
        });

        document.addEventListener('touchcancel', (e) => {
            e.preventDefault();  // Prevent default touch behavior
            this.car.stopMoving("left");
            this.car.stopMoving("right");
            document.getElementById('touchLeft').classList.remove('touch-active');
            document.getElementById('touchRight').classList.remove('touch-active');
        });

        // Keyboard controls
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.car.startMoving("left");
            if (e.key === 'ArrowRight') this.car.startMoving("right");
            if (e.key === 'Escape') this.gameOver = true;
        });

        document.addEventListener('keyup', (e) => {
            if (e.key === 'ArrowLeft') this.car.stopMoving("left");
            if (e.key === 'ArrowRight') this.car.stopMoving("right");
        });
    }

    gameLoop() {
        if (this.gameOver) {
            this.showGameOver();
            return;
        }

        this.update();
        this.draw();
        requestAnimationFrame(() => this.gameLoop());
    }

    update() {
        const currentTime = Date.now();
        
        // Update car position
        this.car.update();
        
        // Spawn new words if needed
        if (!this.obstacleManager.wordsBeingSpawned && 
            currentTime - this.lastSpawnTime > this.spawnCooldown) {
            this.obstacleManager.queueNewWords(
                this.vocabQuiz.options,
                this.vocabQuiz.correctAnswer,
                this.canvas.width
            );
            this.lastSpawnTime = currentTime;
        }

        // Update obstacle spawning
        this.obstacleManager.update(this.obstacles);

        // Update obstacles
        for (let i = this.obstacles.length - 1; i >= 0; i--) {
            const obstacle = this.obstacles[i];
            obstacle.move();
            
            // Remove off-screen obstacles
            if (obstacle.y > this.canvas.height) {
                this.obstacles.splice(i, 1);
                continue;
            }

            // Check collision with car
            if (this.checkCollision(this.car, obstacle)) {
                if (obstacle.word === this.vocabQuiz.correctAnswer) {
                    this.vocabQuiz.updateScore(true);
                    this.vocabQuiz.showFeedback(true);
                    if (this.vocabQuiz.newQuestion()) {
                        this.lastSpawnTime = currentTime;
                    } else {
                        this.gameOver = true;
                    }
                } else {
                    this.vocabQuiz.updateScore(false);
                    this.vocabQuiz.showFeedback(false);
                }
                this.obstacles.splice(i, 1);
            }
        }
    }

    checkCollision(car, obstacle) {
        return car.x < obstacle.x + obstacle.width &&
               car.x + car.width > obstacle.x &&
               car.y < obstacle.y + obstacle.height &&
               car.y + car.height > obstacle.y;
    }

    draw() {
        // Clear canvas
        this.ctx.fillStyle = COLORS.GRAY;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw game elements
        this.vocabQuiz.draw(this.ctx, this.canvas, this.scaleX);
        this.car.draw(this.ctx);
        this.obstacles.forEach(obstacle => obstacle.draw(this.ctx));

        // Draw score
        const fontSize = Math.floor(36 * this.scaleX);
        this.ctx.font = `${fontSize}px 'Open Sans', Arial, sans-serif`;
        this.ctx.fillStyle = COLORS.WHITE;
        this.ctx.textAlign = 'left';
        this.ctx.fillText(`Score: ${this.vocabQuiz.score}`, 10 * this.scaleX, 10 * this.scaleX);
    }

    showGameOver() {
        // Implement game over logic
    }
}

// Start the game when the page loads
window.onload = () => {
    new Game();
};