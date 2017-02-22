function solve() {
    'use strict';

    const ERROR_MESSAGES = {
        INVALID_NAME_TYPE: 'Name must be string!',
        INVALID_NAME_LENGTH: 'Name must be between between 2 and 20 symbols long!',
        INVALID_NAME_SYMBOLS: 'Name can contain only latin symbols and whitespaces!',
        INVALID_MANA: 'Mana must be a positive integer number!',
        INVALID_EFFECT: 'Effect must be a function with 1 parameter!',
        INVALID_DAMAGE: 'Damage must be a positive number that is at most 100!',
        INVALID_HEALTH: 'Health must be a positive number that is at most 200!',
        INVALID_SPEED: 'Speed must be a positive number that is at most 100!',
        INVALID_COUNT: 'Count must be a positive integer number!',
        INVALID_SPELL_OBJECT: 'Passed objects must be Spell-like objects!',
        NOT_ENOUGH_MANA: 'Not enough mana!',
        TARGET_NOT_FOUND: 'Target not found!',
        INVALID_BATTLE_PARTICIPANT: 'Battle participants must be ArmyUnit-like!'
            // ZASTO KATO PREMESTIA ERROR MESSAGEES POD VALIDATOR PISHE CHE NE E DEFINIRANO - OTG: Tova ne e var a e obekt
    };

    const VALIDATOR = {
        validateName(name) { // Този запис на методи е възможен от ES 2015
            if (typeof name !== 'string') {
                throw new Error(ERROR_MESSAGES.INVALID_NAME_TYPE);
            }
            if (name.length < 2 || name.length > 20) {
                throw new Error(ERROR_MESSAGES.INVALID_NAME_LENGTH);
            }
            if (name.match(/[^a-zA-Z ]/)) {
                throw new Error(ERROR_MESSAGES.INVALID_NAME_SYMBOLS);
            }
        },
        validateMana(value) {
            if (typeof value !== 'number' || value < 1 || Number.isNaN(value)) {
                throw new Error(ERROR_MESSAGES.INVALID_MANA);
            }
        },
        validateEffect(func) {
            if (typeof func !== 'function' || func.length !== 1) {
                throw new Error(ERROR_MESSAGES.INVALID_EFFECT);
            }
        },
        validateAllignment(value) {
            if (value !== 'good' && value !== 'neutral' && value !== 'evil') {
                throw new Error('Alignment must be good, neutral or evil!');
            }
        },
        validateDamage(x) {
            if (x < 0 || x > 100 || Number.isNaN(x)) {
                throw new Error(ERROR_MESSAGES.INVALID_DAMAGE);
            }
        },
        validateHealth(x) {
            if (x < 0 || x > 200 || Number.isNaN(x)) {
                throw new Error(ERROR_MESSAGES.INVALID_HEALTH);
            }
        },
        validatecount(x) {
            if (x < 0 || ((x | 0) !== x) || Number.isNaN(x)) {
                throw new Error(ERROR_MESSAGES.INVALID_COUNT);
            }
        },
        validateSpeed(x) {
            if ((x < 1) || (x > 100) || Number.isNaN(x)) {
                throw new Error(ERROR_MESSAGES.INVALID_SPEED);
            }
        },
        validateMana(x) {
            if (typeof x !== 'number' || x <= 0 || Number.isNaN(x)) {
                throw Error(ERROR_MESSAGES.INVALID_MANA);
            }
        }

    };

    var Id = (function() { // Generator na unikalno celochisleno chislo ot 1 nagore
        var id = 0;

        function nextId() { // izvikvame -             this._id = Id.nextId();
            id++;
            return id;
        }
        return {
            nextId: nextId
        };
    })();

    class Spell {
        constructor(name, manaCost, effect) {
            this.name = name;
            this.manaCost = manaCost;
            this.effect = effect;
        }
        get name() {
            return this._name;
        }
        set name(name) {
            VALIDATOR.validateName(name);
            this._name = name; // ZASTO TRQBVA DA SLAGAM DOLNA CHERTA - BEZ NEYA DAVA GRESHKA - 
            //Защото this.name извиква пак setter и става безкрайна рекурсия. В конструктура реално извикваме setter name.
        }
        get manaCost() {
            return this._manaCost;
        }
        set manaCost(value) {
            VALIDATOR.validateMana(value);
            this._manaCost = value;
        }
        get effect() {
            return this._effect;
        }
        set effect(func) {
            VALIDATOR.validateEffect(func);
            this._effect = func;
        }
    }

    class Unit {
        constructor(name, alignment) {
            this.name = name;
            this.alignment = alignment;
        }
        get name() {
            return this._name;
        }
        set name(name) {
            VALIDATOR.validateName(name);
            this._name = name;
        }
        get alignment() {
            return this._alignment;
        }
        set alignment(value) {
            VALIDATOR.validateAllignment(value);
            this._alignment = value;
        }

    }

    class ArmyUnit extends Unit {
        constructor(name, alignment, damage, health, count, speed) {
            super(name, alignment);
            this._id = Id.nextId();
            this.damage = damage;
            this.health = health;
            this.count = count;
            this.speed = speed;
        }
        get id() {
            return this._id;
        }
        get damage() {
            return this._damage;
        }
        set damage(x) {
            VALIDATOR.validateDamage(x);
            this._damage = x;
        }
        get health() {
            return this._health;
        }
        set health(x) {
            VALIDATOR.validateHealth(x);
            this._health = x;
        }
        get count() {
            return this._count;
        }
        set count(x) {
            VALIDATOR.validatecount(x);
            this._count = x;
        }
        get speed() {
            return this._speed;
        }
        set speed(x) {
            VALIDATOR.validateSpeed(x);
            this._speed = x;
        }
    }

    class Commander extends Unit {
        constructor(name, alignment, mana) {
            super(name, alignment);
            this.mana = mana;
            this.spellbook = []; // Syzdavame kato za nacahalo prazen masiv t.k. v uslowieto  ne e spomenato drugo
            this.army = [];
        }
        get mana() {
            return this._mana;
        }
        set mana(x) {
            VALIDATOR.validateMana(x);
            this._mana = x;
        }
    }
    const battleManagerData = {
        commanderrs: [],
        spells: [],
        armyUnits: {},
        armyUnitsQuery: []
    }
    Array.prototype.filterByProperty = function(query, propName) { // Variant II - function filterByProperty (arr,query, propName) {}
        if (!query.hasOwnProperty(propName)) {
            return this; //?? Kak razbirame che vrysta prazen masiv kogato niama syvpadenie
        }
        const value = query[propName]; // Ne raboti s query.propName - zastoto propName ne go vyzpriema kato promenliva
        return this.filter(x => x[propName] === value);
    }
    const battlemanager = {
        getCommander(name, alignment, mana) {
            return new Commander(name, alignment, mana);
        },
        getArmyUnit(options) {
            const unit = new ArmyUnit(options.name, options.alignment, options.damage, options.health, options.count, options.speed);
            //Bqh razmenil options.count i options.speed w parametrite na unit i mi hvyrlqshe greshka
            battleManagerData.armyUnits[unit.id] = unit;
            battleManagerData.armyUnitsQuery.push(unit);
            return unit;
        },
        getSpell(name, manaCost, effect) {
            return new Spell(name, manaCost, effect);
        },
        addCommanders(...commanders) { // Parameters: arbitary number of Commanders
            battleManagerData.commanderrs.push(...commanders); // Syzdavame si obekt battleManagerData izvyn obekta battlemanager za da 
            //pazim informaciq
            return this;
        },
        addArmyUnitTo(commanderName, armyUnit) {
            battleManagerData.commanderrs
                .find(c => c.name === commanderName)
                .army.push(armyUnit);
            return this;
        },
        addSpellsTo(commanderName, ...spells) {
            battleManagerData.commanderrs
                .find(c => c.name === commanderName)
                .spellbook.push(...spells); // Kak se pushvat - kato 1 poziciq koqto e masiv li?
            return this;
        },
        findCommanders(query) { // Dava 14 tochki v Bgcoder
            return battleManagerData.commanderrs
                .filterByProperty(query, 'name')
                .filterByProperty(query, 'alignment')
                .sort(x => x.name);
        },
        findArmyUnitById(id) {
            return battleManagerData.armyUnits[id]; // ne dava nikakvi tochki nito v Bgcoder nito v lokalnite testove
        },
        findArmyUnits(query) {
            return battleManagerData.armyUnitsQuery
                .filterByProperty(query, 'id')
                .filterByProperty(query, 'name')
                .filterByProperty(query, 'alignment')
                .sort((x, y) => {
                    const cmp = y.speed - x.speed;
                    if (cmp === 0) {
                        return x.name.localeCompare(y.name); // NE GO RAZBIRAM
                    }
                    return cmp;
                });
        },
        spellcast(casterName, spellName, targetUnitId) {

            let Commander = battleManagerData.commanderrs.find(c => c.name === casterName);
            if (typeof Commander === 'undefined') {
                throw Error(`Can't cast with non-existant commander ${casterName}!`);
            }
            let Spell = Commander.spellbook.find(spell => spell.name === spellName);
            if (typeof Spell === 'undefined') {
                throw Error(`${casterName} doesn't know ${spellName}`);
            }
            if (Commander.mana < Spell.manaCost) {
                throw Error(ERROR_MESSAGES.NOT_ENOUGH_MANA);
            }
            Commander.mana -= Spell.manaCost;

            let unit = this.findArmyUnitById(targetUnitId);
            if (typeof unit === 'undefined') {
                throw Error(ERROR_MESSAGES.TARGET_NOT_FOUND);
            }
            Spell.effect(unit);
            return this;
        },
        battle(attacker, defender) {

            attacker.totalDamage = attacker.damage * attacker.count;
            defender.totalHealth = defeneder.health * defender.count;
            defender.totalHealth -= attacker.totalDamage;
            defender.count = Math.ceil(defender.totalHealth / defender.health);

            return this;
        }

    };

    return battlemanager;
}
module.exports = solve;



const battlemanager = solve();

const cyki = battlemanager.getCommander('Cyki', 'good', 15),
    koce = battlemanager.getCommander('Koce', 'good', 20);

battlemanager.addCommanders(cyki, koce);
console.log(cyki);

battlemanager.addCommanders(battlemanager.getCommander('Darth Vader', 'evil', 50));

const peter = battlemanager.getArmyUnit({
    name: 'Peter',
    alignment: 'neutral',
    damage: 70,
    health: 25,
    speed: 50,
    count: 10
});

const siths = battlemanager.getArmyUnit({
    name: 'Sith',
    alignment: 'evil',
    damage: 60,
    health: 25,
    speed: 50,
    count: 10
});


battlemanager.addArmyUnitTo('Darth Vader', siths);
battlemanager.addArmyUnitTo('Darth Vader', peter);
console.log(battlemanager.findArmyUnitById(3));

battlemanager
    .addCommanders(
        battlemanager.getCommander('Cyki', 'evil', 50),
        battlemanager.getCommander('Koce', 'evil', 50)
    );

const units = {
    zerg: battlemanager.getArmyUnit({
        name: 'Zerg',
        alignment: 'evil',
        damage: 50,
        speed: 40,
        health: 30,
        count: 100
    }),
    programmers: battlemanager.getArmyUnit({
        name: 'Devs',
        alignment: 'good',
        damage: 40,
        speed: 30,
        health: 30,
        count: 130
    }),
    goodTrainers: battlemanager.getArmyUnit({
        name: 'Trainers',
        alignment: 'good',
        damage: 80,
        speed: 40,
        health: 40,
        count: 4
    }),
    evilTrainers: battlemanager.getArmyUnit({
        name: 'Trainers',
        alignment: 'evil',
        damage: 90,
        speed: 30,
        health: 40,
        count: 4
    })
};

battlemanager
    .addArmyUnitTo('Cyki', units.programmers)
    .addArmyUnitTo('Cyki', units.goodTrainers)
    .addArmyUnitTo('Koce', units.zerg);

console.log(battlemanager.findArmyUnits({ name: 'Trainers', alignment: 'evil' }));


// [ { name: 'Trainers', alignment: 'evil', ... } ]   
console.log(battlemanager.findArmyUnits({ name: 'Trainers' }));

/* [ { name: 'Trainers', alignment: 'good', ... }, 
    { name: 'Trainers', alignment: 'evil', ... } ]  */