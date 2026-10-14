let isPlaying = true;
let isInteractive = true;

let txtField = bnb.scene.getAssetManager().findImage("text");
let txtComponent = bnb.scene.getRoot().findChildByName("text_surface").getComponent(bnb.ComponentType.MESH_INSTANCE).asMeshInstance()

function Effect() {
    var self = this;
    var c = 0.5;
    var sec = 0;
    var lastFrame;

    function frac(f) {
        return f % 1;
    }

    this.play = function () {
        var now = (new Date()).getTime();
        sec += (now - lastFrame) / 1000;
        Api.meshfxMsg("shaderVec4", 4, 0, String(sec));
        //Api.showHint(String(sec));
        lastFrame = now;

        // if (now > self.t && isSmile(world.landmarks, world.latents)) {
        //     Api.meshfxMsg("animOnce", 0, 0, self.closed ? "open" : "close");
        //     self.closed = !self.closed;
        //     self.t = now + 666;
        //     Api.hideHint();
        // }
    };

    this.init = function () {
        lastFrame = (new Date()).getTime();
        Api.meshfxMsg("spawn", 3, 0, "!glfx_FACE");

        Api.meshfxMsg("spawn", 0, 0, "spaceman.bsm2");
        Api.meshfxMsg("animLoop", 0, 0, "idle");

        self.t = 0;
        self.closed = false;

        Api.meshfxMsg("spawn", 1, 0, "face_morph_01.bsm2");
        // Api.meshfxMsg("animOnce", 1, 0, "Take 001");

        Api.meshfxMsg("spawn", 2, 0, "tri.bsm2");
        Api.meshfxMsg("spawn", 4, 0, "tr2.bsm2");

        self.faceActions.push(self.play);
        // Api.showHint("Tap / ← Camera 360 →");
        txtComponent.setVisible(true)
        if(!isInteractive){
            txtComponent.setVisible(false)

        }
        timeOut(2000, function(){
            txtComponent.setVisible(false)
        })
        // Api.playVideo("frx",true,1);
        isPlaying && Api.playSound("Cubemap_Moon_music_L_Channel.ogg", true, 1);
        Api.showRecordButton();
    };

    this.restart = function () {
        Api.meshfxReset();
        // Api.stopVideo("frx");
        // Api.stopSound("sfx.aac");
        self.init();
    };

    this.faceActions = [];
    this.noFaceActions = [self.play];

    this.videoRecordStartActions = [];
    this.videoRecordFinishActions = [];
    this.videoRecordDiscardActions = [this.restart];
}
var effect = new Effect();
configure(effect);

function onTouchesBegan() {
    if(isInteractive){

    
    var now = (new Date()).getTime();
    if (now > effect.t) {
        Api.meshfxMsg("animOnce", 0, 0, effect.closed ? "open" : "close");
        effect.closed = !effect.closed;
        effect.t = now + 666;
        Api.hideHint();
    }
}
}

function hideInteractive(){
    isInteractive = false;
    Api.hideHint();
    txtComponent.setVisible(false)


}

function stopMusic(){
    isPlaying = false;
    Api.stopSound("Cubemap_Moon_music_L_Channel.ogg");
}


function timeOut(delay, callback) {
	var timer = new Date().getTime();

	effect.faceActions.push(removeAfterTimeOut);
	effect.noFaceActions.push(removeAfterTimeOut);

	function removeAfterTimeOut() {
		var now = new Date().getTime();

		if (now >= timer + delay) {
			var idx = effect.faceActions.indexOf(removeAfterTimeOut);
			effect.faceActions.splice(idx, 1);
			idx = effect.noFaceActions.indexOf(removeAfterTimeOut);
			effect.noFaceActions.splice(idx, 1);
			callback();
		}
	}
}

if(bnb.RenderInfo.getPlatform() == "emscripten"){
    hideInteractive();
}