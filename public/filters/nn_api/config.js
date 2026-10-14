var BGVideo = (function() {
    function BGVideo() {
		this._file = "video.mp4",
        this._isLooped = true;
    }

    BGVideo.prototype.set = function (file) {
        this._file = file;
        setBackgroundVideo(this._file,this._isLooped);
		return this;
	};

    BGVideo.prototype.isLooped = function (boolean) {
        this._isLooped = boolean;
		return this;
	};

    BGVideo.prototype.clear = function () {
        disableBackground();
		return this;
	};

    return BGVideo;
}());

var BackgroundVideo = new BGVideo();

var BGImage = (function() {
    function BGImage() {
		this._file = "image.png",
        this._isLooped = true;
    }

    BGImage.prototype.set = function (file) {
        this._file = file;
        setBackgroundImage(this._file);
		return this;
	};

    BGImage.prototype.clear = function () {
        disableBackground();
		return this;
	};

    return BGImage;
}());

var BackgroundTexture = new BGImage();

var LipsColor = (function() {
    function LipsColor() {
		this._color = "1 0 0 1"
        this._mattParams = "1 0 1 0"
        this._shinyParams = "1 0.4 1 0.5"
    };

    LipsColor.prototype.matt = function (color) {
        this._color = color;
        setLipsColor(this._color);
        setLipsShineParams(this._mattParams);
		return this;
	};

    LipsColor.prototype.shiny = function (color) {
        this._color = color;
        setLipsColor(this._color);
        setLipsShineParams(this._shinyParams);
		return this;
	};

    LipsColor.prototype.clear = function () {
        disableLipsColoring();
		return this;
	};

    return LipsColor;
}());

var Lips = new LipsColor();

var EyesColor = (function() {
    function EyesColor() {
		this._color = "1 0 0 1"
    };

    EyesColor.prototype.color = function (color) {
        this._color = color;
        setEyesColor(this._color);
		return this;
	};

    EyesColor.prototype.clear = function () {
        disableEyesColoring();
		return this;
	};

    return EyesColor;
}());

var Eyes = new EyesColor();

var SkinColor = (function() {
    function SkinColor() {
		this._color = "1 0 0 1"
    };

    SkinColor.prototype.color = function (color) {
        this._color = color;
        setSkinColor(this._color);
		return this;
	};

    SkinColor.prototype.clear = function () {
        disableSkinColoring();
		return this;
	};

    return SkinColor;
}());

var Skin = new SkinColor();

var HairColor = (function() {
    function HairColor() {
		this._color = "1 0 0 1"
    };

    HairColor.prototype.color = function (color) {
        this._color = color;
        setHairColor(this._color);
		return this;
	};

    HairColor.prototype.clear = function () {
        disableHairColoring();
		return this;
	};

    return HairColor;
}());

var Hair = new HairColor();

var playVideo = function(name, looped) {
    var media = bnb.scene.getAssetManager().findImage(name).asVideo().asMedia()
    media.setLooped(looped)
    media.play()
}

var activateRecognizerFeature = function (ImageComponentName){
    var nn_image =  bnb.scene.getAssetManager().findImage(ImageComponentName).asSegmentationMask()
    if(!nn_image.isActive()) nn_image.setActive(true)
}

var disactivateRecognizerFeature = function (ImageComponentName){
    var nn_image =  bnb.scene.getAssetManager().findImage(ImageComponentName).asSegmentationMask()
    if(nn_image.isActive()) nn_image.setActive(false)
}

var setEyesColor = function(rgbaString){
    var rgbaArray = rgbaString.split(" ").map(el => Number(el));

    activateRecognizerFeature('leye_nn')
    activateRecognizerFeature('reye_nn')

    var eye_R_param = bnb.scene.getAssetManager().findMaterial('shaders/reye').findParameter('eye_R_color')
    var eye_L_param = bnb.scene.getAssetManager().findMaterial('shaders/leye').findParameter('eye_L_color')

    if (eye_R_param && eye_L_param){
        eye_R_param.setVector4(new bnb.Vec4(...rgbaArray))
        eye_L_param.setVector4(new bnb.Vec4(...rgbaArray))
    }
}

var disableEyesColoring = function(){
    setEyesColor("0 0 0 0");
    disactivateRecognizerFeature('leye_nn');
    disactivateRecognizerFeature('reye_nn');
}

var setSkinColor = function(rgbaString){
    var rgbaArray = rgbaString.split(" ").map(el => Number(el));

    activateRecognizerFeature('skin_nn')

    var skin_param = bnb.scene.getAssetManager().findMaterial('shaders/skin').findParameter('skin_color');

    if (skin_param){
        skin_param.setVector4(new bnb.Vec4(...rgbaArray))
    }
}

var disableSkinColoring = function(){
    setSkinColor("0 0 0 0");
    disactivateRecognizerFeature('skin_nn');
}

var setHairColor = function(rgbaString){
    var rgbaArray = rgbaString.split(" ").map(el => Number(el));

    activateRecognizerFeature('hair_nn')

    var hair_param = bnb.scene.getAssetManager().findMaterial('shaders/hair').findParameter('hair_color');

    if (hair_param){
        hair_param.setVector4(new bnb.Vec4(...rgbaArray))
    }
}

var disableHairColoring = function(){
    setHairColor("0 0 0 0");
    disactivateRecognizerFeature('hair_nn');
}

var setLipsShineParams = function(paramsString){ 
    // value 1 - sCoef - color saturation (1 is optimal), 
    // value 2 - vCoef - shine intensity (brightness, set 0 for matte lipstick)
    // value 3 - bCoef - brightness (1 is optimal)
    // value 4 - sCoef1 - shine bleeding (color saturation, set 0 for matte lipstick)

    activateRecognizerFeature('lips_shine_nn')

    var paramsArray = paramsString.split(" ").map(el => Number(el))

    var lips_config_param = bnb.scene.getAssetManager().findMaterial('shaders/lips').findParameter('lips_config');

    if (lips_config_param){
        lips_config_param.setVector4(new bnb.Vec4(...paramsArray))
    }
}

var setLipsColor = function(rgbaString){
    var rgbaArray = rgbaString.split(" ").map(el => Number(el));

    activateRecognizerFeature('lips_nn')

    var lips_color_param = bnb.scene.getAssetManager().findMaterial('shaders/lips').findParameter('lips_color');

    if (lips_color_param){
        lips_color_param.setVector4(new bnb.Vec4(...rgbaArray))
    }

    setLipsShineParams("1 0 1 0"); // Matt lips are default
}

var disableLipsColoring = function(){
    setLipsColor("0 0 0 0");
    disactivateRecognizerFeature('lips_nn');
    disactivateRecognizerFeature('lips_shine_nn');
}

var setBackgroundVideo = function(path,looped) {
    var bg_param = bnb.scene.getAssetManager().findMaterial('shaders/bg').findParameter('bg_mode');
    var bg_video_file =  bnb.scene.getAssetManager().findImage("bg_video");
    var tex_size_param = bnb.scene.getAssetManager().findMaterial('shaders/bg').findParameter('tex_size');

    activateRecognizerFeature("background_nn");

    bg_video_file.asVideo().load(path, function(success) {
        if (!success) {
            return;
        }

        // bg_video_file.asVideo().asMedia().setStartPosition(2);

        playVideo("bg_video", looped);

        let width = bg_video_file.asVideo().getWidth();
        let height = bg_video_file.asVideo().getHeight();

        let tex_size_param = bnb.scene.getAssetManager().findMaterial('shaders/bg').findParameter('tex_size');
        tex_size_param.setVector4(new bnb.Vec4(width,height,0,0));
    });

    let width = bg_video_file.asVideo().getWidth();
    let height = bg_video_file.asVideo().getHeight();

    if(bg_param){
        bg_param.setVector4(new bnb.Vec4(1,1,0,0))
    }

    if(tex_size_param){
        tex_size_param.setVector4(new bnb.Vec4(width,height,0,0))
    }
}

var setBackgroundImage = function(path) {
    var bg_param = bnb.scene.getAssetManager().findMaterial('shaders/bg').findParameter('bg_mode');
    var tex_size_param = bnb.scene.getAssetManager().findMaterial('shaders/bg').findParameter('tex_size');

    var bg_texture_image =  bnb.scene.getAssetManager().findImage("default_tex.png");

    activateRecognizerFeature("background_nn");
    
    if(bg_texture_image){
        bg_texture_image.asTexture().load(path);
    }

    var width = bg_texture_image.asTexture().getWidth();
    var height = bg_texture_image.asTexture().getHeight();

    if(bg_param){
        bg_param.setVector4(new bnb.Vec4(0,1,0,0))
    }

    if(tex_size_param){
        tex_size_param.setVector4(new bnb.Vec4(width,height,0,0))
    }
}

var disableBackground = function(){
    var bg_param = bnb.scene.getAssetManager().findMaterial('shaders/bg').findParameter('bg_mode');
    bg_param.setVector4(new bnb.Vec4(0,0,0,0))

    disactivateRecognizerFeature("background_nn")
}

var testAll = function(){
    Eyes.color("1 1 0 1");
    // Eyes.clear();
    Skin.color("0 1 0 1")
    // Skin.clear()
    Hair.color("0 0 1 1")
    // Hair.clear()
    Lips.shiny("1 0 1 1")
    // Lips.matt("1 0 1 1")
    // Lips.clear()
    BackgroundVideo.isLooped(true).set("videos/video.mp4");
    // BackgroundVideo.isLooped(true).set("videos/asdvideo.mp4");
    // BackgroundVideo.clear()
    // BackgroundTexture.set("preview.png");
}

 testAll();