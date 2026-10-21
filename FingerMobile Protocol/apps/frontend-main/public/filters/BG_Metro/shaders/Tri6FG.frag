#include <bnb/glsl.frag>
#include <bnb/lut.glsl>

precision highp float;
precision highp int;

BNB_IN(0) vec2 var_uv;

BNB_DECLARE_SAMPLER_2D(2, 3, glfx_BACKGROUND);

BNB_DECLARE_SAMPLER_2D(0, 1, lut);

const int radius = 6;
const float eps = 0.1f;
const float cut = 0.7f;
const float cut_pow = 0.3f;

void main()
{
    vec2 uv = var_uv;

    vec4 source_color = BNB_TEXTURE_2D(BNB_SAMPLER_2D(glfx_BACKGROUND), uv);
    float fg_mask = source_color.a;
    
    vec4 lut_color = bnb_texture_lookup_512(BNB_TEXTURE_2D(BNB_SAMPLER_2D(glfx_BACKGROUND), uv),BNB_PASS_SAMPLER_ARGUMENT(lut));

    bnb_FragColor = vec4(lut_color.rgb, fg_mask);
}
