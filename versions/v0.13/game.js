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
const COMBO_TIMER_MAX = 240;
const ECHO_SWAP_COOLDOWN = 120;
const ECHO_SWAP_PULSE_RADIUS = 110;
const ECHO_SWAP_COST = 1;
const POWERUP_SURGE_DURATION = 600;
const POWERUP_STORM_DURATION = 540;
const POWERUP_RESPAWN_FRAMES = 900;
const APEX_DURATION = 360;
const APEX_SATELLITE_COUNT = 3;
const APEX_ORBIT_RADIUS = 70;
const APEX_DAMAGE_SCORE = 120;
const APEX_TIME_REWARD_MS = 5000;
const APEX_SATELLITE_RADIUS = 18;

// ステージ定義
const stages = [
    {
        id: 1,
        name: 'Phase Introduction',
        width: 3200,
        goalX: 3000,
        timeLimit: 180,
        skyGradient: { top: '#4a90e2', bottom: '#89c4f4' }
    },
    {
        id: 2,
        name: 'Echo Mastery',
        width: 4000,
        goalX: 3800,
        timeLimit: 210,
        skyGradient: { top: '#5f27cd', bottom: '#a55eea' }
    },
    {
        id: 3,
        name: 'Final Dimension',
        width: 5000,
        goalX: 4800,
        timeLimit: 240,
        skyGradient: { top: '#ee5a6f', bottom: '#f79f1f' }
    }
];

let currentStageIndex = 0;
let STAGE_WIDTH = stages[0].width;
let GOAL_X = stages[0].goalX;

// ステージ生成関数
function generatePlatformsForStage(stageWidth, phaseId) {
    const platforms = [
        { x: 0, y: 550, width: stageWidth, height: 50 }
    ];

    const segments = Math.floor(stageWidth / 800);
    for (let i = 0; i < segments; i++) {
        const baseX = i * 800;
        if (phaseId === 'SOLID') {
            platforms.push(
                { x: baseX + 200, y: 450, width: 150, height: 20 },
                { x: baseX + 400, y: 350, width: 150, height: 20 },
                { x: baseX + 600, y: 250, width: 150, height: 20 }
            );
            if (Math.random() > 0.3) {
                platforms.push({ x: baseX + 120, y: 250 + Math.random() * 100, width: 140, height: 20 });
            }
        } else {
            platforms.push(
                { x: baseX + 120, y: 470, width: 140, height: 24 },
                { x: baseX + 310, y: 360, width: 150, height: 24 },
                { x: baseX + 520, y: 440 - Math.random() * 100, width: 120, height: 24 }
            );
            if (Math.random() > 0.4) {
                platforms.push({ x: baseX + 650, y: 200 + Math.random() * 80, width: 110, height: 24 });
            }
        }
    }

    return platforms;
}

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
            { x: 0, y: 550, width: STAGE_WIDTH, height: 50 },
            { x: 200, y: 450, width: 150, height: 20 },
            { x: 400, y: 350, width: 150, height: 20 },
            { x: 600, y: 250, width: 150, height: 20 },
            { x: 120, y: 250, width: 140, height: 20 },
            { x: 500, y: 150, width: 120, height: 20 },
            { x: 900, y: 450, width: 200, height: 20 },
            { x: 1150, y: 350, width: 150, height: 20 },
            { x: 1350, y: 450, width: 180, height: 20 },
            { x: 1600, y: 380, width: 160, height: 20 },
            { x: 1850, y: 280, width: 140, height: 20 },
            { x: 2050, y: 450, width: 200, height: 20 },
            { x: 2300, y: 350, width: 150, height: 20 },
            { x: 2500, y: 250, width: 180, height: 20 },
            { x: 2750, y: 450, width: 250, height: 20 }
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
            { x: 0, y: 550, width: STAGE_WIDTH, height: 50 },
            { x: 120, y: 470, width: 140, height: 24 },
            { x: 520, y: 440, width: 120, height: 24 },
            { x: 310, y: 360, width: 150, height: 24 },
            { x: 110, y: 300, width: 120, height: 24 },
            { x: 430, y: 240, width: 210, height: 24 },
            { x: 650, y: 200, width: 110, height: 24 },
            { x: 850, y: 420, width: 160, height: 24 },
            { x: 1100, y: 320, width: 140, height: 24 },
            { x: 1400, y: 400, width: 180, height: 24 },
            { x: 1650, y: 300, width: 150, height: 24 },
            { x: 1900, y: 220, width: 160, height: 24 },
            { x: 2100, y: 400, width: 190, height: 24 },
            { x: 2350, y: 300, width: 140, height: 24 },
            { x: 2600, y: 380, width: 200, height: 24 },
            { x: 2850, y: 450, width: 180, height: 24 }
        ]
    }
};

let currentPhase = 'SOLID';
let phaseEnergy = 1;
let phaseCooldown = 0;
let phaseFlashTimer = 0;
let frameCounter = 0;
let gameState = 'playing'; // playing, gameover, stageclear, allclear
let score = 0;
let combo = 0;
let comboTimer = 0;
let lives = 3;
let invincibleTimer = 0;
let echoSwapCooldown = 0;
let echoSwapRequested = false;
let cameraX = 0;
let stageStartTime = 0;
let stageClearTime = 0;
let maxComboReached = 0;
let apexTimer = 0;
let apexCharge = 0;

const apexSatellites = [];

const phaseRipples = [];
const playerTrail = [];
const phaseEchoes = [];
const enemies = [];
const floatingTexts = [];
const phaseShockwaves = [];

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
    { x: 620, y: 220, radius: 9, phase: 'ETHER', collected: false, floatOffset: Math.random() * Math.PI * 2, respawnTimer: 0 },
    { x: 1000, y: 420, radius: 10, phase: 'SOLID', collected: false, floatOffset: Math.random() * Math.PI * 2, respawnTimer: 0 },
    { x: 1250, y: 320, radius: 10, phase: 'ETHER', collected: false, floatOffset: Math.random() * Math.PI * 2, respawnTimer: 0 },
    { x: 1500, y: 350, radius: 10, phase: 'BOTH', collected: false, floatOffset: Math.random() * Math.PI * 2, respawnTimer: 0 },
    { x: 1900, y: 250, radius: 10, phase: 'ETHER', collected: false, floatOffset: Math.random() * Math.PI * 2, respawnTimer: 0 },
    { x: 2200, y: 420, radius: 10, phase: 'SOLID', collected: false, floatOffset: Math.random() * Math.PI * 2, respawnTimer: 0 },
    { x: 2450, y: 220, radius: 10, phase: 'BOTH', collected: false, floatOffset: Math.random() * Math.PI * 2, respawnTimer: 0 },
    { x: 2800, y: 420, radius: 10, phase: 'SOLID', collected: false, floatOffset: Math.random() * Math.PI * 2, respawnTimer: 0 }
];

const phasePowerups = [
    { x: 460, y: 310, phase: 'SOLID', type: 'SURGE', collected: false, floatOffset: Math.random() * Math.PI * 2, respawnTimer: 0 },
    { x: 980, y: 380, phase: 'ETHER', type: 'STORM', collected: false, floatOffset: Math.random() * Math.PI * 2, respawnTimer: 0 },
    { x: 1680, y: 340, phase: 'BOTH', type: 'SURGE', collected: false, floatOffset: Math.random() * Math.PI * 2, respawnTimer: 0 },
    { x: 2280, y: 260, phase: 'ETHER', type: 'STORM', collected: false, floatOffset: Math.random() * Math.PI * 2, respawnTimer: 0 },
    { x: 2880, y: 410, phase: 'BOTH', type: 'SURGE', collected: false, floatOffset: Math.random() * Math.PI * 2, respawnTimer: 0 }
];

const activePowerups = {
    SURGE: 0,
    STORM: 0
};

// ピット（穴）の定義
const stagePits = [];

// フェーズシャード（ゲートの代替収集物）
const phaseShards = [];

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

function isPowerupActive(type) {
    return (activePowerups[type] ?? 0) > 0;
}

function applyPowerupEffect(type) {
    if (type === 'SURGE') {
        activePowerups.SURGE = POWERUP_SURGE_DURATION;
        phaseEnergy = Math.min(PHASE_MAX_ENERGY, phaseEnergy + 2);
        addFloatingText(player.x + player.width / 2, player.y - 20, 'SURGE ONLINE', '#ffe066', 18);
        phaseRipples.push({
            x: player.x + player.width / 2,
            y: player.y + player.height / 2,
            radius: 28,
            alpha: 0.55,
            phase: currentPhase
        });
    } else if (type === 'STORM') {
        activePowerups.STORM = POWERUP_STORM_DURATION;
        addFloatingText(player.x + player.width / 2, player.y - 20, 'STORM CALL', '#80ffea', 18);
        for (let i = 0; i < 2; i++) {
            spawnStormEcho(currentPhase);
        }
    }

    checkApexActivation();
}

function spawnStormEcho(phase) {
    const echo = {
        x: player.x + (Math.random() - 0.5) * 20,
        y: player.y + (Math.random() - 0.5) * 20,
        width: player.width,
        height: player.height,
        velocityX: player.velocityX * 0.6 + (Math.random() - 0.5) * 4,
        velocityY: player.velocityY * 0.3 - 4 - Math.random() * 2,
        life: Math.floor(ECHO_LIFETIME_FRAMES * 0.75),
        phase,
        bounceCooldown: 4
    };
    phaseEchoes.push(echo);
    phaseRipples.push({
        x: echo.x + echo.width / 2,
        y: echo.y + echo.height / 2,
        radius: 18,
        alpha: 0.45,
        phase
    });
}

function activateApexResonance() {
    apexTimer = APEX_DURATION;
    apexSatellites.length = 0;
    const satellitePhases = ['SOLID', 'ETHER', 'BOTH'];
    for (let i = 0; i < APEX_SATELLITE_COUNT; i++) {
        apexSatellites.push({
            angle: (Math.PI * 2 / APEX_SATELLITE_COUNT) * i,
            speed: 0.07 + i * 0.01,
            phase: satellitePhases[i % satellitePhases.length],
            x: player.x,
            y: player.y
        });
    }

    stageStartTime -= APEX_TIME_REWARD_MS;
    if (stageStartTime > Date.now()) {
        stageStartTime = Date.now();
    }

    score += 500;
    addFloatingText(player.x + player.width / 2, player.y - 30, 'APEX RESONANCE!', '#ffb3ff', 20);
    phaseRipples.push({
        x: player.x + player.width / 2,
        y: player.y + player.height / 2,
        radius: 60,
        alpha: 0.5,
        phase: currentPhase
    });
    comboTimer = COMBO_TIMER_MAX;
}

function checkApexActivation() {
    if (apexTimer > 0) {
        return;
    }
    if (activePowerups.SURGE > 0 && activePowerups.STORM > 0) {
        activateApexResonance();
    }
}

// 敵の生成
function spawnEnemy() {
    const phase = Math.random() > 0.5 ? 'SOLID' : 'ETHER';
    const platforms = levelPhases[phase].platforms;
    const validPlatforms = platforms.filter(p => p.y < 500 && p.width > 100);
    const platform = validPlatforms[Math.floor(Math.random() * validPlatforms.length)];

    // カメラ範囲から離れた位置にスポーン
    const spawnOffScreen = Math.random() > 0.5;
    const x = spawnOffScreen
        ? (Math.random() > 0.5 ? cameraX + canvas.width + 30 : cameraX - 60)
        : platform.x + Math.random() * (platform.width - 28);

    enemies.push({
        x: x,
        y: platform.y - 28,
        width: 28,
        height: 28,
        phase: phase,
        speed: 1.5 + Math.random() * 1,
        direction: Math.random() > 0.5 ? 1 : -1,
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
        } else if ((e.key === 'q' || e.key === 'Q') && !echoSwapRequested) {
            echoSwapRequested = true;
        }
    }

    if (e.key === ' ') {
        e.preventDefault();
    }

    if (e.key === 'r' || e.key === 'R') {
        if (gameState === 'gameover' || gameState === 'allclear') {
            resetGame();
        } else if (gameState === 'stageclear') {
            resetStage();
        }
    }

    if ((e.key === 'n' || e.key === 'N') && gameState === 'stageclear') {
        const timeBonus = Math.max(0, (stages[currentStageIndex].timeLimit - stageClearTime) * 10);
        score += timeBonus;
        nextStage();
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

function checkCircleRect(circleX, circleY, radius, rect) {
    const closestX = Math.max(rect.x, Math.min(circleX, rect.x + rect.width));
    const closestY = Math.max(rect.y, Math.min(circleY, rect.y + rect.height));
    const dx = circleX - closestX;
    const dy = circleY - closestY;
    return (dx * dx + dy * dy) <= radius * radius;
}

function handlePhaseShift() {
    const surgeActive = isPowerupActive('SURGE');
    if (phaseShiftRequested && (phaseEnergy > 0 || surgeActive) && phaseCooldown === 0) {
        const previousPhase = currentPhase;
        spawnPhaseEcho(previousPhase);
        currentPhase = previousPhase === 'SOLID' ? 'ETHER' : 'SOLID';
        if (!surgeActive) {
            phaseEnergy = Math.max(0, phaseEnergy - 1);
        }
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

        if (isPowerupActive('STORM')) {
            spawnStormEcho(previousPhase);
            spawnStormEcho(currentPhase);
        }
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

function handleEchoSwap() {
    if (echoSwapCooldown > 0) {
        echoSwapCooldown -= 1;
    }

    if (!echoSwapRequested) {
        return;
    }

    echoSwapRequested = false;

    const surgeActive = isPowerupActive('SURGE');

    if (echoSwapCooldown > 0 || phaseEchoes.length === 0 || (!surgeActive && phaseEnergy < ECHO_SWAP_COST)) {
        return;
    }

    let targetIndex = -1;
    let alternateIndex = -1;
    const playerCenterX = player.x + player.width / 2;
    const playerCenterY = player.y + player.height / 2;
    let closestDistance = Infinity;
    let alternateDistance = Infinity;

    for (let i = 0; i < phaseEchoes.length; i++) {
        const echo = phaseEchoes[i];
        const echoCenterX = echo.x + echo.width / 2;
        const echoCenterY = echo.y + echo.height / 2;
        const distance = Math.hypot(echoCenterX - playerCenterX, echoCenterY - playerCenterY);

        if (echo.phase !== currentPhase) {
            if (distance < closestDistance) {
                closestDistance = distance;
                targetIndex = i;
            }
        } else if (distance < alternateDistance) {
            alternateDistance = distance;
            alternateIndex = i;
        }
    }

    if (targetIndex === -1) {
        targetIndex = alternateIndex;
    }

    if (targetIndex === -1) {
        return;
    }

    const originPhase = currentPhase;
    const originX = player.x;
    const originY = player.y;
    const originCenterX = playerCenterX;
    const originCenterY = playerCenterY;

    const targetEcho = phaseEchoes[targetIndex];
    const targetCenterX = targetEcho.x + targetEcho.width / 2;
    const targetCenterY = targetEcho.y + targetEcho.height / 2;

    phaseEchoes.splice(targetIndex, 1);

    if (!surgeActive) {
        phaseEnergy = Math.max(0, phaseEnergy - ECHO_SWAP_COST);
    }
    echoSwapCooldown = ECHO_SWAP_COOLDOWN;
    currentPhase = targetEcho.phase;
    player.x = targetEcho.x;
    player.y = targetEcho.y;
    player.velocityX = targetEcho.velocityX ?? 0;
    player.velocityY = targetEcho.velocityY ?? 0;
    player.onGround = false;
    player.jumping = false;
    phaseCooldown = Math.max(phaseCooldown, 18);
    phaseFlashTimer = PHASE_FLASH_FRAMES;

    phaseRipples.push({
        x: originCenterX,
        y: originCenterY,
        radius: 32,
        alpha: 0.55,
        phase: originPhase
    });
    phaseRipples.push({
        x: targetCenterX,
        y: targetCenterY,
        radius: 38,
        alpha: 0.65,
        phase: currentPhase
    });

    addFloatingText(targetCenterX, targetCenterY - 20, 'Echo Swap!', '#ff8cff', 18);

    let defeatedCount = 0;

    for (let i = enemies.length - 1; i >= 0; i--) {
        const enemy = enemies[i];
        if (enemy.phase !== originPhase) {
            continue;
        }

        const enemyCenterX = enemy.x + enemy.width / 2;
        const enemyCenterY = enemy.y + enemy.height / 2;
        const distance = Math.hypot(enemyCenterX - originCenterX, enemyCenterY - originCenterY);

        if (distance <= ECHO_SWAP_PULSE_RADIUS) {
            enemies.splice(i, 1);
            const points = 80 * (combo + 1);
            score += points;
            combo += 1;
            comboTimer = COMBO_TIMER_MAX;
            phaseEnergy = Math.min(PHASE_MAX_ENERGY, phaseEnergy + 1);
            addFloatingText(enemyCenterX, enemyCenterY, `+${points} Pulse`, '#ff55ff', 15);
            phaseRipples.push({
                x: enemyCenterX,
                y: enemyCenterY,
                radius: 24,
                alpha: 0.6,
                phase: originPhase
            });
            defeatedCount += 1;
        }
    }

    if (defeatedCount > 0) {
        addFloatingText(originCenterX, originCenterY - 24, `Phase Pulse x${defeatedCount}`, '#ffa9ff', 16);
    }

    for (let echo of phaseEchoes) {
        const echoCenterX = echo.x + echo.width / 2;
        const echoCenterY = echo.y + echo.height / 2;
        const dx = originCenterX - echoCenterX;
        const dy = originCenterY - echoCenterY;
        const distance = Math.hypot(dx, dy) || 1;
        echo.velocityX -= (dx / distance) * 1.6;
        echo.velocityY -= (dy / distance) * 1.2;
    }

    const pulseMaxRadius = isPowerupActive('STORM') ? ECHO_SWAP_PULSE_RADIUS + 40 : ECHO_SWAP_PULSE_RADIUS;

    phaseShockwaves.push({
        x: originCenterX,
        y: originCenterY,
        radius: 20,
        growth: 6,
        maxRadius: pulseMaxRadius,
        alpha: 0.45,
        phase: originPhase,
        life: Math.ceil(ECHO_SWAP_PULSE_RADIUS / 6)
    });

    if (isPowerupActive('STORM')) {
        phaseRipples.push({
            x: originCenterX,
            y: originCenterY,
            radius: pulseMaxRadius * 0.6,
            alpha: 0.35,
            phase: originPhase
        });
    }
}
function updatePlayer() {
    const activePhase = levelPhases[currentPhase];
    const activePlatforms = activePhase.platforms;
    const surgeActive = isPowerupActive('SURGE');
    const stormActive = isPowerupActive('STORM');
    const baseHorizontal = currentPhase === 'ETHER' ? MOVE_SPEED + 1.2 : MOVE_SPEED;
    const horizontalSpeed = baseHorizontal + (surgeActive ? 1.5 : 0);
    const gravity = (currentPhase === 'ETHER' ? GRAVITY * 0.7 : GRAVITY) * (stormActive ? 0.92 : 1);
    const jumpStrengthBase = currentPhase === 'ETHER' ? JUMP_STRENGTH * 0.9 : JUMP_STRENGTH;
    const jumpStrength = surgeActive ? jumpStrengthBase * 1.12 : jumpStrengthBase;

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
    if (player.x + player.width > STAGE_WIDTH) player.x = STAGE_WIDTH - player.width;
    if (player.y > canvas.height) {
        lives -= 1;
        if (lives <= 0) {
            gameState = 'gameover';
        } else {
            player.y = 100;
            player.x = 100;
            player.velocityY = 0;
            invincibleTimer = INVINCIBLE_FRAMES;
        }
    }

    // ピット判定
    if (gameState === 'playing' && invincibleTimer === 0) {
        checkPitCollision();
    }

    // ゴール判定
    if (player.x >= GOAL_X && gameState === 'playing') {
        stageClearTime = Math.floor((Date.now() - stageStartTime) / 1000);
        maxComboReached = Math.max(maxComboReached, combo);

        if (currentStageIndex < stages.length - 1) {
            gameState = 'stageclear';
        } else {
            gameState = 'allclear';
        }
    }

    // カメラ更新
    updateCamera();
}

function updateCamera() {
    const targetCameraX = player.x - canvas.width / 2 + player.width / 2;
    cameraX = Math.max(0, Math.min(targetCameraX, STAGE_WIDTH - canvas.width));
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

function updatePhasePowerups() {
    for (let powerup of phasePowerups) {
        powerup.floatOffset += 0.045;
        powerup.renderY = powerup.y + Math.sin(powerup.floatOffset) * 8;

        if (powerup.collected) {
            if (powerup.respawnTimer > 0) {
                powerup.respawnTimer -= 1;
                if (powerup.respawnTimer === 0) {
                    powerup.collected = false;
                }
            }
            continue;
        }

        const activeForPhase = powerup.phase === 'BOTH' || powerup.phase === currentPhase;
        if (!activeForPhase || gameState !== 'playing') {
            continue;
        }

        const pickupRect = {
            x: powerup.x - 16,
            y: powerup.renderY - 16,
            width: 32,
            height: 32
        };

        if (checkCollision(player, pickupRect)) {
            powerup.collected = true;
            powerup.respawnTimer = POWERUP_RESPAWN_FRAMES;
            applyPowerupEffect(powerup.type);
            phaseRipples.push({
                x: powerup.x,
                y: powerup.renderY,
                radius: 24,
                alpha: 0.6,
                phase: currentPhase
            });
        }
    }
}

function collectPhaseShard(shard, sourcePhase = currentPhase) {
    if (shard.collected) {
        return;
    }
    shard.collected = true;
    apexCharge = Math.min(3, apexCharge + 1);
    const shardPhase = shard.phase === 'BOTH' ? sourcePhase : shard.phase;
    addFloatingText(shard.x, shard.renderY ?? shard.y, `Shard ${apexCharge}/3`, levelPhases[currentPhase].accent, 14);
    phaseRipples.push({
        x: shard.x,
        y: (shard.renderY ?? shard.y),
        radius: 22,
        alpha: 0.55,
        phase: shardPhase
    });

    if (apexCharge >= 3) {
        apexCharge = 0;
        activePowerups.SURGE = Math.max(activePowerups.SURGE, Math.floor(POWERUP_SURGE_DURATION / 2));
        activePowerups.STORM = Math.max(activePowerups.STORM, Math.floor(POWERUP_STORM_DURATION / 2));
        activateApexResonance();
    }
}

function updatePhaseShards() {
    for (let shard of phaseShards) {
        if (shard.collected) {
            continue;
        }

        shard.floatOffset += 0.05;
        shard.renderY = shard.y + Math.sin(shard.floatOffset) * 10;

        const activeForPhase = shard.phase === 'BOTH' || shard.phase === currentPhase;
        if (!activeForPhase || gameState !== 'playing') {
            continue;
        }

        const shardRect = {
            x: shard.x - 14,
            y: shard.renderY - 14,
            width: 28,
            height: 28
        };

        if (checkCollision(player, shardRect)) {
            collectPhaseShard(shard);
        }
    }
}

function updateActivePowerups() {
    if (activePowerups.SURGE > 0) {
        activePowerups.SURGE -= 1;
        if (gameState === 'playing' && frameCounter % 30 === 0) {
            phaseEnergy = Math.min(PHASE_MAX_ENERGY, phaseEnergy + 1);
        }
        if (activePowerups.SURGE === 0) {
            addFloatingText(player.x + player.width / 2, player.y - 30, 'Surge Fades', '#ffd166', 14);
        }
    }

    if (activePowerups.STORM > 0) {
        activePowerups.STORM -= 1;
        if (gameState === 'playing' && frameCounter % 45 === 0 && phaseEchoes.length < 14) {
            spawnStormEcho(currentPhase);
        }
        if (activePowerups.STORM === 0) {
            addFloatingText(player.x + player.width / 2, player.y - 30, 'Storm Dissipates', '#80ffea', 14);
        }
    }

    checkApexActivation();
}

function updateApexSatellites() {
    if (apexTimer <= 0) {
        apexSatellites.length = 0;
        return;
    }

    apexTimer -= 1;

    const baseRadius = APEX_ORBIT_RADIUS + Math.sin(frameCounter * 0.08) * 6;

    for (let satellite of apexSatellites) {
        satellite.angle += satellite.speed;
        const radius = baseRadius + Math.sin(frameCounter * 0.15 + satellite.angle) * 4;
        satellite.x = player.x + player.width / 2 + Math.cos(satellite.angle) * radius;
        satellite.y = player.y + player.height / 2 + Math.sin(satellite.angle) * radius * 0.72;

        // 敵との衝突判定
        for (let i = enemies.length - 1; i >= 0; i--) {
            const enemy = enemies[i];
            if (!checkCircleRect(satellite.x, satellite.y, APEX_SATELLITE_RADIUS, enemy)) {
                continue;
            }

            enemies.splice(i, 1);
            const phaseKey = enemy.phase === 'ETHER' ? levelPhases.ETHER : levelPhases.SOLID;
            const points = APEX_DAMAGE_SCORE * (combo + 1);
            score += points;
            combo += 1;
            comboTimer = COMBO_TIMER_MAX;
            phaseEnergy = Math.min(PHASE_MAX_ENERGY, phaseEnergy + 1);
            addFloatingText(enemy.x + enemy.width / 2, enemy.y, `+${points} Apex`, phaseKey.accent, 16);
            phaseRipples.push({
                x: enemy.x + enemy.width / 2,
                y: enemy.y + enemy.height / 2,
                radius: 28,
                alpha: 0.6,
                phase: enemy.phase
            });
        }

        // オーブとの衝突判定
        for (let orb of phaseOrbs) {
            if (orb.collected) {
                continue;
            }
            const orbRect = {
                x: orb.x - orb.radius,
                y: orb.renderY - orb.radius,
                width: orb.radius * 2,
                height: orb.radius * 2
            };
            if (!checkCircleRect(satellite.x, satellite.y, APEX_SATELLITE_RADIUS, orbRect)) {
                continue;
            }

            orb.collected = true;
            orb.respawnTimer = 360;
            const points = 40 * (combo + 1);
            score += points;
            combo += 1;
            comboTimer = COMBO_TIMER_MAX;
            phaseEnergy = Math.min(PHASE_MAX_ENERGY, phaseEnergy + 1);
            const ripplePhase = satellite.phase === 'BOTH' ? currentPhase : satellite.phase;
            phaseRipples.push({
                x: orb.x,
                y: orb.renderY,
                radius: 20,
                alpha: 0.5,
                phase: ripplePhase
            });
            addFloatingText(orb.x, orb.renderY, `+${points}`, levelPhases[ripplePhase].accent, 12);
        }

        for (let shard of phaseShards) {
            if (shard.collected) {
                continue;
            }
            const shardRect = {
                x: shard.x - 14,
                y: (shard.renderY ?? shard.y) - 14,
                width: 28,
                height: 28
            };
            if (!checkCircleRect(satellite.x, satellite.y, APEX_SATELLITE_RADIUS, shardRect)) {
                continue;
            }
            collectPhaseShard(shard, satellite.phase === 'BOTH' ? currentPhase : satellite.phase);
        }
    }

    if (apexTimer === 0) {
        addFloatingText(player.x + player.width / 2, player.y - 30, 'Apex Resonance Fades', '#d4b3ff', 14);
        apexSatellites.length = 0;
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

        // ステージ外で消滅
        if (echo.x < -80 || echo.x > STAGE_WIDTH + 80 || echo.y > canvas.height + 120) {
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

function checkPitCollision() {
    // ピットとの衝突判定
    for (let pit of stagePits) {
        if (player.x + player.width > pit.x && player.x < pit.x + pit.width) {
            // プレイヤーの足元がピットの上端より下にあるかチェック
            if (player.y + player.height >= pit.y) {
                // ピットに落ちた
                lives -= 1;
                if (lives <= 0) {
                    gameState = 'gameover';
                } else {
                    player.x = 100;
                    player.y = 100;
                    player.velocityX = 0;
                    player.velocityY = 0;
                    invincibleTimer = INVINCIBLE_FRAMES;
                    combo = 0;
                    comboTimer = 0;
                }
                return true;
            }
        }
    }
    return false;
}

function updatePhaseShockwaves() {
    for (let i = phaseShockwaves.length - 1; i >= 0; i--) {
        const pulse = phaseShockwaves[i];
        pulse.radius = Math.min(pulse.radius + pulse.growth, pulse.maxRadius);
        pulse.life -= 1;
        pulse.alpha *= 0.94;
        if (pulse.life <= 0 || pulse.alpha <= 0.05) {
            phaseShockwaves.splice(i, 1);
        }
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

        if (enemy.y > canvas.height + 100 || enemy.x < -120 || enemy.x > STAGE_WIDTH + 120) {
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

function loadStage(stageIndex) {
    const stage = stages[stageIndex];
    STAGE_WIDTH = stage.width;
    GOAL_X = stage.goalX;

    // プラットフォームを再生成
    levelPhases.SOLID.platforms = generatePlatformsForStage(STAGE_WIDTH, 'SOLID');
    levelPhases.ETHER.platforms = generatePlatformsForStage(STAGE_WIDTH, 'ETHER');

    // アイテムとピット・シャードをリセット
    phaseOrbs.length = 0;
    phasePowerups.length = 0;
    stagePits.length = 0;
    phaseShards.length = 0;

    // オーブを配置
    const orbCount = Math.floor(STAGE_WIDTH / 300) + 5;
    const phases = ['SOLID', 'ETHER', 'BOTH'];
    for (let i = 0; i < orbCount; i++) {
        phaseOrbs.push({
            x: 200 + (i * STAGE_WIDTH / orbCount) + Math.random() * 100,
            y: 200 + Math.random() * 250,
            radius: 9 + Math.random() * 2,
            phase: phases[Math.floor(Math.random() * phases.length)],
            collected: false,
            floatOffset: Math.random() * Math.PI * 2,
            respawnTimer: 0
        });
    }

    // パワーアップを配置
    const powerupCount = Math.floor(STAGE_WIDTH / 800) + 2;
    const types = ['SURGE', 'STORM'];
    for (let i = 0; i < powerupCount; i++) {
        phasePowerups.push({
            x: 400 + (i * STAGE_WIDTH / powerupCount) + Math.random() * 150,
            y: 250 + Math.random() * 200,
            phase: phases[Math.floor(Math.random() * phases.length)],
            type: types[Math.floor(Math.random() * types.length)],
            collected: false,
            floatOffset: Math.random() * Math.PI * 2,
            respawnTimer: 0
        });
    }

    // ピット(穴)を配置
    const pitCount = Math.floor(STAGE_WIDTH / 800) + 2;
    for (let i = 0; i < pitCount; i++) {
        const pitX = 600 + (i * (STAGE_WIDTH - 1200) / pitCount);
        const pitWidth = 100 + Math.random() * 100;
        stagePits.push({
            x: pitX,
            y: 550,
            width: pitWidth,
            height: 50
        });
    }

    // フェーズシャードを配置
    const shardCount = Math.max(3, Math.floor(STAGE_WIDTH / 1400));
    for (let i = 0; i < shardCount; i++) {
        phaseShards.push({
            x: 500 + (i * STAGE_WIDTH / shardCount) + Math.random() * 120,
            y: 220 + Math.random() * 250,
            phase: phases[Math.floor(Math.random() * phases.length)],
            collected: false,
            floatOffset: Math.random() * Math.PI * 2
        });
    }

    stageStartTime = Date.now();
}

function resetStage() {
    gameState = 'playing';
    combo = 0;
    comboTimer = 0;
    invincibleTimer = 0;
    player.x = 100;
    player.y = 100;
    player.velocityX = 0;
    player.velocityY = 0;
    currentPhase = 'SOLID';
    phaseEnergy = 1;
    cameraX = 0;
    maxComboReached = 0;
    enemies.length = 0;
    phaseRipples.length = 0;
    playerTrail.length = 0;
    phaseEchoes.length = 0;
    floatingTexts.length = 0;
    phaseShockwaves.length = 0;
    echoSwapCooldown = 0;
    apexTimer = 0;
    apexSatellites.length = 0;
    apexCharge = 0;
    activePowerups.SURGE = 0;
    activePowerups.STORM = 0;
    for (let orb of phaseOrbs) {
        orb.collected = false;
        orb.respawnTimer = 0;
    }
    for (let powerup of phasePowerups) {
        powerup.collected = false;
        powerup.respawnTimer = 0;
    }
    for (let shard of phaseShards) {
        shard.collected = false;
    }
}

function resetGame() {
    currentStageIndex = 0;
    score = 0;
    lives = 3;
    loadStage(0);
    resetStage();
}

function nextStage() {
    currentStageIndex++;
    loadStage(currentStageIndex);
    resetStage();
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

function drawPhaseShockwaves() {
    for (let pulse of phaseShockwaves) {
        const pulseState = levelPhases[pulse.phase];
        ctx.save();
        ctx.globalAlpha = pulse.alpha;
        ctx.strokeStyle = pulseState.accent;
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(pulse.x, pulse.y, pulse.radius, 0, Math.PI * 2);
        ctx.stroke();

        ctx.globalAlpha *= 0.4;
        const gradient = ctx.createRadialGradient(pulse.x, pulse.y, 0, pulse.x, pulse.y, pulse.radius);
        gradient.addColorStop(0, 'rgba(255,255,255,0.2)');
        gradient.addColorStop(1, pulseState.accent);
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(pulse.x, pulse.y, pulse.radius * 0.6, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

function drawPowerups() {
    for (let powerup of phasePowerups) {
        if (powerup.collected) {
            continue;
        }

        const isActivePhase = powerup.phase === 'BOTH' || powerup.phase === currentPhase;
        const alpha = isActivePhase ? 0.95 : 0.35;
        const colors = powerup.type === 'SURGE'
            ? { core: '#ffd166', ring: '#ffe08a', glow: 'rgba(255, 209, 102, 0.45)' }
            : { core: '#80ffea', ring: '#2ec4b6', glow: 'rgba(128, 255, 234, 0.45)' };

        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.translate(powerup.x, powerup.renderY);
        const pulse = Math.sin(powerup.floatOffset * 1.5) * 4 + 18;

        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, pulse);
        gradient.addColorStop(0, colors.core);
        gradient.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(0, 0, pulse, 0, Math.PI * 2);
        ctx.fill();

        ctx.globalAlpha *= 0.9;
        ctx.strokeStyle = colors.ring;
        ctx.lineWidth = isActivePhase ? 3 : 1.5;
        ctx.beginPath();
        ctx.arc(0, 0, 16 + Math.sin(powerup.floatOffset) * 2, 0, Math.PI * 2);
        ctx.stroke();

        ctx.globalAlpha *= 0.5;
        ctx.fillStyle = colors.glow;
        ctx.fillRect(-4, -20, 8, 40);

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

function drawPhaseShards() {
    for (let shard of phaseShards) {
        if (shard.collected) {
            continue;
        }

        const isActivePhase = shard.phase === 'BOTH' || shard.phase === currentPhase;
        const shardState = shard.phase === 'BOTH'
            ? (Math.sin(frameCounter * 0.2) > 0 ? levelPhases.SOLID : levelPhases.ETHER)
            : levelPhases[shard.phase];

        ctx.save();
        ctx.globalAlpha = isActivePhase ? 0.9 : 0.4;
        ctx.translate(shard.x, shard.renderY ?? shard.y);
        ctx.rotate(Math.sin(shard.floatOffset) * 0.3);
        ctx.fillStyle = shardState.accent;
        ctx.beginPath();
        ctx.moveTo(0, -16);
        ctx.lineTo(12, 0);
        ctx.lineTo(0, 16);
        ctx.lineTo(-12, 0);
        ctx.closePath();
        ctx.fill();

        ctx.globalAlpha *= 0.6;
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, -18);
        ctx.lineTo(14, 0);
        ctx.lineTo(0, 18);
        ctx.lineTo(-14, 0);
        ctx.closePath();
        ctx.stroke();

        ctx.globalAlpha *= 0.45;
        ctx.fillStyle = shardState.echoColor;
        ctx.beginPath();
        ctx.arc(0, 0, 6 + Math.sin(frameCounter * 0.25) * 2, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }
}

function drawPits() {
    for (let pit of stagePits) {
        ctx.save();
        ctx.fillStyle = '#000000';
        ctx.fillRect(pit.x, pit.y, pit.width, pit.height);

        // 穴の縁を描画
        ctx.strokeStyle = '#ff0000';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(pit.x, pit.y);
        ctx.lineTo(pit.x + pit.width, pit.y);
        ctx.stroke();

        ctx.restore();
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

function drawApexSatellites() {
    if (apexTimer <= 0) {
        return;
    }

    for (let satellite of apexSatellites) {
        const state = satellite.phase === 'BOTH'
            ? (Math.sin(frameCounter * 0.12) > 0 ? levelPhases.SOLID : levelPhases.ETHER)
            : levelPhases[satellite.phase];

        ctx.save();
        ctx.globalAlpha = 0.85;
        ctx.fillStyle = state.accent;
        ctx.beginPath();
        ctx.arc(satellite.x, satellite.y, APEX_SATELLITE_RADIUS, 0, Math.PI * 2);
        ctx.fill();

        ctx.globalAlpha = 0.5;
        ctx.fillStyle = state.echoColor;
        ctx.beginPath();
        ctx.arc(satellite.x, satellite.y, APEX_SATELLITE_RADIUS + 6, 0, Math.PI * 2);
        ctx.fill();

        ctx.globalAlpha = 0.6;
        ctx.strokeStyle = 'rgba(255,255,255,0.9)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(satellite.x, satellite.y, APEX_SATELLITE_RADIUS + 10 + Math.sin(frameCounter * 0.3) * 3, 0, Math.PI * 2);
        ctx.stroke();

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
    ctx.fillRect(20, 20, 220, 160);

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

    const swapReady = echoSwapCooldown === 0 && phaseEnergy >= ECHO_SWAP_COST && phaseEchoes.length > 0;
    ctx.fillStyle = swapReady ? state.accent : 'rgba(255,255,255,0.6)';
    const swapText = swapReady ? 'Q: Echo Swap READY' : (echoSwapCooldown > 0 ? `Q: Echo Swap CD ${Math.ceil(echoSwapCooldown / 12)}f` : 'Q: Echo Swap 要エコー/エネルギー');
    ctx.fillText(swapText, 36, 122);
    ctx.fillStyle = '#fff';

    // スコア・コンボ・ライフ・ステージ情報表示
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.fillRect(canvas.width - 180, 20, 160, 120);

    ctx.fillStyle = '#fff';
    ctx.font = '14px "Arial"';
    const stage = stages[currentStageIndex];
    const elapsedTime = gameState === 'playing' ? Math.floor((Date.now() - stageStartTime) / 1000) : stageClearTime;
    const timeColor = elapsedTime > stage.timeLimit * 0.8 ? '#ff4444' : '#fff';

    ctx.fillText(`Stage ${stage.id}: ${stage.name}`, canvas.width - 165, 38);
    ctx.fillStyle = timeColor;
    ctx.fillText(`Time: ${elapsedTime}s / ${stage.timeLimit}s`, canvas.width - 165, 56);
    ctx.fillStyle = '#fff';
    ctx.fillText(`Score: ${score}`, canvas.width - 165, 74);

    if (combo > 0) {
        ctx.fillStyle = state.accent;
        ctx.fillText(`Combo: x${combo}`, canvas.width - 165, 92);

        // コンボタイマーバー
        const comboRatio = comboTimer / COMBO_TIMER_MAX;
        ctx.fillStyle = 'rgba(255,255,255,0.3)';
        ctx.fillRect(canvas.width - 165, 97, 140, 6);
        ctx.fillStyle = comboRatio > 0.3 ? state.accent : '#ff4444';
        ctx.fillRect(canvas.width - 165, 97, 140 * comboRatio, 6);
    }

    // ライフ表示
    ctx.fillStyle = '#fff';
    ctx.fillText('Lives:', canvas.width - 165, 122);
    for (let i = 0; i < lives; i++) {
        ctx.fillStyle = '#ff6b6b';
        ctx.fillRect(canvas.width - 110 + i * 20, 112, 15, 15);
    }

    const activeStatuses = [];
    if (activePowerups.SURGE > 0) {
        activeStatuses.push({
            label: 'Surge',
            color: '#ffd166',
            ratio: activePowerups.SURGE / POWERUP_SURGE_DURATION
        });
    }
    if (activePowerups.STORM > 0) {
        activeStatuses.push({
            label: 'Storm',
            color: '#80ffea',
            ratio: activePowerups.STORM / POWERUP_STORM_DURATION
        });
    }

    if (activeStatuses.length > 0) {
        ctx.fillStyle = '#fff';
        ctx.fillText('Powerups', 36, 142);
        activeStatuses.forEach((status, index) => {
            const baseY = 150 + index * 16;
            ctx.fillStyle = 'rgba(255,255,255,0.3)';
            ctx.fillRect(36, baseY, 140, 8);
            ctx.fillStyle = status.color;
            ctx.fillRect(36, baseY, 140 * Math.max(0, Math.min(1, status.ratio)), 8);
            ctx.fillStyle = '#fff';
            ctx.font = '10px "Arial"';
            ctx.fillText(status.label, 38, baseY + 7);
            ctx.font = '12px "Arial"';
        });
    }

    let nextStatusY = 150 + activeStatuses.length * 16;
    if (apexTimer > 0) {
        ctx.fillStyle = '#ffd2ff';
        ctx.fillText('Apex Resonance', 36, nextStatusY + 12);
        ctx.fillStyle = 'rgba(255,255,255,0.3)';
        ctx.fillRect(36, nextStatusY + 18, 140, 8);
        ctx.fillStyle = '#ff9dff';
        ctx.fillRect(36, nextStatusY + 18, 140 * Math.max(0, Math.min(1, apexTimer / APEX_DURATION)), 8);
        ctx.fillStyle = '#fff';
        ctx.font = '10px "Arial"';
        ctx.fillText(`${Math.ceil(apexTimer / 60)}s`, 150, nextStatusY + 24);
        ctx.font = '12px "Arial"';
        nextStatusY += 24;
    } else if (apexCharge > 0) {
        ctx.fillStyle = '#ffd2ff';
        ctx.fillText(`Apex Charge: ${apexCharge}/3`, 36, nextStatusY + 12);
        ctx.fillStyle = 'rgba(255,255,255,0.3)';
        ctx.fillRect(36, nextStatusY + 18, 140, 8);
        ctx.fillStyle = '#ff9dff';
        ctx.fillRect(36, nextStatusY + 18, 140 * (apexCharge / 3), 8);
        ctx.fillStyle = '#fff';
        nextStatusY += 24;
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

function drawStageClearScreen() {
    const stage = stages[currentStageIndex];
    const timeLimit = stage.timeLimit;
    const timeBonus = Math.max(0, (timeLimit - stageClearTime) * 10);
    const rank = stageClearTime < timeLimit * 0.5 ? 'S' : stageClearTime < timeLimit * 0.7 ? 'A' : stageClearTime < timeLimit ? 'B' : 'C';
    const rankColor = rank === 'S' ? '#FFD700' : rank === 'A' ? '#C0C0C0' : rank === 'B' ? '#CD7F32' : '#999';

    ctx.save();
    ctx.fillStyle = 'rgba(100, 200, 100, 0.85)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#fff';
    ctx.font = 'bold 48px "Arial"';
    ctx.textAlign = 'center';
    ctx.fillText('STAGE CLEAR!', canvas.width / 2, 120);

    ctx.font = 'bold 32px "Arial"';
    ctx.fillText(`Stage ${stage.id}: ${stage.name}`, canvas.width / 2, 170);

    ctx.font = '24px "Arial"';
    ctx.fillStyle = '#fff';
    ctx.fillText(`Time: ${stageClearTime}s / ${timeLimit}s`, canvas.width / 2, 230);
    ctx.fillText(`Score: ${score}`, canvas.width / 2, 270);
    ctx.fillText(`Max Combo: x${maxComboReached}`, canvas.width / 2, 310);
    ctx.fillText(`Time Bonus: +${timeBonus}`, canvas.width / 2, 350);

    ctx.font = 'bold 60px "Arial"';
    ctx.fillStyle = rankColor;
    ctx.fillText(`Rank: ${rank}`, canvas.width / 2, 420);

    ctx.fillStyle = '#fff';
    ctx.font = '18px "Arial"';
    ctx.fillText('Press N for Next Stage', canvas.width / 2, 490);
    ctx.fillText('Press R to Restart Stage', canvas.width / 2, 520);

    ctx.textAlign = 'left';
    ctx.restore();
}

function drawAllClearScreen() {
    ctx.save();
    ctx.fillStyle = 'rgba(200, 100, 255, 0.9)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#fff';
    ctx.font = 'bold 54px "Arial"';
    ctx.textAlign = 'center';
    ctx.fillText('ALL STAGES CLEAR!', canvas.width / 2, 150);

    ctx.font = 'bold 36px "Arial"';
    ctx.fillText(`Total Score: ${score}`, canvas.width / 2, 240);

    ctx.font = '24px "Arial"';
    ctx.fillText(`Highest Combo: x${maxComboReached}`, canvas.width / 2, 290);
    ctx.fillText(`Lives Remaining: ${lives}`, canvas.width / 2, 330);

    ctx.font = 'bold 32px "Arial"';
    ctx.fillStyle = '#FFD700';
    ctx.fillText('CONGRATULATIONS!', canvas.width / 2, 400);

    ctx.fillStyle = '#fff';
    ctx.font = '18px "Arial"';
    ctx.fillText('Press R to Play Again', canvas.width / 2, 490);

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

    // カメラオフセット適用
    ctx.save();
    ctx.translate(-cameraX, 0);

    drawGhostPlatforms(otherState.platforms, otherState.accent);
    drawPlatforms(activeState.platforms, activeState.platformColor, activeState.platformShadow);
    drawPits();
    drawPhaseRipples();
    drawPhaseShockwaves();
    drawApexSatellites();
    drawPlayerTrail();
    drawPowerups();
    drawPhaseShards();
    drawOrbs();
    drawEnemies();
    drawPhaseEchoes();
    drawPlayer();
    drawFloatingTexts();

    // ゴールマーカー
    if (player.x < GOAL_X) {
        const goalState = levelPhases[currentPhase];
        ctx.fillStyle = goalState.accent;
        ctx.globalAlpha = 0.3;
        ctx.fillRect(GOAL_X, 0, 100, canvas.height);
        ctx.globalAlpha = 1;
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 24px "Arial"';
        ctx.textAlign = 'center';
        ctx.fillText('GOAL', GOAL_X + 50, 100);
        ctx.textAlign = 'left';
    }

    ctx.restore();

    drawUI();
    drawPhaseFlash();

    if (gameState === 'gameover') {
        drawGameOver();
    } else if (gameState === 'stageclear') {
        drawStageClearScreen();
    } else if (gameState === 'allclear') {
        drawAllClearScreen();
    }
}

function gameLoop() {
    handlePhaseShift();
    handleEchoSwap();
    updatePhasePowerups();
    updateActivePowerups();

    if (gameState === 'playing') {
        updatePlayer();
        updatePhaseEchoes();
        updatePhaseShockwaves();
        updatePhaseOrbs();
        updatePhaseShards();
        updateApexSatellites();
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
        updatePhaseShockwaves();
        updatePhaseShards();
        updateApexSatellites();
        updateFloatingTexts();
    }

    draw();
    frameCounter += 1;

    requestAnimationFrame(gameLoop);
}

// ゲーム開始
loadStage(0);
resetStage();
gameLoop();
