import { HeroState, Monster } from '../types/game';
import { MAP_W, MAP_H, TILE_SIZE } from '../data/gameData';

export interface CombatFx {
  type: 'slash' | 'spell_fire' | 'heal' | 'enemy_hit' | 'hero_hit';
  startTime: number;
  duration: number;
  value?: number | string;
}

export class PixelRenderer {
  private waveOffset: number = 0;
  private animFrame: number = 0;

  constructor() {
    setInterval(() => {
      this.waveOffset = (this.waveOffset + 1) % 16;
      this.animFrame = (this.animFrame + 1) % 60;
    }, 120);
  }

  // --- MAP RENDERING ---
  public renderMap(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    mapData: number[][],
    hero: HeroState,
    stepToggle: boolean
  ) {
    ctx.imageSmoothingEnabled = false;

    // Fill background
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, width, height);

    // Calculate map offset to center it in canvas
    const totalMapWidth = MAP_W * TILE_SIZE;
    const totalMapHeight = MAP_H * TILE_SIZE;
    const offsetX = Math.floor((width - totalMapWidth) / 2);
    const offsetY = Math.floor((height - totalMapHeight) / 2);

    // Render Tiles
    for (let y = 0; y < MAP_H; y++) {
      for (let x = 0; x < MAP_W; x++) {
        const tileType = mapData[y]?.[x] ?? 0;
        const px = offsetX + x * TILE_SIZE;
        const py = offsetY + y * TILE_SIZE;

        this.drawTile(ctx, tileType, px, py, x, y);
      }
    }

    // Render Hero
    const hx = offsetX + hero.x * TILE_SIZE;
    const hy = offsetY + hero.y * TILE_SIZE;
    this.drawHero(ctx, hx, hy, hero, stepToggle);
  }

  private drawTile(ctx: CanvasRenderingContext2D, type: number, px: number, py: number, gx: number, gy: number) {
    const s = TILE_SIZE;

    switch (type) {
      case 0: // Grass (草地)
        ctx.fillStyle = '#22c55e';
        ctx.fillRect(px, py, s, s);
        // Grass tufts
        ctx.fillStyle = '#16a34a';
        ctx.fillRect(px + 4, py + 8, 2, 4);
        ctx.fillRect(px + 6, py + 6, 2, 6);
        ctx.fillRect(px + 20, py + 18, 2, 5);
        ctx.fillRect(px + 22, py + 16, 2, 7);
        // Subtle border grid
        ctx.fillStyle = 'rgba(0,0,0,0.06)';
        ctx.strokeRect(px + 0.5, py + 0.5, s - 1, s - 1);
        break;

      case 1: // Forest (樹林)
        ctx.fillStyle = '#15803d';
        ctx.fillRect(px, py, s, s);
        // Pine trees
        ctx.fillStyle = '#14532d';
        ctx.fillRect(px + 6, py + 4, 20, 16);
        ctx.fillRect(px + 10, py + 2, 12, 6);
        // Tree highlight
        ctx.fillStyle = '#22c55e';
        ctx.fillRect(px + 8, py + 6, 4, 4);
        ctx.fillRect(px + 18, py + 10, 3, 3);
        // Trunk
        ctx.fillStyle = '#78350f';
        ctx.fillRect(px + 14, py + 20, 4, 8);
        break;

      case 2: // Mountain (高山)
        ctx.fillStyle = '#475569';
        ctx.fillRect(px, py, s, s);
        // Mountain peak
        ctx.beginPath();
        ctx.moveTo(px + s / 2, py + 3);
        ctx.lineTo(px + s - 3, py + s - 3);
        ctx.lineTo(px + 3, py + s - 3);
        ctx.closePath();
        ctx.fillStyle = '#334155';
        ctx.fill();

        // Snow cap
        ctx.beginPath();
        ctx.moveTo(px + s / 2, py + 3);
        ctx.lineTo(px + s / 2 + 6, py + 11);
        ctx.lineTo(px + s / 2 - 6, py + 11);
        ctx.closePath();
        ctx.fillStyle = '#f8fafc';
        ctx.fill();
        break;

      case 3: // Radatome Castle (拉達托姆城)
        ctx.fillStyle = '#22c55e'; // Grass base
        ctx.fillRect(px, py, s, s);
        // Castle stone base
        ctx.fillStyle = '#94a3b8';
        ctx.fillRect(px + 4, py + 8, 24, 20);
        // Blue roof towers
        ctx.fillStyle = '#2563eb';
        ctx.fillRect(px + 4, py + 4, 6, 8);
        ctx.fillRect(px + 22, py + 4, 6, 8);
        ctx.fillRect(px + 12, py + 2, 8, 8);
        // Gate & gold crest
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(px + 13, py + 18, 6, 10);
        ctx.fillStyle = '#fbbf24';
        ctx.fillRect(px + 14, py + 10, 4, 4);
        break;

      case 4: // Dragonlord Castle (龍王城)
        ctx.fillStyle = '#4c0519';
        ctx.fillRect(px, py, s, s);
        // Dark demonic fortress
        ctx.fillStyle = '#581c87';
        ctx.fillRect(px + 3, py + 6, 26, 22);
        // Spire
        ctx.fillStyle = '#9333ea';
        ctx.fillRect(px + 12, py + 2, 8, 8);
        ctx.fillRect(px + 4, py + 4, 5, 8);
        ctx.fillRect(px + 23, py + 4, 5, 8);
        // Glowing red gate/eyes
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(px + 13, py + 18, 6, 10);
        ctx.fillRect(px + 7, py + 12, 3, 3);
        ctx.fillRect(px + 22, py + 12, 3, 3);
        break;

      case 5: // Cave of Erdrick (羅德洞窟)
        ctx.fillStyle = '#475569';
        ctx.fillRect(px, py, s, s);
        // Cave entrance
        ctx.fillStyle = '#09090b';
        ctx.beginPath();
        ctx.arc(px + s / 2, py + s / 2 + 3, 9, Math.PI, 0);
        ctx.lineTo(px + s / 2 + 9, py + s - 4);
        ctx.lineTo(px + s / 2 - 9, py + s - 4);
        ctx.closePath();
        ctx.fill();
        // Golden glimmer
        ctx.fillStyle = '#fbbf24';
        ctx.fillRect(px + 14, py + 20, 4, 4);
        break;

      case 6: // Poison Marsh (毒沼)
        ctx.fillStyle = '#581c87';
        ctx.fillRect(px, py, s, s);
        ctx.fillStyle = '#701a75';
        ctx.fillRect(px + 4, py + 4, s - 8, s - 8);
        // Bubbles
        const bubbleShift = (this.animFrame + gx * 7 + gy * 13) % 20;
        ctx.fillStyle = '#d946ef';
        ctx.fillRect(px + 6 + (bubbleShift % 18), py + 6 + ((bubbleShift * 3) % 18), 3, 3);
        break;

      case 7: // Town (道具鎮)
        ctx.fillStyle = '#22c55e';
        ctx.fillRect(px, py, s, s);
        // Houses
        ctx.fillStyle = '#b45309';
        ctx.fillRect(px + 4, py + 6, 10, 8);
        ctx.fillRect(px + 18, py + 6, 10, 8);
        ctx.fillStyle = '#fef3c7';
        ctx.fillRect(px + 5, py + 14, 8, 12);
        ctx.fillRect(px + 19, py + 14, 8, 12);
        // Door
        ctx.fillStyle = '#78350f';
        ctx.fillRect(px + 8, py + 20, 3, 6);
        ctx.fillRect(px + 22, py + 20, 3, 6);
        break;

      default:
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(px, py, s, s);
    }
  }

  private drawHero(ctx: CanvasRenderingContext2D, hx: number, hy: number, hero: HeroState, stepToggle: boolean) {
    const s = TILE_SIZE;
    const cx = hx + s / 2;
    const cy = hy + s / 2;

    // Body shadow
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.beginPath();
    ctx.ellipse(cx, cy + 11, 8, 4, 0, 0, Math.PI * 2);
    ctx.fill();

    // Blue Hero Robe/Armor
    ctx.fillStyle = '#2563eb';
    ctx.fillRect(cx - 6, cy - 2, 12, 10);

    // Helmet / Hair
    ctx.fillStyle = '#fbbf24'; // Blonde hair / gold band
    ctx.fillRect(cx - 5, cy - 11, 10, 4);

    // Horns / Helmet crest
    ctx.fillStyle = '#e2e8f0'; // Silver horned helm
    ctx.fillRect(cx - 6, cy - 10, 2, 3);
    ctx.fillRect(cx + 4, cy - 10, 2, 3);

    // Face skin
    ctx.fillStyle = '#fed7aa';
    ctx.fillRect(cx - 5, cy - 7, 10, 6);

    // Eyes based on direction
    ctx.fillStyle = '#0f172a';
    if (hero.direction === 'down') {
      ctx.fillRect(cx - 3, cy - 5, 2, 2);
      ctx.fillRect(cx + 1, cy - 5, 2, 2);
    } else if (hero.direction === 'up') {
      // Back of head (hair/helmet)
      ctx.fillStyle = '#3b82f6';
      ctx.fillRect(cx - 5, cy - 8, 10, 7);
    } else if (hero.direction === 'left') {
      ctx.fillRect(cx - 4, cy - 5, 2, 2);
    } else {
      ctx.fillRect(cx + 2, cy - 5, 2, 2);
    }

    // Shield (Red rim with white crest)
    ctx.fillStyle = '#dc2626';
    if (hero.direction === 'right') {
      ctx.fillRect(cx - 9, cy - 1, 3, 7);
    } else {
      ctx.fillRect(cx + 6, cy - 1, 3, 7);
    }

    // Sword (Golden if Loto Sword, Steel otherwise)
    ctx.fillStyle = hero.hasLotoSword ? '#fbbf24' : '#e2e8f0';
    if (hero.direction === 'left') {
      ctx.fillRect(cx - 9, cy - 6, 2, 9);
    } else {
      ctx.fillRect(cx - 8, cy - 4, 2, 8);
    }

    // Legs / Boots walking step
    ctx.fillStyle = '#78350f';
    if (stepToggle) {
      ctx.fillRect(cx - 5, cy + 8, 3, 4);
      ctx.fillRect(cx + 2, cy + 7, 3, 3);
    } else {
      ctx.fillRect(cx - 5, cy + 7, 3, 3);
      ctx.fillRect(cx + 2, cy + 8, 3, 4);
    }
  }

  // --- BATTLE RENDERING ---
  public renderBattle(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    monster: Monster,
    activeFx: CombatFx | null,
    isEnemyShaking: boolean
  ) {
    ctx.imageSmoothingEnabled = false;

    // Dark vintage background
    ctx.fillStyle = '#050505';
    ctx.fillRect(0, 0, width, height);

    // Decorative dungeon frame
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 4;
    const boxW = Math.min(260, width - 40);
    const boxH = Math.min(200, height - 60);
    const boxX = Math.floor((width - boxW) / 2);
    const boxY = 16;

    ctx.strokeRect(boxX, boxY, boxW, boxH);

    // Inner dark arena
    ctx.fillStyle = '#0a0a0c';
    ctx.fillRect(boxX + 2, boxY + 2, boxW - 4, boxH - 4);

    // Monster shake offset
    let mx = boxX + boxW / 2;
    let my = boxY + boxH / 2;
    if (isEnemyShaking) {
      mx += (Math.random() * 12 - 6);
      my += (Math.random() * 10 - 5);
    }

    // Draw Monster Sprite
    this.drawMonsterSprite(ctx, monster, mx, my);

    // Active Combat Effects
    if (activeFx) {
      this.drawCombatFx(ctx, activeFx, mx, my);
    }
  }

  private drawMonsterSprite(ctx: CanvasRenderingContext2D, monster: Monster, cx: number, cy: number) {
    switch (monster.sprite) {
      case 'slime':
      case 'red_slime': {
        const isRed = monster.sprite === 'red_slime';
        const bodyColor = isRed ? '#ef4444' : '#38bdf8';
        const darkColor = isRed ? '#b91c1c' : '#0284c7';
        const r = 42;

        // Slime body teardrop shape
        ctx.fillStyle = bodyColor;
        ctx.beginPath();
        ctx.moveTo(cx, cy - r - 12); // Teardrop tip
        ctx.bezierCurveTo(cx + r * 1.1, cy - 8, cx + r, cy + r - 4, cx, cy + r);
        ctx.bezierCurveTo(cx - r, cy + r - 4, cx - r * 1.1, cy - 8, cx, cy - r - 12);
        ctx.closePath();
        ctx.fill();

        // Shading on bottom
        ctx.fillStyle = darkColor;
        ctx.beginPath();
        ctx.ellipse(cx, cy + r - 8, r * 0.75, 8, 0, 0, Math.PI * 2);
        ctx.fill();

        // White glossy highlight
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.ellipse(cx - 16, cy - 16, 7, 12, -0.4, 0, Math.PI * 2);
        ctx.fill();

        // Cute Big Round Eyes
        ctx.fillStyle = '#000000';
        ctx.beginPath();
        ctx.arc(cx - 14, cy + 2, 7, 0, Math.PI * 2);
        ctx.arc(cx + 14, cy + 2, 7, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(cx - 16, cy, 3, 0, Math.PI * 2);
        ctx.arc(cx + 12, cy, 3, 0, Math.PI * 2);
        ctx.fill();

        // Smiling mouth
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(cx, cy + 16, 10, 0.15 * Math.PI, 0.85 * Math.PI, false);
        ctx.stroke();
        break;
      }

      case 'skel': {
        // Skeleton Warrior
        ctx.fillStyle = '#e2e8f0';
        // Skull
        ctx.fillRect(cx - 18, cy - 48, 36, 32);
        // Horned helm
        ctx.fillStyle = '#64748b';
        ctx.fillRect(cx - 22, cy - 54, 44, 10);
        ctx.fillStyle = '#cbd5e1';
        ctx.fillRect(cx - 24, cy - 64, 6, 12);
        ctx.fillRect(cx + 18, cy - 64, 6, 12);

        // Glowing red eye sockets
        ctx.fillStyle = '#000000';
        ctx.fillRect(cx - 13, cy - 36, 9, 9);
        ctx.fillRect(cx + 4, cy - 36, 9, 9);
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(cx - 10, cy - 34, 4, 4);
        ctx.fillRect(cx + 7, cy - 34, 4, 4);

        // Teeth
        ctx.fillStyle = '#000000';
        ctx.fillRect(cx - 10, cy - 20, 20, 4);

        // Spine and Ribs
        ctx.fillStyle = '#e2e8f0';
        ctx.fillRect(cx - 4, cy - 16, 8, 40);
        for (let i = 0; i < 4; i++) {
          ctx.fillRect(cx - 24, cy - 12 + i * 9, 48, 4);
        }

        // Broadsword
        ctx.fillStyle = '#94a3b8';
        ctx.fillRect(cx + 28, cy - 50, 6, 68);
        ctx.fillStyle = '#cbd5e1';
        ctx.fillRect(cx + 24, cy + 18, 14, 5);
        ctx.fillStyle = '#78350f';
        ctx.fillRect(cx + 29, cy + 23, 4, 14);

        // Tattered Shield
        ctx.fillStyle = '#475569';
        ctx.fillRect(cx - 36, cy - 14, 14, 34);
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(cx - 32, cy - 2, 6, 10);
        break;
      }

      case 'knight': {
        // Armored Dark Knight
        ctx.fillStyle = '#475569';
        // Chestplate
        ctx.fillRect(cx - 30, cy - 20, 60, 52);
        // Gold trim
        ctx.fillStyle = '#f59e0b';
        ctx.fillRect(cx - 26, cy - 18, 52, 4);
        ctx.fillRect(cx - 2, cy - 14, 4, 42);

        // Helmet with Visor
        ctx.fillStyle = '#334155';
        ctx.fillRect(cx - 22, cy - 56, 44, 34);
        ctx.fillStyle = '#f59e0b';
        ctx.fillRect(cx - 6, cy - 68, 12, 14); // Plume

        // Visor slit
        ctx.fillStyle = '#000000';
        ctx.fillRect(cx - 16, cy - 42, 32, 6);
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(cx - 6, cy - 41, 12, 4); // Glowing eyes

        // Giant Halberd/Sword
        ctx.fillStyle = '#cbd5e1';
        ctx.fillRect(cx + 34, cy - 65, 8, 85);
        ctx.fillStyle = '#f59e0b';
        ctx.fillRect(cx + 28, cy + 18, 20, 6);
        break;
      }

      case 'dragon': {
        // Emerald Dragon
        ctx.fillStyle = '#16a34a';
        // Body
        ctx.beginPath();
        ctx.ellipse(cx, cy + 10, 50, 40, 0, 0, Math.PI * 2);
        ctx.fill();

        // Scales & chest
        ctx.fillStyle = '#fbbf24';
        ctx.beginPath();
        ctx.ellipse(cx - 4, cy + 14, 28, 24, 0, 0, Math.PI * 2);
        ctx.fill();

        // Wings
        ctx.fillStyle = '#15803d';
        ctx.beginPath();
        ctx.moveTo(cx - 35, cy - 10);
        ctx.lineTo(cx - 75, cy - 50);
        ctx.lineTo(cx - 30, cy - 30);
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(cx + 35, cy - 10);
        ctx.lineTo(cx + 75, cy - 50);
        ctx.lineTo(cx + 30, cy - 30);
        ctx.fill();

        // Head and snout
        ctx.fillStyle = '#22c55e';
        ctx.fillRect(cx - 28, cy - 48, 56, 36);

        // Horns
        ctx.fillStyle = '#fef08a';
        ctx.fillRect(cx - 34, cy - 65, 8, 20);
        ctx.fillRect(cx + 26, cy - 65, 8, 20);

        // Red draconic eyes
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(cx - 20, cy - 36, 12, 8);
        ctx.fillRect(cx + 8, cy - 36, 12, 8);
        ctx.fillStyle = '#000000';
        ctx.fillRect(cx - 16, cy - 36, 4, 8);
        ctx.fillRect(cx + 12, cy - 36, 4, 8);

        // Fangs
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(cx - 18, cy - 14, 6, 6);
        ctx.fillRect(cx + 12, cy - 14, 6, 6);
        break;
      }

      case 'boss':
      case 'boss_true': {
        // Dragonlord (龍王)
        // Robed wizard archmage form with sinister draconic features
        ctx.fillStyle = '#4a044e'; // Deep royal purple robe
        ctx.beginPath();
        ctx.moveTo(cx, cy - 50);
        ctx.lineTo(cx + 55, cy + 46);
        ctx.lineTo(cx - 55, cy + 46);
        ctx.closePath();
        ctx.fill();

        // Dragonlord golden cape collar
        ctx.fillStyle = '#f59e0b';
        ctx.fillRect(cx - 30, cy - 25, 60, 8);

        // Head / Mask
        ctx.fillStyle = '#1e1b4b';
        ctx.fillRect(cx - 20, cy - 55, 40, 32);

        // Golden demon crown / horns
        ctx.fillStyle = '#fbbf24';
        ctx.fillRect(cx - 24, cy - 70, 8, 22);
        ctx.fillRect(cx + 16, cy - 70, 8, 22);
        ctx.fillRect(cx - 12, cy - 62, 24, 10);

        // Menacing Crimson Eyes
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(cx - 14, cy - 44, 9, 6);
        ctx.fillRect(cx + 5, cy - 44, 9, 6);
        ctx.fillStyle = '#fef08a';
        ctx.fillRect(cx - 11, cy - 43, 3, 4);
        ctx.fillRect(cx + 8, cy - 43, 3, 4);

        // Dark magic orb / Scepter
        ctx.fillStyle = '#b45309';
        ctx.fillRect(cx + 42, cy - 60, 6, 85);
        ctx.fillStyle = '#9333ea';
        ctx.beginPath();
        ctx.arc(cx + 45, cy - 64, 12, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#f43f5e';
        ctx.beginPath();
        ctx.arc(cx + 45, cy - 64, 6, 0, Math.PI * 2);
        ctx.fill();

        // Aura wisps
        ctx.fillStyle = 'rgba(168, 85, 247, 0.2)';
        ctx.beginPath();
        ctx.arc(cx, cy, 68, 0, Math.PI * 2);
        ctx.fill();
        break;
      }
    }
  }

  private drawCombatFx(ctx: CanvasRenderingContext2D, fx: CombatFx, mx: number, my: number) {
    const elapsed = Date.now() - fx.startTime;
    const progress = Math.min(1, elapsed / fx.duration);

    if (fx.type === 'slash') {
      // Slashing light blade arc
      ctx.save();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 6;
      ctx.beginPath();
      const slashProgress = progress * 100;
      ctx.moveTo(mx - 50 + slashProgress, my - 50 + slashProgress);
      ctx.lineTo(mx - 30 + slashProgress, my - 30 + slashProgress);
      ctx.stroke();

      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(mx + 50 - slashProgress, my - 50 + slashProgress);
      ctx.lineTo(mx + 30 - slashProgress, my - 30 + slashProgress);
      ctx.stroke();
      ctx.restore();
    } else if (fx.type === 'spell_fire') {
      // Fire explosion circles
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2 + progress * 4;
        const dist = progress * 45;
        const fxX = mx + Math.cos(angle) * dist;
        const fxY = my + Math.sin(angle) * dist;

        ctx.fillStyle = i % 2 === 0 ? '#ef4444' : '#f59e0b';
        ctx.beginPath();
        ctx.arc(fxX, fxY, 10 * (1 - progress * 0.5), 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (fx.type === 'heal') {
      // Ascending Green Holy Crosses
      ctx.fillStyle = '#22c55e';
      const lift = progress * 40;
      const crosses = [
        { x: mx - 25, y: my + 10 - lift },
        { x: mx + 25, y: my + 5 - lift },
        { x: mx, y: my - 15 - lift },
      ];
      crosses.forEach((c) => {
        ctx.fillRect(c.x - 3, c.y - 8, 6, 16);
        ctx.fillRect(c.x - 8, c.y - 3, 16, 6);
      });
    }

    // Damage Number Popup
    if (fx.value !== undefined) {
      ctx.save();
      ctx.font = 'bold 22px monospace';
      ctx.fillStyle = typeof fx.value === 'number' && fx.value < 0 ? '#22c55e' : '#ef4444';
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 4;
      const text = `${fx.value}`;
      const textY = my - 30 - progress * 25;
      ctx.strokeText(text, mx - 12, textY);
      ctx.fillText(text, mx - 12, textY);
      ctx.restore();
    }
  }
}
