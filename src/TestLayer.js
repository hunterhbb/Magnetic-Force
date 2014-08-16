/**
 * Created by kafeier on 2014/8/16.
 */
var TestLayer = GameLayer.extend({
    init : function () {
        if(!this._super()){
            return false;
        }

        return true;
    },
    createPhysicsSprite : function () {
        var body = new cp.Body(1, cp.momentForBox(1, 48, 108) );
        body.setPos( cp.v(200,200) );
        this.space.addBody( body );
        var shape = new cp.BoxShape( body, 48, 108);
        shape.setElasticity( 0.5 );
        shape.setFriction( 0.5 );
        this.space.addShape( shape );

        var sprite = cc.PhysicsSprite.create(res.CloseNormal_png);
        sprite.setBody( body );
        return sprite;
    }
});

TestLayer.create = function () {
    var testLayer = new TestLayer();
    if (testLayer && testLayer.init()) {
        return testLayer;
    }
    return null;
};

TestLayer.createScene = function () {
    var gameScene = new cc.Scene();
    gameLayer = TestLayer.create();
    gameScene.addChild(testLayer);
    return gameScene;
};