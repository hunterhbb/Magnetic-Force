var OneGoalLayer = GameLayer.extend({

    showMenu : function() {
    },

    createItems : function (){
        this.itemLayer = new OneGoalItemsLayer(this);
        this.addChild(this.itemLayer, ITEM_ZORDER);
    },

    createBackground : function() {
        // Add Tube Particle system
        this.forceEmitter = new cc.ParticleSystem(res.Pipe);
        this.forceEmitter.setPosition(cc.winSize.width/2, cc.winSize.height - 100);
        this.forceEmitter.scaleX = 0.5;
        this.addChild(this.forceEmitter, TUBE_ZORDER-1);

        var background = new cc.Sprite(res.BackgroundB);
        this.addChild(background, BACK_ZORDER,BACK_TAG);
        background.x = cc.winSize.width/2;
        background.y = cc.winSize.height/2;
    },

    createGameController : function(){
        this.gameController = new OneGoalController(this);
    },

    checkResult : function () {
        var result = this.itemLayer.checkForGoal();
        if (result == OneGoalController.FP_GET_SCORE)
            this.gameController.addFpScore();
        else if (result == OneGoalController.SP_GET_SCORE)
            this.gameController.addSpScore();

        if (this.gameController.isGameOver()) {
            this.gameController.gameOverAction();
        }
    },

    createWalls : function () {
        Level.createLevel(res.Level2, this);
    },

    playerTouchBomb : function (arb, space, ptr) {
        var shapes = arb.getShapes();
        var player = shapes[0].obj.view;
        var item = shapes[1].obj.view;
        var gameLayer = player.parent;

        // Own by first player (nasty one)
        if (player == gameLayer.f_player) {
            item.captured(true);
        }
        // naughty one
        else if (player == gameLayer.s_player) {
            item.captured(false);
        }
        return true;
    }
});