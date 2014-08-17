/**
 * Created by chenryoutou on 14-8-16.
 */

//gameLayer
var SpaceGravite = -300;
var WallElasticity = 2.0;
var WallFriction = 1;
var BackGroundElastricity = 1.2;


//item
var ITEM_MAXSPEED = 900,
    ITEM_WEIGHT_FACTOR = 770,
    ITEM_INIT_FRICTION = 0.25,
    ITEM_INIT_ELASTICITY = 0.3,
    ITEM_MAX_SPEED = 500,
    ITEM_SCALE_FACTOR = 2.5;


//item controller
var INITIAL_BOMB_NUMBER = 4,
    MAX_BOMB_NUMBER = 10,
    BORN_INTERVAL = 8,
    PRIMI_BORN_NUMBER = 2,
    BORN_NUMBER_VAR = 1,
    BORN_X_VAR = 400,
    BORN_Y_VAR = 50,
    BOMB_R = 20,
    BOMB_R_VAR = 2;


//magnet system
var EFFECTIVE_MAGNET_DIS = 900;
var PLAYER_INIT_MH = 800;
var SAFE_DIS_ADD = 0.7;
var REPULSIVE_FORCE_MUTIPLE = 2;
var AIR_STREAM_FORCE = 100;
var AIR_EFFECTIVE_HEIGHT = 400;


//player
var PLAYER_WEIGHT = 1,
    PLAYER_MAX_SPEED = 400,
    PLAYER_JUMP_TOP = 120,
    PLAYER_JUMP_ADD_SPEED_Y = 380,
    PLAYER_JUMP_FORCE = 450,
    PLAYER_INIT_FRICTION = 0.25,
    PLAYER_INIT_ELASTICITY = 0.3,
//    PLAYER_ATTRACT_TOP_FORCE = cp.v(0, 1),
    PLAYER_PARTICLE_RESET_POS_INTERVAL = 0.5;


//bomb
var EXPLODE_TIME = 17+Math.random()*5;
var EXPLODE_WARNNING_TIME = 3;//the bomb will be explode
var EXPLODE_DEVIATION_TIME = 8;
var EXPLODE_WEIGHT = 5;
var EXPLODE_RADIUS = 50;

var EXPLODE_ELASTICITY = 10;
var BOMB_JUMP_ADD_SPEED = 60;

var GLOBAL_COL_TYPE = 0;

var GAME_INIT_HP = 3;

var GAME_TIME_LENGTH = 30;


var SCORE_DEVIATION_MORE = 1.5;

var ITEM_FIRE_SPEED = 40;
var ITEM_FIRE_ANGLE = 50;
var ITEM_FIRE_SPEED_VAR = 25;
var ITEM_FIRE_ANGLE_VAR = 5;
var ITEM_BORN_INTERVAL = 3;
var ITEM_BORN_INTERVAL_VAR = 0;


var Global_Value = {

    initWithConfig : function(config){

//        if (config.SpaceGravite) Window.SpaceGravite = config.SpaceGravite;
//        if (config.WallElasticity) Window.WallElasticity = config.WallElasticity;
//        if (config.WallFriction) Window.WallFriction = config.WallFriction;
//        if (config.BackGroundElastricity) Window.BackGroundElastricity = config.BackGroundElastricity;
//        if (config.ITEM_MAXSPEED) Window.ITEM_MAXSPEED = config.ITEM_MAXSPEED;
//        if (config.ITEM_WEIGHT_FACTOR) Window.ITEM_WEIGHT_FACTOR = config.ITEM_WEIGHT_FACTOR;
//        if (config.ITEM_INIT_FRICTION) Window.ITEM_INIT_FRICTION = config.ITEM_INIT_FRICTION;
//        if (config.ITEM_INIT_ELASTICITY) Window.ITEM_INIT_ELASTICITY = config.ITEM_INIT_ELASTICITY;
//        if (config.ITEM_MAX_SPEED) Window.ITEM_MAX_SPEED = config.ITEM_MAX_SPEED;
//        if (config.ITEM_SCALE_FACTOR) Window.ITEM_SCALE_FACTOR = config.ITEM_SCALE_FACTOR;
//        if (config.INITIAL_BOMB_NUMBER) Window.INITIAL_BOMB_NUMBER = config.INITIAL_BOMB_NUMBER;
//        if (config.MAX_BOMB_NUMBER) Window.MAX_BOMB_NUMBER = config.MAX_BOMB_NUMBER;
//        if (config.BORN_INTERVAL) Window.BORN_INTERVAL = config.BORN_INTERVAL;
//        if (config.PRIMI_BORN_NUMBER) Window.PRIMI_BORN_NUMBER = config.PRIMI_BORN_NUMBER;
//        if (config.BORN_NUMBER_VAR) Window.BORN_NUMBER_VAR = config.BORN_NUMBER_VAR;
//        if (config.BORN_X_VAR) Window.BORN_X_VAR = config.BORN_X_VAR;
//        if (config.BORN_Y_VAR) Window.BORN_Y_VAR = config.BORN_Y_VAR;
//        if (config.BOMB_R) Window.BOMB_R = config.BOMB_R;
//        if (config.BOMB_R_VAR) Window.BOMB_R_VAR = config.BOMB_R_VAR;
//        if (config.EFFECTIVE_MAGNET_DIS) Window.EFFECTIVE_MAGNET_DIS = config.EFFECTIVE_MAGNET_DIS;
//        if (config.PLAYER_INIT_MH) Window.PLAYER_INIT_MH = config.PLAYER_INIT_MH;
//        if (config.SAFE_DIS_ADD) Window.SAFE_DIS_ADD = config.SAFE_DIS_ADD;
//        if (config.REPULSIVE_FORCE_MUTIPLE) Window.REPULSIVE_FORCE_MUTIPLE = config.REPULSIVE_FORCE_MUTIPLE;
//        if (config.AIR_STREAM_FORCE) Window.AIR_STREAM_FORCE = config.AIR_STREAM_FORCE;
//        if (config.AIR_EFFECTIVE_HEIGHT) Window.AIR_EFFECTIVE_HEIGHT = config.AIR_EFFECTIVE_HEIGHT;
//        if (config.PLAYER_WEIGHT) Window.PLAYER_WEIGHT = config.PLAYER_WEIGHT;
//        if (config.PLAYER_MAX_SPEED) Window.PLAYER_MAX_SPEED = config.PLAYER_MAX_SPEED;
//        if (config.PLAYER_JUMP_FORCE) Window.PLAYER_JUMP_FORCE = config.PLAYER_JUMP_FORCE;
//        if (config.PLAYER_INIT_FRICTION) Window.PLAYER_INIT_FRICTION = config.PLAYER_INIT_FRICTION;
//        if (config.PLAYER_INIT_ELASTICITY) Window.PLAYER_INIT_ELASTICITY = config.PLAYER_INIT_ELASTICITY;
//        if (config.PLAYER_PARTICLE_RESET_POS_INTERVAL) Window.PLAYER_PARTICLE_RESET_POS_INTERVAL = config.PLAYER_PARTICLE_RESET_POS_INTERVAL;
//        if (config.EXPLODE_TIME) Window.EXPLODE_TIME = config.EXPLODE_TIME;
//        if (config.EXPLODE_WARNNING_TIME) Window.EXPLODE_WARNNING_TIME = config.EXPLODE_WARNNING_TIME;
//        if (config.EXPLODE_DEVIATION_TIME) Window.EXPLODE_DEVIATION_TIME = config.EXPLODE_DEVIATION_TIME;
//        if (config.EXPLODE_WEIGHT) Window.EXPLODE_WEIGHT = config.EXPLODE_WEIGHT;
//        if (config.EXPLODE_RADIUS) Window.EXPLODE_RADIUS = config.EXPLODE_RADIUS;
//        if (config.EXPLODE_ELASTICITY) Window.EXPLODE_ELASTICITY = config.EXPLODE_ELASTICITY;
//        if (config.BOMB_JUMP_ADD_SPEED) Window.BOMB_JUMP_ADD_SPEED = config.BOMB_JUMP_ADD_SPEED;
//        if (config.GLOBAL_COL_TYPE) Window.GLOBAL_COL_TYPE = config.GLOBAL_COL_TYPE;
//        if (config.GAME_INIT_HP) Window.GAME_INIT_HP = config.GAME_INIT_HP;


        for ( var key in config){
            if (config[key] !== undefined) {
                window[key] = config[key];
            }
        }

    }

};


