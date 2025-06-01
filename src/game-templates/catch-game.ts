import * as Phaser from 'phaser';
import { AILearningAssistant } from '@/services/ai-assistant';

export interface CatchGameConfig {
  // 基礎配置
  objectType: string;        // 掉落物類型 (水果/星星/愛心等)
  objectEmoji: string;       // 顯示的表情符號
  objectColor: string;       // 顏色名稱
  catcherType: string;       // 接取工具類型
  catcherEmoji: string;      // 接取工具表情符號
  
  // 遊戲行為配置
  behaviors: {
    fallPattern: 'straight' | 'zigzag' | 'floating' | 'spinning';
    fallSpeed: 'slow' | 'medium' | 'fast';
    spawnRate: 'low' | 'medium' | 'high';
    specialEffect?: string;    // 特殊效果描述
  };
  
  // 視覺效果配置
  visualEffects: {
    hasGlow?: boolean;         // 是否發光
    hasTrail?: boolean;        // 是否有軌跡
    isAnimated?: boolean;      // 是否有動畫
    backgroundColor?: string;   // 背景顏色
  };
  
  // AI 增強功能
  aiEnhanced?: {
    enabled: boolean;
    personalizedEncouragement?: boolean;
  };
}

export class CatchGameScene extends Phaser.Scene {
  private config: CatchGameConfig;
  private catcher!: Phaser.GameObjects.Container;
  private score: number = 0;
  private scoreText!: Phaser.GameObjects.Text;
  private particles?: Phaser.GameObjects.Particles.ParticleEmitter;
  
  // 速度映射
  private readonly SPEED_MAP = {
    slow: { fallTime: 4000, velocity: 150 },
    medium: { fallTime: 2500, velocity: 250 },
    fast: { fallTime: 1500, velocity: 400 }
  };
  
  // 生成率映射
  private readonly SPAWN_RATE_MAP = {
    low: 2500,
    medium: 1500,
    high: 800
  };
  
  // 顏色映射
  private readonly COLOR_MAP: Record<string, number> = {
    '紅色': 0xFF0000,
    '黃色': 0xFFFF00,
    '綠色': 0x00FF00,
    '藍色': 0x0000FF,
    '紫色': 0x800080,
    '橘色': 0xFFA500,
    '粉紅色': 0xFFC0CB,
    '彩虹': 0xFFFFFF, // 特殊處理
    '金色': 0xFFD700
  };

  constructor(config: CatchGameConfig) {
    super({ key: 'CatchGame' });
    this.config = config;
  }

  preload() {
    // 預載入粒子圖片（用於特效）
    this.load.image('spark', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAYAAAAGCAYAAADgzO9IAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAA7SURBVBhXY/wPBAxUACYoIwCqYgKqYAKqYAKqYAKqYAKqYAKqYAKqYAKqYAKqYAKqYAKqYAKqYPgPAAv2A/0Zs8DWAAAAAElFTkSuQmCC');
  }

  create() {
    // 設置背景
    this.setBackground();
    
    // 創建UI
    this.createUI();
    
    // 創建接取工具
    this.createCatcher();
    
    // 開始遊戲
    this.startSpawning();
    
    // 如果有特殊視覺效果，創建粒子系統
    if (this.config.visualEffects.hasGlow || this.config.visualEffects.hasTrail) {
      this.createParticleEffects();
    }
  }

  private setBackground() {
    const bgColor = this.config.visualEffects.backgroundColor || '#87CEEB';
    this.cameras.main.setBackgroundColor(bgColor);
    
    // 如果是夜空主題（接星星），添加星空背景
    if (this.config.objectType === '星星' || this.config.objectType === '月亮') {
      this.cameras.main.setBackgroundColor('#191970');
      this.createStarryBackground();
    }
  }

  private createStarryBackground() {
    // 創建簡單的星空效果
    for (let i = 0; i < 50; i++) {
      const star = this.add.circle(
        Phaser.Math.Between(0, this.scale.width),
        Phaser.Math.Between(0, this.scale.height / 2),
        Phaser.Math.Between(1, 3),
        0xFFFFFF
      );
      star.setAlpha(Phaser.Math.FloatBetween(0.3, 0.8));
      
      // 閃爍效果
      this.tweens.add({
        targets: star,
        alpha: { from: star.alpha, to: star.alpha * 0.3 },
        duration: Phaser.Math.Between(1000, 3000),
        yoyo: true,
        repeat: -1
      });
    }
  }

  private createUI() {
    // 標題
    const title = this.add.text(this.scale.width / 2, 30, 
      `接${this.config.objectType}遊戲！`, {
      fontSize: '28px',
      fontFamily: 'Arial',
      color: '#FFFFFF',
      stroke: '#000000',
      strokeThickness: 4
    }).setOrigin(0.5);

    // 分數
    this.scoreText = this.add.text(20, 20, '分數: 0', {
      fontSize: '24px',
      fontFamily: 'Arial',
      color: '#FFFFFF',
      stroke: '#000000',
      strokeThickness: 3
    });
  }

  private createCatcher() {
    this.catcher = this.add.container(this.scale.width / 2, this.scale.height - 60);
    
    // 創建接取工具的視覺表現
    const catcherEmoji = this.add.text(0, 0, this.config.catcherEmoji, {
      fontSize: '48px'
    }).setOrigin(0.5);
    
    // 如果是特殊的接取工具，添加額外效果
    if (this.config.catcherType === '魔法棒') {
      // 添加發光效果
      const glow = this.add.circle(0, 0, 40, 0xFFFFFF, 0.3);
      this.catcher.add(glow);
      
      this.tweens.add({
        targets: glow,
        scaleX: 1.2,
        scaleY: 1.2,
        alpha: 0.1,
        duration: 1000,
        yoyo: true,
        repeat: -1
      });
    }
    
    this.catcher.add(catcherEmoji);
    this.catcher.setSize(100, 100);
    
    // 控制方式
    this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
      const newX = Phaser.Math.Clamp(pointer.x, 50, this.scale.width - 50);
      
      // 平滑移動
      this.tweens.add({
        targets: this.catcher,
        x: newX,
        duration: 100,
        ease: 'Power2'
      });
    });
  }

  private startSpawning() {
    const spawnRate = this.SPAWN_RATE_MAP[this.config.behaviors.spawnRate];
    
    this.time.addEvent({
      delay: spawnRate,
      callback: this.spawnObject,
      callbackScope: this,
      loop: true
    });
  }

  private spawnObject() {
    const x = Phaser.Math.Between(50, this.scale.width - 50);
    const object = this.add.container(x, -50);
    
    // 創建物體視覺
    const emoji = this.add.text(0, 0, this.config.objectEmoji, {
      fontSize: '36px'
    }).setOrigin(0.5);
    
    // 處理彩虹色
    if (this.config.objectColor === '彩虹') {
      this.createRainbowEffect(emoji);
    }
    
    // 添加發光效果
    if (this.config.visualEffects.hasGlow || this.config.objectColor === '金色') {
      const glow = this.add.circle(0, 0, 25, 
        this.COLOR_MAP[this.config.objectColor] || 0xFFFFFF, 0.4);
      object.add(glow);
      
      this.tweens.add({
        targets: glow,
        scale: { from: 1, to: 1.3 },
        alpha: { from: 0.4, to: 0.1 },
        duration: 500,
        yoyo: true,
        repeat: -1
      });
    }
    
    object.add(emoji);
    object.setSize(50, 50);
    
    // 根據掉落模式移動物體
    this.animateFalling(object);
  }

  private animateFalling(object: Phaser.GameObjects.Container) {
    const speed = this.SPEED_MAP[this.config.behaviors.fallSpeed];
    const pattern = this.config.behaviors.fallPattern;
    
    switch (pattern) {
      case 'zigzag':
        // 之字形掉落
        const timeline = this.tweens.createTimeline();
        let currentX = object.x;
        const segments = 5;
        const segmentHeight = this.scale.height / segments;
        
        for (let i = 0; i < segments; i++) {
          const targetX = Phaser.Math.Between(50, this.scale.width - 50);
          timeline.add({
            targets: object,
            x: targetX,
            y: (i + 1) * segmentHeight,
            duration: speed.fallTime / segments,
            ease: 'Sine.inOut',
            onUpdate: () => this.checkCatch(object)
          });
        }
        
        timeline.play();
        timeline.on('complete', () => object.destroy());
        break;
        
      case 'floating':
        // 飄浮掉落
        this.tweens.add({
          targets: object,
          y: this.scale.height + 50,
          x: {
            value: object.x + Phaser.Math.Between(-100, 100),
            ease: 'Sine.inOut'
          },
          duration: speed.fallTime * 1.5,
          onUpdate: () => this.checkCatch(object),
          onComplete: () => object.destroy()
        });
        break;
        
      case 'spinning':
        // 旋轉掉落
        this.tweens.add({
          targets: object,
          y: this.scale.height + 50,
          angle: 360 * 3,
          duration: speed.fallTime,
          onUpdate: () => this.checkCatch(object),
          onComplete: () => object.destroy()
        });
        break;
        
      default:
        // 直線掉落
        this.tweens.add({
          targets: object,
          y: this.scale.height + 50,
          duration: speed.fallTime,
          onUpdate: () => this.checkCatch(object),
          onComplete: () => object.destroy()
        });
    }
  }

  private createRainbowEffect(text: Phaser.GameObjects.Text) {
    const colors = ['#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#0000FF', '#4B0082', '#9400D3'];
    let colorIndex = 0;
    
    this.time.addEvent({
      delay: 200,
      callback: () => {
        text.setColor(colors[colorIndex]);
        colorIndex = (colorIndex + 1) % colors.length;
      },
      loop: true
    });
  }

  private checkCatch(object: Phaser.GameObjects.Container) {
    if (!object.active) return;
    
    const distance = Phaser.Math.Distance.Between(
      object.x, object.y,
      this.catcher.x, this.catcher.y
    );
    
    if (distance < 60 && object.y > this.scale.height - 100) {
      this.handleCatch(object);
    }
  }

  private handleCatch(object: Phaser.GameObjects.Container) {
    object.destroy();
    
    // 更新分數
    this.score += 10;
    this.scoreText.setText(`分數: ${this.score}`);
    
    // 播放接住效果
    this.playSpecialEffect();
    
    // 顯示鼓勵
    this.showEncouragement();
  }

  private playSpecialEffect() {
    const effectType = this.config.behaviors.specialEffect;
    
    switch (effectType) {
      case '愛心爆炸':
        for (let i = 0; i < 10; i++) {
          const heart = this.add.text(
            this.catcher.x + Phaser.Math.Between(-50, 50),
            this.catcher.y,
            '❤️',
            { fontSize: '24px' }
          );
          
          this.tweens.add({
            targets: heart,
            y: heart.y - 100,
            x: heart.x + Phaser.Math.Between(-100, 100),
            alpha: 0,
            scale: 0,
            duration: 1000,
            onComplete: () => heart.destroy()
          });
        }
        break;
        
      case '星星閃爍':
        this.cameras.main.flash(200, 255, 215, 0);
        break;
        
      case '彩虹漣漪':
        const ripple = this.add.circle(this.catcher.x, this.catcher.y, 10, 0xFFFFFF, 0.5);
        this.tweens.add({
          targets: ripple,
          scale: 5,
          alpha: 0,
          duration: 500,
          onComplete: () => ripple.destroy()
        });
        break;
    }
  }

  private createParticleEffects() {
    // 創建粒子發射器用於軌跡效果
    // Phaser 3 的粒子系統需要更多配置，這裡簡化處理
  }

  private showEncouragement() {
    const encouragements = [
      '太棒了！', '接得好！', '真厲害！', '好準！',
      '繼續加油！', '你好棒！', '太神了！'
    ];
    
    const text = this.add.text(
      this.scale.width / 2,
      this.scale.height / 2,
      Phaser.Utils.Array.GetRandom(encouragements),
      {
        fontSize: '36px',
        fontFamily: 'Arial',
        color: '#FFD700',
        stroke: '#000000',
        strokeThickness: 4
      }
    ).setOrigin(0.5);
    
    this.tweens.add({
      targets: text,
      scale: { from: 0, to: 1.5 },
      alpha: { from: 1, to: 0 },
      duration: 1000,
      ease: 'Back.out',
      onComplete: () => text.destroy()
    });
  }
}

// 預設配置
export const defaultCatchConfig: CatchGameConfig = {
  objectType: '蘋果',
  objectEmoji: '🍎',
  objectColor: '紅色',
  catcherType: '籃子',
  catcherEmoji: '🧺',
  behaviors: {
    fallPattern: 'straight',
    fallSpeed: 'medium',
    spawnRate: 'medium'
  },
  visualEffects: {
    hasGlow: false,
    hasTrail: false,
    isAnimated: false
  }
};
