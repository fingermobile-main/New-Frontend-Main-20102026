#include <bnb/glsl.frag>
#include <bnb/mediump.glsl>

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

float texture_bicubic1(BNB_DECLARE_SAMPLER_2D_ARGUMENT(tex), vec2 uv)
{
    vec2 tex_size = vec2(textureSize(BNB_SAMPLER_2D(tex), 0));
    vec2 invtex_size = 1.0 / tex_size;

    uv = uv * tex_size - 0.5;

    vec2 fxy = fract(uv);
    uv -= fxy;

    vec4 xcubic = cubic(fxy.x);
    vec4 ycubic = cubic(fxy.y);

    vec4 c = uv.xxyy + vec2(-0.5, +1.5).xyxy;

    vec4 s = vec4(xcubic.xz + xcubic.yw, ycubic.xz + ycubic.yw);
    vec4 offset = c + vec4(xcubic.yw, ycubic.yw) / s;

    offset *= invtex_size.xxyy;

    float sample0 = textureLod(BNB_SAMPLER_2D(tex), offset.xz, 0.).x;
    float sample1 = textureLod(BNB_SAMPLER_2D(tex), offset.yz, 0.).x;
    float sample2 = textureLod(BNB_SAMPLER_2D(tex), offset.xw, 0.).x;
    float sample3 = textureLod(BNB_SAMPLER_2D(tex), offset.yw, 0.).x;

    float sx = s.x / (s.x + s.y);
    float sy = s.z / (s.z + s.w);

    return mix(
        mix(sample3, sample2, sx),
        mix(sample1, sample0, sx),
        sy
    );
}

BNB_IN(0)
vec2 var_uv;

BNB_DECLARE_SAMPLER_2D(0, 1, tex_camera);
BNB_DECLARE_SAMPLER_2D(2, 3, tex_bg_mask);

void main()
{
    vec2 uv = var_uv.xy;
    bnb_FragColor = texelFetch(BNB_SAMPLER_2D(tex_camera), ivec2(gl_FragCoord.xy), 0);
    float bg_mask = 1. - texture_bicubic1(BNB_PASS_SAMPLER_ARGUMENT(tex_bg_mask), uv);
    bg_mask *= bg_mask; // square mask for sharper contour edge
    bnb_FragColor.a = bg_mask;
}