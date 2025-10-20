// script.js - Farcaster Mini App ready (final working version)

window.onload = function() {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');

    const grid = 20;
    let count = 0;
    let score = 0;

    let snake = {
        x: 160,
        y: 160,
        dx: grid,
        dy: 0,
        cells: [],
        maxCells: 4
    };

    let apple = {
        x: 320,
        y: 320
    };

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }

    function loop() {
        requestAnimationFrame(loop);
        if (++count < 4) return;
        count = 0;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        snake.x += snake.dx;
        snake.y += snake.dy;

        if (snake.x < 0) snake.x = canvas.width - grid;
        else if (snake.x >= canvas.width) snake.x = 0;
        if (snake.y < 0) snake.y = canvas.height - grid;
        else if (snake.y >= canvas.height) snake.y = 0;

        snake.cells.unshift({ x: snake.x, y: snake.y });
        if (snake.cells.length > snake.maxCells) snake.cells.pop();

        ctx.fillStyle = 'red';
        ctx.fillRect(apple.x, apple.y, grid - 1, grid - 1);

        ctx.fillStyle = 'lime';
        snake.cells.forEach((cell, index) => {
            ctx.fillRect(cell.x, cell.y, grid - 1, grid - 1);

            if (cell.x === apple.x && cell.y === apple.y) {
                snake.maxCells++;
                score++;
                document.getElementById('score').textContent = 'Score: ' + score;
                apple.x = getRandomInt(0, canvas.width / grid) * grid;
                apple.y = getRandomInt(0, canvas.height / grid) * grid;
            }

            for (let i = index + 1; i < snake.cells.length; i++) {
                if (cell.x === snake.cells[i].x && cell.y === snake.cells[i].y) {
                    snake.x = 160;
                    snake.y = 160;
                    snake.cells = [];
                    snake.maxCells = 4;
                    snake.dx = grid;
                    snake.dy = 0;
                    score = 0;
                    document.getElementById('score').textContent = 'Score: ' + score;
                }
            }
        });
    }

    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowLeft' && snake.dx === 0) { snake.dx = -grid; snake.dy = 0; }
        else if (e.key === 'ArrowUp' && snake.dy === 0) { snake.dx = 0; snake.dy = -grid; }
        else if (e.key === 'ArrowRight' && snake.dx === 0) { snake.dx = grid; snake.dy = 0; }
        else if (e.key === 'ArrowDown' && snake.dy === 0) { snake.dx = 0; snake.dy = grid; }
    });

    // Start game loop
    requestAnimationFrame(loop);

    // ✅ Safely call Farcaster SDK ready (waits until available)
    function waitForFarcasterSDK(attempts = 0) {
        if (window.sdk && window.sdk.actions && typeof window.sdk.actions.ready === 'function') {
            try {
                window.sdk.actions.ready();
                console.log("✅ Farcaster SDK ready called successfully!");
            } catch (err) {
                console.error("❌ Error calling Farcaster SDK ready:", err);
            }
        } else {
            if (attempts < 20) { // retry up to 10 seconds
                console.log("⏳ Waiting for Farcaster SDK to load...");
                setTimeout(() => waitForFarcasterSDK(attempts + 1), 500);
            } else {
                console.warn("⚠️ Farcaster SDK not detected after waiting 10s.");
            }
        }
    }

    waitForFarcasterSDK();
};
