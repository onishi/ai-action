// ゲーム設定
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const GRAVITY = 0.5;
const JUMP_STRENGTH = -12;
const MOVE_SPEED = 5;

// プレイヤー
const player = {
    x: 100,
    y: 100,
    width: 32,
    height: 32,
    velocityX: 0,
    velocityY: 0,
    jumping: false,
    onGround: false
};

// プラットフォーム
const platforms = [
    { x: 0, y: 550, width: 800, height: 50 },      // 地面
    { x: 200, y: 450, width: 150, height: 20 },
    { x: 400, y: 350, width: 150, height: 20 },
    { x: 600, y: 250, width: 150, height: 20 },
    { x: 150, y: 250, width: 100, height: 20 },
    { x: 500, y: 150, width: 120, height: 20 }
];

// キー入力
const keys = {};
window.addEventListener('keydown', (e) => {
    keys[e.key] = true;
    if (e.key === ' ') e.preventDefault();
});
window.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

// 当たり判定
function checkCollision(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
}

// プレイヤー更新
function updatePlayer() {
    // 左右移動
    if (keys['ArrowLeft']) {
        player.velocityX = -MOVE_SPEED;
    } else if (keys['ArrowRight']) {
        player.velocityX = MOVE_SPEED;
    } else {
        player.velocityX = 0;
    }

    // ジャンプ
    if (keys[' '] && player.onGround) {
        player.velocityY = JUMP_STRENGTH;
        player.jumping = true;
        player.onGround = false;
    }

    // 重力適用
    player.velocityY += GRAVITY;

    // 位置更新
    player.x += player.velocityX;
    player.y += player.velocityY;

    // 地面判定リセット
    player.onGround = false;

    // プラットフォーム衝突判定
    for (let platform of platforms) {
        if (checkCollision(player, platform)) {
            // 上から乗った場合
            if (player.velocityY > 0 && player.y + player.height - player.velocityY <= platform.y) {
                player.y = platform.y - player.height;
                player.velocityY = 0;
                player.onGround = true;
                player.jumping = false;
            }
            // 下から当たった場合
            else if (player.velocityY < 0 && player.y - player.velocityY >= platform.y + platform.height) {
                player.y = platform.y + platform.height;
                player.velocityY = 0;
            }
            // 左から当たった場合
            else if (player.velocityX > 0) {
                player.x = platform.x - player.width;
            }
            // 右から当たった場合
            else if (player.velocityX < 0) {
                player.x = platform.x + platform.width;
            }
        }
    }

    // 画面外チェック
    if (player.x < 0) player.x = 0;
    if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;
    if (player.y > canvas.height) {
        player.y = 100;
        player.x = 100;
        player.velocityY = 0;
    }
}

// 描画
function draw() {
    // 背景
    ctx.fillStyle = '#87CEEB';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // プラットフォーム
    ctx.fillStyle = '#8B4513';
    for (let platform of platforms) {
        ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
        // 影
        ctx.fillStyle = '#6B3410';
        ctx.fillRect(platform.x, platform.y + platform.height - 5, platform.width, 5);
        ctx.fillStyle = '#8B4513';
    }

    // プレイヤー
    ctx.fillStyle = '#FF6347';
    ctx.fillRect(player.x, player.y, player.width, player.height);

    // プレイヤーの目
    ctx.fillStyle = '#000';
    ctx.fillRect(player.x + 8, player.y + 8, 6, 6);
    ctx.fillRect(player.x + 18, player.y + 8, 6, 6);
}

// ゲームループ
function gameLoop() {
    updatePlayer();
    draw();
    requestAnimationFrame(gameLoop);
}

// ゲーム開始
gameLoop();
