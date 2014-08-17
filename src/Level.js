/**
 * Created by chenryoutou on 14-8-16.
 */

var Level = {

    levelReader : new TMXReader(),

    createLevel : function(tmxFile, parent) {
        var info = this.levelReader.read(tmxFile),
            layers = info.layers, layer;
        for (var i = layers.length-1; i >= 0; --i) {
            layer = layers[i];
            if (layer instanceof cc.Node) {
                parent.addChild(layer, MAP_ZORDER);
            }
        }
    },
    fp_gate_info : cc.rect(0, 0, 0, 0),
    sp_gate_info : cc.rect(0, 0, 0, 0),

    attack_gate_info : cc.rect(444, 722, 425, 40)
};