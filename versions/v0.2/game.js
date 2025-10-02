// ゲーム設定
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const GRAVITY = 0.5;
const JUMP_STRENGTH = -12;
const MOVE_SPEED = 5;
const PHASE_MAX_ENERGY = 3;
const PHASE_COOLDOWN_FRAMES = 45;
const PHASE_FLASH_FRAMES = 24;

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
            { x: 150, y: 250, width: 100, height: 20 },
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
            { x: 430, y: 240, width: 140, height: 24 },
            { x: 650, y: 200, width: 110, height: 24 }
        ]
    }
};

let currentPhase = 'SOLID';
let phaseEnergy = 1;
let phaseCooldown = 0;
let phaseFlashTimer = 0;
let frameCounter = 0;

const phaseRipples = [];
const playerTrail = [];

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
    { x: 720, y: 520, radius: 10, phase: 'BOTH', collected: false, floatOffset: Math.random() * Math.PI * 2, respawnTimer: 0 }
];

// キー入力
const keys = {};
let shiftHeld = false;
let phaseShiftRequested = false;

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
        currentPhase = currentPhase === 'SOLID' ? 'ETHER' : 'SOLID';
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

        const activeForPhase = orb.phase === 'BOTH' || orb.phase === currentPhase;
        if (!activeForPhase) {
            continue;
        }

        const orbRect = {
            x: orb.x - orb.radius,
            y: orb.renderY - orb.radius,
            width: orb.radius * 2,
            height: orb.radius * 2
        };

        if (checkCollision(player, orbRect)) {
            orb.collected = true;
            orb.respawnTimer = 360;
            phaseEnergy = Math.min(PHASE_MAX_ENERGY, phaseEnergy + 1);
            phaseRipples.push({
                x: orb.x,
                y: orb.renderY,
                radius: 10,
                alpha: 0.5,
                phase: currentPhase
            });
        }
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

function drawPlayer() {
    const state = levelPhases[currentPhase];
    const bodyColor = currentPhase === 'ETHER' ? '#80ffea' : '#FF6347';

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
    drawPhaseRipples();
    drawPlayerTrail();
    drawOrbs();
    drawPlayer();
    drawUI();
    drawPhaseFlash();
}

function gameLoop() {
    handlePhaseShift();
    updatePlayer();
    updatePhaseOrbs();
    updatePlayerTrail();
    draw();

    frameCounter += 1;

    if (frameCounter % 600 === 0) {
        phaseEnergy = Math.min(PHASE_MAX_ENERGY, phaseEnergy + 1);
    }

    requestAnimationFrame(gameLoop);
}

// ゲーム開始
gameLoop();
