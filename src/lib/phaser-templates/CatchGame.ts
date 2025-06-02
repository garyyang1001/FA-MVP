// CatchGame.ts - 改進的 Phaser 載入方式
import { smartObjectMapping, smartCatcherMapping, COLOR_EFFECTS } from '../game-mappings';

export interface GameConfig {
  objectType: string;
  objectColor?: string;
  catcherType: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  gameTitle?: string;
}

export interface GameStats {
  score: number;
  timeLeft: number;
  itemsCaught: number;
  itemsMissed: number;
}

// 建立 Phaser 遊戲實例
export async function createCatchGame(
  containerId: string,
  config: GameConfig
): Promise<Phaser.Game | null> {
  // 確保在瀏覽器環境中
  if (typeof window === 'undefined') {
    console.error('❌ Phaser 只能在瀏覽器環境中載入');
    return null;
  }

  // 檢查容器是否存在
  const container = document.getElementById(containerId);
  if (!container) {
    console.error(`❌ 找不到容器元素: ${containerId}`);
    return null;
  }

  try {
    console.log('📦 開始動態載入 Phaser...');
    
    // 動態載入 Phaser
    const Phaser = (await import('phaser')).default;
    
    console.log('✅ Phaser 載入成功！');

    // 建立場景類別
    class CatchGameScene extends Phaser.Scene {
      private config: GameConfig;
      private catcher!: Phaser.GameObjects.Text;
      private stats: GameStats = {
        score: 0,
        timeLeft: 60,
        itemsCaught: 0,
        itemsMissed: 0
      };
      
      private scoreText!: Phaser.GameObjects.Text;
      private timeText!: Phaser.GameObjects.Text;
      private catcherSpeed: number = 300;
      private spawnRate: number = 1000;
      private gameActive: boolean = true;
      private fallingItems: Phaser.GameObjects.Text[] = [];
      private gameTimer!: Phaser.Time.TimerEvent;
      private spawnTimer!: Phaser.Time.TimerEvent;
      private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;

      private objectMapping: any;
      private catcherMapping: any;

      constructor() {
        super({ key: 'CatchGame' });
        this.config = config;
        
        // 使用智慧映射系統
        this.objectMapping = smartObjectMapping(config.objectType);
        this.catcherMapping = smartCatcherMapping(config.catcherType);
        
        this.setDifficulty();
      }

      private setDifficulty() {
        switch (this.config.difficulty) {
          case 'easy':
            this.spawnRate = 1500;
            this.stats.timeLeft = 45;
            break;
          case 'hard':
            this.spawnRate = 700;
            this.stats.timeLeft = 75;
            break;
          default:
            this.spawnRate = 1000;
            this.stats.timeLeft = 60;
        }
      }

      preload() {
        console.log('🎮 場景預載入...');
      }

      create() {
        console.log('🎮 場景建立中...');
        
        // 設置背景顏色
        this.cameras.main.setBackgroundColor('#87CEEB');

        // 建立輸入控制
        if (this.input.keyboard) {
          this.cursors = this.input.keyboard.createCursorKeys();
        }

        // 創建接取工具
        this.createCatcher();

        // 創建 UI
        this.createUI();

        // 設置遊戲計時器
        this.setupGameTimer();

        // 開始生成掉落物
        this.startSpawning();

        // 設置觸控/滑鼠控制
        this.setupPointerControl();

        // 顯示開始訊息
        this.showStartMessage();

        console.log('✅ 場景建立完成！');
      }

      private createCatcher() {
        const catcherEmoji = this.catcherMapping.visual || '🤲';
        
        this.catcher = this.add.text(
          this.scale.width / 2,
          this.scale.height - 50,
          catcherEmoji,
          {
            fontSize: '48px',
            align: 'center'
          }
        );
        this.catcher.setOrigin(0.5);
      }

      private createUI() {
        // 分數顯示
        this.scoreText = this.add.text(16, 16, `分數: ${this.stats.score}`, {
          fontSize: '24px',
          color: '#000',
          backgroundColor: '#ffffff',
          padding: { x: 10, y: 5 }
        });

        // 時間顯示
        this.timeText = this.add.text(16, 60, `時間: ${this.stats.timeLeft}`, {
          fontSize: '24px',
          color: '#000',
          backgroundColor: '#ffffff',
          padding: { x: 10, y: 5 }
        });

        // 遊戲標題
        if (this.config.gameTitle) {
          this.add.text(this.scale.width / 2, 30, this.config.gameTitle, {
            fontSize: '28px',
            color: '#2c3e50',
            fontStyle: 'bold',
            backgroundColor: '#ffffff',
            padding: { x: 15, y: 8 }
          }).setOrigin(0.5);
        }
      }

      private setupGameTimer() {
        this.gameTimer = this.time.addEvent({
          delay: 1000,
          callback: this.updateTimer,
          callbackScope: this,
          loop: true
        });
      }

      private updateTimer() {
        if (!this.gameActive) return;

        this.stats.timeLeft--;
        this.timeText.setText(`時間: ${this.stats.timeLeft}`);
        
        if (this.stats.timeLeft <= 0) {
          this.endGame();
        }
      }

      private startSpawning() {
        this.spawnTimer = this.time.addEvent({
          delay: this.spawnRate,
          callback: this.spawnObject,
          callbackScope: this,
          loop: true
        });
      }

      private spawnObject() {
        if (!this.gameActive) return;

        const x = Phaser.Math.Between(50, this.scale.width - 50);
        const objectEmoji = this.objectMapping.visual || '🎁';
        
        const fallingItem = this.add.text(x, -30, objectEmoji, {
          fontSize: '36px'
        });
        fallingItem.setOrigin(0.5);

        this.fallingItems.push(fallingItem);

        // 下降動畫
        const fallDuration = Phaser.Math.Between(2000, 4000);
        
        this.tweens.add({
          targets: fallingItem,
          y: this.scale.height + 50,
          duration: fallDuration,
          ease: 'Power1',
          onUpdate: () => {
            this.checkCatch(fallingItem);
          },
          onComplete: () => {
            this.missItem(fallingItem);
          }
        });
      }

      private setupPointerControl() {
        this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
          if (this.gameActive && this.catcher) {
            this.catcher.x = Phaser.Math.Clamp(pointer.x, 50, this.scale.width - 50);
          }
        });
      }

      private showStartMessage() {
        const objectEmoji = this.objectMapping.visual || '🎁';
        const catcherEmoji = this.catcherMapping.visual || '🤲';
        
        const startText = this.add.text(
          this.scale.width / 2,
          this.scale.height / 2,
          `遊戲開始！\n用${catcherEmoji}接住所有${objectEmoji}\n滑鼠或鍵盤控制移動`,
          {
            fontSize: '32px',
            color: '#2c3e50',
            backgroundColor: '#ffffff',
            padding: { x: 20, y: 15 },
            align: 'center'
          }
        );
        startText.setOrigin(0.5);

        // 3秒後消失
        this.time.delayedCall(3000, () => {
          startText.destroy();
        });
      }

      update() {
        if (!this.gameActive || !this.cursors) return;

        // 鍵盤控制
        if (this.cursors.left.isDown && this.catcher) {
          this.catcher.x = Math.max(50, this.catcher.x - this.catcherSpeed * 0.016);
        } else if (this.cursors.right.isDown && this.catcher) {
          this.catcher.x = Math.min(this.scale.width - 50, this.catcher.x + this.catcherSpeed * 0.016);
        }
      }

      private checkCatch(item: Phaser.GameObjects.Text) {
        if (!this.catcher) return;
        
        const distance = Phaser.Math.Distance.Between(
          item.x, item.y,
          this.catcher.x, this.catcher.y
        );

        let catchRadius = 60;
        if (this.catcherMapping.size === 'large') {
          catchRadius = 80;
        } else if (this.catcherMapping.size === 'small') {
          catchRadius = 40;
        }

        if (distance < catchRadius && item.y > this.scale.height - 100) {
          this.catchItem(item);
        }
      }

      private catchItem(item: Phaser.GameObjects.Text) {
        const index = this.fallingItems.indexOf(item);
        if (index > -1) {
          this.fallingItems.splice(index, 1);
        }

        this.stats.score += 10;
        this.stats.itemsCaught++;
        this.scoreText.setText(`分數: ${this.stats.score}`);

        // 特效
        this.showCatchEffect(item);
        item.destroy();
      }

      private missItem(item: Phaser.GameObjects.Text) {
        const index = this.fallingItems.indexOf(item);
        if (index > -1) {
          this.fallingItems.splice(index, 1);
        }

        this.stats.itemsMissed++;
        item.destroy();
      }

      private showCatchEffect(item: Phaser.GameObjects.Text) {
        const effect = this.add.text(item.x, item.y, '✨+10', {
          fontSize: '24px',
          color: '#27ae60',
          fontStyle: 'bold'
        });
        effect.setOrigin(0.5);

        this.tweens.add({
          targets: effect,
          y: effect.y - 50,
          alpha: 0,
          duration: 1000,
          onComplete: () => {
            effect.destroy();
          }
        });

        this.cameras.main.flash(100, 255, 255, 255, false);
      }

      private endGame() {
        this.gameActive = false;
        
        if (this.gameTimer) this.gameTimer.destroy();
        if (this.spawnTimer) this.spawnTimer.destroy();

        this.fallingItems.forEach(item => item.destroy());
        this.fallingItems = [];

        this.showGameEnd();
      }

      private showGameEnd() {
        const overlay = this.add.rectangle(
          this.scale.width / 2,
          this.scale.height / 2,
          this.scale.width,
          this.scale.height,
          0x000000,
          0.7
        );

        const accuracy = this.stats.itemsCaught / (this.stats.itemsCaught + this.stats.itemsMissed) || 0;
        const objectEmoji = this.objectMapping.visual || '🎁';
        const catcherEmoji = this.catcherMapping.visual || '🤲';

        const endText = this.add.text(
          this.scale.width / 2,
          this.scale.height / 2,
          `遊戲結束！\n\n` +
          `你用${catcherEmoji}接了${this.stats.itemsCaught}個${objectEmoji}！\n\n` +
          `最終分數: ${this.stats.score}\n` +
          `錯過物品: ${this.stats.itemsMissed}\n` +
          `準確率: ${Math.round(accuracy * 100)}%\n\n` +
          `點擊重新遊玩`,
          {
            fontSize: '24px',
            color: '#ffffff',
            backgroundColor: '#000000',
            padding: { x: 30, y: 20 },
            align: 'center'
          }
        );
        endText.setOrigin(0.5);

        overlay.setInteractive();
        overlay.on('pointerdown', () => {
          this.scene.restart();
        });
      }
    }

    // 創建遊戲配置
    const gameConfig: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: 400,
      height: 600,
      parent: containerId,
      backgroundColor: '#87CEEB',
      scene: CatchGameScene,
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 0, x: 0 }
        }
      },
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
      }
    };

    console.log('🚀 建立 Phaser 遊戲實例...');
    const game = new Phaser.Game(gameConfig);
    
    console.log('✅ 遊戲建立成功！');
    return game;

  } catch (error) {
    console.error('❌ 建立遊戲失敗:', error);
    return null;
  }
}
