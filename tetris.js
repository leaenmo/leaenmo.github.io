class Tetris {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        
        // 设置画布大小
        this.blockSize = 30; // 每个方块的大小
        this.rows = 20;     // 行数
        this.cols = 10;     // 列数
        
        // 设置画布实际大小
        this.canvas.width = this.cols * this.blockSize;
        this.canvas.height = this.rows * this.blockSize;
        
        // 启用抗锯齿
        this.ctx.imageSmoothingEnabled = true;
        
        // 霓虹风格颜色
        this.colors = [
            'rgba(0,0,0,0)', // 背景透明
            'rgba(255,0,102,1)', // 亮粉红
            'rgba(0,255,102,1)', // 亮绿
            'rgba(51,102,255,1)', // 亮蓝
            'rgba(255,255,0,1)',  // 亮黄
            'rgba(255,51,0,1)',   // 亮红
            'rgba(255,0,255,1)',  // 亮紫
            'rgba(0,255,255,1)'   // 亮青
        ];

        this.glowColors = [
            'rgba(0,0,0,0)',
            'rgba(255,0,102,0.3)',
            'rgba(0,255,102,0.3)',
            'rgba(51,102,255,0.3)',
            'rgba(255,255,0,0.3)',
            'rgba(255,51,0,0.3)',
            'rgba(255,0,255,0.3)',
            'rgba(0,255,255,0.3)'
        ];

        this.board = Array(this.rows).fill().map(() => Array(this.cols).fill(0));
        this.score = 0;
        this.gameOver = false;
        this.currentPiece = null;
        this.dropInterval = 1000;
        this.lastDrop = 0;
        this.previewPieces = [];

        // 定义所有方块形状
        this.shapes = [
            [[1, 1, 0], [0, 1, 1]], // Z
            [[0, 1, 1], [1, 1, 0]], // S
            [[1, 1, 1, 1]], // I
            [[1, 1], [1, 1]], // O
            [[1, 0, 0], [1, 1, 1]], // L
            [[0, 0, 1], [1, 1, 1]], // J
            [[0, 1, 0], [1, 1, 1]]  // T
        ];

        // 生成预览方块
        for(let i = 0; i < 3; i++) {
            this.previewPieces.push(this.generatePiece());
        }

        // 开始动画
        this.startFallingAnimation();
    }

    generatePiece() {
        const shapeIndex = Math.floor(Math.random() * this.shapes.length);
        return {
            shape: this.shapes[shapeIndex],
            color: shapeIndex + 1
        };
    }

    startFallingAnimation() {
        // 在游戏开始前，让方块从顶部落下
        const pieces = [];
        for(let i = 0; i < 5; i++) {
            pieces.push({
                shape: this.shapes[Math.floor(Math.random() * this.shapes.length)],
                color: Math.floor(Math.random() * (this.colors.length - 1)) + 1,
                x: Math.floor(Math.random() * (this.cols - 2)),
                y: -Math.random() * 10
            });
        }

        const animate = () => {
            if(!this.gameOver) {
                this.ctx.fillStyle = this.colors[0];
                this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

                pieces.forEach(piece => {
                    piece.y += 0.1;
                    if(piece.y > this.rows) {
                        piece.y = -2;
                        piece.x = Math.floor(Math.random() * (this.cols - 2));
                    }
                    this.drawPiece(piece);
                });

                requestAnimationFrame(animate);
            }
        };

        animate();
    }

    start() {
        this.gameOver = false;
        this.board = Array(this.rows).fill().map(() => Array(this.cols).fill(0));
        this.score = 0;
        this.currentPiece = this.generatePiece();
        this.previewPieces = [];
        this.previewPieces.push(this.generatePiece());
        this.spawnPiece();
        this.update();

        // 触摸控制变量
        let touchStartX = null;
        let touchStartY = null;
        let lastMoveX = null;

        // 添加鼠标点击和触摸事件用于旋转
        this.canvas.addEventListener('click', () => {
            if (!this.gameOver) {
                this.rotate();
            }
        });

        // 触摸开始
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault(); // 防止滚动
            const touch = e.touches[0];
            touchStartX = touch.clientX;
            touchStartY = touch.clientY;
            lastMoveX = touchStartX;
        });

        // 触摸移动
        this.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            if (!touchStartX || !touchStartY || this.gameOver) return;

            const touch = e.touches[0];
            const currentX = touch.clientX;
            const currentY = touch.clientY;
            const diffX = currentX - lastMoveX;
            const diffY = currentY - touchStartY;

            // 横向移动
            if (Math.abs(diffX) > 20) { // 设置一个阈值，避免过于敏感
                if (diffX > 0) {
                    this.moveRight();
                } else {
                    this.moveLeft();
                }
                lastMoveX = currentX;
            }

            // 下滑加速下落
            if (diffY > 50) { // 设置一个阈值，避免过于敏感
                this.moveDown();
            }
        });

        // 触摸结束
        this.canvas.addEventListener('touchend', () => {
            touchStartX = null;
            touchStartY = null;
            lastMoveX = null;
        });

        // 键盘控制（电脑端）
        document.addEventListener('keydown', (event) => {
            if (this.gameOver) {
                if (event.key === 'Enter') {
                    this.start();
                }
                return;
            }

            switch (event.key) {
                case 'ArrowLeft':
                    this.moveLeft();
                    break;
                case 'ArrowRight':
                    this.moveRight();
                    break;
                case 'ArrowDown':
                    this.moveDown();
                    break;
            }
        });
    }

    spawnPiece() {
        const shape = this.currentPiece.shape;
        this.currentPiece = {
            shape: shape,
            color: this.currentPiece.color,
            x: Math.floor((this.cols - shape[0].length) / 2),
            y: 0
        };
    }

    drawBlock(x, y, color) {
        const ctx = this.ctx;
        const bs = this.blockSize;
        
        // 清除这个位置的之前的内容
        ctx.clearRect(x * bs, y * bs, bs, bs);
        
        // 如果是背景色（0），不绘制任何内容
        if (color === 0) return;
        
        // 设置发光效果
        ctx.shadowColor = this.colors[color];
        ctx.shadowBlur = 10;
        
        // 绘制主体方块
        ctx.fillStyle = this.colors[color];
        ctx.fillRect(x * bs + 1, y * bs + 1, bs - 2, bs - 2);
        
        // 绘制内部发光
        ctx.shadowBlur = 0;
        ctx.fillStyle = 'rgba(255,255,255,0.5)';
        ctx.fillRect(x * bs + 3, y * bs + 3, 4, 4);
        
        // 绘制边框
        ctx.strokeStyle = 'rgba(255,255,255,0.8)';
        ctx.lineWidth = 1;
        ctx.strokeRect(x * bs + 1, y * bs + 1, bs - 2, bs - 2);
    }

    drawPiece(piece) {
        piece.shape.forEach((row, i) => {
            row.forEach((value, j) => {
                if (value) {
                    this.drawBlock(
                        piece.x + j,
                        piece.y + i,
                        piece.color
                    );
                }
            });
        });
    }

    draw() {
        // 清除画布
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 绘制半透明黑色背景
        this.ctx.fillStyle = 'rgba(0,0,0,0.3)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // 绘制网格
        this.ctx.strokeStyle = '#1a1a1a';
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                this.ctx.strokeRect(j * this.blockSize, i * this.blockSize, this.blockSize, this.blockSize);
            }
        }

        // 绘制已固定的方块
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                if (this.board[i][j]) {
                    this.drawBlock(j, i, this.board[i][j]);
                }
            }
        }

        // 绘制当前方块
        if (this.currentPiece) {
            this.drawPiece(this.currentPiece);
        }

        // 绘制游戏结束文字
        if (this.gameOver) {
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            
            this.ctx.fillStyle = '#fff';
            this.ctx.shadowColor = '#fff';
            this.ctx.shadowBlur = 10;
            this.ctx.font = '20px "Press Start 2P", monospace';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('GAME OVER', this.canvas.width / 2, this.canvas.height / 2);
            this.ctx.fillText('Press ENTER', this.canvas.width / 2, this.canvas.height / 2 + 30);
            
            this.ctx.shadowBlur = 0;
        }

        // 绘制分数
        this.ctx.fillStyle = '#fff';
        this.ctx.shadowColor = '#fff';
        this.ctx.shadowBlur = 5;
        this.ctx.font = '16px "Press Start 2P", monospace';
        this.ctx.textAlign = 'left';
        this.ctx.fillText(`Score: ${this.score}`, 10, 25);
        this.ctx.shadowBlur = 0;
    }

    moveDown() {
        this.currentPiece.y++;
        if (this.checkCollision()) {
            this.currentPiece.y--;
            this.freeze();
            this.clearLines();
            this.currentPiece = this.previewPieces.shift();
            this.previewPieces.push(this.generatePiece());
            this.spawnPiece();
            if (this.checkCollision()) {
                this.gameOver = true;
            }
        }
    }

    moveLeft() {
        this.currentPiece.x--;
        if (this.checkCollision()) {
            this.currentPiece.x++;
        }
    }

    moveRight() {
        this.currentPiece.x++;
        if (this.checkCollision()) {
            this.currentPiece.x--;
        }
    }

    rotate() {
        const oldShape = this.currentPiece.shape;
        this.currentPiece.shape = this.currentPiece.shape[0].map((_, i) =>
            this.currentPiece.shape.map(row => row[i]).reverse()
        );
        if (this.checkCollision()) {
            this.currentPiece.shape = oldShape;
        }
    }

    checkCollision() {
        return this.currentPiece.shape.some((row, dy) =>
            row.some((value, dx) => {
                if (!value) return false;
                const newX = this.currentPiece.x + dx;
                const newY = this.currentPiece.y + dy;
                return (
                    newX < 0 ||
                    newX >= this.cols ||
                    newY >= this.rows ||
                    (newY >= 0 && this.board[newY][newX])
                );
            })
        );
    }

    freeze() {
        this.currentPiece.shape.forEach((row, dy) => {
            row.forEach((value, dx) => {
                if (value) {
                    const y = this.currentPiece.y + dy;
                    const x = this.currentPiece.x + dx;
                    if (y >= 0) {
                        this.board[y][x] = this.currentPiece.color;
                    }
                }
            });
        });
    }

    clearLines() {
        let linesCleared = 0;
        for (let i = this.rows - 1; i >= 0; i--) {
            if (this.board[i].every(cell => cell !== 0)) {
                this.board.splice(i, 1);
                this.board.unshift(Array(this.cols).fill(0));
                linesCleared++;
                i++;
            }
        }
        if (linesCleared > 0) {
            this.score += [40, 100, 300, 1200][linesCleared - 1];
        }
    }

    gameLoop() {
        this.update();
    }

    update(timestamp = 0) {
        if (!this.lastDrop) this.lastDrop = timestamp;
        const delta = timestamp - this.lastDrop;

        if (delta > this.dropInterval) {
            this.moveDown();
            this.lastDrop = timestamp;
        }

        this.draw();
        if (!this.gameOver) {
            requestAnimationFrame(this.update.bind(this));
        }
    }
}
