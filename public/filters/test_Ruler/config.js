bnb.scene.enableRecognizerFeature(bnb.FeatureID.RULER);

let txtField = bnb.scene.getAssetManager().findImage("text");

bnb.eventListener.on("onUpdate", (fd)=> {
    txtField.asTextTexture().setText(fd.getRuler().toFixed(1)  + " sm");
})