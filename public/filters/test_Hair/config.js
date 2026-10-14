'use strict';

const prefabs = require("bnb_js/prefabs");

const enableFiltering = true;
bnb.scene.addFeatureParam(
  bnb.FeatureID.HAIR, [new bnb.FeatureParameter(enableFiltering, 0, 0, 0)]);

const assets = bnb.scene.getAssetManager();
const material = assets.findMaterial('hair');
if (!material) {
  bnb.log(`[WARN] Unable to find material "${materialName}"`);
}
const parameters = material.getParameters();
var hair_color = parameters.find((parameter) => parameter.getName() == "hair_color");
var color_params = parameters.find((parameter) => parameter.getName() == "color_params");

function setColor(color) {
    hair_color.setVector4(prefabs.parseColor(color));
}

function setColorShift(value) {
    var params = color_params.getVector4();
    params.x = value;
    color_params.setVector4(params);
}

function setSaturation(value) {
    var params = color_params.getVector4();
    params.y = value;
    color_params.setVector4(params);
}

function setBrightness(value) {
    var params = color_params.getVector4();
    params.z = value;
    color_params.setVector4(params);
}

setColor('#2C1C38');
//setColorShift(0);
//setSaturation(0);
//setBrightness(0);
