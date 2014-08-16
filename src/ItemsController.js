

var ItemsLayer = cc.Layer.extend({
    game_layer : null,

    next_born : 0,

    born_iron_interval : 1,
    born_bomb_interval : 1,

    ctor : function(game_layer){
        this._super();
        this.game_layer = game_layer;
        this.bornItems("#bomb1.png", cc.winSize.width/2, cc.winSize.height, INITIAL_BOMB_NUMBER);
    },

    addItem : function (tex, type, x, y, sOrR, friction, elasticity) {
        var item = Bomb.create(tex, type, x, y, sOrR);
        friction !== undefined && (item.friction = friction);
        elasticity !== undefined && (item.elasticity = elasticity);

        MagneticSystem.addOtherItem(item.phyObj.body);
        this.addChild(item);
    },

    bornItems : function (tex, cx, cy, number) {
        var x, y, ox = cx - BORN_X_VAR, oy = cy - BORN_Y_VAR, xvar = BORN_X_VAR * 2, yvar = BORN_Y_VAR * 2, r;
        number = number || (PRIMI_BORN_NUMBER + Math.round(BORN_NUMBER_VAR * Math.random()));
        for (var i = number; i > 0; --i) {
            x = ox + Math.floor(Math.random() * xvar);
            y = oy + Math.floor(Math.random() * yvar);
            r = BOMB_R + Math.round(Math.random() * BOMB_R_VAR);
            this.addItem(tex, Item.CIRCLE_SHAPE, x, y, r);
        }
    },

    update : function ( dt ){
        if ( !this.game_layer.isBegin){
            return false;
        }

        var children = this.children;

        if (this.next_born <= 0) {
            if (children.length < MAX_BOMB_NUMBER)
                this.bornItems("#bomb1.png", cc.winSize.width/2, cc.winSize.height);
            this.next_born = BORN_INTERVAL;
        }
        this.next_born -= dt;

        for (var i = 0; i < children.length; ++i) {
            children[i].update && children[i].update(dt);
        }

        this.checkForGoal();
    },

    checkForGoal : function (){

        var delete_items = [];
        var items = this.children;

        for (var i = 0; i<items.length; i++){

            var item = items[i];
            if (item.dead || !item instanceof Item) continue;

            var i_pos = item.getPosition();

            if (cc.rectContainsPoint(Level.fp_gate_info, i_pos)){
                //sp get goal.
//                item.time = -1;
                ScoreController.addSpScore();

                delete_items.push(item);
            }

            else if (cc.rectContainsPoint(Level.sp_gate_info, i_pos)){
                //fp get goal
                ScoreController.addFpScore();
                delete_items.push(item);
            }
        }

        for ( var i = 0; i < delete_items.length; i++){
            var deleteItem = delete_items[i];

            deleteItem.die();
        }
    }
});
