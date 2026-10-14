#include <bnb/glsl.vert>

BNB_LAYOUT_LOCATION(0)
BNB_IN vec2 attrib_pos;

BNB_OUT(0)
vec2 var_uv;
BNB_OUT(1)
vec2 var_hair_mask_uv;
flat BNB_OUT(2) vec3 var_hair_average;

BNB_DECLARE_SAMPLER_2D(0, 1, s_bg);
BNB_DECLARE_SAMPLER_2D(2, 3, s_segmentation_mask);

void main()
{
    vec2 v = attrib_pos.xy;
    gl_Position = vec4(v, 0., 1.);
    var_uv = v * 0.5 + 0.5;

#ifdef BNB_VK_1
    var_uv.y = 1. - var_uv.y;
#endif

    vec4 uv = vec4(v, 1., 1.) * hair_nn_transform;
    var_hair_mask_uv = uv.xy;

    /* average hair color */
    ivec2 small_texture_size = textureSize(BNB_SAMPLER_2D(s_bg), 4);

    // `3600` is a square of 1280x720 texture at MIP level 4
    float step_h = max(float(small_texture_size.x * small_texture_size.y) / 3600.f, 1.f);
    vec2 steps = vec2(step_h) / vec2(small_texture_size);

    vec3 sum = vec3(0.f);
    float amount = 0.f;

    for (float x = 0.f; x < 1.f; x += steps.x) {
        for (float y = 0.f; y < 1.f; y += steps.y) {
            vec2 color_uv = vec2(x, y);

#ifdef BNB_VK_1
            color_uv.y = 1. - color_uv.y;
#endif

            vec4 color = textureLod(BNB_SAMPLER_2D(s_bg), color_uv, 4.f);

            vec2 mask_uv = (vec4(2.f * (vec2(x, y) - 0.5f), 1.f, 1.f) * hair_nn_transform).xy;
            vec4 mask = textureLod(BNB_SAMPLER_2D(s_segmentation_mask), mask_uv, 0.f);
            if (mask.x > 0.9f) {
                sum += color.rgb;
                amount += 1.f;
            }
        }
    }

    var_hair_average = amount > 0.f ? sum / amount : vec3(0.f);
}
