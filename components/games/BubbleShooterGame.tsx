import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, LayoutChangeEvent, Animated } from 'react-native';
import { GameEngine } from 'react-native-game-engine';
import Matter from 'matter-js';
import { ArrowUp, RefreshCw } from 'lucide-react-native';
import { Colors } from '@/constants/colors';

// We'll use these as defaults but update them onLayout
const DEFAULT_WIDTH = Dimensions.get('window').width;
const DEFAULT_HEIGHT = Dimensions.get('window').height;

interface BubbleShooterGameProps {
    onComplete: (score: number) => void;
    ageGroup: string;
}

// --- Constants & Config ---
interface GameConfig {
    rows: number;
    cols: number;
    colors: string[];
    bubbleSize: number;
}

const CONFIGS: Record<string, GameConfig> = {
    '5-7': { rows: 9, cols: 6, colors: ['#EF4444', '#3B82F6', '#10B981'], bubbleSize: 40 },
    '8-10': { rows: 11, cols: 8, colors: ['#EF4444', '#3B82F6', '#10B981', '#F59E0B'], bubbleSize: 35 },
    '11-13': { rows: 13, cols: 9, colors: ['#EF4444', '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6'], bubbleSize: 30 },
    '14+': { rows: 15, cols: 10, colors: ['#EF4444', '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899'], bubbleSize: 28 },
};

// --- Helpers ---
const getGridPosition = (r: number, c: number, config: GameConfig, screenWidth: number) => {
    const size = config.bubbleSize;
    const offset = r % 2 !== 0 ? size / 2 : 0;
    const x = c * size + offset + (screenWidth - config.cols * size) / 2 + size / 2;
    const y = r * (size * 0.85) + size / 2;
    return { x, y };
};

const getNeighbors = (r: number, c: number) => {
    const offsets = r % 2 === 0
        ? [[-1, -1], [-1, 0], [0, -1], [0, 1], [1, -1], [1, 0]]
        : [[-1, 0], [-1, 1], [0, -1], [0, 1], [1, 0], [1, 1]];
    return offsets.map(([dr, dc]) => ({ r: r + dr, c: c + dc }));
};

const findMatches = (ents: any, startKey: string): string[] => {
    if (!ents[startKey]) return [];
    const startBody = ents[startKey].body;
    const color = startBody.plugin.color;
    const matches = [startKey];
    const queue = [startKey];
    const visited = new Set([startKey]);

    while (queue.length > 0) {
        const currentKey = queue.shift()!;
        if (!ents[currentKey]) continue;
        const currentBody = ents[currentKey].body;
        const r = currentBody.plugin.row;
        const c = currentBody.plugin.col;

        const neighbors = getNeighbors(r, c);
        for (const { r: nr, c: nc } of neighbors) {
            const nKey = `bubble_${nr}_${nc}`;
            if (ents[nKey] && !visited.has(nKey) && ents[nKey].body.plugin.color === color) {
                visited.add(nKey);
                matches.push(nKey);
                queue.push(nKey);
            }
        }
    }
    return matches;
};

const findAnchored = (ents: any): Set<string> => {
    const anchored = new Set<string>();
    const queue: string[] = [];

    Object.keys(ents).forEach(key => {
        if (key.startsWith('bubble_')) {
            const r = ents[key].body.plugin.row;
            if (r === 0) {
                anchored.add(key);
                queue.push(key);
            }
        }
    });

    while (queue.length > 0) {
        const currentKey = queue.shift()!;
        if (!ents[currentKey] || ents[currentKey].isExploding) continue; // Ignore exploding
        const currentBody = ents[currentKey].body;
        const r = currentBody.plugin.row;
        const c = currentBody.plugin.col;

        const neighbors = getNeighbors(r, c);
        for (const { r: nr, c: nc } of neighbors) {
            const nKey = `bubble_${nr}_${nc}`;
            if (ents[nKey] && !anchored.has(nKey) && !ents[nKey].isExploding) {
                anchored.add(nKey);
                queue.push(nKey);
            }
        }
    }
    return anchored;
};

// --- Renderers ---

const BubbleRenderer = (props: any) => {
    const { body, color, size, isExploding } = props;
    // If exploding, we might not have a body anymore, but we have position stashed in props if we did it right.
    // Actually, `GameLogic` will remove the body but keep the entity. 
    // If body is removed, we normally return null. 
    // WE MUST CHANGE THIS: If `isExploding`, render static at last known position.

    // However, the easiest way with RNGE is:
    // When we set isExploding, we DO NOT delete the body from the entity immediately in JS (so renderer sees it), 
    // but we remove it from the World.
    // OR, we assume `body` prop is still passed but it's just not in physics world.

    // Animation state
    const [scale] = useState(new Animated.Value(1));
    const [opacity] = useState(new Animated.Value(1));

    useEffect(() => {
        if (isExploding) {
            Animated.parallel([
                Animated.timing(scale, {
                    toValue: 1.5,
                    duration: 500,
                    useNativeDriver: false,
                }),
                Animated.timing(opacity, {
                    toValue: 0,
                    duration: 500,
                    useNativeDriver: false,
                })
            ]).start();
        }
    }, [isExploding]);

    if (!body) return null;
    const x = body.position.x - size / 2;
    const y = body.position.y - size / 2;

    return (
        <Animated.View
            style={{
                position: 'absolute',
                left: x,
                top: y,
                width: size,
                height: size,
                borderRadius: size / 2,
                backgroundColor: color,
                borderWidth: 1,
                borderColor: 'rgba(0,0,0,0.1)',
                shadowColor: '#000',
                shadowOffset: { width: 1, height: 1 },
                shadowOpacity: 0.3,
                shadowRadius: 1,
                transform: [{ scale }],
                opacity: opacity,
                zIndex: isExploding ? 10 : 1 // Exploding bubbles on top
            }}
        />
    );
};

const ProjectileRenderer = (props: any) => {
    const { body, color, size } = props;
    if (!body) return null;
    const x = body.position.x - size / 2;
    const y = body.position.y - size / 2;
    return (
        <View
            style={{
                position: 'absolute',
                left: x,
                top: y,
                width: size,
                height: size,
                borderRadius: size / 2,
                backgroundColor: color,
                borderWidth: 2,
                borderColor: '#fff',
                zIndex: 100,
            }}
        />
    );
};

const AimLineRenderer = (props: any) => {
    const { angle, startX, startY, layout } = props;
    if (!layout) return null;

    const { width, height } = layout;
    const dots = [];

    // Raycasting simulation
    let currentX = startX;
    let currentY = startY;
    // Angle 0 is UP (in our logic from GameLogic: atan2(dy, dx) + PI/2)
    // So: 
    // angle = 0 -> Up -> dy should be negative
    // vx = sin(angle), vy = -cos(angle)
    let vx = Math.sin(angle);
    let vy = -Math.cos(angle);

    const stepSize = 20;
    const maxSteps = 50; // Limit length
    const wallPadding = 15; // Ball radius approx

    for (let i = 0; i < maxSteps; i++) {
        // Next position
        let nextX = currentX + vx * stepSize;
        let nextY = currentY + vy * stepSize;

        // Check Wall Collisions
        if (nextX <= wallPadding) {
            // Hit Left Wall
            // Calculate exact intersection Y
            // (wallPadding - currentX) / vx = t
            // intersectY = currentY + vy * t
            const t = (wallPadding - currentX) / vx;
            const intersectY = currentY + vy * t;

            // Draw segment to intersection
            // (Simplified: just bounce from next step)
            vx = -vx; // Reflect
            nextX = wallPadding + (wallPadding - nextX); // Mirror pos
        } else if (nextX >= width - wallPadding) {
            // Hit Right Wall
            vx = -vx; // Reflect
            nextX = (width - wallPadding) - (nextX - (width - wallPadding));
        }

        if (nextY <= 0) break; // Top of screen

        dots.push(
            <View
                key={i}
                style={{
                    position: 'absolute',
                    left: nextX - 3,
                    top: nextY - 3,
                    width: 6,
                    height: 6,
                    borderRadius: 3,
                    backgroundColor: 'rgba(55, 65, 81, 0.6)',
                }}
            />
        );

        currentX = nextX;
        currentY = nextY;
    }

    return (
        <View style={{ position: 'absolute', top: 0, left: 0, width: width, height: height, zIndex: 10 }} pointerEvents="none">
            {dots}
        </View>
    );
};

// --- Systems ---

const Physics = (entities: any, { time }: any) => {
    const engine = entities.physics.engine;
    // Matter.js recommends constant delta for deterministic results.
    // If frame takes longer (low FPS), we shouldn't force physics to jump too far,
    // which causes tunneling. We cap it at ~20ms or roughly 50-60fps step.
    const delta = Math.min(time.delta, 1000 / 60);
    Matter.Engine.update(engine, delta);
    return entities;
};

const GameLogic = (entities: any, { touches, dispatch, events, layout }: any) => {
    const engine = entities.physics.engine;
    const config = entities.config;
    const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = layout;

    const CANNON_BOTTOM_OFFSET = 100; // Distance from bottom for the cannon center
    const CANNON_X = SCREEN_WIDTH / 2;
    const CANNON_Y = SCREEN_HEIGHT - CANNON_BOTTOM_OFFSET;

    // Update Aim Layout
    if (entities.aim) {
        entities.aim.layout = layout;
        entities.aim.startX = CANNON_X;
        entities.aim.startY = CANNON_Y;
    }

    // Aiming - Check for move OR start to be responsive
    const move = touches.find((x: any) => x.type === 'move' || x.type === 'start');
    if (move) {
        // RNGE touches usually have `event.locationX` and `event.locationY` relative to the GameEngine component.
        const locationX = move.event.locationX;
        const locationY = move.event.locationY;

        const dx = locationX - CANNON_X;
        const dy = locationY - CANNON_Y;

        let angle = Math.atan2(dy, dx) + Math.PI / 2;
        const limit = Math.PI / 2.5; // Slightly wider angle
        if (angle > limit) angle = limit;
        if (angle < -limit) angle = -limit;
        entities.aim.angle = angle;
    }

    // Shooting
    const press = touches.find((x: any) => x.type === 'end');
    if (press && !entities.projectile) {
        const angle = entities.aim.angle;
        const speed = 18; // Faster shot
        const vx = Math.sin(angle) * speed;
        const vy = -Math.cos(angle) * speed;

        const size = config.bubbleSize;
        const projectile = Matter.Bodies.circle(CANNON_X, CANNON_Y, size / 2, {
            label: 'projectile',
            restitution: 1, // Elastic bounce
            friction: 0,
            frictionAir: 0,
            frictionStatic: 0,
            inertia: Infinity,
            collisionFilter: { category: 0x0002, mask: 0x0001 }
        });

        Matter.Body.setVelocity(projectile, { x: vx, y: vy });
        Matter.World.add(engine.world, projectile);

        const colorToShoot = entities.nextColor;

        entities.projectile = {
            body: projectile,
            size: size,
            color: colorToShoot,
            renderer: ProjectileRenderer
        };

        entities.nextColor = config.colors[Math.floor(Math.random() * config.colors.length)];
        dispatch({ type: 'SHOT_FIRED', current: colorToShoot, next: entities.nextColor });
    }

    // Collision & Game Logic
    if (entities.projectile) {
        const pBody = entities.projectile.body;
        const radius = config.bubbleSize / 2;

        // Improved Wall Bounce - Elastic but constrained
        // Native physics covers the movement. We just clamp to be safe.
        if (pBody.position.x <= radius) {
            Matter.Body.setPosition(pBody, { x: radius, y: pBody.position.y });
        } else if (pBody.position.x >= SCREEN_WIDTH - radius) {
            Matter.Body.setPosition(pBody, { x: SCREEN_WIDTH - radius, y: pBody.position.y });
        }

        let bestRow = -1;
        let bestCol = -1;
        let hit = false;

        // 1. Detect ALL hits (overlapping bubbles)
        const allBodies = Matter.Composite.allBodies(engine.world);
        const bubbles = allBodies.filter((b: any) => b.label === 'bubble');
        const hits: any[] = [];

        for (const b of bubbles) {
            const dist = Matter.Vector.magnitude(Matter.Vector.sub(pBody.position, b.position));
            // Check overlap
            if (dist < config.bubbleSize * 1.05) {
                hits.push(b);
            }
        }

        // Top Wall "Stick"
        const topWallHit = pBody.position.y <= radius;

        if (hits.length > 0 || topWallHit) {
            hit = true;

            // Stop physics immediately
            const x = pBody.position.x;
            const y = pBody.position.y;
            const color = entities.projectile.color;

            Matter.Body.setVelocity(pBody, { x: 0, y: 0 });
            Matter.World.remove(engine.world, pBody);
            delete entities.projectile;

            const size = config.bubbleSize;

            // Strategy: Find all valid empty neighbors of ALL hit bubbles and pick the closest one.
            if (hits.length > 0) {
                let minCandidateDist = Infinity;

                hits.forEach(hitBubble => {
                    if (hitBubble.plugin) {
                        const { row, col } = hitBubble.plugin;
                        const neighbors = getNeighbors(row, col);

                        for (const { r, c } of neighbors) {
                            if (r < 0 || r >= config.rows) continue;
                            const maxCols = r % 2 === 0 ? config.cols : config.cols - 1;
                            if (c < 0 || c >= maxCols) continue;

                            const key = `bubble_${r}_${c}`;
                            // If empty
                            if (!entities[key]) {
                                const pos = getGridPosition(r, c, config, SCREEN_WIDTH);
                                const dist = Math.sqrt(Math.pow(x - pos.x, 2) + Math.pow(y - pos.y, 2));

                                if (dist < minCandidateDist) {
                                    minCandidateDist = dist;
                                    bestRow = r;
                                    bestCol = c;
                                }
                            }
                        }
                    }
                });
            }

            // Fallback 1: If top wall hit OR no valid neighbor found from hits (weird edge case)
            if (bestRow === -1) {
                if (topWallHit) {
                    // Explicit Top Wall Snap
                    bestRow = 0;
                    const startX = (SCREEN_WIDTH - config.cols * size) / 2;
                    // Row 0 is even.
                    bestCol = Math.round((x - size / 2 - startX) / size);
                    // Clamp
                    bestCol = Math.max(0, Math.min(config.cols - 1, bestCol));

                    // Verify spot is empty
                    if (entities[`bubble_${bestRow}_${bestCol}`]) {
                        // Occupied? Try neighbors? Or just failsafe to global search.
                        // If occupied, it means we hit a bubble, not just the wall. 
                        // But we should have caught that in 'hits'.
                        // If we are here, 'hits' was empty or failed.
                        // Let's fallback to global search if this spot is taken.
                        bestRow = -1;
                    }
                }

                // If still -1 (global search needed)
                if (bestRow === -1) {
                    // Use global local search mainly for top wall or extreme overlaps
                    const roughRow = Math.round((y - size / 2) / (size * 0.85));
                    let minDist = Infinity;

                    for (let r = Math.max(0, roughRow - 1); r <= Math.min(config.rows - 1, roughRow + 1); r++) {
                        const offset = r % 2 !== 0 ? size / 2 : 0;
                        const startX = (SCREEN_WIDTH - config.cols * size) / 2;
                        const roughCol = Math.round((x - size / 2 - offset - startX) / size);

                        for (let c = Math.max(0, roughCol - 1); c <= Math.min(config.cols - 1, roughCol + 1); c++) {
                            const maxCols = r % 2 === 0 ? config.cols : config.cols - 1;
                            if (c < 0 || c >= maxCols) continue;
                            const key = `bubble_${r}_${c}`;
                            if (!entities[key]) { // Only empty spots
                                const pos = getGridPosition(r, c, config, SCREEN_WIDTH);
                                const dist = Math.sqrt(Math.pow(x - pos.x, 2) + Math.pow(y - pos.y, 2));
                                if (dist < minDist) {
                                    minDist = dist;
                                    bestRow = r;
                                    bestCol = c;
                                }
                            }
                        }
                    }
                }
            }

            // Fallback 2: Global Safety Snap (Level 3)
            // If even local specific search failed (e.g. projectile went too deep or confusing state),
            // iterate entire grid to find closest empty spot. This GUARANTEES no disappearance if hit was true.
            if (bestRow === -1) {
                let globalMinDist = Infinity;

                for (let r = 0; r < config.rows; r++) {
                    const maxCols = r % 2 === 0 ? config.cols : config.cols - 1;
                    for (let c = 0; c < maxCols; c++) {
                        const key = `bubble_${r}_${c}`;
                        if (!entities[key]) {
                            const pos = getGridPosition(r, c, config, SCREEN_WIDTH);
                            const dist = Math.sqrt(Math.pow(x - pos.x, 2) + Math.pow(y - pos.y, 2));
                            if (dist < globalMinDist) {
                                globalMinDist = dist;
                                bestRow = r;
                                bestCol = c;
                            }
                        }
                    }
                }
            }

            // Valid placement found?
            if (bestRow !== -1) {
                const pos = getGridPosition(bestRow, bestCol, config, SCREEN_WIDTH);
                const newBubble = Matter.Bodies.circle(pos.x, pos.y, size / 2, {
                    isStatic: true,
                    label: 'bubble',
                    restitution: 0,
                    collisionFilter: { category: 0x0001 }
                });
                newBubble.plugin = { row: bestRow, col: bestCol, color: color };
                Matter.World.add(engine.world, newBubble);

                const newKey = `bubble_${bestRow}_${bestCol}`;
                entities[newKey] = {
                    body: newBubble,
                    size: size,
                    color: color,
                    renderer: BubbleRenderer
                };

                // Matches
                const matches = findMatches(entities, newKey);
                let points = 0;
                if (matches.length >= 3) {
                    matches.forEach(key => {
                        // Trigger Explosion
                        if (!entities[key].isExploding) {
                            entities[key].isExploding = true;
                            entities[key].explodeTime = Date.now();
                            // Remove from physics world immediately so it doesn't block others
                            Matter.World.remove(engine.world, entities[key].body);
                            // NOTE: We keep entities[key] and entities[key].body exists so Renderer can see position.
                            // But since it's removed from World, it won't collide.
                        }
                    });
                    points += matches.length * 10;

                    // Floating logic needs to be careful not to count exploding bubbles as anchors
                    // We need to re-run findAnchored ignoring exploding ones.
                    // Actually findAnchored uses bodies in grid. If we removed them from world, 
                    // findMatches might fail if it relies on physics? 
                    // findMatches uses `ents[key].body.plugin`. This is fine as long as `ents[key]` exists.

                    // Floating
                    const anchored = findAnchored(entities); // logic needs check: does it traverse exploiting bubbles?
                    // findAnchored traverses neighbors. If exploding bubbles are still in `entities`, it might traverse them.
                    // WE SHOULD NOT TRAVERSE EXPLODING BUBBLES.
                    // We need to update findAnchored to ignore exploding bubbles.
                    // Quick fix: findAnchored checks `if (!ents[currentKey]) continue;`
                    // We can add `if (ents[currentKey].isExploding) continue;`

                    Object.keys(entities).forEach(key => {
                        if (key.startsWith('bubble_') && !anchored.has(key) && !entities[key].isExploding) {
                            // Float / Drop these too
                            // For now, just explode them as well for simplicity, or drop them.
                            // User asked for "explosion effect". Let's explode them too.
                            entities[key].isExploding = true;
                            entities[key].explodeTime = Date.now();
                            Matter.World.remove(engine.world, entities[key].body);
                            points += 10;
                        }
                    });
                }

                if (points > 0) {
                    dispatch({ type: 'SCORE_UPDATE', points });
                }

                // Game Over / Win
                if (bestRow >= config.rows - 1) {
                    dispatch({ type: 'GAME_OVER' });
                } else {
                    const remaining = Object.keys(entities).filter(k => k.startsWith('bubble_') && !entities[k].isExploding);
                    if (remaining.length === 0) {
                        dispatch({ type: 'WIN' });
                    }
                }
            } else {
                // Should not happen if logic is correct, but safe cleanup if something fails catastrophically
                // The projectile was already deleted.
            }
        }
    }

    // Cleanup Exploding Bubbles
    Object.keys(entities).forEach(key => {
        if (entities[key].isExploding) {
            const elapsed = Date.now() - entities[key].explodeTime;
            if (elapsed > 500) {
                delete entities[key]; // Fully remove entity after animation
            }
        }
    });

    return entities;
};

export default function BubbleShooterGame({ onComplete, ageGroup }: BubbleShooterGameProps) {
    const config = CONFIGS[ageGroup] || CONFIGS['8-10'];
    // Re-enable engine creation
    const [engine] = useState(() => Matter.Engine.create({ enableSleeping: false, gravity: { x: 0, y: 0 } }));

    const [score, setScore] = useState(0);
    const [gameKey, setGameKey] = useState(0);
    const [layout, setLayout] = useState<{ width: number, height: number } | null>(null);

    // UI State
    const [currentBallColor, setCurrentBallColor] = useState<string>(config.colors[0]);
    const [nextBallColor, setNextBallColor] = useState<string>(config.colors[1]);

    const setupWorld = (width: number, height: number) => {
        const world = engine.world;
        Matter.World.clear(world, false);
        Matter.Engine.clear(engine);

        const CANNON_BOTTOM_OFFSET = 100;
        const CANNON_X = width / 2;
        const CANNON_Y = height - CANNON_BOTTOM_OFFSET;

        // Walls
        const wallThickness = 100;
        const leftWall = Matter.Bodies.rectangle(-wallThickness / 2, height / 2, wallThickness, height * 2, { isStatic: true, label: 'wall', restitution: 1, friction: 0, frictionStatic: 0, collisionFilter: { category: 0x0001 } });
        const rightWall = Matter.Bodies.rectangle(width + wallThickness / 2, height / 2, wallThickness, height * 2, { isStatic: true, label: 'wall', restitution: 1, friction: 0, frictionStatic: 0, collisionFilter: { category: 0x0001 } });
        const ceiling = Matter.Bodies.rectangle(width / 2, -wallThickness / 2, width * 2, wallThickness, { isStatic: true, label: 'wall', restitution: 0, collisionFilter: { category: 0x0001 } });

        Matter.World.add(world, [leftWall, rightWall, ceiling]);

        const startColor = config.colors[Math.floor(Math.random() * config.colors.length)];
        const nextColor = config.colors[Math.floor(Math.random() * config.colors.length)];

        setCurrentBallColor(startColor);
        setNextBallColor(nextColor);

        // Initial Bubbles
        const entities: any = {
            physics: { engine: engine },
            config: config,
            aim: { angle: 0, startX: CANNON_X, startY: CANNON_Y, layout: { width, height }, renderer: AimLineRenderer },
            nextColor: startColor, // This is actually the CURRENT ball color in logic
        };

        const size = config.bubbleSize;
        // Fill top 1/3
        for (let r = 0; r < Math.floor(config.rows / 3); r++) {
            for (let c = 0; c < (r % 2 === 0 ? config.cols : config.cols - 1); c++) {
                const pos = getGridPosition(r, c, config, width);

                const bubble = Matter.Bodies.circle(pos.x, pos.y, size / 2, {
                    isStatic: true,
                    label: 'bubble',
                    restitution: 0, // Sticky
                    collisionFilter: { category: 0x0001 }
                });

                // Store grid data in body plugin
                bubble.plugin = { row: r, col: c, color: config.colors[Math.floor(Math.random() * config.colors.length)] };

                Matter.World.add(world, bubble);
                entities[`bubble_${r}_${c}`] = {
                    body: bubble,
                    size: size,
                    color: bubble.plugin.color,
                    renderer: BubbleRenderer
                };
            }
        }

        return entities;
    };

    const [entities, setEntities] = useState<any>(null);

    // Reset game when ageGroup changes or layout is measured
    useEffect(() => {
        if (layout) {
            setGameKey(k => k + 1);
            setScore(0);
            setEntities(setupWorld(layout.width, layout.height));
        }
    }, [ageGroup, layout]);

    const onEvent = (e: any) => {
        switch (e.type) {
            case 'SCORE_UPDATE':
                setScore(s => s + e.points);
                break;
            case 'SHOT_FIRED':
                // e.current was the ball just fired (now flying)
                // e.next is the new ball that should appear in the cannon
                // Wait a bit to "reload" visually? Or just swap immediately.
                // Let's swap immediately for responsiveness.
                setCurrentBallColor(e.next);
                // We don't have a "next-next" in logic yet, but we can just use e.next as current
                // and maybe generate another random for "next" display if we wanted a queue.
                // For now, let's assume we only show the current one in cannon.
                break;
            case 'GAME_OVER':
                if (layout) {
                    setGameKey(k => k + 1);
                    setScore(0);
                    setEntities(setupWorld(layout.width, layout.height));
                }
                break;
            case 'WIN':
                onComplete(score + 100);
                break;
        }
    };

    const onLayout = (e: LayoutChangeEvent) => {
        const { width, height } = e.nativeEvent.layout;
        // Only update if dimensions actually changed or if it's the first time
        if (!layout || layout.width !== width || layout.height !== height) {
            setLayout({ width, height });
        }
    };

    const cannonX = layout ? layout.width / 2 : DEFAULT_WIDTH / 2;
    const cannonY = layout ? layout.height - 100 : DEFAULT_HEIGHT - 100;

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.scoreText}>Skor: {score}</Text>
                <TouchableOpacity onPress={() => {
                    if (layout) {
                        setGameKey(k => k + 1);
                        setScore(0);
                        setEntities(setupWorld(layout.width, layout.height));
                    }
                }}>
                    <RefreshCw size={24} color={Colors.primary} />
                </TouchableOpacity>
            </View>

            <View style={styles.gameWrapper} onLayout={onLayout}>
                {layout && entities && (
                    <GameEngine
                        key={gameKey}
                        style={styles.gameContainer}
                        systems={[Physics, (ents: any, args: any) => GameLogic(ents, { ...args, layout })]}
                        entities={entities}
                        onEvent={onEvent}
                    />
                )}

                {/* UI Overlay - Rendered OUTSIDE GameEngine to ensure visibility */}
                {layout && (
                    <>
                        <View style={[styles.cannonBase, { left: cannonX - 25, top: cannonY - 25 }]} pointerEvents="none">
                            <View style={{
                                width: 50,
                                height: 50,
                                borderRadius: 25,
                                backgroundColor: currentBallColor,
                                borderWidth: 2,
                                borderColor: 'white',
                                shadowColor: '#000',
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.3,
                                shadowRadius: 3,
                            }} />
                        </View>

                        <View style={styles.nextBubbleContainer} pointerEvents="none">
                            <View style={[styles.nextBubble, { backgroundColor: nextBallColor }]} />
                            <Text style={styles.nextLabel}>Atış Yap</Text>
                        </View>
                    </>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F3F4F6',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 16,
        alignItems: 'center',
        zIndex: 100,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    scoreText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.spacePurple,
    },
    gameWrapper: {
        flex: 1,
        position: 'relative',
        overflow: 'hidden', // Ensure nothing bleeds out
    },
    gameContainer: {
        flex: 1,
        backgroundColor: '#F3F4F6',
    },
    cannonBase: {
        position: 'absolute',
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 50, // High Z-Index
    },
    nextBubbleContainer: {
        position: 'absolute',
        bottom: 40,
        width: '100%',
        alignItems: 'center',
        zIndex: 50,
    },
    nextBubble: {
        width: 30,
        height: 30,
        borderRadius: 15,
        borderWidth: 2,
        borderColor: 'white',
        marginBottom: 4,
    },
    nextLabel: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#6B7280',
        marginTop: 40,
    },
});
