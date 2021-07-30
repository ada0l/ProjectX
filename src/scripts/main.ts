import {SceneManager} from './scenes/sceneManager';
import {FightScene} from "./scenes/fightScene";
import {FieldScene} from './scenes/fieldScene';
import {SelectMonsterScene} from './scenes/selectMonsterScene'
import {StartScene} from "./scenes/startScene";

import {GameState} from './gameState';

import {Player} from "./creatures/player";
import {Map} from "./map/map";
import {I2DCoordinates} from "./interfaces";
import {Monster} from "./creatures/monster";
import {Fight} from "./logic/fight";

/* Global variables */
const DEFAULT_START_AVAILABLE_MOVES = 5;
const DEFAULT_PLAYER_1_POS: [number, number] = [0, 0];
const DEFAULT_PLAYER_2_POS: [number, number] = [0, 4];
const DEFAULT_MAP_SIZE: [number, number] = [5, 5];
let gs: GameState = new GameState(
    new Player("Steve", "hero_1", ...DEFAULT_PLAYER_1_POS, DEFAULT_START_AVAILABLE_MOVES),
    new Player("John", "hero_2", ...DEFAULT_PLAYER_2_POS, DEFAULT_START_AVAILABLE_MOVES),
    new Map(...DEFAULT_MAP_SIZE)
);


/**
 * Scenes
 */
const fieldScene = new FieldScene(
    document.getElementById('game-field'),
    cellClickListener,
    NESZButtonInFieldClickListener,
    NESXButtonInFieldClickListener
);
let fightScene = new FightScene(
    document.getElementById('game-fight'),
    NESZButtonInFightClickListener,
    NESXButtonInFightClickListener
);
let selectMonsterScene = new SelectMonsterScene(
    document.getElementById('game-select-monster'),
    OKButtonInSelectClickListener
);
let startScene = new StartScene(
    document.getElementById('game-start'),
    startButtonClickListener
);

fightScene.render();
startScene.render();

/**
 * Scene Manager
 */
let sceneManager = new SceneManager([
    {
        name: 'field',
        scene: fieldScene
    },
    {
        name: 'fight',
        scene: fightScene
    },
    {
        name: 'select',
        scene: selectMonsterScene
    },
    {
        name: 'start',
        scene: startScene
    }
])
sceneManager.showScene('start');

/**
 * Start scene
 */
function startButtonClickListener() {
    sceneManager.showScene('field');
    fieldScene.render(gs.map);
    fieldScene.update(gs.map, [gs.player, gs.player2]);
    fieldScene.updateInfo(gs.getCurrent());
}

/**
 * Fight Scene
 */
function NESZButtonInFightClickListener() {
    gs.fight.attackCurrent();
    if (gs.fight.isFinish()) {
        gs.fight.finish();
        fieldScene.updateInfo(gs.getCurrent());
        sceneManager.showScene('field');
    }
    gs.fight.swap();
    fightScene.update();
}
function NESXButtonInFightClickListener() {
    gs.fight.defendCurrent();
    gs.fight.swap();
    fightScene.update();
}

/**
 * Field Scene
 */
function cellClickListener(event: MouseEvent) {

    function getCoordinatesOfCell(target: EventTarget): I2DCoordinates {
        let element = <HTMLElement>target;
        const td = <HTMLTableCellElement>element.parentElement;
        const row = <HTMLTableRowElement>td.parentElement;
        return { x: td.cellIndex, y: row.rowIndex };
    }

    const coordinates = getCoordinatesOfCell(event.target);
    let old_coordinate: I2DCoordinates = gs.getCurrent().getCoordinates();
    if (gs.moveManager.move(gs.getCurrent(), coordinates)) {
        fieldScene.updateInfo(gs.getCurrent());
        fieldScene.updateCells(gs.map, [old_coordinate, gs.getCurrent().getCoordinates()], gs.getCreatures());
    }
}
function NESZButtonInFieldClickListener() {
    let coordinates = gs.getCurrent().getCoordinates();
    if (gs.map.getCell(coordinates).monster.looted)
        return;
    if (gs.getCurrent().availableMoves <= 0)
        return;
    selectMonsterScene.setPlayer(gs.getCurrent());
    selectMonsterScene.update();
    sceneManager.showScene('select');
}
function NESXButtonInFieldClickListener() {
    gs.getCurrent().resetAvailableMoves();
    gs.swapPlayers();
    gs.getCurrent().setAvailableMoves(DEFAULT_START_AVAILABLE_MOVES);
    fieldScene.updateInfo(gs.getCurrent());
}

/**
 * Select Scene
 */
function OKButtonInSelectClickListener() {
    sceneManager.showScene('fight');
    let monsters: [Monster, Monster] = [
        selectMonsterScene.getChosenMonster(),
        gs.map.getCell(gs.getCurrent().getCoordinates()).monster
    ]
    fightScene.setMonsters(monsters);
    fightScene.render();
    fightScene.update();
    gs.fight = new Fight(gs.getCurrent(), ...monsters);
}