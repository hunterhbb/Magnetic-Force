/**
 * Created by kafeier on 2014/8/17.
 */
var BackGroundLayer = cc.Layer.extend({

    ctor : function () {
        this._super();

        var back = new cc.Sprite(res.BackgroundA);
        back.x = cc.winSize.width/2;
        back.y = 0;
        back.anchorY = 0;

        var ground = new cc.Sprite(res.Ground);

        ground.x = cc.winSize.width/2;
        ground.y = ground.height/2;

        var spriteFrameCache = cc.spriteFrameCache;
        var left_gate = new cc.Sprite(spriteFrameCache.getSpriteFrame("purpleA.png"));
        left_gate.setPosition(cc.p(0,0));
        left_gate.setAnchorPoint(cc.p(0,0));

        //right gate
        var right_gate = new cc.Sprite(spriteFrameCache.getSpriteFrame("redA.png"));
        right_gate.setPosition(cc.p(cc.winSize.width, 0));
        right_gate.setAnchorPoint(cc.p(1,0));

        this.addChild(back, BACK_ZORDER);
        this.addChild(ground, BACK_ZORDER);
        this.addChild(left_gate,BACK_ZORDER,LEFT_GATE_TAG);
        this.addChild(right_gate,BACK_ZORDER,RIGHT_GATE_TAG);

    }
});