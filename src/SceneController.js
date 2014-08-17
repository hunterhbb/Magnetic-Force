

var GameLevels = [
    // Ordinary
    function (showMenu) {
        return new GameLayer(showMenu);
    },

    // One goal
    function (showMenu) {
        return new OneGoalLayer(showMenu);
    }
];

var current_level = 0;

var nextLevel = function (gameScene, showMenu, level) {
    current_level++;
    if (current_level >= GameLevels.length) {
        current_level = 0;
    }
    
    current_level = level === undefined ? current_level : level;
    levelLayer = GameLevels[current_level](showMenu);
    Global_Value.initWithConfig(Config[current_level]);
    gameScene.removeAllChildren(true);
    gameScene.addChild(levelLayer);

    return levelLayer;
};
var replayLevel = function (gameScene, showMenu, level) {
    current_level = level === undefined ? current_level : level;
    levelLayer = GameLevels[current_level](showMenu);
    Global_Value.initWithConfig(Config[current_level]);
    gameScene.removeAllChildren(true);
    gameScene.addChild(levelLayer);
    return levelLayer;
};