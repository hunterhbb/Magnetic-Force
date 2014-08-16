cc.game.onStart = function(){
    cc.view.setDesignResolutionSize(1280, 768, cc.ResolutionPolicy.EXACT_FIT);
	cc.view.resizeWithBrowserSize(true);
    //load resources
    cc.LoaderScene.preload(g_resources, function () {
        cc.director.runScene(GameLayer.createScene());
    }, this);
};
cc.game.run();