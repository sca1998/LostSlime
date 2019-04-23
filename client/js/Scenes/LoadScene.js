
import Scene from '../Scene.js';
import BeatMap from '../BeatMap.js';
import { loadImage, loadJSON, loadAudio } from '../loaders.js';
import { Entity } from '../Entity.js';
import { Vec2 } from '../util.js';
import GameScene from './GameScene.js';
import HighScoreGameScene from './HighScoreGameScene.js';
import SoloGameScene from './SoloGameScene.js';

export default class LoadScene extends Scene {

    constructor(name, socket, jsonURL, audioURL, gameType) {
        super(name, socket);
        this.gameType = gameType;

        this.loadAssets(jsonURL, audioURL);
    }

    loadAssets(jsonURL, audioURL) {
        loadImage('/img/background/space.gif').then(image => {
            const background = new Entity(new Vec2(0, 0), image);
            this.addEntity('background', background, 0);
        });

        Promise.all([loadJSON(jsonURL), loadAudio(audioURL)])
            .then(([json, audio]) => { //at this point the json, audio files finished loading
                const beatmap = new BeatMap(json);
                if (this.gameType === 'pvp') {
                    const pvpGame = new GameScene('pvp', this.socket, beatmap, audio);
                    pvpGame.show();
                }
                else if (this.gameType === 'highscore') {
                    const highscoreGame = new HighScoreGameScene('highscore', this.socket, beatmap, audio);
                    highscoreGame.show();
                }
                else if (this.gameType === 'survival') {
                    const survival = new SoloGameScene('survival', this.socket, beatmap, audio);
                    survival.show();
                }
            });
    }
}