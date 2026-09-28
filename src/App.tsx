import React, { useState, useEffect, useRef, useCallback } from 'react';
import { HeroState, Monster, Spell, ShopItem, GameState } from './types/game';
import { DEFAULT_MAP, INITIAL_HERO, MONSTERS, SPELLS, MAP_W, MAP_H } from './data/gameData';
import { soundEngine } from './audio/soundEngine';
import { PixelRenderer, CombatFx } from './utils/pixelRenderer';
import { HeaderNav } from './components/HeaderNav';
import { RetroDpad } from './components/RetroDpad';
import { GameGuideModal } from './components/GameGuideModal';
import { StatusModal } from './components/StatusModal';
import { ShopModal } from './components/ShopModal';
import { Sparkles, Trophy, Skull, RotateCcw, Volume2, Shield, Sword } from 'lucide-react';

const STORAGE_KEY = 'dq1_tribute_save_v1';

export default function App() {
  // Game states
  const [gameState, setGameState] = useState<GameState>('MAP');
  const [hero, setHero] = useState<HeroState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return { ...INITIAL_HERO, ...JSON.parse(saved) };
      }
    } catch {
      // fallback
    }
    return { ...INITIAL_HERO };
  });

  const [currentEnemy, setCurrentEnemy] = useState<Monster | null>(null);
  const [messages, setMessages] = useState<string[]>([
    '歡迎來到亞雷夫加爾德大陸。',
    '前往南方魔王城，擊倒「龍王」拯救世界吧！',
  ]);

  // Audio & Display preferences
  const [isSoundMuted, setIsSoundMuted] = useState<boolean>(() => soundEngine.getIsMuted());
  const [isBgmMuted, setIsBgmMuted] = useState<boolean>(true); // start bgm muted by default
  const [isCrtEnabled, setIsCrtEnabled] = useState<boolean>(true);

  // Modals
  const [isGuideOpen, setIsGuideOpen] = useState<boolean>(false);
  const [isStatusOpen, setIsStatusOpen] = useState<boolean>(false);
  const [isShopOpen, setIsShopOpen] = useState<boolean>(false);

  // Sub-menus
  const [isSpellMenuOpen, setIsSpellMenuOpen] = useState<boolean>(false);

  // Visual effects
  const [stepToggle, setStepToggle] = useState<boolean>(false);
  const [combatFx, setCombatFx] = useState<CombatFx | null>(null);
  const [isEnemyShaking, setIsEnemyShaking] = useState<boolean>(false);
  const [isHeroDamageFlash, setIsHeroDamageFlash] = useState<boolean>(false);

  // Canvas refs
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rendererRef = useRef<PixelRenderer>(new PixelRenderer());
  const msgBoxRef = useRef<HTMLDivElement | null>(null);

  // Scroll message log
  const logMessage = useCallback((text: string) => {
    setMessages([text]);
  }, []);

  const appendMessage = useCallback((text: string) => {
    setMessages((prev) => [...prev, text]);
  }, []);

  useEffect(() => {
    if (msgBoxRef.current) {
      msgBoxRef.current.scrollTop = msgBoxRef.current.scrollHeight;
    }
  }, [messages]);

  // Toggle audio
  const handleToggleSound = () => {
    const next = !isSoundMuted;
    setIsSoundMuted(next);
    soundEngine.setMute(next);
  };

  const handleToggleBgm = () => {
    const next = !isBgmMuted;
    setIsBgmMuted(next);
    soundEngine.setBgmMute(next);
    if (!next) {
      if (gameState === 'BATTLE') {
        soundEngine.playBgm(currentEnemy?.sprite === 'boss' ? 'boss' : 'battle');
      } else {
        soundEngine.playBgm('overworld');
      }
    } else {
      soundEngine.stopBgm();
    }
  };

  const handleToggleCrt = () => {
    setIsCrtEnabled((prev) => !prev);
    soundEngine.playCursor();
  };

  // Save / Reset
  const handleSaveGame = useCallback(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(hero));
      soundEngine.playSelect();
      appendMessage('📜 國王：「冒險之書已為你妥善記載！願羅德之神與你同在！」');
    } catch {
      appendMessage('無法記錄冒險之書。');
    }
  }, [hero, appendMessage]);

  const handleResetGame = () => {
    if (window.confirm('確定要清除所有進度，重返最初的起點嗎？')) {
      localStorage.removeItem(STORAGE_KEY);
      setHero({ ...INITIAL_HERO });
      setGameState('MAP');
      setCurrentEnemy(null);
      setMessages([
        '冒險之書已被重置。',
        '歡迎來到亞雷夫加爾德大陸。前往南方魔王城拯救世界吧！',
      ]);
      soundEngine.playSelect();
    }
  };

  // Canvas drawing loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (gameState === 'BATTLE' && currentEnemy) {
      rendererRef.current.renderBattle(
        ctx,
        canvas.width,
        canvas.height,
        currentEnemy,
        combatFx,
        isEnemyShaking
      );
    } else {
      rendererRef.current.renderMap(
        ctx,
        canvas.width,
        canvas.height,
        DEFAULT_MAP,
        hero,
        stepToggle
      );
    }
  }, [gameState, hero, currentEnemy, stepToggle, combatFx, isEnemyShaking]);

  // Update BGM on state changes
  useEffect(() => {
    if (isBgmMuted || isSoundMuted) return;
    if (gameState === 'BATTLE') {
      soundEngine.playBgm(currentEnemy?.sprite === 'boss' ? 'boss' : 'battle');
    } else if (gameState === 'MAP') {
      soundEngine.playBgm('overworld');
    } else {
      soundEngine.stopBgm();
    }
  }, [gameState, currentEnemy, isBgmMuted, isSoundMuted]);

  // --- Exploration & Movement ---
  const startBattle = useCallback((enemyId: number) => {
    soundEngine.playEncounter();
    const proto = MONSTERS[enemyId] || MONSTERS[0];
    const enemyCopy: Monster = JSON.parse(JSON.stringify(proto));

    setCurrentEnemy(enemyCopy);
    setGameState('BATTLE');
    setIsSpellMenuOpen(false);

    logMessage(`遭遇了 ${enemyCopy.nameZh}！`);
  }, [logMessage]);

  const checkRandomEncounter = useCallback((tile: number, currentHero: HeroState) => {
    // 樹林遇敵率 30%，草地 18%
    const rate = tile === 1 ? 0.30 : 0.18;
    if (Math.random() < rate) {
      let enemyIndex = 0;
      if (currentHero.lv >= 6 && Math.random() < 0.4) {
        enemyIndex = 4; // 巨龍 (Dragon)
      } else if (currentHero.lv >= 4 && Math.random() < 0.45) {
        enemyIndex = 3; // 暗黑騎士 (Knight)
      } else if (currentHero.lv >= 2 && Math.random() < 0.6) {
        enemyIndex = 2; // 骷髏兵 (Skeleton)
      } else if (Math.random() < 0.4) {
        enemyIndex = 1; // 史萊姆貝斯 (Red Slime)
      } else {
        enemyIndex = 0; // 史萊姆 (Slime)
      }

      startBattle(enemyIndex);
    }
  }, [startBattle]);

  const moveHero = useCallback((dx: number, dy: number) => {
    if (gameState !== 'MAP') return;

    soundEngine.playStep();
    setStepToggle((prev) => !prev);

    // Direction
    let dir: 'up' | 'down' | 'left' | 'right' = hero.direction;
    if (dy < 0) dir = 'up';
    else if (dy > 0) dir = 'down';
    else if (dx < 0) dir = 'left';
    else if (dx > 0) dir = 'right';

    const nx = hero.x + dx;
    const ny = hero.y + dy;

    // Check bounds
    if (nx < 0 || nx >= MAP_W || ny < 0 || ny >= MAP_H) return;

    const tile = DEFAULT_MAP[ny]?.[nx];

    // Mountain check (2: Mountain)
    if (tile === 2) {
      soundEngine.playCancel();
      logMessage('高聳的山脈擋住了去路！');
      setHero((prev) => ({ ...prev, direction: dir }));
      return;
    }

    // Step state
    const nextSteps = hero.stepsCount + 1;
    let nextHp = hero.hp;

    // Check Poison Marsh (6: Swamp)
    if (tile === 6) {
      nextHp = Math.max(1, hero.hp - 2);
      soundEngine.playHeroDamage();
      setIsHeroDamageFlash(true);
      setTimeout(() => setIsHeroDamageFlash(false), 200);
      logMessage('踏入了毒沼！劇毒侵蝕身體受到 2 點傷害！');
    }

    const updatedHero: HeroState = {
      ...hero,
      x: nx,
      y: ny,
      direction: dir,
      hp: nextHp,
      stepsCount: nextSteps,
    };

    setHero(updatedHero);

    // Tile specific interactions
    if (tile === 3) {
      // Radatome Castle
      soundEngine.playHeal();
      logMessage('來到【拉達托姆城】。國王為你回復所有 HP/MP 並保存冒險！');
      setHero((prev) => ({
        ...prev,
        hp: prev.maxHp,
        mp: prev.maxMp,
      }));
      handleSaveGame();
    } else if (tile === 7) {
      // Radatome Town Shop
      soundEngine.playConfirm();
      logMessage('抵達【拉達托姆鎮】。商販們正向你兜售物資。');
      setIsShopOpen(true);
    } else if (tile === 5 && !updatedHero.hasLotoSword) {
      // Cave of Erdrick
      soundEngine.playTreasure();
      logMessage('✨ 在洞窟深處發現了傳說中的【羅德之劍】！攻擊力大幅提升 +15！');
      setHero((prev) => ({
        ...prev,
        hasLotoSword: true,
        atk: prev.atk + 15,
        equippedWeapon: '羅德之劍 (Erdrick Sword +15)',
      }));
    } else if (tile === 4) {
      // Charlock Castle -> Dragonlord Boss Battle!
      startBattle(5);
    } else if (tile !== 6) {
      checkRandomEncounter(tile, updatedHero);
    }
  }, [gameState, hero, handleSaveGame, logMessage, checkRandomEncounter, startBattle]);

  const interact = useCallback(() => {
    if (gameState !== 'MAP') return;

    soundEngine.playConfirm();
    const tile = DEFAULT_MAP[hero.y]?.[hero.x];
    if (tile === 3) {
      soundEngine.playHeal();
      setHero((prev) => ({
        ...prev,
        hp: prev.maxHp,
        mp: prev.maxMp,
      }));
      logMessage('國王：「勇敢的戰士啊！願羅德之光庇佑著你！」(HP/MP 已全滿)');
    } else if (tile === 7) {
      setIsShopOpen(true);
    } else if (tile === 5) {
      if (hero.hasLotoSword) {
        logMessage('洞窟石碑上刻著：「繼承羅德血脈之人，光之玉將驅散黑暗。」');
      } else {
        soundEngine.playTreasure();
        logMessage('✨ 在洞窟深處發現了傳說中的【羅德之劍】！攻擊力大幅提升 +15！');
        setHero((prev) => ({
          ...prev,
          hasLotoSword: true,
          atk: prev.atk + 15,
          equippedWeapon: '羅德之劍 (Erdrick Sword +15)',
        }));
      }
    } else {
      logMessage('腳下是一片荒野。繼續尋找羅德之劍與魔王城吧！');
    }
  }, [gameState, hero, logMessage]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // If modal is open, let Esc close it
      if (e.key === 'Escape') {
        setIsGuideOpen(false);
        setIsStatusOpen(false);
        setIsShopOpen(false);
        setIsSpellMenuOpen(false);
        return;
      }

      if (isGuideOpen || isStatusOpen || isShopOpen) return;

      if (gameState === 'MAP') {
        if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
          e.preventDefault();
          moveHero(0, -1);
        } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
          e.preventDefault();
          moveHero(0, 1);
        } else if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
          e.preventDefault();
          moveHero(-1, 0);
        } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
          e.preventDefault();
          moveHero(1, 0);
        } else if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          interact();
        } else if (e.key === 'm' || e.key === 'M') {
          setIsStatusOpen(true);
        } else if (e.key === 'g' || e.key === 'G') {
          setIsGuideOpen(true);
        }
      } else if (gameState === 'BATTLE') {
        if (e.key === '1') {
          heroAttack();
        } else if (e.key === '2') {
          setIsSpellMenuOpen((prev) => !prev);
        } else if (e.key === '3') {
          heroUseHerb();
        } else if (e.key === '4') {
          heroRun();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, isGuideOpen, isStatusOpen, isShopOpen, moveHero, interact]);

  // --- Battle Mechanics ---
  const endBattle = useCallback(() => {
    setGameState('MAP');
    setCurrentEnemy(null);
    setIsSpellMenuOpen(false);
    setCombatFx(null);
    setIsEnemyShaking(false);
  }, []);

  const checkLevelUp = useCallback((currentHero: HeroState): HeroState => {
    let updated = { ...currentHero };
    const nextLvExp = updated.lv * 15;

    if (updated.exp >= nextLvExp) {
      soundEngine.playLevelUp();
      updated.lv += 1;
      const hpGain = 8;
      const mpGain = 4;
      const atkGain = 4;
      const defGain = 3;

      updated.maxHp += hpGain;
      updated.hp = updated.maxHp;
      updated.maxMp += mpGain;
      updated.mp = updated.maxMp;
      updated.atk += atkGain;
      updated.def += defGain;

      appendMessage(`🎉 等級提升至 Lv.${updated.lv}！各項能力全面提高！`);

      // Spell unlocks
      if (updated.lv === 2) appendMessage('✨ 習得了火炎咒文【吉拉 (Fire)】！');
      if (updated.lv === 4) appendMessage('✨ 習得了瞬間移動咒文【盧拉 (Return)】！');
      if (updated.lv === 6) appendMessage('✨ 習得了強效回復咒文【貝霍伊米 (Healmore)】！');
      if (updated.lv === 8) appendMessage('✨ 習得了究極劫火咒文【貝基拉瑪 (Flame)】！');
    }
    return updated;
  }, [appendMessage]);

  const enemyTurn = useCallback(() => {
    setTimeout(() => {
      if (!currentEnemy || currentEnemy.hp <= 0) return;

      soundEngine.playHeroDamage();
      setIsHeroDamageFlash(true);
      setTimeout(() => setIsHeroDamageFlash(false), 300);

      // Check for special attacks
      let enemyDmg = 0;
      let attackName = `${currentEnemy.nameZh} 發動猛烈襲擊！`;

      if (currentEnemy.fireBreathChance && Math.random() < currentEnemy.fireBreathChance) {
        soundEngine.playAttack();
        enemyDmg = Math.max(8, Math.floor(currentEnemy.atk * 1.1 + Math.random() * 6));
        attackName = `🔥 ${currentEnemy.nameZh} 噴出了狂暴熾熱的烈焰！`;
      } else {
        enemyDmg = Math.max(1, Math.floor(currentEnemy.atk - hero.def / 2 + (Math.random() * 3 - 1)));
      }

      setHero((prev) => {
        const remainingHp = prev.hp - enemyDmg;
        appendMessage(`${attackName} 勇者受到 ${enemyDmg} 點傷害！`);

        if (remainingHp <= 0) {
          soundEngine.playGameOver();
          setGameState('GAMEOVER');
          appendMessage('💀 勇者倒下了... 亞雷夫加爾德籠罩在永恆的黑暗中。');
        }
        return {
          ...prev,
          hp: Math.max(0, remainingHp),
        };
      });
    }, 600);
  }, [currentEnemy, hero.def, appendMessage]);

  const checkBattleStatus = useCallback((enemyRemainingHp: number) => {
    if (!currentEnemy) return;

    if (enemyRemainingHp <= 0) {
      // Enemy defeated
      if (currentEnemy.sprite === 'boss') {
        soundEngine.playVictory();
        setGameState('VICTORY');
        logMessage('👑 龍王倒下了！和平再次回到了亞雷夫加爾德！<br>你成為了名垂青史的真正勇者！感謝遊玩！');
        return;
      }

      soundEngine.playVictory();
      logMessage(`擊倒了 ${currentEnemy.nameZh}！獲得 ${currentEnemy.exp} EXP，${currentEnemy.gold} 金幣！`);

      setHero((prev) => {
        let updated: HeroState = {
          ...prev,
          exp: prev.exp + currentEnemy.exp,
          gold: prev.gold + currentEnemy.gold,
          monstersSlain: prev.monstersSlain + 1,
        };
        updated = checkLevelUp(updated);
        return updated;
      });

      setTimeout(endBattle, 1500);
    } else {
      enemyTurn();
    }
  }, [currentEnemy, checkLevelUp, endBattle, enemyTurn, logMessage]);

  const heroAttack = () => {
    if (gameState !== 'BATTLE' || !currentEnemy) return;

    soundEngine.playAttack();
    const damage = Math.max(1, Math.floor(hero.atk - currentEnemy.def / 2 + (Math.random() * 4 - 2)));
    const updatedHp = currentEnemy.hp - damage;

    // Trigger visual FX
    setCombatFx({
      type: 'slash',
      startTime: Date.now(),
      duration: 350,
      value: damage,
    });
    setIsEnemyShaking(true);
    setTimeout(() => {
      soundEngine.playHit();
      setIsEnemyShaking(false);
    }, 200);

    setCurrentEnemy((prev) => (prev ? { ...prev, hp: updatedHp } : null));
    logMessage(`勇者發動攻擊！對 ${currentEnemy.nameZh} 造成了 ${damage} 點傷害！`);

    checkBattleStatus(updatedHp);
  };

  const castSpell = (spell: Spell) => {
    if (gameState !== 'BATTLE' || !currentEnemy) return;

    if (hero.mp < spell.mpCost) {
      soundEngine.playCancel();
      appendMessage(`MP 不足，無法詠唱 ${spell.nameZh}！`);
      return;
    }

    soundEngine.playSpellCast();
    setIsSpellMenuOpen(false);

    setHero((prev) => ({
      ...prev,
      mp: prev.mp - spell.mpCost,
    }));

    if (spell.type === 'heal') {
      soundEngine.playHeal();
      const healAmount = spell.power + Math.floor(Math.random() * 6);
      setHero((prev) => ({
        ...prev,
        hp: Math.min(prev.maxHp, prev.hp + healAmount),
      }));

      setCombatFx({
        type: 'heal',
        startTime: Date.now(),
        duration: 400,
        value: `+${healAmount}`,
      });

      logMessage(`勇者詠唱了【${spell.nameZh}】！HP 回復了 ${healAmount} 點！`);
      enemyTurn();
    } else if (spell.type === 'attack') {
      const spellDmg = spell.power + Math.floor(Math.random() * 8);
      const updatedHp = currentEnemy.hp - spellDmg;

      setCombatFx({
        type: 'spell_fire',
        startTime: Date.now(),
        duration: 400,
        value: spellDmg,
      });
      setIsEnemyShaking(true);
      setTimeout(() => setIsEnemyShaking(false), 250);

      setCurrentEnemy((prev) => (prev ? { ...prev, hp: updatedHp } : null));
      logMessage(`勇者詠唱了【${spell.nameZh}】！烈焰對敵方造成了 ${spellDmg} 點傷害！`);

      checkBattleStatus(updatedHp);
    } else if (spell.type === 'utility' && spell.id === 'rula') {
      // Teleport back to Radatome Castle
      logMessage('勇者詠唱了【盧拉】！空間扭曲，瞬間返回拉達托姆城！');
      setHero((prev) => ({ ...prev, x: 1, y: 1 }));
      endBattle();
    }
  };

  const heroUseHerb = () => {
    if (hero.herbs > 0) {
      soundEngine.playHeal();
      const heal = 24 + Math.floor(Math.random() * 5);
      setHero((prev) => ({
        ...prev,
        herbs: prev.herbs - 1,
        hp: Math.min(prev.maxHp, prev.hp + heal),
      }));

      logMessage(`使用了【藥草】！HP 回復了 ${heal} 點！`);
      if (gameState === 'BATTLE') {
        enemyTurn();
      }
    } else {
      soundEngine.playCancel();
      appendMessage('背包裡已經沒有藥草了！');
    }
  };

  const heroUseWing = () => {
    if (hero.wings > 0) {
      soundEngine.playConfirm();
      setHero((prev) => ({
        ...prev,
        wings: prev.wings - 1,
        x: 1,
        y: 1,
      }));
      logMessage('拋出了【奇美拉之翼】！宛如插上雙翼，飛回了拉達托姆城！');
      setIsStatusOpen(false);
      if (gameState === 'BATTLE') {
        endBattle();
      }
    } else {
      soundEngine.playCancel();
      appendMessage('背包裡沒有奇美拉之翼！');
    }
  };

  const heroRun = () => {
    if (!currentEnemy) return;

    if (currentEnemy.sprite === 'boss') {
      soundEngine.playCancel();
      logMessage('面對魔王龍王，勇者無法逃跑！');
      enemyTurn();
      return;
    }

    if (Math.random() < 0.6) {
      soundEngine.playRun();
      logMessage('勇者成功逃跑了！');
      setTimeout(endBattle, 800);
    } else {
      soundEngine.playCancel();
      logMessage('逃跑失敗，露出了破綻！');
      enemyTurn();
    }
  };

  // Shop purchase
  const handleBuyItem = (item: ShopItem) => {
    if (hero.gold < item.cost) {
      soundEngine.playCancel();
      return;
    }

    soundEngine.playTreasure();

    setHero((prev) => {
      const nextGold = prev.gold - item.cost;
      if (item.id === 'herb') {
        return { ...prev, gold: nextGold, herbs: prev.herbs + 1 };
      }
      if (item.id === 'wing') {
        return { ...prev, gold: nextGold, wings: prev.wings + 1 };
      }
      if (item.type === 'weapon' && item.atkBonus) {
        return {
          ...prev,
          gold: nextGold,
          atk: prev.atk + item.atkBonus,
          equippedWeapon: item.name,
        };
      }
      if (item.type === 'armor' && item.defBonus) {
        return {
          ...prev,
          gold: nextGold,
          def: prev.def + item.defBonus,
          equippedArmor: item.name,
        };
      }
      return { ...prev, gold: nextGold };
    });

    logMessage(`成功購入了【${item.name}】！`);
  };

  return (
    <div className={`min-h-screen flex flex-col items-center justify-between text-white relative overflow-x-hidden ${isCrtEnabled ? 'crt-overlay' : ''}`}>
      {/* Top Bar Contract compliant navigation */}
      <HeaderNav
        gameState={gameState}
        onOpenGuide={() => setIsGuideOpen(true)}
        onOpenStats={() => setIsStatusOpen(true)}
        onSaveGame={handleSaveGame}
        onResetGame={handleResetGame}
        isSoundMuted={isSoundMuted}
        onToggleSound={handleToggleSound}
        isBgmMuted={isBgmMuted}
        onToggleBgm={handleToggleBgm}
        isCrtEnabled={isCrtEnabled}
        onToggleCrt={handleToggleCrt}
      />

      {/* Main Game Frame */}
      <main className="w-full max-w-lg px-2 sm:px-4 py-2 flex flex-col items-center">
        {/* Retro Status Bar Window */}
        <div className="w-full dq-frame px-3 py-2 mb-2 flex items-center justify-between text-xs sm:text-sm font-bold bg-black">
          <div className="flex items-center gap-1.5 text-amber-400">
            <span>勇者</span>
            <span className="font-mono">Lv.{hero.lv}</span>
          </div>

          <div className="flex items-center gap-1 text-stone-200">
            <span className="text-red-400">HP:</span>
            <span className="font-mono">{hero.hp}</span>/
            <span className="font-mono text-stone-400">{hero.maxHp}</span>
          </div>

          <div className="flex items-center gap-1 text-stone-200">
            <span className="text-sky-400">MP:</span>
            <span className="font-mono">{hero.mp}</span>/
            <span className="font-mono text-stone-400">{hero.maxMp}</span>
          </div>

          <div className="flex items-center gap-1 text-yellow-400 font-mono">
            <span>G:</span>
            <span>{hero.gold}</span>
          </div>
        </div>

        {/* Game Canvas Container */}
        <div className={`relative dq-frame p-1 bg-black overflow-hidden ${isHeroDamageFlash ? 'flash-animation' : ''} ${isEnemyShaking ? 'shake-animation' : ''}`}>
          <canvas
            ref={canvasRef}
            width={480}
            height={320}
            className="w-full h-auto pixelated block bg-black rounded"
          />

          {/* Quick HUD overlay in battle */}
          {gameState === 'BATTLE' && currentEnemy && (
            <div className="absolute top-3 left-3 bg-black/85 border-2 border-white px-2.5 py-1 text-xs font-bold text-white rounded">
              <div className="text-amber-400">{currentEnemy.nameZh}</div>
              <div className="text-[11px] text-stone-300 font-mono">
                HP: {Math.max(0, currentEnemy.hp)} / {currentEnemy.maxHp}
              </div>
            </div>
          )}
        </div>

        {/* Narrative Dialog Box */}
        <div
          ref={msgBoxRef}
          className="w-full dq-frame p-3 my-2 h-24 overflow-y-auto text-xs sm:text-sm leading-relaxed bg-black text-stone-100"
        >
          {messages.map((msg, i) => (
            <div key={i} className="mb-1" dangerouslySetInnerHTML={{ __html: msg }} />
          ))}
        </div>

        {/* Action Controls Area */}
        <div className="w-full">
          {gameState === 'BATTLE' ? (
            <div>
              {/* Battle Commands */}
              {!isSpellMenuOpen ? (
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={heroAttack}
                    className="dq-frame py-2.5 px-3 flex items-center justify-center gap-1.5 font-bold text-sm bg-black hover:bg-stone-800 active:bg-stone-700 cursor-pointer text-white"
                  >
                    <span>⚔️ 攻擊</span>
                    <span className="text-[10px] text-stone-400">(Fight: 1)</span>
                  </button>

                  <button
                    onClick={() => {
                      soundEngine.playCursor();
                      setIsSpellMenuOpen(true);
                    }}
                    className="dq-frame py-2.5 px-3 flex items-center justify-center gap-1.5 font-bold text-sm bg-black hover:bg-stone-800 active:bg-stone-700 cursor-pointer text-white"
                  >
                    <span>✨ 咒文</span>
                    <span className="text-[10px] text-stone-400">(Spell: 2)</span>
                  </button>

                  <button
                    onClick={heroUseHerb}
                    className="dq-frame py-2.5 px-3 flex items-center justify-center gap-1.5 font-bold text-sm bg-black hover:bg-stone-800 active:bg-stone-700 cursor-pointer text-white"
                  >
                    <span>🧪 藥草 ({hero.herbs})</span>
                    <span className="text-[10px] text-stone-400">(3)</span>
                  </button>

                  <button
                    onClick={heroRun}
                    className="dq-frame py-2.5 px-3 flex items-center justify-center gap-1.5 font-bold text-sm bg-black hover:bg-stone-800 active:bg-stone-700 cursor-pointer text-white"
                  >
                    <span>💨 逃跑</span>
                    <span className="text-[10px] text-stone-400">(Run: 4)</span>
                  </button>
                </div>
              ) : (
                /* Spell Sub-menu */
                <div className="space-y-1.5">
                  <div className="grid grid-cols-2 gap-2">
                    {SPELLS.filter((s) => hero.lv >= s.requiredLv).map((spell) => (
                      <button
                        key={spell.id}
                        disabled={hero.mp < spell.mpCost}
                        onClick={() => castSpell(spell)}
                        className="dq-frame py-2 px-2 flex flex-col items-start bg-black hover:bg-stone-800 active:bg-stone-700 disabled:opacity-40 cursor-pointer text-white text-xs"
                      >
                        <div className="font-bold text-stone-100 flex items-center justify-between w-full">
                          <span>{spell.nameZh}</span>
                          <span className="text-amber-400 font-mono text-[11px]">{spell.mpCost} MP</span>
                        </div>
                        <div className="text-[10px] text-stone-400 truncate w-full">{spell.description}</div>
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => {
                      soundEngine.playCursor();
                      setIsSpellMenuOpen(false);
                    }}
                    className="w-full dq-frame py-1.5 text-center font-bold text-xs bg-stone-900 hover:bg-stone-800 cursor-pointer"
                  >
                    ◀ 返回戰鬥指令
                  </button>
                </div>
              )}
            </div>
          ) : gameState === 'GAMEOVER' ? (
            /* Game Over Screen Controls */
            <div className="dq-frame p-4 text-center bg-black space-y-3">
              <div className="text-red-500 font-bold text-base flex items-center justify-center gap-2">
                <Skull className="w-5 h-5" /> 勇者倒下了
              </div>
              <p className="text-xs text-stone-400">
                國王：「勇者啊！亞雷夫加爾德的黎明尚未到來，請重新站起來！」
              </p>
              <div className="flex gap-2 justify-center">
                <button
                  onClick={() => {
                    soundEngine.playHeal();
                    // revive at castle with half gold
                    setHero((prev) => ({
                      ...prev,
                      x: 1,
                      y: 1,
                      hp: prev.maxHp,
                      mp: prev.maxMp,
                      gold: Math.floor(prev.gold / 2),
                    }));
                    setGameState('MAP');
                    logMessage('國王以神聖祝福使你甦醒於拉達托姆城！失去了半數金幣。');
                  }}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded border border-amber-300 cursor-pointer"
                >
                  在王城甦醒復活
                </button>
                <button
                  onClick={handleResetGame}
                  className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-300 font-bold text-xs rounded border border-stone-600 cursor-pointer"
                >
                  重置全新冒險
                </button>
              </div>
            </div>
          ) : gameState === 'VICTORY' ? (
            /* Victory Screen Controls */
            <div className="dq-frame-gold p-4 text-center bg-black space-y-3">
              <div className="text-amber-400 font-bold text-base flex items-center justify-center gap-2">
                <Trophy className="w-5 h-5" /> 亞雷夫加爾德的救世主
              </div>
              <p className="text-xs text-stone-300 leading-relaxed">
                光之玉的光芒驅散了深邃的黑暗，魔王龍王灰飛煙滅！
                國王與萬民歡呼你的名字，傳說中的大勇者！
              </p>
              <button
                onClick={() => {
                  soundEngine.playConfirm();
                  setGameState('MAP');
                  setHero((prev) => ({ ...prev, x: 1, y: 1 }));
                  logMessage('凱旋歸來！和平的大陸任你自由徜徉！');
                }}
                className="px-5 py-2 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded border-2 border-amber-300 cursor-pointer"
              >
                繼續探索世界
              </button>
            </div>
          ) : (
            /* Overworld Exploration Controls (D-Pad) */
            <RetroDpad
              onMove={moveHero}
              onInteract={interact}
              disabled={gameState !== 'MAP'}
            />
          )}
        </div>
      </main>

      {/* Footer information */}
      <footer className="w-full text-center py-2 text-[11px] text-stone-500 select-none">
        致敬 1986 年經典 RPG 始祖《勇者鬥惡龍 I》· Alefgard 冒險復刻版
      </footer>

      {/* Modals */}
      <GameGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />

      <StatusModal
        isOpen={isStatusOpen}
        onClose={() => setIsStatusOpen(false)}
        hero={hero}
        onUseHerb={heroUseHerb}
        onUseWing={heroUseWing}
      />

      <ShopModal
        isOpen={isShopOpen}
        onClose={() => setIsShopOpen(false)}
        hero={hero}
        onBuyItem={handleBuyItem}
      />
    </div>
  );
}
