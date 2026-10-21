## **nn_api effect API description**
nn_api effect consists of the following features:

- Lips segmentation
- Hair segmentation
- Eyes segmentation (separate L/R)
- Skin segmentation
- Background segmentation

Based on that features effect can provide you with:
- Lips coloring (Matt or Shiny)
- Hair coloring
- Eyes coloring
- Skin coloring
- Image/Video background replacement

## API

**Lips coloring:**
     
    Lips.matt(color) - sets Matt lips color, e.g. Lips.matt("1 0 1 1") for purple lips;
    Lips.shiny(color) - sets Shiny lips color, e.g. Lips.shiny("1 0 1 1") for purple lips;
    Lips.clear() - disable the feature and reset the color.

**Hair coloring:**
     
    - Hair.color(color) - set Hair color, e.g. Hair.color("0 1 0 1") for green hair;
    - Hair.clear() - disable the feature and reset the color.

**Eyes coloring:**
     
    - Eyes.color(color) - set Eyes color, e.g. Eyes.color("1 0 0 1") for red eyes;
    - Eyes.clear() - disable the feature and reset the color.

**Skin coloring:**
     
    - Skin.color(color) - set Skin color, e.g. Skin.color("0 1 0 1") for green skin;
    - Skin.clear() - disable the feature and reset the color.

**Image/Video background replacement:**
     
    - BackgroundTexture.set(file) - set image as a background, path can be relative or absolute,
    e.g. BackgroundTexture.set("images/default_tex1.png").
    - BackgroundTexture.clear() - disable the feature and reset the background.

    - BackgroundVideo.set(file) - set video as a background, path can be relative or absolute,
    e.g. BackgroundVideo.set("/videos/video2.mp4")
    - BackgroundVideo.clear() - disable the feature and reset the background.