//Bad "enum", because Javascript doesn't have bultin enums.
const CardType = {
    UNDEFINED : 0,
    MEMBER : 1,
    ROLE : 2,
    CHANNEL : 3,
    MEME : 4
};

const AnimType = {
	NONE: 0,
	TARGET: 1,
	EFFECT: 2,
	SHUFFLE: 3,
	DESTROY: 4,
	BOUNCE: 5,
	ATTACK: 6,
    TOPGRAVE: 7,
    FLIPUP: 8,
    FLIPDOWN: 9,
    REVEAL: 10
};

const CardLocation = {
    NONE : 0b0,
    CHANNEL_ZONES : 0b1,
    MEMBER_ZONE_CURRENT : 0b10,
    MEMBER_ZONE_OPPOSITE : 0b100,
    MEMBER_ZONES: 0b110,
    MEME_ZONES : 0b1000,
    FIELD : 0b1111,
    OFFLINE : 0b10000,
    FIELD_OFFLINE : 0b11111,
    DECK : 0b100000,
    ALL : 0b111111
};

//The bottom left-most card in cards.png. It is the same texture rect used for facedown cards.
const UNDEFINED_CARD_INDEX = 159;

//Empty list populated at runtime by the cards defined in assets/cards.json
CardIndex = []

//Empty list populated at runtime by the deck defined in assets/dummy_deck.json
DummyDeck = []

const CardColor = {
    NONE : 0,
    RED : 1,
    ORN : 2,
    YLW : 3,
    GRN : 4,
    BLU : 5,
    PPL : 6,
    PNK : 7,
    GRY : 8
}

const MemeCategory = {
	NML : 0,
	CTN : 1,
    RSP : 2,
    VRT : 3
}

const CardStatus = {
    OFFLINE : 0,
    ONLINE : 1,
    IDLE : 2,
    DONOTDISTURB : 3,
    STREAMING : 4
}

class Card {
    constructor() {
        this.type = CardType.UNDEFINED;
		this.category = MemeCategory.CTN;
        this.status = CardStatus.ONLINE;
        this.index = 0;
        this.role = null; //Role applied to card, if applicable
        this.obj = null;
        this.currentHP = 0;
        this.name = "";
        this.original_name = "";
        this.mod = {
            hp: 0,
            atk: 0,
            def: 0
        };
    }

	//Sets the card index.
    set_index(index) {
        this.index = index;
        this.update();
        this.currentHP = this.hp;
    }

    boost(stat, amt) {
        this.mod[stat] += amt;
    }

    nerf(stat, amt) {
        this.mod[stat] -= amt;
    }

    //Makes the instance card a copy of a card defined in CardIndex, giving the instance
    //card the CardIndex's property values.
    update() {
        var protocard = CardIndex[this.index];
        for(var prop in protocard) {
            this[prop] = protocard[prop]; //Copies over the properties from the protocard
        }
        this.original_name = this.name;
    }

    isMember() { return this.type == CardType.MEMBER; }
    isChannel() { return this.type == CardType.CHANNEL; }
    isMeme() { return this.type == CardType.MEME; }
    isRole() { return this.type == CardType.ROLE; }

    getName() { return this.name; }
    getOriginalName() { return this.original_name; }
    hasOriginalName() { return this.name == this.card.original_name; }

    getAttack() { return this.atk; }
    getDefense() { return this.def; }
    getLevel() { return this.lvl; }

    getMemeCategory() { return this.category; }
    
    getChannelSubject() { return this.subject; }
}

class Deck {
    constructor() {
        this.card = [];
    }

	//Creates a copy of the deck.
    copy() {
        var d = new Deck();
        for(i in this.card) {
            var c = new Card();
            c.set_index(this.card[i].index);
            d.add(c);
        }
        return d;
    }

	//Create a raw copy of a list of cards in the deck.
    rawcopy() {
        var d = [];
        for(i in this.card) {
            d.push(this.card[i].index);
        }
        return d;
    }

    fromJSON(json) {
        for(i in json) {
            var c = new Card();
            c.set_index(json[i]);
            this.add(c);
        }
    }

	//Pushes a card into the deck.
    add(card) {
        this.card.push(card);
    }

	//Returns the top of the deck.
    get_top() {
        return this.card[this.card.length - 1]
    }

    //Returns a filtered list of cards in the deck
    getFilteredList(filter) {
        var fl = [];
        for(i in this.card) {
            var c = this.card[i];
            if(filter(c))
                fl.push(c);
        }
        return fl;
    }

    //Removes a card from the deck.
    remove(card) {
        for(i in this.card) {
            var c = this.card[i];
            if(c === card)
                this.card.splice(i, 1);
        }
    }

	//Shuffles the deck.
    shuffle() {
        var len = this.card.length;
        for(i = len-1; i > 1; i--) {
            var j = getRandomInt(0, i+1);
            var c = this.card[j]; //Move reference into c
            this.card[j] = this.card[i]; //J references I
            this.card[i] = c;   //I references C
        }
    }
	
    //Sorts deck
    sort() {
        this.card.sort(function(a,b){ return a.index - b.index; });
    }

	//Removes the card at the top of the deck and returns it.
    draw() {
        return this.card.pop();
    }

	//Updates the cards.
    update() {
        for(var i in this.card) {
            this.card[i].update();
        }
    }
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}