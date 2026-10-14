
function Effect()
{
    this.init = function() {
        Api.meshfxMsg("spawn", 1, 0, "tri.bsm2");
        Api.meshfxMsg("spawn", 0, 0, "quad.bsm2");

        // colors:
        Api.meshfxMsg("shaderVec4", 0, 0, "1 0 0 1");
        Api.meshfxMsg("shaderVec4", 0, 1, "1 0 0 1");

        Api.meshfxMsg("shaderVec4", 0, 2, "0 1 0 1");
        Api.meshfxMsg("shaderVec4", 0, 3, "0 1 0 1");

        Api.meshfxMsg("shaderVec4", 0, 4, "0 0 1 1");
        Api.meshfxMsg("shaderVec4", 0, 5, "0 0 1 1");

        Api.meshfxMsg("shaderVec4", 0, 6, "1 1 0 1");
        Api.meshfxMsg("shaderVec4", 0, 7, "1 1 0 1");

        // number of colors:
        Api.meshfxMsg("shaderVec4", 0, 8, "8");

        Api.showRecordButton();
    };

    this.faceActions = [];
    this.noFaceActions = [];

    this.videoRecordStartActions = [];
    this.videoRecordFinishActions = [];
    this.videoRecordDiscardActions = [];
}

function setColor(name) {
    Api.meshfxMsg("tex", 0, 0, name);
}

configure(new Effect());
