/**
 * Created by chenryoutou on 14-8-16.
 */

var ScoreController = {

    fp_score : 0,
    sp_score : 0,
    fp_score_label : null,
    sp_score_label : null,
    game_layer : null,
    gameOver_score : GAME_OVER_SCORE,

    isGameOver : false,

    init : function(game_layer){
        this.fp_score = 0;
        this.sp_score = 0;

        this.fp_score_label = cc.LabelTTF.create("0");
        this.sp_score_label = cc.LabelTTF.create("0");
        this.fp_score_label.setPosition(winSize.width/10, winSize.height * 2/3);
        this.sp_score_label.setPosition(winSize.width * 9/10, winSize.height * 2/3);
        this.fp_score_label.setFontSize(50);
        this.sp_score_label.setFontSize(50);
        game_layer.addChild(this.fp_score_label);
        game_layer.addChild(this.sp_score_label);

        this.game_layer = game_layer;

        this.isGameOver = false;
    },

    addFpScore : function(){
        this.fp_score ++;

        if (this.fp_score && this.fp_score <= this.gameOver_score) {
            this.fp_score_label.setString(this.fp_score);
            var rightGate = this.game_layer.getChildByTag(BACK_TAG).getChildByTag(RIGHT_GATE_TAG);
            var spriteFrameCache = cc.spriteFrameCache;
            var rightSpriteFrame = null;
            switch (this.fp_score) {
                case 1:
                    rightSpriteFrame = spriteFrameCache.getSpriteFrame("redB.png");
                    break;
                case 2:
                    rightSpriteFrame = spriteFrameCache.getSpriteFrame("redC.png");
                    break;
                case 3:
                    rightSpriteFrame = spriteFrameCache.getSpriteFrame("redD.png");
                    break;
            }
            if (rightSpriteFrame) {
                rightGate.setSpriteFrame(rightSpriteFrame);

                var explode = ccs.Armature.create("explode");
                explode.setPosition(cc.p(cc.winSize.width - 50 ,320));
                explode.scaleX = 3;
                explode.scaleY = 3;
                explode.getAnimation().playWithIndex(0);
                cc.audioEngine.playEffect(res.explosion_ogg,false);
                explode.getAnimation().movementEvent = this.explodeCallBack;
                this.game_layer.addChild(explode);
            }

        }

        if (this.fp_score && this.fp_score == this.gameOver_score && !this.isGameOver){
            this.gameOver();
        }
    },

    addSpScore : function(){
        this.sp_score ++;
        if (this.sp_score && this.sp_score <= this.gameOver_score) {
            this.sp_score_label.setString(this.sp_score);
            var leftGate = this.game_layer.getChildByTag(BACK_TAG).getChildByTag(LEFT_GATE_TAG);
            var spriteFrameCache = cc.spriteFrameCache;
            var leftSpriteFrame = null;
            switch (this.sp_score) {
                case 1:
                    leftSpriteFrame = spriteFrameCache.getSpriteFrame("purpleB.png");;
                    break;
                case 2:
                    leftSpriteFrame = spriteFrameCache.getSpriteFrame("purpleC.png");
                    break;
                case 3:
                    leftSpriteFrame = spriteFrameCache.getSpriteFrame("purpleD.png");
                    break;
            }
            if (leftSpriteFrame) {
                leftGate.setSpriteFrame(leftSpriteFrame);

                var explode = ccs.Armature.create("explode");
                explode.setPosition(cc.p(50,320));
                explode.scaleX = 3;
                explode.scaleY = 3;
                explode.getAnimation().playWithIndex(0);
                cc.audioEngine.playEffect(res.explosion_ogg,false);
                explode.getAnimation().movementEvent = this.explodeCallBack;
//
                this.game_layer.addChild(explode);
            }
        }

        if ( this.sp_score && this.sp_score == this.gameOver_score && !this.isGameOver){
            this.gameOver();
        }

    },

    gameOver : function (){

        this.isGameOver = true;

    },
    explodeCallBack : function (armature, movementType, movementID) {
        if (movementType == ccs.MovementEventType.complete) {
//            console.log("explode");
//            armature.getAnimation().playWithIndex(0);
            armature.removeFromParent();
        }
    }



};