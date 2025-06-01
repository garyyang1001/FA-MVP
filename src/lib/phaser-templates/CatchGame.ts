import Phaser from 'phaser';
import { OBJECT_MAPPINGS, CATCHER_MAPPINGS, COLOR_EFFECTS } from '../game-mappings';

export interface GameConfig {
  objectType: string;    // 要接的物品（如：蘋果）
  objectColor?: string;  // 顏色
  catcherType: string;   // 接的工具（如：籃子）
  difficulty?: 'easy' | 'medium' | 'hard';
  gameTitle?: string;
}

export interface GameStats {
  score: number;
  timeLeft: number;
  itemsCaught: number;
  itemsMissed: number;
}

export class CatchGameScene extends Phaser.Scene {
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

  constructor(config: GameConfig) {
    super({ key: 'CatchGame' });
    this.config = config;
    this.setDifficulty();
  }

  private setDifficulty() {
    switch (this.config.difficulty) {
      case 'easy':
        this.spawnRate = 1500;
        this.stats.timeLeft = 45;
        break;
      case 'medium':
        this.spawnRate = 1000;
        this.stats.timeLeft = 60;
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
    // MVP 階段使用文字和表情符號代替圖片
    // 如果需要音效，可以在這裡載入
  }

  create() {
    // 設置背景顏色（天空藍）
    this.cameras.main.setBackgroundColor('#87CEEB');

    // 建立輸入控制
    this.cursors = this.input.keyboard!.createCursorKeys();

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

    // 顯示遊戲開始訊息
    this.showStartMessage();
  }

  private createCatcher() {
    const catcherData = CATCHER_MAPPINGS[this.config.catcherType];
    const catcherEmoji = catcherData?.visual || '🧺';
    
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
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
      padding: { x: 10, y: 5 }
    });

    // 時間顯示
    this.timeText = this.add.text(16, 60, `時間: ${this.stats.timeLeft}`, {
      fontSize: '24px',
      color: '#000',
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
      padding: { x: 10, y: 5 }
    });

    // 遊戲標題
    if (this.config.gameTitle) {
      this.add.text(this.scale.width / 2, 30, this.config.gameTitle, {
        fontSize: '28px',
        color: '#2c3e50',
        fontStyle: 'bold',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        padding: { x: 15, y: 8 }
      }).setOrigin(0.5);
    }

    // 接取工具說明
    const catcherData = CATCHER_MAPPINGS[this.config.catcherType];
    if (catcherData) {
      this.add.text(this.scale.width - 16, 16, catcherData.specialAbility, {
        fontSize: '16px',
        color: '#34495e',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        padding: { x: 8, y: 4 }
      }).setOrigin(1, 0);
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
    const objectData = OBJECT_MAPPINGS[this.config.objectType];
    const objectEmoji = objectData?.visual || '🍎';
    
    // 創建掉落物
    const fallingItem = this.add.text(x, -30, objectEmoji, {
      fontSize: '36px'
    });
    fallingItem.setOrigin(0.5);

    // 添加顏色效果
    if (this.config.objectColor && COLOR_EFFECTS[this.config.objectColor]) {
      this.applyColorEffect(fallingItem, this.config.objectColor);
    }

    this.fallingItems.push(fallingItem);

    // 根據物品特性設置下降動畫
    this.createFallingAnimation(fallingItem, objectData);
  }

  private applyColorEffect(item: Phaser.GameObjects.Text, colorKey: string) {
    const colorEffect = COLOR_EFFECTS[colorKey];
    
    switch (colorKey) {
      case '彩虹':
        // 彩虹效果：循環變色
        this.tweens.add({
          targets: item,
          duration: 1000,
          repeat: -1,
          onUpdate: () => {
            const colors = ['#ff0000', '#ff8800', '#ffff00', '#00ff00', '#0088ff', '#0000ff', '#8800ff'];
            const colorIndex = Math.floor((Date.now() / 200) % colors.length);
            item.setTint(parseInt(colors[colorIndex].replace('#', '0x')));
          }
        });
        break;
      case '金色':
        item.setTint(0xFFD700);
        break;
      case '閃亮':
        // 閃爍效果
        this.tweens.add({
          targets: item,
          alpha: { from: 1, to: 0.3 },
          duration: 500,
          repeat: -1,
          yoyo: true
        });
        break;
      case '透明':
        item.setAlpha(0.6);
        break;
    }
  }

  private createFallingAnimation(item: Phaser.GameObjects.Text, objectData: any) {
    const fallDuration = Phaser.Math.Between(2000, 4000);
    
    // 根據物品類型創建不同的下降效果
    if (objectData) {
      switch (objectData.behavior) {
        case '會左右搖擺著掉下來':
          // 香蕉的左右搖擺
          this.tweens.add({
            targets: item,
            x: item.x + Phaser.Math.Between(-100, 100),
            duration: fallDuration / 2,
            repeat: 1,
            yoyo: true
          });
          break;
        case '輕飄飄地，之字形飄落':
          // 星星的之字形飄落
          this.tweens.add({
            targets: item,
            x: {
              value: item.x + Phaser.Math.Between(-150, 150),
              duration: fallDuration / 3,
              repeat: 2,
              yoyo: true
            }
          });
          break;
        case '邊轉圈邊掉下來':
          // 笑臉的旋轉
          this.tweens.add({
            targets: item,
            rotation: 2 * Math.PI,
            duration: fallDuration,
            repeat: 0
          });
          break;
      }
    }

    // 主要的下降動畫
    this.tweens.add({
      targets: item,
      y: this.scale.height + 50,
      duration: fallDuration,
      ease: 'Power1',
      onUpdate: () => {
        this.checkCatch(item);
      },
      onComplete: () => {
        this.missItem(item);
      }
    });
  }

  private setupPointerControl() {
    this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
      if (this.gameActive) {
        this.catcher.x = Phaser.Math.Clamp(pointer.x, 50, this.scale.width - 50);
      }
    });
  }

  private showStartMessage() {
    const startText = this.add.text(
      this.scale.width / 2,
      this.scale.height / 2,
      '遊戲開始！\n用滑鼠或鍵盤控制移動\n接住所有東西！',
      {
        fontSize: '32px',
        color: '#2c3e50',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
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
    if (!this.gameActive) return;

    // 鍵盤控制
    if (this.cursors.left.isDown) {
      this.catcher.x = Math.max(50, this.catcher.x - this.catcherSpeed * 0.016);
    } else if (this.cursors.right.isDown) {
      this.catcher.x = Math.min(this.scale.width - 50, this.catcher.x + this.catcherSpeed * 0.016);
    }
  }

  private checkCatch(item: Phaser.GameObjects.Text) {
    const distance = Phaser.Math.Distance.Between(
      item.x, item.y,
      this.catcher.x, this.catcher.y
    );

    if (distance < 60 && item.y > this.scale.height - 100) {
      this.catchItem(item);
    }
  }

  private catchItem(item: Phaser.GameObjects.Text) {
    // 移除物品
    const index = this.fallingItems.indexOf(item);
    if (index > -1) {
      this.fallingItems.splice(index, 1);
    }

    // 更新分數
    this.stats.score += this.getItemValue();
    this.stats.itemsCaught++;
    this.scoreText.setText(`分數: ${this.stats.score}`);

    // 特殊效果
    this.showCatchEffect(item);

    // 移除物品
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

  private getItemValue(): number {
    let baseValue = 10;
    
    // 根據顏色調整分數
    if (this.config.objectColor === '金色') {
      baseValue *= 2;
    }
    
    // 根據難度調整分數
    switch (this.config.difficulty) {
      case 'hard':
        baseValue *= 1.5;
        break;
      case 'easy':
        baseValue *= 0.8;
        break;
    }
    
    return Math.round(baseValue);
  }

  private showCatchEffect(item: Phaser.GameObjects.Text) {
    // 成功接取的視覺反饋
    const effect = this.add.text(item.x, item.y, '✨+' + this.getItemValue(), {
      fontSize: '24px',
      color: '#27ae60',
      fontStyle: 'bold'
    });
    effect.setOrigin(0.5);

    // 動畫效果
    this.tweens.add({
      targets: effect,
      y: effect.y - 50,
      alpha: 0,
      duration: 1000,
      onComplete: () => {
        effect.destroy();
      }
    });

    // 畫面閃爍效果
    this.cameras.main.flash(100, 255, 255, 255, false);

    // 根據物品特性播放特殊效果
    const objectData = OBJECT_MAPPINGS[this.config.objectType];
    if (objectData && objectData.specialEffect) {
      this.showSpecialEffect(item.x, item.y, objectData.specialEffect);
    }
  }

  private showSpecialEffect(x: number, y: number, effectDescription: string) {
    // 簡化的特殊效果實作
    if (effectDescription.includes('愛心')) {
      const hearts = ['💖', '💕', '💗'];
      hearts.forEach((heart, index) => {
        const heartEffect = this.add.text(x + (index - 1) * 30, y, heart, {
          fontSize: '20px'
        });
        heartEffect.setOrigin(0.5);
        
        this.tweens.add({
          targets: heartEffect,
          y: heartEffect.y - 100,
          alpha: 0,
          duration: 1500,
          delay: index * 200,
          onComplete: () => heartEffect.destroy()
        });
      });
    }
  }

  private endGame() {
    this.gameActive = false;
    
    // 停止所有計時器
    this.gameTimer.destroy();
    this.spawnTimer.destroy();

    // 清理掉落物
    this.fallingItems.forEach(item => item.destroy());
    this.fallingItems = [];

    // 顯示結束畫面
    this.showGameEnd();
  }

  private showGameEnd() {
    // 半透明覆蓋層
    const overlay = this.add.rectangle(
      this.scale.width / 2,
      this.scale.height / 2,
      this.scale.width,
      this.scale.height,
      0x000000,
      0.7
    );

    // 計算評級
    const accuracy = this.stats.itemsCaught / (this.stats.itemsCaught + this.stats.itemsMissed);
    const rating = this.getRating(accuracy);

    // 結束文字
    const endText = this.add.text(
      this.scale.width / 2,
      this.scale.height / 2,
      `遊戲結束！\n\n` +
      `最終分數: ${this.stats.score}\n` +
      `接到物品: ${this.stats.itemsCaught}\n` +
      `錯過物品: ${this.stats.itemsMissed}\n` +
      `準確率: ${Math.round(accuracy * 100)}%\n\n` +
      `評級: ${rating}\n\n` +
      `點擊重新遊玩`,
      {
        fontSize: '24px',
        color: '#ffffff',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: { x: 30, y: 20 },
        align: 'center'
      }
    );
    endText.setOrigin(0.5);

    // 點擊重新開始
    overlay.setInteractive();
    overlay.on('pointerdown', () => {
      this.scene.restart();
    });
  }

  private getRating(accuracy: number): string {
    if (accuracy >= 0.9) return '🌟🌟🌟 完美！';
    if (accuracy >= 0.8) return '🌟🌟 很棒！';
    if (accuracy >= 0.7) return '🌟 不錯！';
    return '再試一次！';
  }
}

// 創建遊戲的工廠函數
export function createCatchGame(
  containerId: string,
  config: GameConfig
): Phaser.Game {
  return new Phaser.Game({
    type: Phaser.AUTO,
    width: 400,
    height: 600,
    parent: containerId,
    backgroundColor: '#87CEEB',
    scene: new CatchGameScene(config),
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
  });
}
