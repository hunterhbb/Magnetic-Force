/**
 * Created by chenryoutou on 14-8-15.
 */

var winSize = null;

var KeyCode_Z = 90,
    KeyCode_X = 88,
    KeyCode_N = 78,
    KeyCode_M = 77,

    BACK_ZORDER = 0,
    BACK_TAG = 33,
    PLAYER_ZORDER = 10,
    TUBE_ZORDER = 200,
    ITEM_ZORDER = 11,
    MAP_ZORDER = 1,
    LEFT_GATE_TAG = 103,
    RIGHT_GATE_TAG = 104,
    MenuUI_ZORDER = 300;

var GameLayer = cc.Layer.extend({

    isBegin : false,

    space : null,

    debugNode : null,

    f_player:null,

    s_player:null,

    itemLayer : null,

    isEffectPlaying: false,

    init : function(){

        if ( !this._super() ){
            return false;
        }

        winSize = cc.director.getWinSize();


//        var armature = ccs.Armature.create("robot");
//        armature.getAnimation().playWithIndex(2);
//        armature.setPosition(200,300);
//        this.addChild(armature,100);

        this.loadResoure();

        this.createBackground();

        this.createPhysicsWorld();

        this.setupDebugNode();

        this.createWalls();

        this.createPlayers();

        this.createMagnetSystem();

        this.createItems();

        this.createScoreController();

        return true;
    },

    createBackground : function() {
//        var back = new cc.Sprite(res.BackgroundA);
//        back.x = cc.winSize.width/2;
//        back.y = 0;
//        back.anchorY = 0;

//
//        var ground = new cc.Sprite(res.Ground);
//        ground.x = cc.winSize.width/2;
//        ground.y = ground.height/2;
//
        var tube = new cc.Sprite(res.Tube);
        tube.x = cc.winSize.width / 2 - 5;
        tube.y = cc.winSize.height - 185;
        tube.anchorY = 0;
//
//        //left gate
//        var spriteFrameCache = cc.spriteFrameCache;
//        var left_gate = new cc.Sprite(spriteFrameCache.getSpriteFrame("purpleA.png"));
//        left_gate.setPosition(cc.p(0,0));
//        left_gate.setAnchorPoint(cc.p(0,0));
//
//        //right gate
//        var right_gate = new cc.Sprite(spriteFrameCache.getSpriteFrame("redA.png"));
//        right_gate.setPosition(cc.p(cc.winSize.width, 0));
//        right_gate.setAnchorPoint(cc.p(1,0));
//
////        this.addChild(back, BACK_ZORDER);
//        this.addChild(ground, BACK_ZORDER);
        this.addChild(tube, TUBE_ZORDER);
//        this.addChild(left_gate,BACK_ZORDER,LEFT_GATE_TAG);
//        this.addChild(right_gate,BACK_ZORDER,RIGHT_GATE_TAG);

        var backGround = new BackGroundLayer();
        this.addChild(backGround,BACK_ZORDER,BACK_TAG);

        this.showMenu();
    },

    createPhysicsWorld : function () {

        Physics.init(this.parent);
        this.space = Physics.world;
        // Gravity
        this.space.gravity = cp.v(0, -300);
    },
    setupDebugNode : function (){
        this.debugNode = cc.PhysicsDebugNode.create( this.space );
        this.debugNode.visible = true ;
        this.addChild( this.debugNode );
    },
    onToggleDebug : function() {
        var state = this.debugNode.visible;
        this.debugNode.visible = !state ;
    },
    createWalls : function () {

        Level.createLevel(res.Level1, this);

    },
    createPlayers : function () {

        this.f_player = new Player("robot", 50, winSize.width/6*5, 57);
        //var index = [5];
        this.f_player.getAnimation().playWithIndex(0);
        this.addChild(this.f_player, PLAYER_ZORDER);
//        this.f_player.isMagnetUpdated = function () {
//           var f_player_label = window.document.getElementById("f_player_magnet");
//            f_player_label.innerHTML = "&nbsp;&nbsp;&nbsp;f_megnet : " + this.isMagnet;
//            //console.log(s_player_label.innerHTML);
//        };
//        this.f_player.isAttractUpdated = function () {
//            var f_player_label = window.document.getElementById("f_player_attratic");
//            f_player_label.innerHTML =  "&nbsp;&nbsp;&nbsp;f_attratic : " + this.isAttract;
//            //console.log(s_player_label.innerHTML);
//        };

        this.s_player = new Player("robot", 50, winSize.width/6, 57);
        this.s_player.getAnimation().playWithIndex(3);
        this.addChild(this.s_player, PLAYER_ZORDER);
//        this.s_player.isMagnetUpdated = function () {
//            var s_player_label = window.document.getElementById("s_player_magnet");
//            s_player_label.innerHTML = "&nbsp;&nbsp;&nbsp;s_megnet : " +this.isMagnet;
//            //console.log(s_player_label.innerHTML);
//        };
//        this.s_player.isAttractUpdated = function () {
//            var s_player_label = window.document.getElementById("s_player_attratic");
//            s_player_label.innerHTML = "&nbsp;&nbsp;&nbsp;s_attratic : " +this.isAttract;
//            //console.log(s_player_label.innerHTML);
//        };

    },
    createMagnetSystem : function () {

        MagneticSystem.init(this, this.f_player, this.s_player);

    },
    createItems : function (){
        this.itemLayer = new ItemsLayer(this);
        this.addChild(this.itemLayer, ITEM_ZORDER);
    },

    createScoreController : function(){
      ScoreController.init(this);
    },

    update : function( delta ) {
        this.space.step( delta );

        MagneticSystem.update(delta);
        this.f_player.phyUpdate();
        this.s_player.phyUpdate();

        this.itemLayer.update(delta);
    },
    onEnter : function () {
        this._super();
        this.scheduleUpdate();

        //button listener
        cc.eventManager.addListener({
            event : cc.EventListener.KEYBOARD,
            onKeyPressed : this.onKeyPressed,
            onKeyReleased: this.onKeyReleased
        }, this);
        //setup game begin.
        this.isBegin = true;

        //ccs.A

        this.space.addCollisionHandler(Player.COL_TYPE, Item.COL_TYPE, null, this.playerTouchItem, null, null);
        this.space.addCollisionHandler(Player.COL_TYPE, Wall.COL_TYPE, null, this.playerHitGround, null, null);
        this.space.addCollisionHandler(Player.COL_TYPE, Trampoline.COL_TYPE, null, this.playerHitTrampoline, null, null);
        this.space.addCollisionHandler(Player.COL_TYPE, CornerTrampoline.COL_TYPE, null, this.hitTrampoline, null, null);
        this.space.addCollisionHandler(Bomb.COL_TYPE, CornerTrampoline.COL_TYPE, null, this.hitTrampoline, null, null);
//        this.space.addCollisionHandler(Player.COL_TYPE, Bomb.EXPLODE_COL_TYPE, null, this.playerHitGround, null, null);

    },
    onExit : function () {
        this.unscheduleUpdate();
        this.space.removeCollisionHandler(Player.COL_TYPE,Item.COL_TYPE);
        this._super();
    },
    onKeyPressed : function (key,event) {
        var target = event.getCurrentTarget();
        switch (key) {
            case KeyCode_M:
                target.f_player.isMagnet = true;
                target.f_player.isAttract = false;
                break;
            case KeyCode_N:
                target.f_player.isMagnet = true;
                target.f_player.isAttract = true;
                target.f_player.jump();
                break;
            case KeyCode_X:
                target.s_player.isMagnet = true;
                target.s_player.isAttract = false;
                break;
            case KeyCode_Z:
                target.s_player.isMagnet = true;
                target.s_player.isAttract = true;
                target.s_player.jump();
                break;
            default :
                break;
        }
    },
    onKeyReleased : function (key,event) {
        var target = event.getCurrentTarget();
        switch (key) {
            case KeyCode_M:
                target.f_player.isMagnet = false;
                break;
            case KeyCode_N:
                target.f_player.isMagnet = false;
                break;
            case KeyCode_X:
                target.s_player.isMagnet = false;
                break;
            case KeyCode_Z:
                target.s_player.isMagnet = false;
                break;
            default :
                break;
        }
    },
    playerTouchItem : function (arb, space, ptr) {
        var shapes = arb.getShapes();
        var player = shapes[0];
        var item = shapes[1];
        var armature = player.obj.view;
//        console.log("aaaaaaaa");
//        if(armature){
//            console.log(armature.eatItem());
//        }

        //console.log(armature);
//        if(armature){
//            armature.eatItem();
//        }

//        var parentLayer = player.obj.view.parent;
//        if(!parentLayer.isEffectPlaying){
//
//                cc.audioEngine.playEffect(res.hit2_ogg,false);
//            parentLayer.isEffectPlaying = true;
//            parentLayer.scheduleOnce(parentLayer.resetEffect, 2);
//        }
        return true;
    },
    playerHitGround : function (arb, space, ptr) {
        var shapes = arb.getShapes();
        var player = shapes[0];
        var ground = shapes[1];

//        var n = arb.getNormal(0);
//        var angle = cc.pToAngle( cc.p(n.x, n.y) );
        var angle = Physics.calculAngle(arb);

//        console.log(angle);

//        console.log(v.x + "   " + v.y);
//        var angle = Math.atan2(v.y , v.x);

        var player_armature = player.obj.view;
        player_armature.hitGround(arb.getPoint(0), angle);

        return true;
    },
    playerHitTrampoline : function (arb, space, ptr) {
        var shapes = arb.getShapes();
        var player = shapes[0].obj.view;
        player.jump(Trampoline.JUMP_FACTOR);
    },
    hitTrampoline : function (arb) {
        var shapes = arb.getShapes();
        var target = shapes[0];
        target.body.vx += BOMB_JUMP_ADD_SPEED * Trampoline.JUMP_FACTOR;
        target.body.vy += BOMB_JUMP_ADD_SPEED * Trampoline.JUMP_FACTOR;
    },

    playerBeExplode : function (arb, space, ptr) {

    },

    loadResoure : function () {
        var armatureDataManager = ccs.armatureDataManager;
        armatureDataManager.addArmatureFileInfo(res.Robot_exportJSON);
        armatureDataManager.addArmatureFileInfo(res.Explode_exportJSON);
        var spriteFrameCache = cc.spriteFrameCache;
        spriteFrameCache.addSpriteFrames(res.Bomb_plist);
        spriteFrameCache.addSpriteFrames(res.House_plist);
        spriteFrameCache.addSpriteFrames(res.Menu_plist);

    },
    showMenu : function () {
        var back = this.getChildByTag(BACK_TAG);
        back.scaleX = 1.4;
        back.scaleY = 1.2;

        var spriteFrame = cc.spriteFrameCache;
        var btn_1p = new cc.Sprite(spriteFrame.getSpriteFrame("1pBtn.png"));
        var btn_2p = new cc.Sprite(spriteFrame.getSpriteFrame("2pBtn.png"));
        var btn_4p = new cc.Sprite(spriteFrame.getSpriteFrame("4pBtn.png"));
        var btn_help = new cc.Sprite(spriteFrame.getSpriteFrame("helpBtn.png"));
        var btn_setting = new cc.Sprite(spriteFrame.getSpriteFrame("settingsBtn.png"));
        var logo_png = new cc.Sprite(spriteFrame.getSpriteFrame("logo.png"));
        logo_png.setAnchorPoint(cc.p(0,0));
        logo_png.setPosition(cc.p(50,300));
        this.addChild(logo_png,MenuUI_ZORDER);
    }
});


GameLayer.create = function () {
    var gameLayer = new GameLayer();
    if (gameLayer && gameLayer.init()) {
        return gameLayer;
    }
    return null;
};

GameLayer.createScene = function () {
    var gameScene = new cc.Scene();
    gameLayer = GameLayer.create();
    gameScene.addChild(gameLayer);
    return gameScene;
};
