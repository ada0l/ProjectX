import {Player} from './creatures/player';
import {Monster, Shark} from './creatures/monster';
import {FieldRenderer} from './scenes/fieldRenderer';
import {SceneManager} from './scenes/sceneManager';
import {GameState} from './gameState';
import {I2DCoordinates} from './interfaces';
import {FightRenderer} from "./scenes/fightRenderer";
import {SelectMonsterRenderer} from './scenes/selectMonsterRenderer'
import {Fight} from './logic/fight';

/* Global variables */
const gameState = new GameState(
    new Player("Steve", "hero_1", 0, 0, 4, [new Shark()]),
    []
);
const sceneManager = new SceneManager(gameState);

/* Renderers */
const fieldRenderer = new FieldRenderer(gameState,  sceneManager.getSceneInfo('field').element,
    cellClickListener, NESZButtonInFieldClickListener, NESXButtonInFieldClickListener);
let fightRenderer: FightRenderer = null;
let selectMonsterRenderer: SelectMonsterRenderer = null;

/* Prepare field */
fieldRenderer.render();
fieldRenderer.update();
sceneManager.showScene('field');

/* Click Listener for all cells in field */
function cellClickListener(event: MouseEvent) {

    function getCoordinatesOfCell(target: EventTarget): I2DCoordinates {
        let element = <HTMLElement>target;
        const td = <HTMLTableCellElement>element.parentElement;
        const row = <HTMLTableRowElement>td.parentElement;
        return {
            x: td.cellIndex,
            y: row.rowIndex
        }
    }

    const coordinates = getCoordinatesOfCell(event.target);
    let old_coordinate: I2DCoordinates = gameState.player.getCoordinates();
    if (gameState.moveManager.move(coordinates)) {
        fieldRenderer.updateInfo();
        fieldRenderer.updateCells([
            old_coordinate,
            gameState.player.getCoordinates()
        ]);
    }
}

function NESZButtonInFightClickListener() {
    gameState.fight.attackCurrent();
    if (gameState.fight.isFinish()) {
        gameState.fight.finish();
        fieldRenderer.updateInfo();
        sceneManager.showScene('field');
    }
    gameState.fight.swap();
    fightRenderer.update();
}

function NESXButtonInFightClickListener() {
    gameState.fight.defendCurrent();
    gameState.fight.swap();
    fightRenderer.update();
}

function NESZButtonInFieldClickListener() {
    let coordinates = gameState.player.getCoordinates();
    if (gameState.map.getCell(coordinates).monster.looted)
        return;
    if (gameState.player.availableMoves <= 0)
        return;
    selectMonsterRenderer = new SelectMonsterRenderer(
        sceneManager.getSceneInfo('select-monster').element,
        gameState.player,
        OKButtonInSelectClickListener
    )
    selectMonsterRenderer.update();
    sceneManager.showScene('select-monster');
}

function NESXButtonInFieldClickListener() {
    gameState.player.resetAvailableMoves();
    console.log("Reset");
    gameState.player.setAvailableMoves(10);
    fieldRenderer.updateInfo();
}

/* Click Listener for OK button in select-monster */
function OKButtonInSelectClickListener() {
    sceneManager.showScene('fight');
    let monsters: [Monster, Monster] = [
        selectMonsterRenderer.getChosenMonster(),
        gameState.map.getCell(gameState.player.getCoordinates()).monster
    ]
    fightRenderer = new FightRenderer(
        sceneManager.getSceneInfo('fight').element,
        monsters,
        NESZButtonInFightClickListener,
        NESXButtonInFightClickListener
    );
    fightRenderer.render();
    fightRenderer.update();
    gameState.fight = new Fight(gameState.player, ...monsters);
}

window.addEventListener("keydown", function (event) {
    if (event.key == "r") {
        console.log(gameState.player.availableMoves);
    }
}, true);
