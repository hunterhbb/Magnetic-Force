var res = {
    BackgroundA : "res/sceneA.jpg",
    BackgroundB : "res/sceneB.jpg",
    Tube : "res/tube.png",
    Robot_plist : "res/animation/robot/robot0.plist",
    Robot_png : "res/animation/robot/robot0.png",
    Robot_exportJSON : "res/animation/robot/robot.ExportJson",
    Level1 : "res/level1.tmx",
    Level2 : "res/level2.tmx",
    Explode_exportJSON : "res/animation/explode/explode.ExportJson",
    Explode_png : "res/animation/explode/explode0.png",
    Explode_plist : "res/animation/explode/explode0.plist",
    Bomb_png : "res/animation/bomb/bombAnim.png",
    Bomb_plist : "res/animation/bomb/bombAnim.plist",
    Frict1_ogg:"res/audio/Frict1.ogg",
    Frict2_ogg:"res/audio/Frict2.ogg",
    hit1_ogg:"res/audio/hit1.ogg",
    hit2_ogg:"res/audio/hit2.ogg",
    hit3_ogg:"res/audio/hit3.ogg",
    explosion_ogg:"res/audio/explosion.ogg",
    bleeding_ogg : "res/audio/bleeding.ogg",
    DunkMonster_ogg : "res/audio/DunkMonster.ogg",
    NastyWins_ogg : "res/audio/NastyWins.ogg",
    NaughtWIns_ogg : "res/audio/NaughtyWins.ogg",

    Fire_plist : "res/fire.plist",
    Gate_plist:"res/gate.plist",
    House_png : "res/house.png",
    House_plist : "res/house.plist",

    Spring: "res/spring.png",
    Ground: "res/ground.png",

    Menu_png : "res/menuUI.png",
    Menu_plist : "res/menuUI.plist",
    game_ui_plist : "res/gameUI.plist",
    game_ui_png : "res/gameUI.png",

    over_ui_plist : "res/overUI.plist",
    over_ui_png : "res/overUI.png",

    Pipe : "res/Pipe.plist",

    GuideUI_png : "res/guideUI.png",
    GuideUI_plist : "res/guideUI.plist",

    EnergyBall : "res/energyBall.png",
    LuckiestGuy_ttf : "res/LuckiestGuy.ttf"
};

var g_resources = [];
for (var i in res) {
    g_resources.push(res[i]);
}