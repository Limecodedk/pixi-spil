//Import PIXI
import * as PIXI from 'pixi.js';
//Import Gsap
import { gsap } from 'gsap';
//Import Spine
import { Spine } from 'pixi-spine'
//Import Howler
import { Howl, Howler } from 'howler';
//Import Stage.js
import Stage from './Stage';
import Enemy from './Enemy';
import HitTest from './HitTest';

export default class Game {

  constructor() {

    this.myStage = new Stage();
    this.scene = this.myStage.scene;
    this.scene.sortableChildren = true;
    this.background = this.myStage.bg;

    this.ht = new HitTest();

    this.soundArray = ["ia1", "ia2"];

    this.si = this.myStage.stageInfo;

    this.hitSound = new Howl({
      src: ['../assets/sound/effekt_swish.mp3'],
      volume: 0.5
    })

    this.intersectSound = new Howl({
      src: ['../assets/sound/effekt_hit.mp3'],
      volume: .2
    })

    let assets = [
      '../assets/spritesheet/ninjarack.json',
      //'../assets/images/background.jpg',
      '../assets/images/Ninja_bg.jpg',
      '../assets/images/ninja-jump.png',
      '../assets/images/play.png'
    ];



    const loader = PIXI.Loader.shared
      .add(assets)
      .add('alienspine', '../assets/spritesheet/alien-spine/alienboss.json')

      .load((loader, res) => {

        /*  let bgTexture = PIXI.Texture.from('../assets/images/background.jpg'); */
        let bgTexture = PIXI.Texture.from('../assets/images/Ninja_bg.jpg');


        let _bg = new PIXI.Sprite(bgTexture);
        this.background.addChild(_bg);

        let playTexture = PIXI.Texture.from('../assets/images/play.png');
        let play = new PIXI.Sprite(playTexture);
        play.anchor.set(.5);
        play.x = 512;
        play.y = 250;
        play.interactive = true;
        play.buttonMode = true;
        this.scene.addChild(play);

        play.on('pointerdown', (event) => {

          event.stopPropagation();

          this.enemy = new Enemy({

            name: res.alienspine,
            addTo: this.scene
          })

          this.si.app.stage.interactive = true;

          gsap.to(event.currentTarget, {

            duration: .5,
            delay: .2,
            y: play.y - 350,
            ease: "Elastic.easeOut"

          })

          let soundSwirp = new Howl({
            src: ['../assets/sound/effekt_swish.mp3'],
            volume: .2
          })

          let timerid = setTimeout(() => {
            soundSwirp.play();
          }, 300);


          let sound = new Howl({
            /* src: ['../assets/sound/musicloop.mp3'], */
            src: ['../assets/sound/Ninja_Soundtrack.mp3'],
            autoplay: true,
            loop: true,
            volume: .2
          })

        })

        this.hitareaNinja = new PIXI.Graphics();
        this.hitareaNinja.beginFill(0xDE3249);
        this.hitareaNinja.drawRect(500 - 150, 550, 300, 200);
        this.hitareaNinja.alpha = .0;
        this.hitareaNinja.endFill();
        this.scene.addChild(this.hitareaNinja);

        let sheet = PIXI.Loader.shared.resources['../assets/spritesheet/ninjarack.json'].spritesheet;

        this.ninja = new PIXI.AnimatedSprite(sheet.animations['alien']);
        this.ninja.anchor.set(0.5);
        this.ninja.x = 512;
        this.ninja.y = 768 - 150;
        this.ninja.interactive = true;
        this.ninja.buttonMode = true;
        this.ninja.zIndex = 2;
        this.ninja.animationSpeed = 0.5;
        this.ninja.play();
        this.scene.addChild(this.ninja);



        this.si.app.stage.on('pointerdown', (event) => {

          this.ninja.stop();
          this.ninja.texture = PIXI.Texture.from('../assets/images/ninja-jump.png')

          let getFromSoundArray = this.soundArray[Math.floor(Math.random() * this.soundArray.length)];

          this.ia = new Howl({
            src: ['../assets/sound/' + getFromSoundArray + '.mp3'],
            volume: 0.5
          })

          this.ia.play();

          let newPosition = event.data.getLocalPosition(this.background);

          gsap.to(this.ninja, {
            duration: .2,
            x: newPosition.x - 300,
            y: newPosition.y,
            ease: "Circ.easeOut",
            onComplete: () => {

              gsap.to(this.ninja, {
                duration: .2,
                x: 512,
                y: 768 - 150,
                ease: "Elastic.easeOut",
              })

              this.ninja.play();
            }
          })//END GSAP

          let mX = event.data.global.x;

          mX > this.si.appWidth / 2 ? this.ninja.scale.x = -1 : this.ninja.scale.x = 1;

          this.hitSound.play();

        })//END eventlistener

      });//END Load

    console.clear();

    let ticker = PIXI.Ticker.shared;

    ticker.add((delta) => {

      if (this.enemy != undefined) {

        this.enemy.enemies.forEach(_enemy => {
          //** Hit the enemy*/
          if (this.ht.checkMe(this.ninja, _enemy.getChildAt(1)) && _enemy.alive == true) {

            const currentEnemySpriteSheet = _enemy.getChildAt(0);

            currentEnemySpriteSheet.state.setAnimation(0, 'die', true);

            let enemyDieTimeline = gsap.timeline({
              onComplete: () => {
                this.scene.removeChild(_enemy);
              }
            });
            enemyDieTimeline.to(_enemy, { y: 300, duration: .7, ease: "Circ.easeOut" });
            /*  enemyDieTimeline.to(_enemy, { rotation: 10, duration: .4, ease: "Circ.easeIn" }); */
            enemyDieTimeline.to(_enemy, { y: 1200, duration: .5, ease: "Circ.easeIN" });



            if (_enemy.alive) this.intersectSound.play();

            _enemy.alive = false;

          }//END if hittest
          //** END Hit the enemy*/

          if (this.ht.checkMe(this.hitareaNinja, _enemy.getChildAt(1)) && _enemy.attack == true) {

            const currentEnemySpriteSheetAttack = _enemy.getChildAt(0);
            currentEnemySpriteSheetAttack.state.setAnimation(0, 'attack', true);

            let timeToNinjaIsHurt = setTimeout(() => {
              this.ninja.stop();
              this.ninja.texture = PIXI.Texture.from('../assets/images/ninja-hurt.png')

              gsap.to(this.ninja, {
                duration: 0.7,
                y: 550,
                ease: 'Circ.easeOut',
                onComplete: () => {
                  this.ninja.play();

                  gsap.to(this.ninja, {
                    duration: 0.4,
                    y: 768 - 150
                  })
                }
              })

            }, 300)

            _enemy.alive = false;
            _enemy.attack = false;


            gsap.to(_enemy, {
              duration: 0.7,
              y: 550,
              ease: "Circ.easeOut",
              onComplete: () => {
                gsap.to(_enemy, {
                  duration: 0.5,
                  y: 768 - 50,
                  ease: "Circ.easeOut"
                })
                currentEnemySpriteSheetAttack.state.setAnimation(0, 'walk', true);
              }
            })
          }
        }); //End forEach
      };
    });//END ticker


  } // END constructor
} // END class
