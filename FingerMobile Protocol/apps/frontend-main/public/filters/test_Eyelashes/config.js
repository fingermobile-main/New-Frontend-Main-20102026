var rot = 1.0;

bnb.scene.enableRecognizerFeature(bnb.FeatureID.EYES_CORRECTION);

function Effect()
{
    var self = this;

    this.init = function() {
        Api.meshfxMsg("wlut", 1, 50, "images/lut3d_eyes_verylow.png");
        Api.meshfxMsg("wlut", 2, 100, "images/lut3d_teeth_highlighter5.png");
        Api.meshfxMsg("shaderVec4", 0, 0, "0 0 1");
        Api.meshfxMsg("spawn", 0, 0, "!glfx_FACE");
        Api.showRecordButton();
    };

    this.restart = function() {
        Api.meshfxReset();
        self.init();
    };

    this.faceActions = [];
    this.noFaceActions = [];

    this.videoRecordStartActions = [];
    this.videoRecordFinishActions = [];
    this.videoRecordDiscardActions = [];
}

var effect = new Effect();

configure(effect);