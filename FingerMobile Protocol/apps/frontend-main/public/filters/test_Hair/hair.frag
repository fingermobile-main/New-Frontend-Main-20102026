#include <bnb/glsl.frag>

BNB_IN(0)
vec2 var_uv;
BNB_IN(1)
vec2 var_hair_mask_uv;
flat BNB_IN(2) vec3 var_hair_average;


BNB_DECLARE_SAMPLER_2D(0, 1, s_bg);
BNB_DECLARE_SAMPLER_2D(2, 3, s_segmentation_mask);

vec4 cubic(float v)
{
    vec4 n = vec4(1.0, 2.0, 3.0, 4.0) - v;
    vec4 s = n * n * n;
    float x = s.x;
    float y = s.y - 4.0 * s.x;
    float z = s.z - 4.0 * s.y + 6.0 * s.x;
    float w = 6.0 - x - y - z;
    return vec4(x, y, z, w) * (1.0 / 6.0);
}

vec2 rgb_hs(vec3 rgb)
{
    float cmax = max(rgb.r, max(rgb.g, rgb.b));
    float cmin = min(rgb.r, min(rgb.g, rgb.b));
    float delta = cmax - cmin;
    vec2 hs = vec2(0.);
    if (cmax > cmin) {
        hs.y = delta / cmax;
        if (rgb.r == cmax)
            hs.x = (rgb.g - rgb.b) / delta;
        else {
            if (rgb.g == cmax)
                hs.x = 2. + (rgb.b - rgb.r) / delta;
            else
                hs.x = 4. + (rgb.r - rgb.g) / delta;
        }
        hs.x = fract(hs.x / 6.);
    }
    return hs;
}

float rgb_v(vec3 rgb)
{
    return max(rgb.r, max(rgb.g, rgb.b));
}

vec3 hsv_rgb(float h, float s, float v)
{
    return v * mix(vec3(1.), clamp(abs(fract(vec3(1., 2. / 3., 1. / 3.) + h) * 6. - 3.) - 1., 0., 1.), s);
}

vec3 blendColor(vec3 base, vec3 blend)
{
    vec3 blend_hsv = vec3(rgb_hs(blend), rgb_v(blend));
    vec3 base_hsv = vec3(rgb_hs(base), rgb_v(base));

    vec4 small_texture_curr = vec4(var_hair_average, 1.);

    vec3 new_color = var_hair_average;

    vec3 small_texture_hsv = vec3(rgb_hs(new_color.rgb), rgb_v(new_color.rgb));

    vec3 result = vec3(0.f);

    result.x = blend_hsv.x;
    result.y = blend_hsv.y;

    float v = sqrt(blend_hsv.z - 1.2f * pow(blend_hsv.z - 0.5f, 3.f)) - 0.2f;

    // apply color params
    result.x += color_params.x * 0.5f;

    if (result.x > 1.f)
        result.x -= 1.f;

    if (result.x < 0.f)
        result.x += 1.f;

    if ((result.y > 0.f) && (result.y < 1.f))
        result.y = exp(log(result.y) * exp(-color_params.y));

    if ((v > 0.f) && (v < 1.f))
        v = exp(log(v) * exp(-color_params.z));

    if (small_texture_hsv.z > 0.f)
        result.z = clamp(
            v * (base_hsv.z / small_texture_hsv.z + 1.f) * 0.5f + (base_hsv.z - small_texture_hsv.z),
            0.f,
            1.f
        );
    else
        result.z = v;

    return hsv_rgb(result.x, result.y, result.z);
}

vec3 blendColor(vec3 base, vec3 blend, float opacity)
{
    return (blendColor(base, blend) * opacity + base * (1.0 - opacity));
}

void main()
{
    const float threshold = 0.2;

    vec2 texSize = hair_nn_meta.xy;
    vec2 invTexSize = 1.0 / texSize;

    vec2 texCoords = var_hair_mask_uv * texSize - 0.5;

    vec2 fxy = fract(texCoords);
    texCoords -= fxy;

    vec4 xcubic = cubic(fxy.x);
    vec4 ycubic = cubic(fxy.y);

    vec4 c = texCoords.xxyy + vec2(-0.5, +1.5).xyxy;

    vec4 s = vec4(xcubic.xz + xcubic.yw, ycubic.xz + ycubic.yw);
    vec4 offset = c + vec4(xcubic.yw, ycubic.yw) / s;

    offset *= invTexSize.xxyy;

    vec4 sample0 = BNB_TEXTURE_2D(BNB_SAMPLER_2D(s_segmentation_mask), offset.xz);
    vec4 sample1 = BNB_TEXTURE_2D(BNB_SAMPLER_2D(s_segmentation_mask), offset.yz);
    vec4 sample2 = BNB_TEXTURE_2D(BNB_SAMPLER_2D(s_segmentation_mask), offset.xw);
    vec4 sample3 = BNB_TEXTURE_2D(BNB_SAMPLER_2D(s_segmentation_mask), offset.yw);

    float sx = s.x / (s.x + s.y);
    float sy = s.z / (s.z + s.w);

    vec4 filtered_mask = mix(mix(sample3, sample2, sx), mix(sample1, sample0, sx), sy);

    float mask = max((filtered_mask.x - threshold) / (1. - threshold), 0.);
    vec3 bg_color = BNB_TEXTURE_2D(BNB_SAMPLER_2D(s_bg), var_uv).rgb;
    bnb_FragColor = vec4(blendColor(bg_color, hair_color.rgb, mask), 1.);
}
