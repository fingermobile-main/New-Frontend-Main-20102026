#include <bnb/glsl.frag>

BNB_IN(0) vec2 var_uv;

BNB_DECLARE_SAMPLER_2D(0, 1, s_text);

void main()
{
    float text_mask = BNB_TEXTURE_2D(BNB_SAMPLER_2D(s_text), var_uv).x;
    bnb_FragColor = vec4(1., 1., 1., text_mask);
}