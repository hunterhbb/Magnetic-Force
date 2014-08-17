/**
 * Created by chenryoutou on 14-8-17.
 */

var OverLayer = cc.Layer.extend({

    isNaughtyWin : false,
    gameLayer : null,

    ctor : function(gameLayer) {
        this._super();
        this.gameLayer = gameLayer;
        this.clicked = false;
    },

    init : function() {
        if ( !this._super() ) {
            return false;
        }

        return true;
    },

    onEnter : function() {
        this.clicked = false;

        this._super();


        if ( this.isNaughtyWin ){
            this.win_logo = new cc.Sprite("#prupleWinUI.png");
//            cc.audioEngine.playEffect(res.NaughtWIns_ogg,false);
        }else{
            this.win_logo = new cc.Sprite("#redWinUI.png");
//            cc.audioEngine.playEffect(res.NastyWins_ogg,false);
        }

        this.win_logo.setPosition(winSize.width/2, winSize.height/2);
        this.win_logo.setScale(0, 0);
        this.addChild(this.win_logo);

        this.win_logo.runAction(
            new cc.Sequence(
                new cc.DelayTime(1),
                new cc.EaseBackOut(new cc.ScaleTo(0.8, 1.0, 1.0)),
                new cc.DelayTime(2),
                new cc.EaseBackIn(new cc.ScaleTo(0.5, 0.0, 0.0)),
                new cc.CallFunc(this.showOverMenu, this)
            )
        );



    },

    showOverMenu : function (){

        var cover = cc.LayerColor.create(cc.color(0,0,0, 80), winSize.width, winSize.height);
        this.addChild(cover, 0);


        var game_over_logo = new cc.Sprite("#gameOverUI.png");


        var spriteFrameCache = cc.spriteFrameCache;
        var again_btn_frame = spriteFrameCache.getSpriteFrame("againBtn.png");
        var play_again_btn = new cc.MenuItemImage(again_btn_frame, again_btn_frame, this.playAgain, this);

        var back_to_main_menu_frame = spriteFrameCache.getSpriteFrame("backBtn.png");
        var back_to_main_menu_btn = new cc.MenuItemImage(back_to_main_menu_frame, back_to_main_menu_frame, this.backToMainMenu, this);

        play_again_btn.setPosition(-60, -80);
        back_to_main_menu_btn.setPosition(60, -190);

        var menu = cc.Menu.create(play_again_btn, back_to_main_menu_btn);
//        var settings_btn = new cc.MenuItemSprite("");

        this.addChild(game_over_logo);
        this.addChild(menu);

        game_over_logo.setPosition(winSize.width/2, winSize.height * 2/3);
        menu.setPosition(winSize.width/2 , winSize.height /2);

        game_over_logo.setScale(0, 0);
        menu.setScale(0, 0);

        game_over_logo.runAction(new cc.EaseBackOut(new cc.ScaleTo(0.5, 1.0, 1.0)));
        menu.runAction(new cc.EaseBackOut(new cc.ScaleTo(0.5, 1.0, 1.0)));
    },

    playAgain : function(){
        if ( !this.clicked ){
            this.clicked = true;
            this.gameLayer && this.gameLayer.clear();
            
            var layer = nextLevel(cc.director.getRunningScene(), true);
            current_level == 0 ? layer.guideUIP : layer.guideUI2P();
        }
    },

    backToMainMenu : function (){

    }
});


OverLayer.create = function(isNaughtyWin, gameLayer){
    var layer = new OverLayer(gameLayer);
    if( layer && layer.init() ){
        layer.isNaughtyWin = isNaughtyWin;
        return layer;
    }
    return null;
};