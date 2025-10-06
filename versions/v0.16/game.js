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
        theme: {
            key: 'aurora-steppe',
            pit: { fill: '#082238', edge: '#d2ffe9' },
            palettes: {
                SOLID: {
                    skyTop: '#7cd4ff',
                    skyBottom: '#d8fbff',
                    platformColor: '#6ebf72',
                    platformShadow: '#4a8a4a',
                    accent: '#ffe066',
                    echoColor: 'rgba(255, 224, 102, 0.32)',
                    detailColor: '#c9ff9c'
                },
                ETHER: {
                    skyTop: '#102b63',
                    skyBottom: '#2b56a9',
                    platformColor: '#4c67dc',
                    platformShadow: '#263aa6',
                    accent: '#95f8ff',
                    echoColor: 'rgba(149, 248, 255, 0.35)',
                    detailColor: '#caf5ff'
                }
            }
        }
    },
    {
        id: 2,
        name: 'Echo Mastery',
        width: 4000,
        goalX: 3800,
        timeLimit: 210,
        theme: {
            key: 'crystal-expanse',
            pit: { fill: '#140d2f', edge: '#ffd9ff' },
            palettes: {
                SOLID: {
                    skyTop: '#3d1d5a',
                    skyBottom: '#8143b0',
                    platformColor: '#b673ff',
                    platformShadow: '#7e3fca',
                    accent: '#ffd8fe',
                    echoColor: 'rgba(255, 216, 254, 0.38)',
                    detailColor: '#ffe9ff'
                },
                ETHER: {
                    skyTop: '#0e1d3d',
                    skyBottom: '#334a80',
                    platformColor: '#2fa7c9',
                    platformShadow: '#1d5874',
                    accent: '#79fff7',
                    echoColor: 'rgba(121, 255, 247, 0.32)',
                    detailColor: '#aef5ff'
                }
            }
        }
    },
    {
        id: 3,
        name: 'Final Dimension',
        width: 5000,
        goalX: 4800,
        timeLimit: 240,
        theme: {
            key: 'volcanic-rift',
            pit: { fill: '#1a0202', edge: '#ff6333' },
            palettes: {
                SOLID: {
                    skyTop: '#2f0909',
                    skyBottom: '#641b1b',
                    platformColor: '#824040',
                    platformShadow: '#4d2020',
                    accent: '#ff7b45',
                    echoColor: 'rgba(255, 123, 69, 0.38)',
                    detailColor: '#ffb36b'
                },
                ETHER: {
                    skyTop: '#25052f',
                    skyBottom: '#551063',
                    platformColor: '#6f2d8b',
                    platformShadow: '#3c1653',
                    accent: '#ff6ad5',
                    echoColor: 'rgba(255, 106, 213, 0.35)',
                    detailColor: '#ff9ce9'
                }
            }
        }
    },
    {
        id: 4,
        name: 'Neon Cityscape',
        width: 4500,
        goalX: 4300,
        timeLimit: 220,
        theme: {
            key: 'neon-cityscape',
            pit: { fill: '#0a0014', edge: '#ff00ff' },
            palettes: {
                SOLID: {
                    skyTop: '#0f0428',
                    skyBottom: '#2d1452',
                    platformColor: '#ff1493',
                    platformShadow: '#8b0060',
                    accent: '#00ffff',
                    echoColor: 'rgba(0, 255, 255, 0.42)',
                    detailColor: '#ff69ff'
                },
                ETHER: {
                    skyTop: '#050520',
                    skyBottom: '#1a1a4d',
                    platformColor: '#00d9ff',
                    platformShadow: '#0066cc',
                    accent: '#ffff00',
                    echoColor: 'rgba(255, 255, 0, 0.38)',
                    detailColor: '#00ffaa'
                }
            }
        }
    },
    {
        id: 5,
        name: 'Deep Ocean Trench',
        width: 5500,
        goalX: 5300,
        timeLimit: 260,
        theme: {
            key: 'deep-ocean',
            pit: { fill: '#000814', edge: '#00ffaa' },
            palettes: {
                SOLID: {
                    skyTop: '#001a33',
                    skyBottom: '#003366',
                    platformColor: '#1b5e7f',
                    platformShadow: '#0d2f3f',
                    accent: '#00ffaa',
                    echoColor: 'rgba(0, 255, 170, 0.35)',
                    detailColor: '#66ffcc'
                },
                ETHER: {
                    skyTop: '#0a0a1a',
                    skyBottom: '#1a1a4d',
                    platformColor: '#2d4a6f',
                    platformShadow: '#1a2d45',
                    accent: '#7dd3ff',
                    echoColor: 'rgba(125, 211, 255, 0.32)',
                    detailColor: '#a3e8ff'
                }
            }
        }
    },
    {
        id: 6,
        name: 'Astral Void',
        width: 6000,
        goalX: 5800,
        timeLimit: 280,
        theme: {
            key: 'astral-void',
            pit: { fill: '#000000', edge: '#ffffff' },
            palettes: {
                SOLID: {
                    skyTop: '#0d0020',
                    skyBottom: '#2a0052',
                    platformColor: '#8a4fff',
                    platformShadow: '#4a1f8a',
                    accent: '#ffffff',
                    echoColor: 'rgba(255, 255, 255, 0.45)',
                    detailColor: '#d4a6ff'
                },
                ETHER: {
                    skyTop: '#000510',
                    skyBottom: '#001a33',
                    platformColor: '#4d7ba8',
                    platformShadow: '#2a4766',
                    accent: '#a3d9ff',
                    echoColor: 'rgba(163, 217, 255, 0.38)',
                    detailColor: '#ffffff'
                }
            }
        }
    }
];

let currentStageIndex = 0;
let STAGE_WIDTH = stages[0].width;
let GOAL_X = stages[0].goalX;
let currentStageTheme = stages[0].theme;

// ステージ生成関数
function generatePlatformsForStage(stage, phaseId) {
    const platforms = [
        { x: 0, y: 550, width: stage.width, height: 50 }
    ];

    const addPlatform = (x, y, width, height) => {
        const clampedX = Math.max(0, x);
        const maxWidth = stage.width - clampedX - 10;
        const clampedWidth = Math.max(40, Math.min(width, maxWidth));
        if (clampedWidth <= 0) {
            return;
        }
        platforms.push({
            x: clampedX,
            y: y,
            width: clampedWidth,
            height: height ?? (phaseId === 'SOLID' ? 22 : 24)
        });
    };

    if (stage.id === 1) {
        const spacing = 720;
        const loops = Math.ceil(stage.width / spacing) + 1;
        if (phaseId === 'SOLID') {
            const terracePattern = [
                { offset: 80, y: 500, width: 280 },
                { offset: 320, y: 440, width: 230 },
                { offset: 520, y: 380, width: 210 },
                { offset: 680, y: 330, width: 180 }
            ];
            for (let i = 0; i < loops; i++) {
                const baseX = i * spacing;
                for (let j = 0; j < terracePattern.length; j++) {
                    const piece = terracePattern[j];
                    const jitter = (Math.random() - 0.5) * 30;
                    const yWave = j === 3 ? -20 : 0;
                    addPlatform(baseX + piece.offset + jitter, piece.y + yWave * (i % 2 === 0 ? 1 : -1), piece.width + (Math.random() - 0.5) * 40, 24);
                }

                if (i % 2 === 0) {
                    addPlatform(baseX + 420 + Math.random() * 40, 270 + Math.random() * 30, 180 + Math.random() * 40, 20);
                }
            }
        } else {
            const hoverPattern = [
                { offset: 60, y: 470, width: 200 },
                { offset: 240, y: 400, width: 160 },
                { offset: 420, y: 320, width: 150 },
                { offset: 600, y: 250, width: 140 },
                { offset: 710, y: 330, width: 160 }
            ];
            for (let i = 0; i < loops; i++) {
                const baseX = i * spacing;
                for (let piece of hoverPattern) {
                    const jitter = (Math.random() - 0.5) * 36;
                    addPlatform(baseX + piece.offset + jitter, piece.y - (i % 2) * 20, piece.width + (Math.random() - 0.5) * 30, 24);
                }
                if (Math.random() > 0.45) {
                    addPlatform(baseX + 180 + Math.random() * 120, 210 + Math.random() * 40, 140 + Math.random() * 40, 20);
                }
            }
        }
    } else if (stage.id === 2) {
        const spacing = 820;
        const loops = Math.ceil(stage.width / spacing) + 1;
        if (phaseId === 'SOLID') {
            const ridgePattern = [
                { offset: 110, y: 520, width: 170 },
                { offset: 320, y: 450, width: 150 },
                { offset: 440, y: 360, width: 140 },
                { offset: 610, y: 420, width: 170 },
                { offset: 750, y: 300, width: 150 }
            ];
            for (let i = 0; i < loops; i++) {
                const baseX = i * spacing;
                ridgePattern.forEach((piece, index) => {
                    const jitter = (Math.random() - 0.5) * 45;
                    const height = index === 2 ? 18 : 22;
                    addPlatform(baseX + piece.offset + jitter, piece.y - (i % 2) * 18, piece.width + (Math.random() - 0.5) * 40, height);
                });
                if (Math.random() > 0.35) {
                    addPlatform(baseX + 460 + Math.random() * 80, 280 + Math.random() * 40, 140 + Math.random() * 40, 20);
                }
            }
        } else {
            const shardPattern = [
                { offset: 90, y: 480, width: 150 },
                { offset: 240, y: 360, width: 120 },
                { offset: 420, y: 260, width: 110 },
                { offset: 560, y: 340, width: 130 },
                { offset: 730, y: 220, width: 110 },
                { offset: 860, y: 320, width: 140 }
            ];
            for (let i = 0; i < loops; i++) {
                const baseX = i * spacing;
                shardPattern.forEach((piece, index) => {
                    const jitter = (Math.random() - 0.5) * 38;
                    const yOffset = index % 2 === 0 ? 0 : -20;
                    addPlatform(baseX + piece.offset + jitter, piece.y + yOffset, piece.width + (Math.random() - 0.5) * 26, 22);
                });
                if (Math.random() > 0.5) {
                    addPlatform(baseX + 320 + Math.random() * 120, 210 + Math.random() * 40, 120 + Math.random() * 30, 18);
                }
            }
        }
    } else if (stage.id === 3) {
        const spacing = 860;
        const loops = Math.ceil(stage.width / spacing) + 1;
        if (phaseId === 'SOLID') {
            const magmaPattern = [
                { offset: 120, y: 520, width: 210 },
                { offset: 340, y: 460, width: 160 },
                { offset: 540, y: 400, width: 140 },
                { offset: 700, y: 340, width: 160 },
                { offset: 880, y: 390, width: 150 }
            ];
            for (let i = 0; i < loops; i++) {
                const baseX = i * spacing;
                magmaPattern.forEach((piece, index) => {
                    const jitter = (Math.random() - 0.5) * 52;
                    const yRise = index === 2 ? -30 : 0;
                    addPlatform(baseX + piece.offset + jitter, piece.y + yRise - (i % 2) * 14, piece.width + (Math.random() - 0.5) * 40, 24);
                });
                addPlatform(baseX + 430 + Math.random() * 60, 260 + Math.random() * 40, 140 + Math.random() * 40, 20);
            }

            addPlatform(stage.goalX - 220, 420, 220, 26);
            addPlatform(stage.goalX - 420, 320, 160, 24);
        } else {
            const riftPattern = [
                { offset: 100, y: 460, width: 170 },
                { offset: 280, y: 380, width: 150 },
                { offset: 460, y: 300, width: 140 },
                { offset: 640, y: 240, width: 130 },
                { offset: 810, y: 300, width: 140 },
                { offset: 960, y: 360, width: 160 }
            ];
            for (let i = 0; i < loops; i++) {
                const baseX = i * spacing;
                riftPattern.forEach((piece, index) => {
                    const jitter = (Math.random() - 0.5) * 44;
                    const yPulse = index % 3 === 0 ? -20 : 0;
                    addPlatform(baseX + piece.offset + jitter, piece.y + yPulse + (i % 2 ? -10 : 10), piece.width + (Math.random() - 0.5) * 30, 22);
                });
                if (Math.random() > 0.3) {
                    addPlatform(baseX + 360 + Math.random() * 140, 210 + Math.random() * 50, 120 + Math.random() * 30, 18);
                }
            }

            addPlatform(stage.goalX - 260, 300, 170, 20);
            addPlatform(stage.goalX - 420, 220, 140, 18);
        }
    } else if (stage.id === 4) {
        // Neon Cityscape - ビルの屋上を模したプラットフォーム
        const spacing = 680;
        const loops = Math.ceil(stage.width / spacing) + 1;
        if (phaseId === 'SOLID') {
            const buildingPattern = [
                { offset: 80, y: 500, width: 180 },
                { offset: 280, y: 420, width: 140 },
                { offset: 440, y: 350, width: 120 },
                { offset: 580, y: 280, width: 150 },
                { offset: 720, y: 380, width: 160 }
            ];
            for (let i = 0; i < loops; i++) {
                const baseX = i * spacing;
                buildingPattern.forEach((piece, index) => {
                    const jitter = (Math.random() - 0.5) * 25;
                    const height = 24 + Math.random() * 4;
                    addPlatform(baseX + piece.offset + jitter, piece.y - (i % 3) * 15, piece.width + (Math.random() - 0.5) * 30, height);
                });
                if (Math.random() > 0.4) {
                    addPlatform(baseX + 380 + Math.random() * 60, 240 + Math.random() * 30, 110 + Math.random() * 40, 20);
                }
            }
        } else {
            const neonPattern = [
                { offset: 100, y: 480, width: 140 },
                { offset: 260, y: 390, width: 120 },
                { offset: 400, y: 310, width: 130 },
                { offset: 550, y: 240, width: 120 },
                { offset: 690, y: 330, width: 140 }
            ];
            for (let i = 0; i < loops; i++) {
                const baseX = i * spacing;
                neonPattern.forEach((piece, index) => {
                    const jitter = (Math.random() - 0.5) * 30;
                    addPlatform(baseX + piece.offset + jitter, piece.y + (i % 2) * 18, piece.width + (Math.random() - 0.5) * 25, 22);
                });
                if (Math.random() > 0.35) {
                    addPlatform(baseX + 320 + Math.random() * 80, 200 + Math.random() * 40, 100 + Math.random() * 30, 18);
                }
            }
        }
    } else if (stage.id === 5) {
        // Deep Ocean Trench - 珊瑚礁と海底地形
        const spacing = 750;
        const loops = Math.ceil(stage.width / spacing) + 1;
        if (phaseId === 'SOLID') {
            const coralPattern = [
                { offset: 90, y: 510, width: 200 },
                { offset: 310, y: 450, width: 170 },
                { offset: 500, y: 380, width: 150 },
                { offset: 670, y: 320, width: 160 },
                { offset: 840, y: 400, width: 180 }
            ];
            for (let i = 0; i < loops; i++) {
                const baseX = i * spacing;
                coralPattern.forEach((piece, index) => {
                    const jitter = (Math.random() - 0.5) * 40;
                    const wave = Math.sin(i * 0.7 + index) * 15;
                    addPlatform(baseX + piece.offset + jitter, piece.y + wave, piece.width + (Math.random() - 0.5) * 35, 24);
                });
                if (i % 2 === 0) {
                    addPlatform(baseX + 420 + Math.random() * 70, 270 + Math.random() * 35, 130 + Math.random() * 40, 20);
                }
            }
        } else {
            const trenchPattern = [
                { offset: 70, y: 470, width: 160 },
                { offset: 250, y: 380, width: 140 },
                { offset: 410, y: 290, width: 130 },
                { offset: 570, y: 230, width: 120 },
                { offset: 710, y: 310, width: 150 }
            ];
            for (let i = 0; i < loops; i++) {
                const baseX = i * spacing;
                trenchPattern.forEach((piece, index) => {
                    const jitter = (Math.random() - 0.5) * 35;
                    const drift = Math.cos(i * 0.5 + index * 1.2) * 20;
                    addPlatform(baseX + piece.offset + jitter, piece.y + drift, piece.width + (Math.random() - 0.5) * 28, 22);
                });
                if (Math.random() > 0.4) {
                    addPlatform(baseX + 360 + Math.random() * 90, 200 + Math.random() * 45, 110 + Math.random() * 35, 18);
                }
            }
        }
    } else if (stage.id === 6) {
        // Astral Void - 浮遊する星のかけらと小惑星
        const spacing = 800;
        const loops = Math.ceil(stage.width / spacing) + 1;
        if (phaseId === 'SOLID') {
            const asteroidPattern = [
                { offset: 100, y: 500, width: 190 },
                { offset: 310, y: 430, width: 160 },
                { offset: 490, y: 350, width: 140 },
                { offset: 660, y: 280, width: 150 },
                { offset: 830, y: 360, width: 170 }
            ];
            for (let i = 0; i < loops; i++) {
                const baseX = i * spacing;
                asteroidPattern.forEach((piece, index) => {
                    const jitter = (Math.random() - 0.5) * 50;
                    const float = Math.sin(i * 0.8 + index * 1.5) * 25;
                    addPlatform(baseX + piece.offset + jitter, piece.y + float - (i % 2) * 20, piece.width + (Math.random() - 0.5) * 40, 26);
                });
                if (Math.random() > 0.3) {
                    addPlatform(baseX + 450 + Math.random() * 80, 240 + Math.random() * 40, 120 + Math.random() * 40, 22);
                }
            }
            addPlatform(stage.goalX - 200, 400, 200, 28);
            addPlatform(stage.goalX - 380, 300, 150, 24);
        } else {
            const voidPattern = [
                { offset: 80, y: 460, width: 150 },
                { offset: 240, y: 370, width: 130 },
                { offset: 390, y: 280, width: 120 },
                { offset: 530, y: 210, width: 110 },
                { offset: 670, y: 290, width: 140 },
                { offset: 820, y: 350, width: 150 }
            ];
            for (let i = 0; i < loops; i++) {
                const baseX = i * spacing;
                voidPattern.forEach((piece, index) => {
                    const jitter = (Math.random() - 0.5) * 45;
                    const orbit = Math.cos(i * 1.2 + index * 0.8) * 30;
                    addPlatform(baseX + piece.offset + jitter, piece.y + orbit, piece.width + (Math.random() - 0.5) * 32, 24);
                });
                if (Math.random() > 0.25) {
                    addPlatform(baseX + 380 + Math.random() * 100, 180 + Math.random() * 50, 100 + Math.random() * 35, 18);
                }
            }
            addPlatform(stage.goalX - 240, 280, 160, 22);
            addPlatform(stage.goalX - 400, 200, 130, 20);
        }
    } else {
        // フォールバック（念のため）
        const spacing = 600;
        const loops = Math.ceil(stage.width / spacing) + 1;
        for (let i = 0; i < loops; i++) {
            const baseX = i * spacing;
            addPlatform(baseX + 100, 450, 200, 24);
            addPlatform(baseX + 350, 350, 180, 24);
        }
    }

    return platforms;
}

function applyStageTheme(stage) {
    currentStageTheme = stage.theme;
    const solidPalette = stage.theme.palettes.SOLID;
    const etherPalette = stage.theme.palettes.ETHER;

    Object.assign(levelPhases.SOLID, {
        skyTop: solidPalette.skyTop,
        skyBottom: solidPalette.skyBottom,
        platformColor: solidPalette.platformColor,
        platformShadow: solidPalette.platformShadow,
        accent: solidPalette.accent,
        echoColor: solidPalette.echoColor,
        detailColor: solidPalette.detailColor
    });

    Object.assign(levelPhases.ETHER, {
        skyTop: etherPalette.skyTop,
        skyBottom: etherPalette.skyBottom,
        platformColor: etherPalette.platformColor,
        platformShadow: etherPalette.platformShadow,
        accent: etherPalette.accent,
        echoColor: etherPalette.echoColor,
        detailColor: etherPalette.detailColor
    });
}

function initializeStageAmbience(stage) {
    stageBackdrop.layers.length = 0;
    stageBackdrop.overlayParticles.length = 0;
    stageBackdrop.shimmerPhase = 0;

    if (!stage || !stage.theme) {
        return;
    }

    if (stage.theme.key === 'aurora-steppe') {
        const ridgeCount = Math.max(3, Math.floor(stage.width / 700));
        for (let i = 0; i < ridgeCount; i++) {
            stageBackdrop.layers.push({
                type: 'ridge',
                baseX: (stage.width / ridgeCount) * i + Math.random() * 160,
                width: 420 + Math.random() * 220,
                height: 140 + Math.random() * 80,
                parallax: 0.12 + Math.random() * 0.05,
                color: 'rgba(60, 120, 185, 0.4)',
                highlight: 'rgba(200, 240, 255, 0.22)'
            });
        }

        const cloudCount = Math.max(6, Math.floor(stage.width / 280));
        for (let i = 0; i < cloudCount; i++) {
            stageBackdrop.layers.push({
                type: 'cloud',
                baseX: (stage.width / cloudCount) * i + Math.random() * 220,
                y: 60 + Math.random() * 160,
                width: 180 + Math.random() * 170,
                height: 60 + Math.random() * 30,
                parallax: 0.28 + Math.random() * 0.08,
                offset: Math.random() * 200,
                loop: 320 + Math.random() * 180,
                speed: 0.35 + Math.random() * 0.2,
                opacity: 0.4 + Math.random() * 0.25,
                waveAmp: 10 + Math.random() * 12,
                waveFreq: 0.01 + Math.random() * 0.01,
                waveOffset: Math.random() * Math.PI * 2
            });
        }

        const pollenCount = 26;
        for (let i = 0; i < pollenCount; i++) {
            stageBackdrop.overlayParticles.push({
                kind: 'pollen',
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.25,
                vy: -0.25 - Math.random() * 0.12,
                size: 2.2 + Math.random() * 2,
                alpha: 0.2 + Math.random() * 0.15,
                hueShift: Math.random() * 0.5
            });
        }
    } else if (stage.theme.key === 'crystal-expanse') {
        const spireCount = Math.max(5, Math.floor(stage.width / 520));
        for (let i = 0; i < spireCount; i++) {
            stageBackdrop.layers.push({
                type: 'spire',
                baseX: (stage.width / spireCount) * i + Math.random() * 260,
                baseWidth: 110 + Math.random() * 120,
                height: 220 + Math.random() * 140,
                parallax: 0.18 + Math.random() * 0.08,
                color: 'rgba(146, 110, 255, 0.35)',
                edgeColor: 'rgba(255, 255, 255, 0.4)',
                shardOffset: Math.random() * Math.PI * 2
            });
        }

        const ringCount = Math.max(4, Math.floor(stage.width / 900));
        for (let i = 0; i < ringCount; i++) {
            stageBackdrop.layers.push({
                type: 'ring',
                baseX: (stage.width / ringCount) * i + Math.random() * 300,
                y: 120 + Math.random() * 260,
                radius: 80 + Math.random() * 60,
                parallax: 0.3 + Math.random() * 0.1,
                rotation: Math.random() * Math.PI * 2,
                rotationSpeed: 0.005 + Math.random() * 0.003,
                glow: 'rgba(180, 255, 255, 0.45)'
            });
        }

        const glimmerCount = 32;
        for (let i = 0; i < glimmerCount; i++) {
            stageBackdrop.overlayParticles.push({
                kind: 'glimmer',
                angle: Math.random() * Math.PI * 2,
                radius: 120 + Math.random() * 240,
                speed: 0.01 + Math.random() * 0.01,
                size: 1.8 + Math.random() * 2.4,
                alpha: 0.25 + Math.random() * 0.25
            });
        }
    } else if (stage.theme.key === 'volcanic-rift') {
        const waveCount = Math.max(5, Math.floor(stage.width / 520));
        for (let i = 0; i < waveCount; i++) {
            stageBackdrop.layers.push({
                type: 'magmaWave',
                baseX: (stage.width / waveCount) * i + Math.random() * 200,
                width: 480 + Math.random() * 180,
                height: 90 + Math.random() * 50,
                parallax: 0.14 + Math.random() * 0.05,
                phase: Math.random() * Math.PI * 2,
                waveSpeed: 0.02 + Math.random() * 0.02,
                color: 'rgba(255, 120, 70, 0.35)'
            });
        }

        const plumeCount = Math.max(4, Math.floor(stage.width / 1000));
        for (let i = 0; i < plumeCount; i++) {
            stageBackdrop.layers.push({
                type: 'eruption',
                baseX: (stage.width / plumeCount) * i + Math.random() * 340,
                width: 120 + Math.random() * 80,
                height: 240 + Math.random() * 120,
                parallax: 0.22 + Math.random() * 0.06,
                pulse: Math.random() * Math.PI * 2,
                pulseSpeed: 0.03 + Math.random() * 0.02,
                glow: 'rgba(255, 100, 80, 0.55)'
            });
        }

        const emberCount = 36;
        for (let i = 0; i < emberCount; i++) {
            stageBackdrop.overlayParticles.push({
                kind: 'ember',
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.18,
                vy: -0.5 - Math.random() * 0.35,
                size: 2 + Math.random() * 2,
                alpha: 0.3 + Math.random() * 0.25,
                flicker: Math.random() * Math.PI * 2
            });
        }
    } else if (stage.theme.key === 'neon-cityscape') {
        // ネオン都市 - ビルのシルエットとネオンライン
        const buildingCount = Math.max(6, Math.floor(stage.width / 580));
        for (let i = 0; i < buildingCount; i++) {
            stageBackdrop.layers.push({
                type: 'building',
                baseX: (stage.width / buildingCount) * i + Math.random() * 280,
                width: 140 + Math.random() * 100,
                height: 180 + Math.random() * 160,
                parallax: 0.16 + Math.random() * 0.06,
                color: 'rgba(20, 10, 40, 0.65)',
                neonColor: i % 3 === 0 ? 'rgba(255, 20, 147, 0.8)' : i % 3 === 1 ? 'rgba(0, 217, 255, 0.8)' : 'rgba(255, 255, 0, 0.8)',
                flickerSpeed: 0.03 + Math.random() * 0.02
            });
        }

        // ネオンサイン
        const signCount = Math.max(8, Math.floor(stage.width / 420));
        for (let i = 0; i < signCount; i++) {
            stageBackdrop.layers.push({
                type: 'neonSign',
                baseX: (stage.width / signCount) * i + Math.random() * 200,
                y: 160 + Math.random() * 180,
                width: 60 + Math.random() * 40,
                parallax: 0.28 + Math.random() * 0.08,
                color: ['rgba(255, 0, 255, 0.9)', 'rgba(0, 255, 255, 0.9)', 'rgba(255, 255, 0, 0.9)'][i % 3],
                pulse: Math.random() * Math.PI * 2,
                pulseSpeed: 0.04 + Math.random() * 0.03
            });
        }

        // 光の粒子
        const glowCount = 28;
        for (let i = 0; i < glowCount; i++) {
            stageBackdrop.overlayParticles.push({
                kind: 'neonGlow',
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.12,
                vy: (Math.random() - 0.5) * 0.12,
                size: 1.5 + Math.random() * 2.5,
                alpha: 0.35 + Math.random() * 0.25,
                hue: Math.random() * 360
            });
        }
    } else if (stage.theme.key === 'deep-ocean') {
        // 深海 - 珊瑚とクラゲ
        const coralCount = Math.max(5, Math.floor(stage.width / 660));
        for (let i = 0; i < coralCount; i++) {
            stageBackdrop.layers.push({
                type: 'coral',
                baseX: (stage.width / coralCount) * i + Math.random() * 300,
                width: 90 + Math.random() * 80,
                height: 130 + Math.random() * 100,
                parallax: 0.15 + Math.random() * 0.06,
                color: 'rgba(30, 90, 110, 0.45)',
                glowColor: 'rgba(0, 255, 170, 0.35)',
                sway: Math.random() * Math.PI * 2,
                swaySpeed: 0.015 + Math.random() * 0.01
            });
        }

        // クラゲ
        const jellyfishCount = Math.max(4, Math.floor(stage.width / 900));
        for (let i = 0; i < jellyfishCount; i++) {
            stageBackdrop.layers.push({
                type: 'jellyfish',
                baseX: (stage.width / jellyfishCount) * i + Math.random() * 360,
                y: 100 + Math.random() * 240,
                size: 35 + Math.random() * 30,
                parallax: 0.25 + Math.random() * 0.1,
                pulse: Math.random() * Math.PI * 2,
                pulseSpeed: 0.025 + Math.random() * 0.015,
                glow: 'rgba(125, 211, 255, 0.55)',
                drift: Math.random() * Math.PI * 2
            });
        }

        // 発光粒子
        const biolumCount = 32;
        for (let i = 0; i < biolumCount; i++) {
            stageBackdrop.overlayParticles.push({
                kind: 'biolum',
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.08,
                vy: (Math.random() - 0.7) * 0.15,
                size: 1.2 + Math.random() * 1.8,
                alpha: 0.25 + Math.random() * 0.3,
                pulse: Math.random() * Math.PI * 2
            });
        }
    } else if (stage.theme.key === 'astral-void') {
        // 宇宙 - 星雲と小惑星
        const nebulaCount = Math.max(4, Math.floor(stage.width / 820));
        for (let i = 0; i < nebulaCount; i++) {
            stageBackdrop.layers.push({
                type: 'nebula',
                baseX: (stage.width / nebulaCount) * i + Math.random() * 400,
                y: 120 + Math.random() * 200,
                width: 280 + Math.random() * 180,
                height: 200 + Math.random() * 120,
                parallax: 0.12 + Math.random() * 0.05,
                color: i % 2 === 0 ? 'rgba(138, 79, 255, 0.25)' : 'rgba(77, 123, 168, 0.25)',
                rotation: Math.random() * Math.PI * 2,
                rotationSpeed: 0.002 + Math.random() * 0.002
            });
        }

        // 小惑星
        const asteroidCount = Math.max(6, Math.floor(stage.width / 620));
        for (let i = 0; i < asteroidCount; i++) {
            stageBackdrop.layers.push({
                type: 'asteroid',
                baseX: (stage.width / asteroidCount) * i + Math.random() * 280,
                y: 140 + Math.random() * 260,
                size: 25 + Math.random() * 35,
                parallax: 0.22 + Math.random() * 0.08,
                color: 'rgba(80, 70, 90, 0.75)',
                edgeGlow: 'rgba(163, 217, 255, 0.4)',
                rotation: Math.random() * Math.PI * 2,
                rotationSpeed: 0.006 + Math.random() * 0.004
            });
        }

        // 星
        const starCount = 48;
        for (let i = 0; i < starCount; i++) {
            stageBackdrop.overlayParticles.push({
                kind: 'star',
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: 0.8 + Math.random() * 1.5,
                alpha: 0.4 + Math.random() * 0.35,
                twinkle: Math.random() * Math.PI * 2,
                twinkleSpeed: 0.02 + Math.random() * 0.02
            });
        }
    }

    stageBackdrop.layers.sort((a, b) => a.parallax - b.parallax);
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
        detailColor: '#ffd166',
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
        detailColor: '#dffbff',
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
const stageBackdrop = {
    layers: [],
    overlayParticles: [],
    shimmerPhase: 0
};

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
    // プレイヤーが画面外（穴）に落ちたかチェック
    if (player.y > canvas.height) {
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

    applyStageTheme(stage);
    initializeStageAmbience(stage);

    // プラットフォームを再生成
    levelPhases.SOLID.platforms = generatePlatformsForStage(stage, 'SOLID');
    levelPhases.ETHER.platforms = generatePlatformsForStage(stage, 'ETHER');

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

    // 地面プラットフォームにピットの穴を開ける
    for (const phase of ['SOLID', 'ETHER']) {
        const platforms = levelPhases[phase].platforms;
        const groundPlatform = platforms[0]; // 最初の要素が地面

        if (stagePits.length === 0) {
            continue;
        }

        // ピットをX座標でソート
        const sortedPits = [...stagePits].sort((a, b) => a.x - b.x);

        // 新しい地面セグメントを作成
        const newGroundSegments = [];
        let currentX = 0;

        for (const pit of sortedPits) {
            // ピットの前の地面セグメントを追加
            if (currentX < pit.x) {
                newGroundSegments.push({
                    x: currentX,
                    y: 550,
                    width: pit.x - currentX,
                    height: 50
                });
            }
            // ピットの後ろから次のセグメント開始
            currentX = pit.x + pit.width;
        }

        // 最後のセグメントを追加
        if (currentX < STAGE_WIDTH) {
            newGroundSegments.push({
                x: currentX,
                y: 550,
                width: STAGE_WIDTH - currentX,
                height: 50
            });
        }

        // 地面プラットフォームを新しいセグメントで置き換え
        platforms.splice(0, 1, ...newGroundSegments);
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

function updateStageAmbience() {
    stageBackdrop.shimmerPhase += 0.01;

    for (const layer of stageBackdrop.layers) {
        if (layer.type === 'cloud') {
            layer.offset += layer.speed * 0.4;
            if (layer.offset > layer.loop) {
                layer.offset = -layer.loop;
            }
        } else if (layer.type === 'ring') {
            layer.rotation += layer.rotationSpeed;
        } else if (layer.type === 'magmaWave') {
            layer.phase += layer.waveSpeed;
        } else if (layer.type === 'eruption') {
            layer.pulse += layer.pulseSpeed;
        } else if (layer.type === 'neonSign') {
            layer.pulse += layer.pulseSpeed;
        } else if (layer.type === 'coral') {
            layer.sway += layer.swaySpeed;
        } else if (layer.type === 'jellyfish') {
            layer.pulse += layer.pulseSpeed;
            layer.drift += 0.008;
        } else if (layer.type === 'nebula') {
            layer.rotation += layer.rotationSpeed;
        } else if (layer.type === 'asteroid') {
            layer.rotation += layer.rotationSpeed;
        }
    }

    for (const particle of stageBackdrop.overlayParticles) {
        if (particle.kind === 'pollen') {
            particle.x += particle.vx;
            particle.y += particle.vy;
            if (particle.y < -30) {
                particle.x = Math.random() * canvas.width;
                particle.y = canvas.height + Math.random() * 40;
            }
            if (particle.x < -60 || particle.x > canvas.width + 60) {
                particle.x = particle.x < 0 ? canvas.width + 40 : -40;
            }
        } else if (particle.kind === 'glimmer') {
            particle.angle += particle.speed;
        } else if (particle.kind === 'ember') {
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.flicker += 0.12;
            if (particle.y < -50) {
                particle.x = Math.random() * canvas.width;
                particle.y = canvas.height + Math.random() * 30;
                particle.vx = (Math.random() - 0.5) * 0.2;
                particle.vy = -0.45 - Math.random() * 0.35;
            }
            if (particle.x < -80 || particle.x > canvas.width + 80) {
                particle.x = Math.random() * canvas.width;
            }
        } else if (particle.kind === 'neonGlow') {
            particle.x += particle.vx;
            particle.y += particle.vy;
            if (particle.x < -80 || particle.x > canvas.width + 80) {
                particle.x = particle.x < 0 ? canvas.width + 60 : -60;
            }
            if (particle.y < -80 || particle.y > canvas.height + 80) {
                particle.y = particle.y < 0 ? canvas.height + 60 : -60;
            }
        } else if (particle.kind === 'biolum') {
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.pulse += 0.08;
            if (particle.y < -50) {
                particle.x = Math.random() * canvas.width;
                particle.y = canvas.height + Math.random() * 40;
                particle.vx = (Math.random() - 0.5) * 0.08;
                particle.vy = (Math.random() - 0.7) * 0.15;
            }
            if (particle.x < -60 || particle.x > canvas.width + 60) {
                particle.x = particle.x < 0 ? canvas.width + 40 : -40;
            }
        } else if (particle.kind === 'star') {
            particle.twinkle += particle.twinkleSpeed;
        }
    }
}

function drawBackground(state) {
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, state.skyTop);
    gradient.addColorStop(1, state.skyBottom);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drawStageBackdrop();
}

function drawStageBackdrop() {
    if (!currentStageTheme) {
        return;
    }

    if (currentStageTheme.key === 'aurora-steppe') {
        const aurora = ctx.createLinearGradient(0, 0, canvas.width, canvas.height * 0.6);
        aurora.addColorStop(0, 'rgba(160, 255, 210, 0.16)');
        aurora.addColorStop(1, 'rgba(80, 160, 240, 0.06)');
        ctx.fillStyle = aurora;
        ctx.fillRect(0, 0, canvas.width, canvas.height * 0.7);
    } else if (currentStageTheme.key === 'crystal-expanse') {
        const haze = ctx.createLinearGradient(0, canvas.height * 0.2, 0, canvas.height);
        haze.addColorStop(0, 'rgba(110, 40, 160, 0.12)');
        haze.addColorStop(1, 'rgba(40, 20, 70, 0.35)');
        ctx.fillStyle = haze;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    } else if (currentStageTheme.key === 'volcanic-rift') {
        const glow = ctx.createLinearGradient(0, canvas.height * 0.35, 0, canvas.height);
        glow.addColorStop(0, 'rgba(255, 120, 70, 0.05)');
        glow.addColorStop(1, 'rgba(60, 0, 0, 0.45)');
        ctx.fillStyle = glow;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    } else if (currentStageTheme.key === 'neon-cityscape') {
        const cityGlow = ctx.createLinearGradient(0, canvas.height * 0.4, 0, canvas.height);
        cityGlow.addColorStop(0, 'rgba(255, 20, 147, 0.08)');
        cityGlow.addColorStop(0.5, 'rgba(0, 217, 255, 0.12)');
        cityGlow.addColorStop(1, 'rgba(30, 10, 50, 0.4)');
        ctx.fillStyle = cityGlow;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    } else if (currentStageTheme.key === 'deep-ocean') {
        const oceanDepth = ctx.createLinearGradient(0, 0, 0, canvas.height);
        oceanDepth.addColorStop(0, 'rgba(0, 30, 60, 0.25)');
        oceanDepth.addColorStop(1, 'rgba(0, 10, 20, 0.55)');
        ctx.fillStyle = oceanDepth;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    } else if (currentStageTheme.key === 'astral-void') {
        const voidGradient = ctx.createRadialGradient(canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, canvas.width * 0.8);
        voidGradient.addColorStop(0, 'rgba(42, 0, 82, 0.15)');
        voidGradient.addColorStop(1, 'rgba(0, 0, 0, 0.6)');
        ctx.fillStyle = voidGradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    for (const layer of stageBackdrop.layers) {
        if (layer.type === 'cloud') {
            const x = layer.baseX - cameraX * layer.parallax + layer.offset;
            if (x > canvas.width + 260 || x + layer.width < -260) {
                continue;
            }
            const centerX = x + layer.width / 2;
            const centerY = layer.y + Math.sin(stageBackdrop.shimmerPhase * layer.waveFreq + layer.waveOffset) * layer.waveAmp;
            ctx.save();
            ctx.globalAlpha = layer.opacity;
            ctx.fillStyle = 'rgba(255,255,255,0.9)';
            ctx.beginPath();
            ctx.ellipse(centerX, centerY, layer.width / 2, layer.height / 2, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        } else if (layer.type === 'ridge') {
            const centerX = layer.baseX - cameraX * layer.parallax;
            if (centerX + layer.width < -260 || centerX - layer.width > canvas.width + 260) {
                continue;
            }
            ctx.save();
            ctx.fillStyle = layer.color;
            ctx.beginPath();
            ctx.moveTo(centerX - layer.width / 2, canvas.height);
            ctx.lineTo(centerX, canvas.height - layer.height);
            ctx.lineTo(centerX + layer.width / 2, canvas.height);
            ctx.closePath();
            ctx.fill();

            ctx.globalAlpha = 0.7;
            ctx.fillStyle = layer.highlight;
            ctx.beginPath();
            ctx.moveTo(centerX - layer.width / 4, canvas.height - layer.height * 0.4);
            ctx.lineTo(centerX, canvas.height - layer.height * 0.75);
            ctx.lineTo(centerX + layer.width / 4, canvas.height - layer.height * 0.4);
            ctx.closePath();
            ctx.fill();
            ctx.restore();
        } else if (layer.type === 'spire') {
            const baseX = layer.baseX - cameraX * layer.parallax;
            if (baseX + layer.baseWidth < -220 || baseX - layer.baseWidth > canvas.width + 220) {
                continue;
            }
            ctx.save();
            ctx.fillStyle = layer.color;
            ctx.beginPath();
            ctx.moveTo(baseX - layer.baseWidth / 2, canvas.height);
            ctx.lineTo(baseX, canvas.height - layer.height);
            ctx.lineTo(baseX + layer.baseWidth / 2, canvas.height);
            ctx.closePath();
            ctx.fill();

            ctx.globalAlpha = 0.6;
            ctx.strokeStyle = layer.edgeColor;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(baseX, canvas.height);
            ctx.lineTo(baseX, canvas.height - layer.height);
            ctx.stroke();

            const shardY = canvas.height - layer.height * 0.6;
            const shimmer = Math.sin(stageBackdrop.shimmerPhase * 3 + layer.shardOffset) * 6;
            ctx.beginPath();
            ctx.moveTo(baseX - layer.baseWidth / 4, shardY + shimmer);
            ctx.lineTo(baseX, shardY - 14 + shimmer);
            ctx.lineTo(baseX + layer.baseWidth / 4, shardY + shimmer);
            ctx.stroke();
            ctx.restore();
        } else if (layer.type === 'ring') {
            const baseX = layer.baseX - cameraX * layer.parallax;
            if (baseX + layer.radius < -220 || baseX - layer.radius > canvas.width + 220) {
                continue;
            }
            const y = layer.y + Math.sin(stageBackdrop.shimmerPhase * 0.8 + baseX * 0.001) * 10;
            ctx.save();
            ctx.translate(baseX, y);
            ctx.rotate(layer.rotation);
            ctx.globalAlpha = 0.55;
            ctx.strokeStyle = layer.glow;
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.arc(0, 0, layer.radius, 0, Math.PI * 2);
            ctx.stroke();
            ctx.globalAlpha = 0.35;
            ctx.strokeStyle = 'rgba(255,255,255,0.55)';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(0, 0, layer.radius * 0.65, 0, Math.PI * 2);
            ctx.stroke();
            ctx.restore();
        } else if (layer.type === 'magmaWave') {
            const x = layer.baseX - cameraX * layer.parallax;
            if (x > canvas.width + 260 || x + layer.width < -260) {
                continue;
            }
            const baseY = canvas.height - 40;
            const gradient = ctx.createLinearGradient(x, baseY - layer.height, x, baseY + 20);
            gradient.addColorStop(0, layer.color);
            gradient.addColorStop(1, 'rgba(80, 10, 0, 0.0)');
            ctx.save();
            ctx.globalAlpha = 0.6;
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.moveTo(x, baseY);
            const steps = 5;
            for (let i = 0; i <= steps; i++) {
                const t = i / steps;
                const wave = Math.sin(layer.phase + t * Math.PI * 2) * 14;
                const height = layer.height * (0.4 + 0.6 * Math.sin(Math.PI * t));
                ctx.lineTo(x + layer.width * t, baseY - height + wave);
            }
            ctx.lineTo(x + layer.width, baseY);
            ctx.closePath();
            ctx.fill();
            ctx.restore();
        } else if (layer.type === 'eruption') {
            const centerX = layer.baseX - cameraX * layer.parallax;
            if (centerX + layer.width < -260 || centerX - layer.width > canvas.width + 260) {
                continue;
            }
            const baseY = canvas.height - 48;
            const pulse = 0.4 + Math.sin(layer.pulse) * 0.3;
            const gradient = ctx.createLinearGradient(centerX, baseY - layer.height, centerX, baseY);
            gradient.addColorStop(0, `rgba(255, 160, 110, ${0.45 + pulse * 0.25})`);
            gradient.addColorStop(1, 'rgba(255, 70, 40, 0.0)');
            ctx.save();
            ctx.globalAlpha = 0.6;
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.moveTo(centerX - layer.width / 2, baseY);
            ctx.quadraticCurveTo(centerX, baseY - layer.height * (0.4 + pulse * 0.4), centerX + layer.width / 2, baseY);
            ctx.closePath();
            ctx.fill();
            ctx.restore();
        } else if (layer.type === 'building') {
            const x = layer.baseX - cameraX * layer.parallax;
            if (x + layer.width < -200 || x > canvas.width + 200) {
                continue;
            }
            const baseY = canvas.height;
            ctx.save();
            ctx.fillStyle = layer.color;
            ctx.fillRect(x, baseY - layer.height, layer.width, layer.height);
            const flicker = 0.6 + Math.sin(frameCounter * layer.flickerSpeed) * 0.4;
            ctx.globalAlpha = flicker;
            ctx.strokeStyle = layer.neonColor;
            ctx.lineWidth = 2;
            ctx.strokeRect(x + 2, baseY - layer.height + 2, layer.width - 4, layer.height - 4);
            ctx.restore();
        } else if (layer.type === 'neonSign') {
            const x = layer.baseX - cameraX * layer.parallax;
            if (x + layer.width < -100 || x > canvas.width + 100) {
                continue;
            }
            const pulse = 0.5 + Math.sin(layer.pulse) * 0.5;
            ctx.save();
            ctx.globalAlpha = pulse;
            ctx.fillStyle = layer.color;
            ctx.fillRect(x, layer.y, layer.width, 16);
            ctx.globalAlpha = pulse * 0.6;
            ctx.shadowColor = layer.color;
            ctx.shadowBlur = 15;
            ctx.fillRect(x, layer.y, layer.width, 16);
            ctx.restore();
        } else if (layer.type === 'coral') {
            const x = layer.baseX - cameraX * layer.parallax;
            if (x + layer.width < -150 || x > canvas.width + 150) {
                continue;
            }
            const sway = Math.sin(stageBackdrop.shimmerPhase * layer.swaySpeed + layer.sway) * 8;
            const baseY = canvas.height;
            ctx.save();
            ctx.fillStyle = layer.color;
            ctx.beginPath();
            ctx.moveTo(x, baseY);
            ctx.quadraticCurveTo(x + layer.width / 2 + sway, baseY - layer.height * 0.6, x + layer.width, baseY);
            ctx.closePath();
            ctx.fill();
            ctx.globalAlpha = 0.5;
            ctx.fillStyle = layer.glowColor;
            ctx.beginPath();
            ctx.arc(x + layer.width / 2 + sway, baseY - layer.height * 0.7, layer.width * 0.3, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        } else if (layer.type === 'jellyfish') {
            const x = layer.baseX - cameraX * layer.parallax;
            if (x + layer.size < -100 || x > canvas.width + 100) {
                continue;
            }
            const drift = Math.sin(stageBackdrop.shimmerPhase * 0.015 + layer.drift) * 30;
            const pulse = 0.7 + Math.sin(layer.pulse) * 0.3;
            const bodyY = layer.y + drift;
            ctx.save();
            ctx.globalAlpha = 0.5;
            ctx.fillStyle = layer.glow;
            ctx.beginPath();
            ctx.arc(x, bodyY, layer.size * pulse, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 0.35;
            for (let i = 0; i < 4; i++) {
                const tentacleX = x - layer.size * 0.5 + (i * layer.size / 3);
                ctx.strokeStyle = layer.glow;
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(tentacleX, bodyY + layer.size);
                ctx.quadraticCurveTo(tentacleX + Math.sin(stageBackdrop.shimmerPhase * 0.05 + i) * 8, bodyY + layer.size * 2, tentacleX, bodyY + layer.size * 2.5);
                ctx.stroke();
            }
            ctx.restore();
        } else if (layer.type === 'nebula') {
            const x = layer.baseX - cameraX * layer.parallax;
            if (x + layer.width < -300 || x > canvas.width + 300) {
                continue;
            }
            ctx.save();
            ctx.globalAlpha = 0.3;
            ctx.translate(x + layer.width / 2, layer.y + layer.height / 2);
            ctx.rotate(layer.rotation);
            const nebulaGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, layer.width / 2);
            nebulaGradient.addColorStop(0, layer.color);
            nebulaGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
            ctx.fillStyle = nebulaGradient;
            ctx.fillRect(-layer.width / 2, -layer.height / 2, layer.width, layer.height);
            ctx.restore();
        } else if (layer.type === 'asteroid') {
            const x = layer.baseX - cameraX * layer.parallax;
            if (x + layer.size < -100 || x > canvas.width + 100) {
                continue;
            }
            ctx.save();
            ctx.translate(x, layer.y);
            ctx.rotate(layer.rotation);
            ctx.fillStyle = layer.color;
            ctx.beginPath();
            const points = 6;
            for (let i = 0; i < points; i++) {
                const angle = (i / points) * Math.PI * 2;
                const radius = layer.size * (0.8 + Math.random() * 0.4);
                const px = Math.cos(angle) * radius;
                const py = Math.sin(angle) * radius;
                if (i === 0) {
                    ctx.moveTo(px, py);
                } else {
                    ctx.lineTo(px, py);
                }
            }
            ctx.closePath();
            ctx.fill();
            ctx.globalAlpha = 0.5;
            ctx.strokeStyle = layer.edgeGlow;
            ctx.lineWidth = 1.5;
            ctx.stroke();
            ctx.restore();
        }
    }
}

function drawPlatforms(platforms, state, alpha = 1) {
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = state.platformColor;

    for (let platform of platforms) {
        ctx.fillRect(platform.x, platform.y, platform.width, platform.height);

        if (state.platformShadow) {
            ctx.fillStyle = state.platformShadow;
            ctx.fillRect(platform.x, platform.y + platform.height - 5, platform.width, 5);
            ctx.fillStyle = state.platformColor;
        }

        if (currentStageTheme) {
            if (currentStageTheme.key === 'aurora-steppe') {
                ctx.save();
                ctx.fillStyle = state.detailColor;
                ctx.globalAlpha = 0.65;
                ctx.fillRect(platform.x, platform.y, platform.width, Math.min(6, platform.height));
                ctx.globalAlpha = 0.25;
                ctx.fillStyle = 'rgba(255,255,255,0.6)';
                ctx.fillRect(platform.x, platform.y + 3, platform.width, 2);
                ctx.restore();
            } else if (currentStageTheme.key === 'crystal-expanse') {
                ctx.save();
                ctx.globalAlpha = 0.5;
                const gradient = ctx.createLinearGradient(platform.x, platform.y, platform.x, platform.y + platform.height);
                gradient.addColorStop(0, state.detailColor);
                gradient.addColorStop(1, 'rgba(255,255,255,0)');
                ctx.fillStyle = gradient;
                ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
                ctx.globalAlpha = 0.35;
                ctx.strokeStyle = 'rgba(255,255,255,0.45)';
                ctx.lineWidth = 1.5;
                ctx.strokeRect(platform.x + 1.5, platform.y + 1.5, platform.width - 3, platform.height - 3);
                ctx.restore();
            } else if (currentStageTheme.key === 'volcanic-rift') {
                ctx.save();
                ctx.globalAlpha = 0.45;
                const lavaGlow = ctx.createLinearGradient(platform.x, platform.y, platform.x, platform.y + platform.height);
                lavaGlow.addColorStop(0, 'rgba(255,120,70,0.4)');
                lavaGlow.addColorStop(1, 'rgba(0,0,0,0)');
                ctx.fillStyle = lavaGlow;
                ctx.fillRect(platform.x, platform.y + platform.height - 8, platform.width, 8);

                ctx.globalAlpha = 0.35;
                ctx.strokeStyle = 'rgba(20, 0, 0, 0.55)';
                ctx.lineWidth = 1.25;
                ctx.beginPath();
                for (let crackX = platform.x + 6; crackX < platform.x + platform.width; crackX += 36) {
                    const offset = Math.sin((crackX + platform.y) * 0.05) * 6;
                    ctx.moveTo(crackX, platform.y + platform.height);
                    ctx.lineTo(crackX + offset, platform.y + platform.height - 10);
                }
                ctx.stroke();
                ctx.restore();
            }
        }
    }

    ctx.restore();
}

function drawStageOverlay() {
    if (!currentStageTheme || stageBackdrop.overlayParticles.length === 0) {
        return;
    }

    for (const particle of stageBackdrop.overlayParticles) {
        if (particle.kind === 'pollen') {
            const sway = Math.sin(stageBackdrop.shimmerPhase * 4 + particle.x * 0.02 + particle.hueShift) * 4;
            ctx.save();
            ctx.globalAlpha = particle.alpha;
            ctx.fillStyle = currentStageTheme.palettes.SOLID.detailColor;
            ctx.beginPath();
            ctx.arc(particle.x + sway, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha *= 0.6;
            ctx.fillStyle = 'rgba(255,255,255,0.4)';
            ctx.beginPath();
            ctx.arc(particle.x + sway + 1, particle.y - 1, particle.size * 0.45, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        } else if (particle.kind === 'glimmer') {
            const centerX = canvas.width / 2 + Math.cos(particle.angle) * particle.radius;
            const centerY = canvas.height / 2 + Math.sin(particle.angle) * particle.radius;
            ctx.save();
            ctx.globalCompositeOperation = 'lighter';
            ctx.globalAlpha = particle.alpha;
            ctx.fillStyle = 'rgba(190, 255, 255, 0.9)';
            ctx.beginPath();
            ctx.arc(centerX, centerY, particle.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = 'rgba(255,255,255,0.65)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(centerX - particle.size * 2, centerY);
            ctx.lineTo(centerX + particle.size * 2, centerY);
            ctx.moveTo(centerX, centerY - particle.size * 2);
            ctx.lineTo(centerX, centerY + particle.size * 2);
            ctx.stroke();
            ctx.restore();
        } else if (particle.kind === 'ember') {
            ctx.save();
            ctx.globalCompositeOperation = 'lighter';
            const intensity = particle.alpha * (0.7 + Math.sin(particle.flicker) * 0.3);
            ctx.globalAlpha = intensity;
            ctx.fillStyle = currentStageTheme.palettes.SOLID.accent;
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha *= 0.5;
            ctx.strokeStyle = 'rgba(255, 210, 130, 0.8)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y + particle.size * 2);
            ctx.lineTo(particle.x, particle.y - particle.size * 2);
            ctx.stroke();
            ctx.restore();
        } else if (particle.kind === 'neonGlow') {
            ctx.save();
            ctx.globalCompositeOperation = 'lighter';
            ctx.globalAlpha = particle.alpha;
            ctx.fillStyle = `hsl(${particle.hue}, 100%, 60%)`;
            ctx.shadowColor = `hsl(${particle.hue}, 100%, 60%)`;
            ctx.shadowBlur = 12;
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        } else if (particle.kind === 'biolum') {
            ctx.save();
            ctx.globalCompositeOperation = 'lighter';
            const pulse = 0.5 + Math.sin(particle.pulse) * 0.5;
            ctx.globalAlpha = particle.alpha * pulse;
            ctx.fillStyle = currentStageTheme.palettes.SOLID.accent;
            ctx.shadowColor = currentStageTheme.palettes.SOLID.accent;
            ctx.shadowBlur = 8;
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        } else if (particle.kind === 'star') {
            ctx.save();
            const twinkle = 0.5 + Math.sin(particle.twinkle) * 0.5;
            ctx.globalAlpha = particle.alpha * twinkle;
            ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha *= 0.7;
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(particle.x - particle.size * 1.5, particle.y);
            ctx.lineTo(particle.x + particle.size * 1.5, particle.y);
            ctx.moveTo(particle.x, particle.y - particle.size * 1.5);
            ctx.lineTo(particle.x, particle.y + particle.size * 1.5);
            ctx.stroke();
            ctx.restore();
        }
    }
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
        const pitStyle = currentStageTheme?.pit ?? { fill: '#000', edge: '#ff0000' };

        if (currentStageTheme?.key === 'volcanic-rift') {
            const lava = ctx.createLinearGradient(pit.x, pit.y, pit.x, pit.y + pit.height);
            lava.addColorStop(0, 'rgba(40, 0, 0, 0.9)');
            lava.addColorStop(0.4, 'rgba(255, 90, 50, 0.65)');
            lava.addColorStop(1, 'rgba(255, 140, 80, 0.9)');
            ctx.fillStyle = lava;
        } else if (currentStageTheme?.key === 'crystal-expanse') {
            const voidGradient = ctx.createLinearGradient(pit.x, pit.y, pit.x, pit.y + pit.height);
            voidGradient.addColorStop(0, 'rgba(15, 10, 40, 0.85)');
            voidGradient.addColorStop(1, 'rgba(20, 5, 50, 0.4)');
            ctx.fillStyle = voidGradient;
        } else {
            const depth = ctx.createLinearGradient(pit.x, pit.y, pit.x, pit.y + pit.height);
            depth.addColorStop(0, pitStyle.fill);
            depth.addColorStop(1, 'rgba(0, 0, 0, 0.95)');
            ctx.fillStyle = depth;
        }

        ctx.fillRect(pit.x, pit.y, pit.width, pit.height);

        ctx.globalAlpha = 0.85;
        ctx.strokeStyle = pitStyle.edge;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(pit.x, pit.y);
        ctx.lineTo(pit.x + pit.width, pit.y);
        ctx.stroke();

        if (currentStageTheme?.key === 'crystal-expanse') {
            ctx.globalAlpha = 0.35;
            ctx.strokeStyle = 'rgba(255,255,255,0.45)';
            ctx.lineWidth = 1.2;
            for (let shardX = pit.x + 8; shardX < pit.x + pit.width; shardX += 26) {
                ctx.beginPath();
                ctx.moveTo(shardX, pit.y);
                ctx.lineTo(shardX + 6, pit.y + pit.height * 0.35);
                ctx.stroke();
            }
        } else if (currentStageTheme?.key === 'aurora-steppe') {
            ctx.globalAlpha = 0.2;
            ctx.fillStyle = 'rgba(210, 255, 233, 0.6)';
            ctx.fillRect(pit.x, pit.y, pit.width, 4);
        } else if (currentStageTheme?.key === 'volcanic-rift') {
            ctx.globalAlpha = 0.35;
            ctx.fillStyle = 'rgba(255, 190, 90, 0.4)';
            ctx.fillRect(pit.x, pit.y + pit.height - 6, pit.width, 6);
        }

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
    drawPlatforms(activeState.platforms, activeState);
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

    drawStageOverlay();
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
    updateStageAmbience();

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
