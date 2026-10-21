#include <bnb/glsl.frag>
#include <bnb/lut.glsl>






#define PSI 0.05

#define teethSharpenIntensity 0.2

BNB_IN(0) vec3 maskColor;
BNB_IN(1) vec4 var_uv_bg_uv;
BNB_IN(2) vec2 var_uv;


BNB_DECLARE_SAMPLER_2D(8, 9, glfx_BACKGROUND);


BNB_DECLARE_SAMPLER_2D(2, 3, tex_makeup);

BNB_DECLARE_SAMPLER_LUT(4, 5, glfx_WLUT1);

BNB_DECLARE_SAMPLER_LUT(6, 7, glfx_WLUT2);

#define textureLookup BNB_TEXTURE_LUT

vec3 whitening(vec3 originalColor, float factor, BNB_DECLARE_SAMPLER_LUT_ARGUMENT(lookup)) {
    vec3 color = textureLookup(originalColor, BNB_PASS_SAMPLER_ARGUMENT(lookup));
    return mix(originalColor, color, factor);
}

vec3 sharpen(vec3 originalColor, float factor) {
#ifdef YVG_USE_TEXTURE_OFFSET
    vec3 total = 5.0 * originalColor
    - textureOffset(glfx_BACKGROUND, var_uv_bg_uv.zw, ivec2(-1,-1)).xyz
    - textureOffset(glfx_BACKGROUND, var_uv_bg_uv.zw, ivec2(-1,+1)).xyz
    - textureOffset(glfx_BACKGROUND, var_uv_bg_uv.zw, ivec2(+1,-1)).xyz
    - textureOffset(glfx_BACKGROUND, var_uv_bg_uv.zw, ivec2(+1,+1)).xyz;
#else
    float dx = bnb_SCREEN.z;
    float dy = bnb_SCREEN.w;
    
    vec3 total = 5.0 * originalColor
    - BNB_TEXTURE_2D_LOD(BNB_SAMPLER_2D(glfx_BACKGROUND), vec2(var_uv_bg_uv.z-dx, var_uv_bg_uv.w-dy), 0.).xyz
    - BNB_TEXTURE_2D_LOD(BNB_SAMPLER_2D(glfx_BACKGROUND), vec2(var_uv_bg_uv.z+dx, var_uv_bg_uv.w-dy), 0.).xyz
    - BNB_TEXTURE_2D_LOD(BNB_SAMPLER_2D(glfx_BACKGROUND), vec2(var_uv_bg_uv.z-dx, var_uv_bg_uv.w+dy), 0.).xyz
    - BNB_TEXTURE_2D_LOD(BNB_SAMPLER_2D(glfx_BACKGROUND), vec2(var_uv_bg_uv.z+dx, var_uv_bg_uv.w+dy), 0.).xyz;
#endif
    vec3 result = mix(originalColor, total, factor);
    return clamp(result, 0.0, 1.0);
}

vec3 softSkin(vec3 originalColor, float factor) {
    vec3 screenColor = originalColor;

#ifdef YVG_USE_TEXTURE_OFFSET
    vec3 nextColor0 = textureOffset(glfx_BACKGROUND, var_uv_bg_uv.zw, ivec2(-5, -5)).xyz;
    vec3 nextColor1 = textureOffset(glfx_BACKGROUND, var_uv_bg_uv.zw, ivec2(5, -5)).xyz;
    vec3 nextColor2 = textureOffset(glfx_BACKGROUND, var_uv_bg_uv.zw, ivec2(-5, 5)).xyz;
    vec3 nextColor3 = textureOffset(glfx_BACKGROUND, var_uv_bg_uv.zw, ivec2(5, 5)).xyz;
#else

    float dx = 4.0 / bnb_SCREEN.x;
    float dy = 4.0 / bnb_SCREEN.y;
    
    vec3 nextColor0 = BNB_TEXTURE_2D(BNB_SAMPLER_2D(glfx_BACKGROUND), vec2(var_uv_bg_uv.z-dx, var_uv_bg_uv.w-dy)).xyz;
    vec3 nextColor1 = BNB_TEXTURE_2D(BNB_SAMPLER_2D(glfx_BACKGROUND), vec2(var_uv_bg_uv.z+dx, var_uv_bg_uv.w-dy)).xyz;
    vec3 nextColor2 = BNB_TEXTURE_2D(BNB_SAMPLER_2D(glfx_BACKGROUND), vec2(var_uv_bg_uv.z-dx, var_uv_bg_uv.w+dy)).xyz;
    vec3 nextColor3 = BNB_TEXTURE_2D(BNB_SAMPLER_2D(glfx_BACKGROUND), vec2(var_uv_bg_uv.z+dx, var_uv_bg_uv.w+dy)).xyz;
#endif
    
    float intensity = screenColor.g;
    vec4 nextIntensity = vec4(nextColor0.g, nextColor1.g, nextColor2.g, nextColor3.g);
    

    vec4 lg = nextIntensity - intensity;
    

    vec4 curr = max(0.367 - abs(lg * (0.367*0.6/(1.41*PSI))), 0.);
    
    float summ = 1.0 + curr.x + curr.y + curr.z + curr.w;
    screenColor += (nextColor0 * curr.x + nextColor1 * curr.y + nextColor2 * curr.z + nextColor3 * curr.w);
    screenColor = screenColor * (factor / summ);
    
    screenColor = originalColor*(1.-factor) + screenColor;
    return screenColor;
}


BNB_DECLARE_SAMPLER_2D(0, 1, tex_softlight);

float softlight_blend_1ch(float a, float b)
{
   return ((1.-2.*b)*a+2.*b)*a;
}

vec3 softlight_blend_1ch(vec3 base, vec3 blend) {
    return vec3(softlight_blend_1ch(base.r,blend.r),softlight_blend_1ch(base.g,blend.g),softlight_blend_1ch(base.b,blend.b));
}

vec3 softlight_blend_1ch(vec3 base, vec3 blend, float opacity) {
    return (softlight_blend_1ch(base, blend) * opacity + base * (1.0 - opacity));
}


BNB_DECLARE_SAMPLER_2D(10, 11, glfx_BLUR_BACKGROUND);

#if 0
#define saturate(v) clamp(v, 0.0, 1.0)

vec3 rgb_to_hcv(vec3 rgb)
{
    // Based on work by Sam Hocevar and Emil Persson
    vec4 P = (rgb.g < rgb.b) ? vec4(rgb.bg, -1.0, 2.0/3.0) : vec4(rgb.gb, 0.0, -1.0/3.0);
    vec4 Q = (rgb.r < P.x) ? vec4(P.xyw, rgb.r) : vec4(rgb.r, P.yzx);
    float C = Q.x - min(Q.w, Q.y);
    float H = abs((Q.w - Q.y) / max(0.001,6.0 * C) + Q.z);
    return vec3(H, C, Q.x);
}

vec3 hue_to_rgb(float hue)
{
    float R = abs(hue * 6.0 - 3.0) - 1.0;
    float G = 2.0 - abs(hue * 6.0 - 2.0);
    float B = 2.0 - abs(hue * 6.0 - 4.0);
    return saturate(vec3(R,G,B));
}

vec3 hsl_to_rgb(vec3 hsl)
{
    vec3 rgb = hue_to_rgb(hsl.x);
    float C = (1.0 - abs(2.0 * hsl.z - 1.0)) * hsl.y;
    return (rgb - 0.5) * C + hsl.z;
}

vec3 rgb_to_hsl(vec3 rgb)
{
    vec3 HCV = rgb_to_hcv(rgb);
    float L = HCV.z - HCV.y * 0.5;
    float S = HCV.y / max(0.001, 1.0 - abs(L * 2.0 - 1.0));
    return vec3(HCV.x, S, L);
}

vec3 remove_bags( vec3 res, float RemoveBagsIntensity )
{
    float bag_factor = BNB_TEXTURE_2D(BNB_SAMPLER_2D(bag_selection_tex), var_uv_bg_uv.xy).g*RemoveBagsIntensity;

    if (bag_factor > 1./255. && var_uv_bg_uv.y < 0.6)
    {
        vec3 avg = BNB_TEXTURE_2D(BNB_SAMPLER_2D(glfx_BLUR_BACKGROUND),var_uv_bg_uv.zw).xyz;

        //hsv = mix(hsv, avg, 1.00);
        vec3 hsl = rgb_to_hsl(res);
        vec3 hsl2 = rgb_to_hsl(avg);
        hsl.b = hsl2.b;
        hsl.g = mix(hsl.g, 0.0, 0.1);
        hsl.b = mix(1.0, hsl.b, 0.925);

        vec3 skin = hsl_to_rgb(hsl);
        res = mix(res, skin, bag_factor);
    }
    return res;
}
#endif

void main()
{
    float softlight_alpha = 0.9*maskColor.r;
    
    float skinSoftIntensity = 0.9;
    float RemoveBagsIntensity = 0.9;
    float rot = script_data1.z;
    
    vec3 res = BNB_TEXTURE_2D(BNB_SAMPLER_2D(glfx_BACKGROUND), var_uv_bg_uv.zw).xyz;
    
    float soft_skin_factor = maskColor.r * skinSoftIntensity;
 
    res = softSkin(res, soft_skin_factor);

    if( maskColor.g > 1./255. )
    {
        float sharp_factor = maskColor.g * teethSharpenIntensity;
        res = sharpen(res, sharp_factor);
        float teeth_factor = maskColor.g;
        res = whitening(res, teeth_factor, BNB_PASS_SAMPLER_ARGUMENT(glfx_WLUT2));
    }

    if( maskColor.b > 1./255. )
    {
        float e_factor = maskColor.b;
        res = whitening(res, e_factor, BNB_PASS_SAMPLER_ARGUMENT(glfx_WLUT1));
    }

    vec4 soft_light_layer = BNB_TEXTURE_2D(BNB_SAMPLER_2D(tex_softlight), var_uv_bg_uv.xy );

    const float soft_cutoff0 = 0.3;
    const float soft_cutoff1 = 0.7;
    float brightness = res.g;
    float light_factor = smoothstep(soft_cutoff0,soft_cutoff1,brightness);
    soft_light_layer.xyz = mix( 
        vec3(dot(soft_light_layer.xyz,vec3(0.299,0.587,0.114))), 
        soft_light_layer.xyz, 
        light_factor );

    vec3 softlight_color = softlight_blend_1ch( res, soft_light_layer.xyz );

    res = mix(res, softlight_color, softlight_alpha*mix(1.,rot,soft_light_layer.w));
    vec2 uv = var_uv_bg_uv.xy;

  
    vec4 makeup_color = BNB_TEXTURE_2D(BNB_SAMPLER_2D(tex_makeup), var_uv);
    res = mix(res, makeup_color.rgb, makeup_color.w); 
    
    bnb_FragColor = vec4(res, 1.);
}
