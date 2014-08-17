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
    TUBE_TAG = 200,
    ITEM_ZORDER = 11,
    MAP_ZORDER = 1,
    LEFT_GATE_TAG = 103,
    RIGHT_GATE_TAG = 104,
    MenuUI_ZORDER = 300,
    MenuUI_TAG = 300,
    GuideUI_ZORDER = 301,
    GuideUI_TAG = 301;

var GameLayer = cc.Layer.extend({

    isBegin : false,
    isOver : false,
    inTitle : false,

    space : null,

    debugNode : null,

    f_player:null,

    s_player:null,

    itemLayer : null,

    isEffectPlaying: false,

    gameController : null,

    ctor : function (showMenu) {
        this._super();
        winSize = cc.director.getWinSize();
        if (showMenu)
            this.initWithMenu();
        else this.init();

        //button listener
        cc.eventManager.addListener({
            event : cc.EventListener.KEYBOARD,
            onKeyPressed : this.onKeyPressed,
            onKeyReleased: this.onKeyReleased
        }, this);
    },
    init : function(){

        if ( !this._super() ){
            return false;
        }
//        var armature = ccs.Armature.create("robot");
//        armature.getAnimation().playWithIndex(2);
//        armature.setPosition(200,300);
//        this.addChild(armature,100);

        this.loadResoure();

        this.createBackground();

        this.createPhysicsWorld();
//
        //this.setupDebugNode();

        this.createWalls();

        this.createPlayers();

        this.createMagnetSystem();

        this.createItems();

        this.createGameController();
        this.isBegin = true;
        this.isOver = false;
        this.inTitle = false;

        return true;
    },

    initWithMenu : function () {
//        var armature = ccs.Armature.create("robot");
//        armature.getAnimation().playWithIndex(2);
//        armature.setPosition(200,300);
//        this.addChild(armature,100);

        this.isBegin = false;
        this.isOver = false;
        this.inTitle = true;

        this.loadResoure();

        this.createBackground();

        this.showMenu();

        return true;
    },
    createBackground : function() {


        var tubeX = cc.winSize.width / 2 - 5, tubeY = cc.winSize.height - 185;
        if(this.inTitle) {
            tubeY = cc.winSize.height + 185;
        }
        var tube = new cc.Sprite(res.Tube);
        tube.x = tubeX;
        tube.y = tubeY;
        tube.anchorY = 0;

        this.addChild(tube, TUBE_ZORDER,TUBE_TAG);

        // Add Tube Particle system
        this.forceEmitter = new cc.ParticleSystem(res.Pipe);
        this.forceEmitter.setPosition(tubeX, cc.winSize.height - 185 + tube.height/2);
        this.addChild(this.forceEmitter, TUBE_ZORDER-1);

        var backGround = new BackGroundLayer();
        this.addChild(backGround,BACK_ZORDER,BACK_TAG);
    },

    createPhysicsWorld : function () {
        Physics.init(this.parent);
        this.space = Physics.world;
        // Gravity
        this.space.gravity = cp.v(0, -300);

        //ccs.A
        Physics.addCollisionHandler(Player.COL_TYPE, Bomb.COL_TYPE, null, this.playerTouchBomb, null, null);
        Physics.addCollisionHandler(Player.COL_TYPE, Wall.COL_TYPE, null, this.playerHitGround, null, null);
        Physics.addCollisionHandler(Player.COL_TYPE, Trampoline.COL_TYPE, null, this.playerHitTrampoline, null, null);
        Physics.addCollisionHandler(Player.COL_TYPE, CornerTrampoline.COL_TYPE, null, this.hitTrampoline, null, null);
        Physics.addCollisionHandler(Bomb.COL_TYPE, CornerTrampoline.COL_TYPE, null, this.hitTrampoline, null, null);
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

    createGameController : function(){
      this.gameController = new ScoreController(this);
    },

    checkResult : function () {
        var result = this.itemLayer.checkForGoal();
        if (result == ScoreController.HIT_FP_HOUSE) {
            this.gameController.hitFpHouse();
        }
        else if (result == ScoreController.HIT_SP_HOUSE) {
            this.gameController.hitSpHouse();
        }
        if (this.gameController.isGameOver()) {
            this.gameController.gameOverAction();
        }
    },

    update : function( delta ) {
        if(this.isBegin && !this.inTitle){
            this.space.step( delta );

            this.f_player.phyUpdate();
            var x = this.f_player.x;
            if (x < -40 || x > cc.winSize.width + 40)
                this.gameController.forceWin(GameController.SP_WIN);
            this.s_player.phyUpdate();
            x = this.s_player.x;
            if (x < -40 || x > cc.winSize.width + 40)
                this.gameController.forceWin(GameController.FP_WIN);

            MagneticSystem.update(delta);
            this.itemLayer.update(delta);

            if (!this.isOver){
                this.gameController.update(delta);
                this.checkResult();
            }
        }
    },

    onEnter : function () {
        this._super();
        this.scheduleUpdate();
        //setup game begin.
        this.isBegin = true;

        //button listener
        cc.eventManager.addListener({
            event : cc.EventListener.KEYBOARD,
            onKeyPressed : this.onKeyPressed,
            onKeyReleased: this.onKeyReleased
        }, this);
    },
    clear : function() {
        MagneticSystem.clear();
        this.gameController && this.gameController.clear();
        Physics.clear();
    },
    onExit : function () {
        cc.eventManager.removeAllListeners();
        this.unscheduleAllCallbacks();
        this.unscheduleUpdate();
        this._super();
    },
    onKeyPressed : function (key,event) {
        var target = event.getCurrentTarget();

        if ( !target.isBegin || target.isOver || !target.f_player || !target.s_player){
            return;
        }

        switch (key) {
            case KeyCode_M:
                target.f_player.isMagnet = true;
                target.f_player.isAttract = false;
                target.f_player.repulsion(2);
                break;
            case KeyCode_N:
                target.f_player.isMagnet = true;
                target.f_player.isAttract = true;
                target.f_player.jump();
                target.f_player.setScale(0.95,0.95);
                target.f_player.attraction(1);
                break;
            case KeyCode_X:
                target.s_player.isMagnet = true;
                target.s_player.isAttract = false;
                target.s_player.repulsion(5);
                break;
            case KeyCode_Z:
                target.s_player.isMagnet = true;
                target.s_player.isAttract = true;
                target.s_player.jump();
                target.s_player.setScale(0.95,0.95);
                target.s_player.attraction(4);
                break;
            default :
                break;
        }
    },
    onKeyReleased : function (key,event) {
        var target = event.getCurrentTarget();

        if ( !target.isBegin || target.isOver || !target.f_player || !target.s_player){
            return;
        }

        switch (key) {
            case KeyCode_N:
                target.f_player.setScale(1/0.95,1/0.95);
            case KeyCode_M:
                target.f_player.isMagnet = false;
                target.f_player.normal(0);
                target.f_player.resetJump();
                break;
            case KeyCode_Z:
                target.s_player.setScale(1/0.9,1/0.9);
            case KeyCode_X:
                target.s_player.isMagnet = false;
                target.s_player.normal(3);
                target.s_player.resetJump();
                break;
            default :
                break;
        }
    },
    playerTouchBomb : function (arb, space, ptr) {
//        var shapes = arb.getShapes();
//        var player = shapes[0];
//        var item = shapes[1];
//        var armature = player.obj.view;
////        console.log("aaaaaaaa");
////        if(armature){
////            console.log(armature.eatItem());
////        }
//
//        //console.log(armature);
////        if(armature){
////            armature.eatItem();
////        }

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
        spriteFrameCache.addSpriteFrames(res.game_ui_plist);
        spriteFrameCache.addSpriteFrames(res.over_ui_plist);
        spriteFrameCache.addSpriteFrames(res.Menu_plist);
        spriteFrameCache.addSpriteFrames(res.GuideUI_plist) ;
    },
    showMenu : function () {
        var back = this.getChildByTag(BACK_TAG);
        back.scaleX = 1.4;
        back.scaleY = 1.2;
        var target = this;
        var menu_layer = new cc.Layer();
        menu_layer.setPosition(cc.p(0,0));
        var spriteFrame = cc.spriteFrameCache;
        var btn_1p_spriteFrame = spriteFrame.getSpriteFrame("1pBtn.png");
        var btn_1p = new cc.MenuItemImage(btn_1p_spriteFrame,btn_1p_spriteFrame,function () {
            if(!this.clicked){
                this.clicked = true;
                target.runAction(new cc.Sequence(
                    new cc.CallFunc(hideUI),
                    new cc.DelayTime(2.5),
                    new cc.CallFunc(this.playWith1P, this)
                ));
            }

        },this);
        btn_1p.setPosition(cc.p(cc.winSize.width / 2 - 47,340));

        var btn_2p_spriteFrame = spriteFrame.getSpriteFrame("2pBtn.png");
        var btn_2p = new cc.MenuItemImage(btn_2p_spriteFrame,btn_2p_spriteFrame,function () {
            if(!this.clicked){
                this.clicked = true;
                target.runAction(new cc.Sequence(
                    new cc.CallFunc(hideUI),
                    new cc.DelayTime(2),
                    new cc.CallFunc(this.playWith2P, this)

                ));
            }
        },this);
        btn_2p.setPosition(cc.p(cc.winSize.width / 2 + 77,230));

        var btn_4p_spriteFrame = spriteFrame.getSpriteFrame("4pBtn.png");
        var btn_4p = new cc.MenuItemImage(btn_4p_spriteFrame,btn_4p_spriteFrame,null/*function () {
            target.runAction(new cc.Sequence(
                new cc.CallFunc(hideUI),
                new cc.DelayTime(2.5),
                new cc.CallFunc(target.playWith4P)
            ));
        },*/,this);
        btn_4p.setPosition(cc.p(cc.winSize.width / 2 - 55,125));

        var btn_help = new cc.Sprite(spriteFrame.getSpriteFrame("helpBtn.png"));
        btn_help.setPosition(cc.p(cc.winSize.width - 55,55));

        var btn_setting = new cc.Sprite(spriteFrame.getSpriteFrame("settingsBtn.png"));
        btn_setting.setPosition(cc.p(55,55));

        var logo_png = new cc.Sprite(spriteFrame.getSpriteFrame("logo.png"));
        logo_png.setAnchorPoint(cc.p(0,0));
        logo_png.setPosition(cc.p(40,320));

        var tube = this.getChildByTag(TUBE_TAG);
        function hideUI () {
            logo_png.runAction( new cc.Sequence(
                new cc.DelayTime(0.5),
                new cc.EaseSineOut(new cc.MoveTo(1.0,cc.p(logo_png.x,cc.winSize.height + 300))))
            );
            btn_1p.runAction( new cc.Sequence(
                 new cc.EaseBackIn(new cc.MoveTo(0.9,cc.p(-500,btn_1p.y))))
            );
            btn_2p.runAction( new cc.Sequence(
                 new cc.DelayTime(0.1),
                 new cc.EaseBackIn(new cc.MoveTo(0.9,cc.p(cc.winSize.width + 500,btn_2p.y))))
            );
            btn_4p.runAction( new cc.Sequence(
                new cc.DelayTime(0.2),
                new cc.EaseBackIn(new cc.MoveTo(0.9,cc.p(-500,btn_4p.y))))
            );
            btn_help.runAction(new cc.Sequence(
                    new cc.DelayTime(0.5),
                    new cc.EaseSineOut(new cc.MoveTo(1.0,cc.p(btn_help.x,-100))))
            );
            btn_setting.runAction(new cc.Sequence(
                    new cc.DelayTime(0.5),
                    new cc.EaseSineOut(new cc.MoveTo(1.0,cc.p(btn_setting.x,-100))))
            );
            back.runAction(new cc.Sequence(
                    new cc.DelayTime(1.5),
                    new cc.ScaleTo(0.8,1.0,1.0)
                )
            );
            tube.runAction(new cc.Sequence(
                    new cc.DelayTime(1.5),
                    new cc.MoveTo(0.8,cc.winSize.width / 2 - 5,cc.winSize.height - 185)
                )
            );
        }

        var menu = cc.Menu.create(btn_1p,btn_2p,btn_4p);
        menu.setPosition(cc.p(0,0));

//        this.addChild(btn_2p,MenuUI_ZORDER);
//        this.addChild(btn_4p,MenuUI_ZORDER);
        menu_layer.addChild(btn_help);
        menu_layer.addChild(btn_setting);
        menu_layer.addChild(logo_png);
        menu_layer.addChild(menu);
        this.addChild(menu_layer,MenuUI_ZORDER,MenuUI_TAG);
    },
    playWith1P : function () {
        this.getChildByTag(MenuUI_TAG).removeFromParent();
        this.guideUI1P();
    },
    playWith2P : function () {
        this.getChildByTag(MenuUI_TAG).removeFromParent();
        //this.clear();
        var layer = nextLevel(cc.director.getRunningScene(), true, 1);
        layer.guideUI2P();
    },
    playWith4P : function () {
        console.log("4p");
    },
    settingMenu : function () {

    },
    helpMenu  : function () {

    },
    guideUI1P : function () {//2p guideUI init
        var target  = this;
        var spriteFrameCache = cc.spriteFrameCache;
        var guide_layer = new cc.Layer();
        guide_layer.setPosition(cc.p(0,0));

        var guide_pic = new cc.Sprite(spriteFrameCache.getSpriteFrame("guidePic.png"));
        guide_pic.setPosition(cc.p(cc.winSize.width / 2 ,cc.winSize.height + 200));
        guide_pic.runAction(new cc.Sequence(
            new cc.DelayTime(0.1),
            new cc.EaseBackOut(new cc.MoveTo(1.0,cc.p(cc.winSize.width / 2 ,520)))
        ));
        var guide_text = new cc.Sprite(spriteFrameCache.getSpriteFrame("guideText.png"));
        guide_text.setPosition(cc.p(-300 , 180));
        guide_text.runAction(new cc.Sequence(
            new cc.DelayTime(0.3),
            new cc.EaseBackOut(new cc.MoveTo(1.0,cc.p(cc.winSize.width / 2 ,180)))
        ));

        var confirm_btn_frame = spriteFrameCache.getSpriteFrame("confirmBtn.png")
        var confirm_btn = new cc.MenuItemImage(confirm_btn_frame,confirm_btn_frame,function () {
            if( !this.clicked_1){
                this.clicked_1 = true;

                target.runAction(new cc.Sequence(
                    new cc.CallFunc(hideUI),
                    new cc.DelayTime(2.3),
                    new cc.CallFunc(target.initAfterMenu,target)
                ));
            }
        },this);
        confirm_btn.setPosition(cc.p(cc.winSize.width - 200 , 60));
        var menu = new cc.Menu(confirm_btn);
        menu.setPosition(cc.p(0,0));

        function hideUI () {
            guide_pic.runAction(new cc.Sequence(
                new cc.DelayTime(0.3),
                new cc.EaseBackIn(new cc.MoveTo(1.0,cc.p(cc.winSize.width / 2 ,cc.winSize.height + 200)))
            ));
            guide_text.runAction(new cc.Sequence(
                new cc.DelayTime(0.1),
                new cc.EaseBackIn(new cc.MoveTo(1.0,cc.p(-500 ,guide_text.y)))
            ));
            menu.runAction(new cc.Sequence(
                new cc.DelayTime(0.5),
                new cc.EaseBackOut(new cc.MoveTo(1.0,cc.p(cc.winSize.height + 200 ,menu.y)))
            ));
        }

        guide_layer.addChild(guide_pic);
        guide_layer.addChild(guide_text);
        guide_layer.addChild(menu);
        this.addChild(guide_layer,GuideUI_ZORDER,GuideUI_TAG);
    },
    guideUI2P : function () {//2p guideUI init
        var target  = this;
        var spriteFrameCache = cc.spriteFrameCache;
        var guide_layer = new cc.Layer();
        guide_layer.setPosition(cc.p(0,0));

        var guide_pic = new cc.Sprite(spriteFrameCache.getSpriteFrame("guidePicB.png"));
        guide_pic.setPosition(cc.p(cc.winSize.width / 2 ,cc.winSize.height + 200));
        guide_pic.runAction(new cc.Sequence(
            new cc.DelayTime(0.1),
            new cc.EaseBackOut(new cc.MoveTo(1.0,cc.p(cc.winSize.width / 2 ,520)))
        ));
        var guide_text = new cc.Sprite(spriteFrameCache.getSpriteFrame("guideText.png"));
        guide_text.setPosition(cc.p(-300 , 180));
        guide_text.runAction(new cc.Sequence(
            new cc.DelayTime(0.3),
            new cc.EaseBackOut(new cc.MoveTo(1.0,cc.p(cc.winSize.width / 2 ,180)))
        ));

        var confirm_btn_frame = spriteFrameCache.getSpriteFrame("confirmBtn.png")
        var confirm_btn = new cc.MenuItemImage(confirm_btn_frame,confirm_btn_frame,function () {
            if(!this.clicked_2){
                this.clicked_2 = true;

                target.runAction(new cc.Sequence(
                    new cc.CallFunc(hideUI),
                    new cc.DelayTime(2.3),
                    new cc.CallFunc(target.initAfterMenu,target)
                ));
            }
        },this);
        confirm_btn.setPosition(cc.p(cc.winSize.width - 200 , 60));
        var menu = new cc.Menu(confirm_btn);
        menu.setPosition(cc.p(0,0));

        function hideUI () {
            guide_pic.runAction(new cc.Sequence(
                new cc.DelayTime(0.3),
                new cc.EaseBackIn(new cc.MoveTo(1.0,cc.p(cc.winSize.width / 2 ,cc.winSize.height + 200)))
            ));
            guide_text.runAction(new cc.Sequence(
                new cc.DelayTime(0.1),
                new cc.EaseBackIn(new cc.MoveTo(1.0,cc.p(-500 ,guide_text.y)))
            ));
            menu.runAction(new cc.Sequence(
                new cc.DelayTime(0.5),
                new cc.EaseBackOut(new cc.MoveTo(1.0,cc.p(cc.winSize.height + 200 ,menu.y)))
            ));
        }

        guide_layer.addChild(guide_pic);
        guide_layer.addChild(guide_text);
        guide_layer.addChild(menu);
        this.addChild(guide_layer,GuideUI_ZORDER,GuideUI_TAG);
    },
    initAfterMenu : function () {
//            this.getChildByTag(GuideUI_TAG).removeFromParent();

            this.createPhysicsWorld();
//
            //this.setupDebugNode();

            this.createWalls();

            this.createPlayers();

            this.createMagnetSystem();

            this.createItems();

            this.createGameController();

            this.isBegin = true;
            this.isOver = false;
            this.inTitle = false;
    }
});
