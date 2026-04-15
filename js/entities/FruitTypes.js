import { BaseFruit } from './Fruit.js';

class Apple extends BaseFruit {
    constructor() {
        super();
        this.type = 'apple';
        this.scoreValue = 1;
        this.spawnWeight = 10;
        // Apple is permanent — lifespan stays Infinity
    }
}

class GoldenApple extends BaseFruit {
    constructor() {
        super();
        this.type = 'golden';
        this.scoreValue = 3;
        this.spawnWeight = 3;
    }
    effect(game) {
        game.skipSpeedUp = true;
    }
}

class PoisonFruit extends BaseFruit {
    constructor() {
        super();
        this.type = 'poison';
        this.scoreValue = -1;
        this.spawnWeight = 2;
    }
    effect(game) {
        game.speed = Math.min(game.speed + 20, game.baseSpeed);
    }
}

class Cherry extends BaseFruit {
    constructor() {
        super();
        this.type = 'cherry';
        this.scoreValue = 2;
        this.spawnWeight = 5;
    }
}

const SPECIAL_TYPES = [GoldenApple, PoisonFruit, Cherry];

export class FruitFactory {
    // Spawn a permanent apple
    static spawnApple(isOccupied) {
        const f = new Apple();
        f.place(isOccupied);
        return f;
    }

    // Spawn a random special fruit (Golden / Poison / Cherry) with a set lifespan
    static spawnSpecial(isOccupied, lifespan) {
        const total = SPECIAL_TYPES.reduce((sum, T) => sum + new T().spawnWeight, 0);
        let roll = Math.random() * total;
        for (const T of SPECIAL_TYPES) {
            const inst = new T();
            roll -= inst.spawnWeight;
            if (roll <= 0) {
                inst.lifespan = lifespan;
                inst.ticksLeft = lifespan;
                inst.place(isOccupied);
                return inst;
            }
        }
        // fallback
        const fallback = new GoldenApple();
        fallback.lifespan = lifespan;
        fallback.ticksLeft = lifespan;
        fallback.place(isOccupied);
        return fallback;
    }
}
