

var Item = cc.Sprite.extend({

    weight : 50,
    maxSpeed : ITEM_MAX_SPEED,
    _friction : ITEM_INIT_FRICTION,
    _elasticity : ITEM_INIT_ELASTICITY,

    phyObj : null,

    dead : false,

    ctor : function(file, type, x, y, sOrR) {
        this._super(file);

        var isCircle = type == Item.CIRCLE_SHAPE;

        var size = this.getContentSize();
        if (isCircle) {
            this.scale = sOrR * ITEM_SCALE_FACTOR / size.width;
            this.weight = sOrR * 4 / ITEM_WEIGHT_FACTOR;
        }
        else {
            this.scaleX = sOrR.width / size.width;
            this.scaleY = sOrR.height / size.height;
            this.weight = (sOrR.width + sOrR.height) / ITEM_WEIGHT_FACTOR;
        }
        this.maxSpeed = ITEM_MAXSPEED;

        this.initPhysics(isCircle, x, y, sOrR);
    },

    getFriction : function() {
        return this._friction;
    },
    setFriction : function(f) {
        this._friction = f;
        this.phyObj.setFriction(this._friction);
    },

    getElasticity : function() {
        return this._elasticity;
    },
    setElasticity : function(f) {
        this._elasticity = f;
        this.phyObj.setElasticity(this._elasticity);
    },

    initPhysics : function (isCircle, x, y, sOrR) {
        var origin = cc.p(x, y);

        if (isCircle) {
            this.phyObj = new CircleObject(this.weight, sOrR, this.maxSpeed, this, origin);
        }
        else {
            this.phyObj = new PhysicsObject(this.weight, sOrR, this.maxSpeed, this, origin);
        }
        this.phyObj.setFriction(this._friction);
        this.phyObj.setElasticity(this._elasticity);
        this.phyObj.shape.setCollisionType(Item.COL_TYPE);
    },

    update : function() {
        if (!this.phyObj) return;
        var pos = this.phyObj.getPosition();
        if (pos.x < -50 || pos.x > cc.winSize.width + 50 || pos.y < -50) {
            this.die();
            return;
        }

        this.x = pos.x;
        this.y = pos.y;
        this.rotation = -180 * this.phyObj.body.a / Math.PI;
    },

    _realDie : function() {
        MagneticSystem.removeOtherItem(this.phyObj.body);
        this.phyObj.removeSelf();
        this.phyObj = null;
        cc.pool.putInPool(this);
    },

    die : function () {
        if (this.dead)
            return;

        this.scheduleOnce(this._realDie, 0.3);
        this.dead = true;
    },

    unuse : function() {
        this.removeFromParent(true);
        this.retain();
    },
    reuse : function(file, type, x, y, sOrR) {
        this.release();
        if (file[0] == "#")
            this.setSpriteFrame(file.substr(1));
        else {
            var tex = cc.textureCache.textureForKey(file);
            this.setTexture(tex);
            this.setTextureRect(cc.rect(0, 0, tex.width, tex.height));
        }
        var size = this.getContentSize();

        var isCircle = type == Item.CIRCLE_SHAPE;
        if (isCircle) {
            this.scale = sOrR * ITEM_SCALE_FACTOR / size.width;
            this.weight = sOrR * 4 / ITEM_WEIGHT_FACTOR;
        }
        else {
            this.scaleX = sOrR.width / size.width;
            this.scaleY = sOrR.height / size.height;
            this.weight = (sOrR.width + sOrR.height) / ITEM_WEIGHT_FACTOR;
        }
        this.maxSpeed = ITEM_MAXSPEED;
        this.dead = false;

        this.initPhysics(isCircle, x, y, sOrR);
    }
});

Item.create = function(file, type, x, y, sOrR) {
    var ret = null;
    if (cc.pool.hasObj(Item))
        ret = cc.pool.getFromPool(Item, file, type, x, y, sOrR);
    else
        ret = new Item(file, type, x, y, sOrR);
    return ret;
};

var p = Item.prototype;
cc.defineGetterSetter(p, "friction", p.getFriction, p.setFriction);
cc.defineGetterSetter(p, "elasticity", p.getElasticity, p.setElasticity);

Item.COL_TYPE = GLOBAL_COL_TYPE++;

Item.CIRCLE_SHAPE = 0;
Item.RECT_SHAPE = 1;


var Bomb = Item.extend({
    bomb_armature : null,
    time : EXPLODE_TIME,
    isExplode : false,
    isEndExplode : false,
    isWarnning : false,
    anime : null,
    nastyDog : false,
    naughtyDog : false,
    ctor : function (file, type, x, y, sOrR) {
        this._super(file, type, x, y , sOrR);
        this.time = EXPLODE_TIME + EXPLODE_DEVIATION_TIME * Math.random();
        this.phyObj.shape.setCollisionType(Bomb.COL_TYPE);
    },
    update : function (dt) {
        this._super();
        this.time -= dt;

        if (!this.isExplode && this.time < EXPLODE_WARNNING_TIME) {
            if (!this.isWarnning && this.anime) {
                this.isWarnning = true;
                var repeatAction = cc.repeat(cc.sequence(cc.tintTo(1,128,0,0),cc.tintTo(1,255,200,200)),2);
                this.runAction(cc.sequence(repeatAction,cc.tintTo(1,200,75,75)));
            }
            if (this.time < 0) {
                this.isExplode = true;
                this.stopAllActions();
                this.bomb_armature = ccs.Armature.create("explode");
                this.bomb_armature.retain();
                var origin = this.getPosition();

                this.bomb_armature.phyObj = new CircleObject(EXPLODE_WEIGHT, EXPLODE_RADIUS, this.maxSpeed, this.bomb_armature, origin);
                this.bomb_armature.phyObj.setFriction(0);
                this.bomb_armature.phyObj.setElasticity(EXPLODE_ELASTICITY);
                this.bomb_armature.phyObj.shape.setCollisionType(Bomb.EXPLODE_COL_TYPE);

                if (this.phyObj) {
                    MagneticSystem.removeOtherItem(this.phyObj.body);
                    this.phyObj.removeSelf();
                    this.phyObj = null;
                }

                this.bomb_armature.scaleX = 2;
                this.bomb_armature.scaleY = 2;
                this.bomb_armature.setPosition(origin);
                this.bomb_armature.rotation = this.rotation;
                this.bomb_armature.getAnimation().playWithIndex(0);

                cc.audioEngine.playEffect(res.explosion_ogg,false);
                this.parent.addChild(this.bomb_armature);
                this.die();
            }
        }

        if (this.isExplode && !this.isEndExplode) {

            if (this.bomb_armature.getAnimation().isComplete()) {
                this.isEndExplode = true;
                this.bomb_armature.phyObj.removeSelf();
                this.bomb_armature.removeFromParent();
                this.bomb_armature = null;
            }
        }
    },

    captured : function (nasty) {
        if (nasty) {
            this.color = cc.color(255, 0, 0, 100);
            this.nastyDog = true;
            this.naughtyDog = false;
        }
        else {
            this.color = cc.color(0, 0, 255, 100);
            this.nastyDog = false;
            this.naughtyDog = true;
        }
    },

    _realDieWithArmature : function() {
        cc.pool.putInPool(this);
    },

    _realDie : function() {
        if (this.phyObj) {
            MagneticSystem.removeOtherItem(this.phyObj.body);
            this.phyObj.removeSelf();
            this.phyObj = null;
        }
        this.scheduleOnce(this._realDieWithArmature, 0.7);
        this.opacity = 0;
    },
    unuse : function () {
        this.stopAllActions();
        this._super();
    },
    reuse : function (file, type, x, y, sOrR) {
        this._super(file, type, x, y, sOrR);
        this.opacity = 255;
        this.isExplode = false;
        this.isEndExplode = false;
        this.isWarnning = false;
        this.naughtyDog = false;
        this.nastyDog = false;
        this.color = cc.color(255,255,255);
        this.time = EXPLODE_TIME + EXPLODE_DEVIATION_TIME * Math.random();
        this.phyObj.shape.setCollisionType(Bomb.COL_TYPE);
    }
});

Bomb.COL_TYPE = GLOBAL_COL_TYPE++;
Bomb.EXPLODE_COL_TYPE = GLOBAL_COL_TYPE++;
Bomb.animation = null;
Bomb.create = function (file, type, x, y, sOrR) {
    var ret = null;
    if (cc.pool.hasObj(Bomb))
        ret = cc.pool.getFromPool(Bomb, file, type, x, y, sOrR);
    else
        ret = new Bomb(file, type, x, y, sOrR);

    ret.setAnchorPoint(cc.p(0.35,0.35));
    if (!Bomb.animation) {
        var animFrames = [];
        for (var i = 1; i < 4; i++) {
            var str = "bomb" + i + ".png";
            var frame = cc.spriteFrameCache.getSpriteFrame(str);
            animFrames.push(frame);
        }
        Bomb.animation = new cc.Animation(animFrames, 0.1);
    }
    ret.anime = cc.animate(Bomb.animation).repeatForever();
    ret.runAction(ret.anime);
    return ret;
};
Bomb.createNoAnime = function (file, type, x, y, sOrR) {
    var ret = null;
    if (cc.pool.hasObj(Bomb))
        ret = cc.pool.getFromPool(Bomb, file, type, x, y, sOrR);
    else
        ret = new Bomb(file, type, x, y, sOrR);
    return ret;
};


var TrampolineNoTex = cc.Class.extend({
    ctor : function (objDesc) {
        var x = parseInt(objDesc.x), y = parseInt(objDesc.y), w = parseInt(objDesc.width), h = parseInt(objDesc.height);
        var phyObj = new StaticObject(x, y, w, h, this);
        phyObj.shape.setCollisionType(Trampoline.COL_TYPE);
    }
});

var Trampoline = cc.Sprite.extend({
    texfile : res.Tube,
    phyObj : null,

    ctor : function (objDesc) {
        this._super(this.texfile);
        var x = parseInt(objDesc.x), y = parseInt(objDesc.y), w = parseInt(objDesc.width), h = parseInt(objDesc.height);
        this.x = x + w/2;
        this.y = y + h;
        this.scaleX = w / this.width;
        this.scaleY = h / this.height;
        this.rotation = 180;

        this.phyObj = new StaticObject(x, y, w, h, this);
        this.phyObj.shape.setCollisionType(Trampoline.COL_TYPE);
    }
});

Trampoline.COL_TYPE = GLOBAL_COL_TYPE++;
Trampoline.JUMP_FACTOR = 5;

var CornerTrampoline = Trampoline.extend({
    texfile : res.Spring,

    ctor : function (objDesc) {
        this._super(objDesc);
        this.phyObj.shape.setCollisionType(CornerTrampoline.COL_TYPE);

        if (this.x > cc.winSize.width/2) {
            this.flippedX = true;
            this.rotation = 45;
        }
        else this.rotation = -45;
    }
});
CornerTrampoline.COL_TYPE = GLOBAL_COL_TYPE++;

var Platform = cc.Sprite.extend({
    texfile : res.Tube,
    phyObj : null,

    ctor : function (objDesc) {
        this._super(this.texfile);
        var x = parseInt(objDesc.x), y = parseInt(objDesc.y), w = parseInt(objDesc.width), h = parseInt(objDesc.height);
        this.x = x + w/2;
        this.y = y + h;
        this.scaleX = w / this.width;
        this.scaleY = h / this.height;
        this.rotation = 180;

        this.phyObj = new StaticObject(x, y, w, h, this);
    }
});