import {Creature} from "./creature";

export class Monster extends Creature {
    private readonly _maxHeath: number;
    public get maxHeath(): number {
        return this._maxHeath;
    }

    private _health: number;
    public get health(): number {
        return this._health;
    }

    private _defense: number;
    public get defense(): number {
        return this._defense;
    }

    private readonly _attack: number;
    public get attack(): number {
        return this._attack;
    }

    private readonly _attackBooster: number;
    public get attackBooster(): number {
        return this._attackBooster;
    }

    private _looted: boolean;
    public get looted(): boolean {
        return this._looted;
    }
    public loot(): void {
        this._looted = true;
    }

    constructor(name: string, cssClass: string, type: string, health: number, attack: number, defense: number,
                attackBooster: number, looted: boolean) {
        super(name, cssClass);
        this._maxHeath = health;
        this._health = health;
        this._defense = defense;
        this._attack = attack;
        this._attackBooster = attackBooster;
        this._looted = looted;
    }

    public beAttacked(enemy: Monster): void {
        const damage = this.defense - (enemy.attack + enemy.attackBooster);
        if (damage >= 0) {
            this._health -= 1;
        } else {
            this._health += damage;
        }
    }

    public defenseHimself(): void {
        this._defense += 5;
    }

    public isDead(): boolean {
        return this._health <= 0;
    }

    public Heal(): void {
       this._health = this.maxHeath;
    }

    public BalanceHeal(newHeal: number): void{
        this._health = newHeal;
    }

    public getString(): string {
        return `${this.name}, hp: ${this.health}, defense: ${this.defense}, attack: ${this.attack}`;
    }
}

export class Shark extends Monster {
    constructor() {
        super('Shark', 'shark', 'red', 10, 10, 5, 0, false);
    }
}

export class Dragon extends Monster {
    constructor() {
        super('Dragon', 'dragon', 'red', 20, 5, 0, 0, false);
    }
}

export class BlackDragon extends Monster{
    constructor(){
        super('BlackDragon', 'black_dragon', 'a', 100, 10, 0, 3, false);
    }
}

export class Cat extends Monster{
    constructor(){
        super('Cat', 'cat', 'red', 20, 30, 0, 20, false);
    }
}

export class Dog extends Monster{
    constructor(){
        super('Dog', 'dog', 'red', 10, 10, 200, 0, false);
    }
}

export class Horse extends Monster{
    constructor(){
        super('Horse', 'horse', 'red', 200, 5, 0, 10, false);
    }
}

export class Lion extends Monster{
    constructor(){
        super('Lion', 'lion', 'red', 30, 6, 5, 2, false);
    }
}

export class Medusa extends Monster{
    constructor(){
        super('Medusa', 'medusa', 'red', 3, 5, 100, 0, false);
    }
}

export class Plant extends Monster{
    constructor(){
        super('Plant', 'plant', 'red', 5, 5, 20, 0, false);
    }
}

export class Snake extends Monster{
    constructor(){
        super('Snake', 'snake', 'red', 30, 2, 0, 0, false);
    }
}

export class Boss extends Monster{
    constructor(){
        super('Boss', 'boss', 'red', 1000, 25, 20, 10, false);
    }
}