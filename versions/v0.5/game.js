// ゲーム設定
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const GRAVITY = 0.5;
const JUMP_STRENGTH = -12;
const MOVE_SPEED = 5;
const PHASE_MAX_ENERGY = 5;
const PHASE_COOLDOWN_FRAMES = 45;
const PHASE_FLASH_FRAMES = 24;
const INVINCIBLE_FRAMES = 90;
const ECHO_LIFETIME_FRAMES = 160;
const ECHO_FADE_START = 60;
const ECHO_GRAVITY_SCALE = 0.85;
const GATE_COOLDOWN_FRAMES = 90;
const PLAYER_GATE_COOLDOWN = 36;
const COMBO_TIMER_MAX = 240;

const levelPhases = {
    SOLID: {
        id: 'SOLID',
        displayName: 'SOLID REALM',
        skyTop: '#7fc0ff',
        skyBottom: '#bce1ff',
        platformColor: '#8B4513',
        platformShadow: '#6B3410',
        accent: '#ff6b6b',
        echoColor: 'rgba(255, 99, 71, 0.35)',
        platforms: [
            { x: 0, y: 550, width: 800, height: 50 },
            { x: 200, y: 450, width: 150, height: 20 },
            { x: 400, y: 350, width: 150, height: 20 },
            { x: 600, y: 250, width: 150, height: 20 },
            { x: 120, y: 250, width: 140, height: 20 },
            { x: 500, y: 150, width: 120, height: 20 }
        ]
    },
    ETHER: {
        id: 'ETHER',
        displayName: 'ETHER DRIFT',
        skyTop: '#12092b',
        skyBottom: '#352267',
        platformColor: '#3d3cae',
        platformShadow: '#202074',
        accent: '#8cf5ff',
        echoColor: 'rgba(140, 245, 255, 0.35)',
        platforms: [
            { x: 0, y: 550, width: 800, height: 50 },
            { x: 120, y: 470, width: 140, height: 24 },
            { x: 520, y: 440, width: 120, height: 24 },
            { x: 310, y: 360, width: 150, height: 24 },
            { x: 110, y: 300, width: 120, height: 24 },
            { x: 430, y: 240, width: 210, height: 24 },
            { x: 650, y: 200, width: 110, height: 24 }
        ]
    }
};

let currentPhase = 'SOLID';
let phaseEnergy = 1;
let phaseCooldown = 0;
let phaseFlashTimer = 0;
let frameCounter = 0;
let gameState = 'playing'; // playing, gameover
let score = 0;
let combo = 0;
let comboTimer = 0;
let lives = 3;
let invincibleTimer = 0;
let playerGateCooldown = 0;

const phaseRipples = [];
const playerTrail = [];
const phaseEchoes = [];
const enemies = [];
const floatingTexts = [];

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

const phaseOrbs = [
    { x: 240, y: 420, radius: 10, phase: 'SOLID', collected: false, floatOffset: Math.random() * Math.PI * 2, respawnTimer: 0 },
    { x: 580, y: 320, radius: 10, phase: 'ETHER', collected: false, floatOffset: Math.random() * Math.PI * 2, respawnTimer: 0 },
    { x: 720, y: 520, radius: 10, phase: 'BOTH', collected: false, floatOffset: Math.random() * Math.PI * 2, respawnTimer: 0 },
    { x: 140, y: 200, radius: 9, phase: 'SOLID', collected: false, floatOffset: Math.random() * Math.PI * 2, respawnTimer: 0 },
    { x: 620, y: 220, radius: 9, phase: 'ETHER', collected: false, floatOffset: Math.random() * Math.PI * 2, respawnTimer: 0 }
];

const phaseGates = [
    { id: 'SOLID_GATE_LOWER', phase: 'SOLID', x: 720, y: 470, width: 42, height: 70, link: 'SOLID_GATE_TERRACE', cooldown: 0 },
    { id: 'SOLID_GATE_TERRACE', phase: 'SOLID', x: 140, y: 220, width: 42, height: 70, link: 'SOLID_GATE_LOWER', cooldown: 0 },
    { id: 'ETHER_GATE_LEFT', phase: 'ETHER', x: 80, y: 440, width: 48, height: 72, link: 'ETHER_GATE_SPIRE', cooldown: 0 },
    { id: 'ETHER_GATE_SPIRE', phase: 'ETHER', x: 600, y: 210, width: 48, height: 72, link: 'ETHER_GATE_LEFT', cooldown: 0 }
];

// フローティングテキスト生成
function addFloatingText(x, y, text, color = '#fff', size = 16) {
    floatingTexts.push({
        x: x,
        y: y,
        text: text,
        color: color,
        size: size,
        life: 60,
        velocityY: -1.5
    });
}

// 敵の生成
function spawnEnemy() {
    const phase = Math.random() > 0.5 ? 'SOLID' : 'ETHER';
    const side = Math.random() > 0.5 ? 'left' : 'right';
    const x = side === 'left' ? -30 : canvas.width + 30;
    const platforms = levelPhases[phase].platforms;
    const validPlatforms = platforms.filter(p => p.y < 500);
    const platform = validPlatforms[Math.floor(Math.random() * validPlatforms.length)];

    enemies.push({
        x: x,
        y: platform.y - 28,
        width: 28,
        height: 28,
        phase: phase,
        speed: 1.5 + Math.random() * 1,
        direction: side === 'left' ? 1 : -1,
        patrolLeft: platform.x,
        patrolRight: platform.x + platform.width - 28,
        velocityY: 0,
        onGround: false
    });
}

// キー入力
const keys = {};
let shiftHeld = false;
let phaseShiftRequested = false;

function spawnPhaseEcho(phase) {
    const echo = {
        x: player.x,
        y: player.y,
        width: player.width,
        height: player.height,
        velocityX: player.velocityX * 0.9 + (Math.random() - 0.5) * 2.5,
        velocityY: player.velocityY * 0.25 - 3,
        life: ECHO_LIFETIME_FRAMES,
        phase,
        bounceCooldown: 0
    };
    phaseEchoes.push(echo);
    phaseRipples.push({
        x: echo.x + echo.width / 2,
        y: echo.y + echo.height / 2,
        radius: 16,
        alpha: 0.4,
        phase
    });
}

window.addEventListener('keydown', (e) => {
    if (!keys[e.key]) {
        keys[e.key] = true;
        if (e.key === 'Shift' && !shiftHeld) {
            phaseShiftRequested = true;
            shiftHeld = true;
        }
    }

    if (e.key === ' ') {
        e.preventDefault();
    }

    if (e.key === 'r' && gameState === 'gameover') {
        resetGame();
    }
});

window.addEventListener('keyup', (e) => {
    keys[e.key] = false;
    if (e.key === 'Shift') {
        shiftHeld = false;
    }
});

// 当たり判定
function checkCollision(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
}

function handlePhaseShift() {
    if (phaseShiftRequested && phaseEnergy > 0 && phaseCooldown === 0) {
        const previousPhase = currentPhase;
        spawnPhaseEcho(previousPhase);
        currentPhase = previousPhase === 'SOLID' ? 'ETHER' : 'SOLID';
        phaseEnergy -= 1;
        phaseCooldown = PHASE_COOLDOWN_FRAMES;
        phaseFlashTimer = PHASE_FLASH_FRAMES;
        phaseRipples.push({
            x: player.x + player.width / 2,
            y: player.y + player.height / 2,
            radius: 30,
            alpha: 0.6,
            phase: currentPhase
        });
        phaseRipples.push({
            x: player.x + player.width / 2,
            y: player.y + player.height / 2,
            radius: 46,
            alpha: 0.35,
            phase: previousPhase
        });
    }
    phaseShiftRequested = false;

    if (phaseCooldown > 0) {
        phaseCooldown -= 1;
    }

    if (phaseFlashTimer > 0) {
        phaseFlashTimer -= 1;
    }

    for (let i = phaseRipples.length - 1; i >= 0; i--) {
        const ripple = phaseRipples[i];
        ripple.radius += 18;
        ripple.alpha *= 0.88;
        if (ripple.alpha <= 0.05) {
            phaseRipples.splice(i, 1);
        }
    }
}

function updatePlayer() {
    const activePhase = levelPhases[currentPhase];
    const activePlatforms = activePhase.platforms;
    const horizontalSpeed = currentPhase === 'ETHER' ? MOVE_SPEED + 1.2 : MOVE_SPEED;
    const gravity = currentPhase === 'ETHER' ? GRAVITY * 0.7 : GRAVITY;
    const jumpStrength = currentPhase === 'ETHER' ? JUMP_STRENGTH * 0.9 : JUMP_STRENGTH;

    // 左右移動
    if (keys['ArrowLeft']) {
        player.velocityX = -horizontalSpeed;
    } else if (keys['ArrowRight']) {
        player.velocityX = horizontalSpeed;
    } else {
        player.velocityX *= 0.8;
        if (Math.abs(player.velocityX) < 0.1) {
            player.velocityX = 0;
        }
    }

    // ジャンプ
    if (keys[' '] && player.onGround) {
        player.velocityY = jumpStrength;
        player.jumping = true;
        player.onGround = false;
    }

    // 重力適用
    player.velocityY += gravity;

    // 位置更新
    player.x += player.velocityX;
    player.y += player.velocityY;

    // 地面判定リセット
    player.onGround = false;

    // プラットフォーム衝突判定
    for (let platform of activePlatforms) {
        if (checkCollision(player, platform)) {
            if (player.velocityY > 0 && player.y + player.height - player.velocityY <= platform.y) {
                player.y = platform.y - player.height;
                player.velocityY = 0;
                player.onGround = true;
                player.jumping = false;
            } else if (player.velocityY < 0 && player.y - player.velocityY >= platform.y + platform.height) {
                player.y = platform.y + platform.height;
                player.velocityY = 0;
            } else if (player.velocityX > 0) {
                player.x = platform.x - player.width;
                player.velocityX = 0;
            } else if (player.velocityX < 0) {
                player.x = platform.x + platform.width;
                player.velocityX = 0;
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

function updatePhaseOrbs() {
    for (let orb of phaseOrbs) {
        orb.floatOffset += 0.05;
        orb.renderY = orb.y + Math.sin(orb.floatOffset) * 6;

        if (orb.collected) {
            if (orb.respawnTimer > 0) {
                orb.respawnTimer -= 1;
                if (orb.respawnTimer === 0) {
                    orb.collected = false;
                }
            }
            continue;
        }

        const orbRect = {
            x: orb.x - orb.radius,
            y: orb.renderY - orb.radius,
            width: orb.radius * 2,
            height: orb.radius * 2
        };

        const playerActive = orb.phase === 'BOTH' || orb.phase === currentPhase;
        let collectedBy = null;

        if (playerActive && checkCollision(player, orbRect)) {
            collectedBy = { type: 'player' };
        } else {
            for (let j = phaseEchoes.length - 1; j >= 0; j--) {
                const echo = phaseEchoes[j];
                const echoActive = orb.phase === 'BOTH' || orb.phase === echo.phase;
                if (!echoActive) {
                    continue;
                }
                if (checkCollision(echo, orbRect)) {
                    collectedBy = { type: 'echo', index: j, echo };
                    break;
                }
            }
        }

        if (collectedBy) {
            orb.collected = true;
            orb.respawnTimer = 360;

            if (collectedBy.type === 'player') {
                phaseEnergy = Math.min(PHASE_MAX_ENERGY, phaseEnergy + 1);
                const points = 50 * (combo + 1);
                score += points;
                addFloatingText(orb.x, orb.renderY, `+${points}`, levelPhases[currentPhase].accent, 14);
                combo += 1;
                comboTimer = COMBO_TIMER_MAX;
                phaseRipples.push({
                    x: orb.x,
                    y: orb.renderY,
                    radius: 10,
                    alpha: 0.5,
                    phase: currentPhase
                });
            } else if (collectedBy.type === 'echo') {
                phaseEnergy = Math.min(PHASE_MAX_ENERGY, phaseEnergy + 1);
                const points = 35 * (combo + 1);
                score += points;
                addFloatingText(orb.x, orb.renderY, `+${points}`, levelPhases[collectedBy.echo.phase].accent, 12);
                combo += 1;
                comboTimer = COMBO_TIMER_MAX;
                phaseRipples.push({
                    x: orb.x,
                    y: orb.renderY,
                    radius: 14,
                    alpha: 0.45,
                    phase: collectedBy.echo.phase
                });
                phaseEchoes.splice(collectedBy.index, 1);
            }
        }
    }
}

function updatePhaseEchoes() {
    for (let i = phaseEchoes.length - 1; i >= 0; i--) {
        const echo = phaseEchoes[i];
        echo.life -= 1;
        if (echo.life <= 0) {
            phaseEchoes.splice(i, 1);
            continue;
        }

        if (echo.bounceCooldown > 0) {
            echo.bounceCooldown -= 1;
        }

        const state = levelPhases[echo.phase];
        const gravity = (echo.phase === 'ETHER' ? GRAVITY * 0.7 : GRAVITY) * ECHO_GRAVITY_SCALE;

        echo.velocityY += gravity;
        echo.velocityY = Math.min(echo.velocityY, 12);
        echo.x += echo.velocityX;
        echo.y += echo.velocityY;
        echo.velocityX *= 0.94;

        // プラットフォームとの衝突（滞在フェーズ基準）
        for (let platform of state.platforms) {
            if (!checkCollision(echo, platform)) {
                continue;
            }

            if (echo.velocityY > 0 && echo.y + echo.height - echo.velocityY <= platform.y) {
                echo.y = platform.y - echo.height;
                if (echo.bounceCooldown === 0) {
                    echo.velocityY = echo.phase === 'ETHER' ? -7 : -5.5;
                    echo.bounceCooldown = 8;
                } else {
                    echo.velocityY = 0;
                }
            } else if (echo.velocityY < 0 && echo.y - echo.velocityY >= platform.y + platform.height) {
                echo.y = platform.y + platform.height;
                echo.velocityY = 0;
            } else if (echo.velocityX > 0) {
                echo.x = platform.x - echo.width;
                echo.velocityX *= -0.4;
            } else if (echo.velocityX < 0) {
                echo.x = platform.x + platform.width;
                echo.velocityX *= -0.4;
            }
        }

        // 画面外で消滅
        if (echo.x < -80 || echo.x > canvas.width + 80 || echo.y > canvas.height + 120) {
            phaseEchoes.splice(i, 1);
            continue;
        }

        // 同フェーズでの吸収
        if (echo.phase === currentPhase && checkCollision(player, echo)) {
            phaseEnergy = Math.min(PHASE_MAX_ENERGY, phaseEnergy + 1);
            score += 30;
            addFloatingText(echo.x + echo.width / 2, echo.y, '+30 Echo', levelPhases[currentPhase].accent, 12);
            phaseRipples.push({
                x: player.x + player.width / 2,
                y: player.y + player.height / 2,
                radius: 24,
                alpha: 0.45,
                phase: currentPhase
            });
            phaseEchoes.splice(i, 1);
        }
    }
}

function updatePhaseGates() {
    if (playerGateCooldown > 0) {
        playerGateCooldown -= 1;
    }

    for (let gate of phaseGates) {
        if (gate.cooldown > 0) {
            gate.cooldown -= 1;
        }
    }

    for (let gate of phaseGates) {
        if (gate.phase !== currentPhase) {
            continue;
        }
        if (playerGateCooldown > 0 || gate.cooldown > 0) {
            continue;
        }

        const gateRect = {
            x: gate.x,
            y: gate.y,
            width: gate.width,
            height: gate.height
        };

        if (!checkCollision(player, gateRect)) {
            continue;
        }

        const targetGate = phaseGates.find(candidate => candidate.id === gate.link);
        if (!targetGate) {
            continue;
        }

        const targetCenterX = targetGate.x + targetGate.width / 2;
        const targetCenterY = targetGate.y + targetGate.height / 2;

        player.x = targetCenterX - player.width / 2;
        player.y = targetCenterY - player.height / 2;
        player.velocityY = Math.min(player.velocityY, -6);
        player.velocityX *= 0.35;
        player.onGround = false;
        playerGateCooldown = PLAYER_GATE_COOLDOWN;
        gate.cooldown = GATE_COOLDOWN_FRAMES;
        targetGate.cooldown = GATE_COOLDOWN_FRAMES;
        comboTimer = Math.max(comboTimer, 90);

        player.x = Math.max(0, Math.min(player.x, canvas.width - player.width));
        player.y = Math.max(0, Math.min(player.y, canvas.height - player.height));

        phaseRipples.push({
            x: gate.x + gate.width / 2,
            y: gate.y + gate.height / 2,
            radius: 26,
            alpha: 0.5,
            phase: gate.phase
        });
        phaseRipples.push({
            x: targetGate.x + targetGate.width / 2,
            y: targetGate.y + targetGate.height / 2,
            radius: 34,
            alpha: 0.45,
            phase: targetGate.phase
        });
    }
}

function updateEnemies() {
    for (let i = enemies.length - 1; i >= 0; i--) {
        const enemy = enemies[i];
        const enemyState = levelPhases[enemy.phase];
        const enemyPlatforms = enemyState.platforms;

        // パトロール移動
        enemy.x += enemy.direction * enemy.speed;
        if (enemy.x <= enemy.patrolLeft) {
            enemy.x = enemy.patrolLeft;
            enemy.direction = 1;
        } else if (enemy.x >= enemy.patrolRight) {
            enemy.x = enemy.patrolRight;
            enemy.direction = -1;
        }

        const gravity = enemy.phase === 'ETHER' ? GRAVITY * 0.7 : GRAVITY;
        enemy.velocityY += gravity;
        enemy.velocityY = Math.min(enemy.velocityY, 12);
        enemy.y += enemy.velocityY;

        enemy.onGround = false;
        for (let platform of enemyPlatforms) {
            if (!checkCollision(enemy, platform)) {
                continue;
            }

            if (enemy.velocityY > 0 && enemy.y + enemy.height - enemy.velocityY <= platform.y) {
                enemy.y = platform.y - enemy.height;
                enemy.velocityY = 0;
                enemy.onGround = true;
            } else if (enemy.direction > 0) {
                enemy.x = platform.x - enemy.width;
                enemy.direction = -1;
            } else if (enemy.direction < 0) {
                enemy.x = platform.x + platform.width;
                enemy.direction = 1;
            }
        }

        let defeated = false;

        if (enemy.phase === currentPhase && invincibleTimer === 0 && checkCollision(player, enemy)) {
            if (player.velocityY > 0 && player.y + player.height - player.velocityY <= enemy.y + 10) {
                enemies.splice(i, 1);
                player.velocityY = -8;
                const points = 100 * (combo + 1);
                score += points;
                addFloatingText(enemy.x + enemy.width / 2, enemy.y, `+${points}`, '#ffff00', 16);
                combo += 1;
                comboTimer = COMBO_TIMER_MAX;
                phaseRipples.push({
                    x: enemy.x + enemy.width / 2,
                    y: enemy.y + enemy.height / 2,
                    radius: 20,
                    alpha: 0.7,
                    phase: currentPhase
                });
                defeated = true;
            } else {
                lives -= 1;
                invincibleTimer = INVINCIBLE_FRAMES;
                combo = 0;
                if (lives <= 0) {
                    gameState = 'gameover';
                }
            }
        }

        if (defeated) {
            continue;
        }

        for (let j = phaseEchoes.length - 1; j >= 0; j--) {
            const echo = phaseEchoes[j];
            if (echo.phase !== enemy.phase) {
                continue;
            }
            if (checkCollision(echo, enemy)) {
                enemies.splice(i, 1);
                const points = 90 * (combo + 1);
                score += points;
                addFloatingText(enemy.x + enemy.width / 2, enemy.y, `+${points} Echo!`, '#00ffff', 15);
                combo += 1;
                comboTimer = COMBO_TIMER_MAX;
                phaseEnergy = Math.min(PHASE_MAX_ENERGY, phaseEnergy + 1);
                phaseRipples.push({
                    x: enemy.x + enemy.width / 2,
                    y: enemy.y + enemy.height / 2,
                    radius: 24,
                    alpha: 0.6,
                    phase: enemy.phase
                });
                echo.velocityY = -6;
                echo.velocityX *= 0.6;
                echo.life = Math.max(echo.life - 25, 10);
                defeated = true;
                break;
            }
        }

        if (defeated) {
            continue;
        }

        if (enemy.y > canvas.height + 100 || enemy.x < -120 || enemy.x > canvas.width + 120) {
            enemies.splice(i, 1);
        }
    }
}

function updateFloatingTexts() {
    for (let i = floatingTexts.length - 1; i >= 0; i--) {
        const text = floatingTexts[i];
        text.life -= 1;
        text.y += text.velocityY;
        text.velocityY -= 0.05;

        if (text.life <= 0) {
            floatingTexts.splice(i, 1);
        }
    }
}

function resetGame() {
    gameState = 'playing';
    score = 0;
    combo = 0;
    comboTimer = 0;
    lives = 3;
    invincibleTimer = 0;
    player.x = 100;
    player.y = 100;
    player.velocityX = 0;
    player.velocityY = 0;
    currentPhase = 'SOLID';
    phaseEnergy = 1;
    enemies.length = 0;
    phaseRipples.length = 0;
    playerTrail.length = 0;
    phaseEchoes.length = 0;
    floatingTexts.length = 0;
    playerGateCooldown = 0;
    for (let orb of phaseOrbs) {
        orb.collected = false;
        orb.respawnTimer = 0;
    }
    for (let gate of phaseGates) {
        gate.cooldown = 0;
    }
}

function updatePlayerTrail() {
    if (frameCounter % 2 === 0) {
        playerTrail.push({
            x: player.x,
            y: player.y,
            width: player.width,
            height: player.height,
            life: 18,
            phase: currentPhase
        });
    }

    for (let i = playerTrail.length - 1; i >= 0; i--) {
        playerTrail[i].life -= 1;
        if (playerTrail[i].life <= 0) {
            playerTrail.splice(i, 1);
        }
    }
}

function drawBackground(state) {
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, state.skyTop);
    gradient.addColorStop(1, state.skyBottom);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawPlatforms(platforms, baseColor, shadowColor, alpha = 1) {
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = baseColor;

    for (let platform of platforms) {
        ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
        if (shadowColor) {
            ctx.fillStyle = shadowColor;
            ctx.fillRect(platform.x, platform.y + platform.height - 5, platform.width, 5);
            ctx.fillStyle = baseColor;
        }
    }

    ctx.restore();
}

function drawGhostPlatforms(platforms, color) {
    ctx.save();
    ctx.globalAlpha = 0.2;
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;

    for (let platform of platforms) {
        ctx.strokeRect(platform.x + 2, platform.y + 2, platform.width - 4, platform.height - 4);
    }

    ctx.restore();
}

function drawPhaseRipples() {
    for (let ripple of phaseRipples) {
        const rippleState = levelPhases[ripple.phase];
        ctx.save();
        ctx.globalAlpha = ripple.alpha;
        ctx.strokeStyle = rippleState.accent;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
    }
}

function drawPlayerTrail() {
    for (let trail of playerTrail) {
        const state = levelPhases[trail.phase];
        ctx.save();
        ctx.globalAlpha = Math.max(trail.life / 24, 0) * 0.5;
        ctx.fillStyle = state.echoColor;
        ctx.fillRect(trail.x, trail.y, trail.width, trail.height);
        ctx.restore();
    }
}

function drawPhaseGates() {
    for (let gate of phaseGates) {
        const state = levelPhases[gate.phase];
        const isActive = gate.phase === currentPhase;
        const pulse = Math.sin((frameCounter + gate.x) * 0.08) * 0.5 + 1.2;

        ctx.save();
        ctx.translate(gate.x + gate.width / 2, gate.y + gate.height / 2);
        ctx.globalAlpha = isActive ? 0.85 : 0.25;
        ctx.strokeStyle = state.accent;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.ellipse(0, 0, (gate.width * 0.55) * pulse, (gate.height * 0.35) * (2 - pulse), 0, 0, Math.PI * 2);
        ctx.stroke();

        ctx.globalAlpha *= 0.6;
        ctx.fillStyle = isActive ? 'rgba(255,255,255,0.22)' : 'rgba(255,255,255,0.12)';
        ctx.beginPath();
        ctx.ellipse(0, 0, gate.width * 0.35, gate.height * 0.2 + Math.sin(frameCounter * 0.16) * 4, 0, 0, Math.PI * 2);
        ctx.fill();

        if (gate.cooldown > 0) {
            ctx.globalAlpha = 0.45 + Math.sin((frameCounter + gate.cooldown) * 0.25) * 0.25;
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.ellipse(0, 0, gate.width * 0.68, gate.height * 0.4, 0, 0, Math.PI * 2);
            ctx.stroke();
        }

        ctx.restore();

        if (!isActive) {
            ctx.save();
            ctx.globalAlpha = 0.1;
            ctx.fillStyle = state.accent;
            ctx.fillRect(gate.x, gate.y, gate.width, gate.height);
            ctx.restore();
        }
    }
}

function drawPhaseEchoes() {
    for (let echo of phaseEchoes) {
        const state = levelPhases[echo.phase];
        const isActive = echo.phase === currentPhase;
        const fadeRatio = echo.life < ECHO_FADE_START ? Math.max(echo.life / ECHO_FADE_START, 0) : 1;
        ctx.save();
        ctx.globalAlpha = (isActive ? 0.75 : 0.32) * fadeRatio;
        ctx.fillStyle = state.accent;
        ctx.fillRect(echo.x, echo.y, echo.width, echo.height);
        ctx.globalAlpha *= 0.6;
        ctx.fillStyle = state.echoColor;
        ctx.fillRect(echo.x - 3, echo.y - 3, echo.width + 6, echo.height + 6);
        ctx.restore();
    }
}

function drawOrbs() {
    for (let orb of phaseOrbs) {
        const renderY = orb.renderY ?? orb.y;
        const targetPhase = orb.phase === 'BOTH' ? currentPhase : orb.phase;
        const targetState = levelPhases[targetPhase];
        const activeForPhase = (orb.phase === 'BOTH' || orb.phase === currentPhase) && !orb.collected;

        if (!activeForPhase && orb.collected) {
            continue;
        }

        const intensity = orb.collected ? 0 : (orb.phase === 'BOTH' ? 0.8 : (orb.phase === currentPhase ? 0.9 : 0.25));

        ctx.save();
        ctx.globalAlpha = intensity;
        const gradient = ctx.createRadialGradient(orb.x, renderY, 0, orb.x, renderY, orb.radius * 1.6);
        gradient.addColorStop(0, targetState.accent);
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(orb.x, renderY, orb.radius * 1.6, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        if (orb.phase !== currentPhase && orb.phase !== 'BOTH') {
            ctx.save();
            ctx.globalAlpha = 0.3;
            ctx.strokeStyle = targetState.accent;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(orb.x, renderY, orb.radius, 0, Math.PI * 2);
            ctx.stroke();
            ctx.restore();
        } else if (!orb.collected) {
            ctx.save();
            ctx.globalAlpha = 0.9;
            ctx.strokeStyle = 'rgba(255,255,255,0.8)';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(orb.x, renderY, orb.radius + Math.sin(frameCounter * 0.2) * 2, 0, Math.PI * 2);
            ctx.stroke();
            ctx.restore();
        }
    }
}

function drawEnemies() {
    for (let enemy of enemies) {
        if (enemy.phase !== currentPhase) {
            continue;
        }

        const state = levelPhases[currentPhase];
        const enemyColor = currentPhase === 'ETHER' ? '#ff4d94' : '#8B00FF';

        ctx.fillStyle = enemyColor;
        ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);

        // 敵の目
        ctx.fillStyle = '#fff';
        ctx.fillRect(enemy.x + 4, enemy.y + 6, 6, 6);
        ctx.fillRect(enemy.x + 18, enemy.y + 6, 6, 6);

        ctx.fillStyle = '#000';
        const eyeDir = enemy.direction > 0 ? 2 : -2;
        ctx.fillRect(enemy.x + 6 + eyeDir, enemy.y + 8, 3, 3);
        ctx.fillRect(enemy.x + 20 + eyeDir, enemy.y + 8, 3, 3);
    }
}

function drawPlayer() {
    const state = levelPhases[currentPhase];
    const bodyColor = currentPhase === 'ETHER' ? '#80ffea' : '#FF6347';

    // 無敵時間の点滅
    if (invincibleTimer > 0 && Math.floor(invincibleTimer / 6) % 2 === 0) {
        ctx.save();
        ctx.globalAlpha = 0.4;
    }

    ctx.fillStyle = bodyColor;
    ctx.fillRect(player.x, player.y, player.width, player.height);

    if (currentPhase === 'ETHER') {
        ctx.fillStyle = '#0b1431';
        ctx.fillRect(player.x + 6, player.y + 10, 8, 8);
        ctx.fillRect(player.x + 18, player.y + 10, 8, 8);
        ctx.fillStyle = state.accent;
        ctx.fillRect(player.x + 10, player.y + 22, 12, 4);
    } else {
        ctx.fillStyle = '#000';
        ctx.fillRect(player.x + 8, player.y + 8, 6, 6);
        ctx.fillRect(player.x + 18, player.y + 8, 6, 6);
    }

    if (invincibleTimer > 0) {
        ctx.restore();
    }
}

function drawUI() {
    const state = levelPhases[currentPhase];
    ctx.save();
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.fillRect(20, 20, 220, 100);

    ctx.fillStyle = '#fff';
    ctx.font = '16px "Arial"';
    ctx.fillText(`Realm: ${state.displayName}`, 36, 48);
    ctx.fillText('Phase Energy', 36, 72);

    for (let i = 0; i < PHASE_MAX_ENERGY; i++) {
        const x = 32 + i * 28;
        const y = 84;
        ctx.strokeStyle = 'rgba(255,255,255,0.7)';
        ctx.strokeRect(x, y, 22, 10);
        if (i < phaseEnergy) {
            ctx.fillStyle = state.accent;
            ctx.fillRect(x + 1, y + 1, 20, 8);
        }
    }

    ctx.font = '12px "Arial"';
    const cooldownText = phaseCooldown > 0 ? `Recharging... ${Math.ceil(phaseCooldown / 12)}f` : 'Shift で相互次元シフト';
    ctx.fillText(cooldownText, 36, 106);

    // スコア・コンボ・ライフ表示
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.fillRect(canvas.width - 180, 20, 160, 80);

    ctx.fillStyle = '#fff';
    ctx.font = '14px "Arial"';
    ctx.fillText(`Score: ${score}`, canvas.width - 165, 45);

    if (combo > 0) {
        ctx.fillStyle = state.accent;
        ctx.fillText(`Combo: x${combo}`, canvas.width - 165, 65);

        // コンボタイマーバー
        const comboRatio = comboTimer / COMBO_TIMER_MAX;
        ctx.fillStyle = 'rgba(255,255,255,0.3)';
        ctx.fillRect(canvas.width - 165, 70, 140, 6);
        ctx.fillStyle = comboRatio > 0.3 ? state.accent : '#ff4444';
        ctx.fillRect(canvas.width - 165, 70, 140 * comboRatio, 6);
    }

    // ライフ表示
    ctx.fillStyle = '#fff';
    ctx.fillText('Lives:', canvas.width - 165, 88);
    for (let i = 0; i < lives; i++) {
        ctx.fillStyle = '#ff6b6b';
        ctx.fillRect(canvas.width - 110 + i * 20, 78, 15, 15);
    }

    ctx.restore();
}

function drawFloatingTexts() {
    for (let text of floatingTexts) {
        const alpha = Math.min(text.life / 30, 1);
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = text.color;
        ctx.font = `bold ${text.size}px "Arial"`;
        ctx.textAlign = 'center';
        ctx.strokeStyle = 'rgba(0,0,0,0.8)';
        ctx.lineWidth = 3;
        ctx.strokeText(text.text, text.x, text.y);
        ctx.fillText(text.text, text.x, text.y);
        ctx.restore();
    }
}

function drawGameOver() {
    ctx.save();
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#fff';
    ctx.font = 'bold 48px "Arial"';
    ctx.textAlign = 'center';
    ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2 - 40);

    ctx.font = '24px "Arial"';
    ctx.fillText(`Final Score: ${score}`, canvas.width / 2, canvas.height / 2 + 20);

    ctx.font = '18px "Arial"';
    ctx.fillText('Press R to Restart', canvas.width / 2, canvas.height / 2 + 60);

    ctx.textAlign = 'left';
    ctx.restore();
}

function drawPhaseFlash() {
    if (phaseFlashTimer > 0) {
        const alpha = (phaseFlashTimer / PHASE_FLASH_FRAMES) * 0.25;
        ctx.fillStyle = `rgba(255,255,255,${alpha})`;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
}

function draw() {
    const activeState = levelPhases[currentPhase];
    const otherState = currentPhase === 'SOLID' ? levelPhases.ETHER : levelPhases.SOLID;

    drawBackground(activeState);
    drawGhostPlatforms(otherState.platforms, otherState.accent);
    drawPlatforms(activeState.platforms, activeState.platformColor, activeState.platformShadow);
    drawPhaseGates();
    drawPhaseRipples();
    drawPlayerTrail();
    drawOrbs();
    drawEnemies();
    drawPhaseEchoes();
    drawPlayer();
    drawFloatingTexts();
    drawUI();
    drawPhaseFlash();

    if (gameState === 'gameover') {
        drawGameOver();
    }
}

function gameLoop() {
    if (gameState === 'playing') {
        handlePhaseShift();
        updatePlayer();
        updatePhaseGates();
        updatePhaseEchoes();
        updatePhaseOrbs();
        updateEnemies();
        updatePlayerTrail();
        updateFloatingTexts();

        if (invincibleTimer > 0) {
            invincibleTimer -= 1;
        }

        if (comboTimer > 0) {
            comboTimer -= 1;
            if (comboTimer === 0) {
                combo = 0;
            }
        }

        // 敵の生成
        if (frameCounter % 180 === 0 && enemies.length < 6) {
            spawnEnemy();
        }

        if (frameCounter % 600 === 0) {
            phaseEnergy = Math.min(PHASE_MAX_ENERGY, phaseEnergy + 1);
        }
    } else {
        updatePhaseEchoes();
        updateFloatingTexts();
    }

    draw();
    frameCounter += 1;

    requestAnimationFrame(gameLoop);
}

// ゲーム開始
gameLoop();
