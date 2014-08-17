

var ItemsLayer = cc.Layer.extend({
    game_layer : null,

    next_born : 0,
    inited : false,

//    born_iron_interval : 1,
//    born_bomb_interval : 1,

    ctor : function(game_layer){
        this._super();
        this.game_layer = game_layer;
    },

    addItem : function (tex, type, x, y, sOrR, friction, elasticity) {
        var item = Bomb.create(tex, type, x, y, sOrR);
        friction !== undefined && (item.friction = friction);
        elasticity !== undefined && (item.elasticity = elasticity);

        MagneticSystem.addOtherItem(item.phyObj.body);
        this.addChild(item);
        return item;
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

        if (!this.inited) {
            this.bornItems("#bomb1.png", cc.winSize.width/2, cc.winSize.height, INITIAL_BOMB_NUMBER);
            this.inited = true;
        }
        if (this.next_born <= 0) {
            if (children.length < MAX_BOMB_NUMBER)
                this.bornItems("#bomb1.png", cc.winSize.width/2, cc.winSize.height);
            this.next_born = BORN_INTERVAL;
        }
        this.next_born -= dt;

        for (var i = 0; i < children.length; ++i) {
            children[i].update && children[i].update(dt);
        }
    },

    checkForGoal : function (){
        var delete_items = [],
            items = this.children,
            ret = ScoreController.HIT_NOTING;

        for (var i = 0; i<items.length; i++){

            var item = items[i];
            if (item.dead || !item instanceof Item) continue;

            var i_pos = item.getPosition();

            if (cc.rectContainsPoint(Level.fp_gate_info, i_pos)){
                //sp get goal.
                ret = ScoreController.HIT_FP_HOUSE;
                delete_items.push(item);
            }

            else if (cc.rectContainsPoint(Level.sp_gate_info, i_pos)){
                //fp get goal
                ret = ScoreController.HIT_SP_HOUSE;
                delete_items.push(item);
            }
        }

        for ( var i = 0; i < delete_items.length; i++){
            var deleteItem = delete_items[i];

            deleteItem.die();
        }
        return ret;
    }
});

var OneGoalItemsLayer = ItemsLayer.extend({


//    addItem: function () {
//        var item = this._super();
//
//        // Add initial force
//
//    },

    addItem : function (tex, type, x, y, sOrR, friction, elasticity) {
        var item = Bomb.createNoAnime(tex, type, x, y, sOrR);
        friction !== undefined && (item.friction = friction);
        elasticity !== undefined && (item.elasticity = elasticity);

        MagneticSystem.addOtherItem(item.phyObj.body);
        this.addChild(item);

        //apply veloci to item.

        if ( x < winSize.width / 2 ){
            var veloci = ITEM_FIRE_SPEED - ITEM_FIRE_SPEED_VAR + Math.random() * ITEM_FIRE_SPEED_VAR * 2;
            var angle = cc.degreesToRadians(ITEM_FIRE_ANGLE - ITEM_FIRE_ANGLE_VAR + Math.random() * ITEM_FIRE_ANGLE_VAR * 2);
            var v = cp.v (veloci * Math.cos(angle) , veloci * Math.sin(angle) );
            item.phyObj.body.applyImpulse( cp.v(v.x, v.y) , cp.v(0,0));
        }
        else{
            var veloci = ITEM_FIRE_SPEED - ITEM_FIRE_SPEED_VAR + Math.random() * ITEM_FIRE_SPEED_VAR * 2;
            var angle = cc.degreesToRadians(ITEM_FIRE_ANGLE - ITEM_FIRE_ANGLE_VAR + Math.random() * ITEM_FIRE_ANGLE_VAR * 2);
            var v = cp.v (veloci * Math.cos(angle) , veloci * Math.sin(angle) );
            item.phyObj.body.applyImpulse( cp.v( - v.x, v.y) , cp.v(0,0));
        }


        return item;
    },

//    bornItems : function (tex, cx, cy, number) { //56, 123      1224,123
//        var x, y, ox = cx - BORN_X_VAR, oy = cy - BORN_Y_VAR, xvar = BORN_X_VAR * 2, yvar = BORN_Y_VAR * 2, r;
//        number = number || (PRIMI_BORN_NUMBER + Math.round(BORN_NUMBER_VAR * Math.random()));
//        for (var i = number; i > 0; --i) {
//            x = ox + Math.floor(Math.random() * xvar);
//            y = oy + Math.floor(Math.random() * yvar);
//            r = BOMB_R + Math.round(Math.random() * BOMB_R_VAR);
//            this.addItem(tex, Item.CIRCLE_SHAPE, x, y, r);
//        }
//    },

    update : function (dt){
        // Generate items from left and right corner

        if ( !this.game_layer.isBegin){
            return false;
        }

        var children = this.children;

        if (this.next_born <= 0) {
            if (children.length < MAX_BOMB_NUMBER){
                r = BOMB_R + Math.round(Math.random() * BOMB_R_VAR);
                this.addItem(res.EnergyBall, Item.CIRCLE_SHAPE, 160, 170, r);
                this.addItem(res.EnergyBall, Item.CIRCLE_SHAPE, 1120, 170, r);
            }
            this.next_born = ITEM_BORN_INTERVAL - ITEM_BORN_INTERVAL_VAR + Math.random() * ITEM_BORN_INTERVAL_VAR * 2;
        }
        this.next_born -= dt;

        for (var i = 0; i < children.length; ++i) {
            children[i].update && children[i].update(dt);
        }


    },

    checkForGoal : function() {
        // Check for the only one goal
        var delete_items = [],
            items = this.children,
            ret = OneGoalController.NO_ONE_GET_SCORE;

        for (var i = 0; i<items.length; i++){

            var item = items[i];
            if (item.dead || !item instanceof Item) continue;

            var i_pos = item.getPosition();

            if ( cc.rectContainsPoint(Level.attack_gate_info, i_pos) ){

                if (item instanceof  Bomb){
                    if ( item.naughtyDog ){
                        ret = OneGoalController.FP_GET_SCORE;
                    }else if ( item.nastyDog ){
                        ret = OneGoalController.SP_GET_SCORE;
                    }else{
                        ret = OneGoalController.NO_ONE_GET_SCORE;
                    }
                }

                delete_items.push(item);

                //explode
                var explode = ccs.Armature.create("explode");
                explode.setPosition(cc.p(item.x , item.y));
                explode.scaleX = 3;
                explode.scaleY = 3;
                explode.getAnimation().playWithIndex(0);
                cc.audioEngine.playEffect(res.explosion_ogg,false);
                explode.getAnimation().movementEvent = this.explodeCallBack;
                this.game_layer.addChild(explode);
            }
        }

        for ( var i = 0; i < delete_items.length; i++){
            var deleteItem = delete_items[i];

            deleteItem.die();
        }
        return ret;
    },


    explodeCallBack : function (armature, movementType, movementID) {
        if (movementType == ccs.MovementEventType.complete) {
//            console.log("explode");
//            armature.getAnimation().playWithIndex(0);
            armature.removeFromParent();
        }
    }

});