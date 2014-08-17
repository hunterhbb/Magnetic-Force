cc.game.onStart = function(){
    cc.view.setDesignResolutionSize(1280, 768, cc.ResolutionPolicy.EXACT_FIT);
	cc.view.resizeWithBrowserSize(true);
    //load resources
    cc.LoaderScene.preload(g_resources, function () {
        gameScene = new cc.Scene();
        nextLevel(gameScene, true, 0);
        cc.director.runScene(gameScene);
    }, this);
};
cc.game.run();