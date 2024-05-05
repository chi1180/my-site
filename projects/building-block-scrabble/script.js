const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
ctx.fillStyle = "green";

let lives = 3;
let level = 0;

let pressedRight = false;
let pressedLeft = false;

let dx = 2;
let dy = -2;

const ballRadius = 6;
let ballX = canvas.width / 2;
let ballY = canvas.height - ballRadius * 2;

const paddleWidth = canvas.width / ballRadius;
const paddleHeight = ballRadius;
let paddleX = canvas.width / 2 - paddleWidth / 2;
const paddleY = canvas.height - paddleHeight;

const brickColumn = 10;
const brickRow = 10;
const brickPadding = ballRadius / 2;
const brickWidth = (canvas.width - brickPadding * brickColumn) / brickColumn;
const brickHeight = (canvas.height / 2 - brickPadding * brickRow) / brickRow;
let brick_s = [];
for (let r = 0; r < brickRow; r ++) {
    brick_s.push([]);
    for (let c = 0; c < brickColumn; c ++) {
        brick_s[r].push({
            x: (brickWidth + brickPadding) * r + brickPadding / 2,
            y: (brickHeight + brickPadding) * c +  brickPadding / 2,
            stans: true
        });
    }
}

function ball()
{
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballRadius, ballRadius, Math.PI * ballRadius);
    ctx.fill();
    ctx.closePath();

    const is_touch_side = ballX - ballRadius < 0 || ballX + ballRadius > canvas.width;
    const is_touch_top_or_paddle = ballY - ballRadius < 0 || ballX > paddleX && ballX < paddleX + paddleWidth && ballY + ballRadius > paddleY;
    const is_touch_bottom = ballY + ballRadius > canvas.height;

    if (is_touch_side) {
        dx = -dx;
    } else if (is_touch_top_or_paddle) {
        dy = -dy;
    } else if (is_touch_bottom) {
        dy = -dy;
        lives --;
        document.getElementById("lives").innerText = lives.toString();
        if ( ! lives) {
            setTimeout(() => {
                alert("GAME OVER !!");
                askPlayAgain();
            }, 250);
        }
    }

    ballX += dx;
    ballY += dy;
}

function paddle()
{
    ctx.beginPath();
    ctx.rect(paddleX, paddleY, paddleWidth, paddleHeight);
    ctx.fill();
    ctx.closePath();

    if (pressedLeft && paddleX > 0) {
        paddleX -= ballRadius;
    } else if (pressedRight && paddleX + paddleWidth < canvas.width) {
        paddleX += ballRadius;
    }
}

document.addEventListener("keydown", (e) => {
    if (e.code === "ArrowLeft") {
        pressedLeft = true;
    } else if (e.code === "ArrowRight") {
        pressedRight = true;
    }
});

document.addEventListener('keyup', (e) => {
    if (e.code === "ArrowLeft") {
        pressedLeft = false;
    } else if (e.code === "ArrowRight") {
        pressedRight = false;
    }
});

document.addEventListener('mousemove', (e) => {
    const clientX = e.clientX - canvas.offsetLeft;
    if (clientX < paddleWidth / 2) {
        paddleX = 0;
    } else if (clientX > canvas.width - paddleWidth / 2) {
        paddleX = canvas.width - paddleWidth;
    } else {
        paddleX = clientX - paddleWidth / 2;
    }
});

function brick()
{
    for (let c = 0; c < brickColumn; c ++) {
        for (let r = 0; r < brickRow; r ++) {
            if (brick_s[c][r].stans) {
                ctx.beginPath();
                ctx.rect(brick_s[c][r].x, brick_s[c][r].y, brickWidth, brickHeight);
                ctx.fill();
                ctx.closePath();

                const is_touched_ball = ballX > brick_s[c][r].x && ballX < brick_s[c][r].x + brickWidth && ballY - ballRadius < brick_s[c][r].y + brickHeight && ballY - ballRadius > brick_s[c][r].y;
                if (is_touched_ball) {
                    brick_s[c][r].stans = false;
                    dy = -dy;
                    level ++;
                    document.getElementById("level").innerText = level.toString();

                    if (level === brickColumn * brickRow) {
                        setTimeout(() => {
                            alert("YOU WIN ! GREAT !!!");
                            askPlayAgain();
                        }, 250);
                    }
                }
            }
        }
    }
}

function draw()
{
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ball();
    paddle();
    brick();

    requestAnimationFrame(draw);
}

draw();

function askPlayAgain()
{
    const conf = confirm("Are you want to play again ?");
    if (conf) {
        location.reload();
    } else {
        window.close();
    }
}

