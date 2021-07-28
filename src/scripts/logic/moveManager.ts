import {I2DCoordinates} from '../interfaces';
import {Map} from '../map/map';
import {Player} from '../creatures/player';

export class MoveManager {

    private player: Player;
    private map: Map;

    constructor(map: Map, player: Player) {
        this.map = map;
        this.player = player;
    }

    /**
     * Coordinates are correct if the map range is included
     * and point to an adjacent cell horizontally or vertically
     * @returns
     * @param coordinates
     */
    public isCorrectCoordinates(coordinates: I2DCoordinates): boolean {
        return (0 <= coordinates.x && coordinates.x < this.map.getSize().x) &&
               (0 <= coordinates.y && coordinates.y < this.map.getSize().y) &&
               (Math.abs(coordinates.x - this.player.getCoordinates().x) +
                Math.abs(coordinates.y - this.player.getCoordinates().y) == 1);
    }

    public move(coordinates: I2DCoordinates): boolean {
        if (this.isCorrectCoordinates(coordinates)) {
            console.log(`${this.player.name} moved to (${coordinates.x}, ${coordinates.y})`);
            this.player.move(coordinates);
            return true;
        } else {
            console.log(`${this.player.name} not moved to (${coordinates.x}, ${coordinates.y})`);
            return false;
        }
    }
}