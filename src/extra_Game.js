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
import { Sprite, Texture } from 'pixi.js';

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
      '../assets/images/background.jpg',
      '../assets/images/Ninja_bg.jpg',
      '../assets/images/ninja-jump.png',
      '../assets/images/play.png'
    ];



    const loader = PIXI.Loader.shared
      .add(assets)

      .load((loader, res) => {

        //console.log('im loaded');

        let bgTexture = PIXI.Texture.from('../assets/images/background.jpg');
        let _bg = new PIXI.Sprite(bgTexture);
        this.background.addChild(_bg);


        this.counter = -1;

        let spriteX = [200, 600, 1050];
        let textures = ['left_box', 'middle_box', 'right_box'];
        let startAty = -500;
        let spriteY = 768 - 150;


        let myInterval = setInterval(() => {

          this.counter++;

          let boxTexture = PIXI.Texture.from('../assets/images/' + textures[this.counter] + '.png')
          let boxes = new PIXI.Sprite(boxTexture);
          boxes.anchor.set(0.5);
          boxes.x = spriteX[this.counter];
          boxes.y = spriteY;
          boxes.interactive = true;
          boxes.buttonMode = true;
          this.scene.addChild(boxes);;


          boxes.on('pointerdown', (event) => {
            gsap.to(event.currentTarget, {
              duration: 1,
              y: -500,
              ease: "circ.easeOut"
            })
          })

          gsap.to(boxes, {
            duration: .5,
            y: spriteY,
            ease: "Bounce.easeOut"
          })


          if (this.counter > 1) clearInterval(myInterval)
        }, 1000)

      });//END Load


  } // END constructor
} // END class
