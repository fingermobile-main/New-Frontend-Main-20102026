#include <bnb/glsl.vert>

BNB_LAYOUT_LOCATION(0)
BNB_IN vec3 attrib_pos;

BNB_DECLARE_SAMPLER_2D(0, 1, tex_morphs);

BNB_OUT(0)
vec2 var_c;


const int EXPAND_PASSES = 8;
const float NPUSH = 75.;

void main()
{
    int i = int(gl_InstanceID);

    vec3 vpos = attrib_pos;

    ivec2 ij = ivec2(gl_VertexID % (3308 / 2), gl_VertexID / (3308 / 2));
    vec2 delta = vec2(0.);

    for (int bsi = 0; bsi < 4; ++bsi)
        delta += texelFetch(BNB_SAMPLER_2D(tex_morphs), ivec2(ij.x, ij.y + (bsi + 0) * 2), 0).xy * morphs_00[bsi];
    for (int bsi = 0; bsi < 4; ++bsi)
        delta += texelFetch(BNB_SAMPLER_2D(tex_morphs), ivec2(ij.x, ij.y + (bsi + 4) * 2), 0).xy * morphs_04[bsi];
    for (int bsi = 0; bsi < 4; ++bsi)
        delta += texelFetch(BNB_SAMPLER_2D(tex_morphs), ivec2(ij.x, ij.y + (bsi + 8) * 2), 0).xy * morphs_08[bsi];
    for (int bsi = 0; bsi < 4; ++bsi)
        delta += texelFetch(BNB_SAMPLER_2D(tex_morphs), ivec2(ij.x, ij.y + (bsi + 12) * 2), 0).xy * morphs_12[bsi];
    for (int bsi = 0; bsi < 4; ++bsi)
        delta += texelFetch(BNB_SAMPLER_2D(tex_morphs), ivec2(ij.x, ij.y + (bsi + 16) * 2), 0).xy * morphs_16[bsi];
    for (int bsi = 0; bsi < 4; ++bsi)
        delta += texelFetch(BNB_SAMPLER_2D(tex_morphs), ivec2(ij.x, ij.y + (bsi + 20) * 2), 0).xy * morphs_20[bsi];
    for (int bsi = 0; bsi < 4; ++bsi)
        delta += texelFetch(BNB_SAMPLER_2D(tex_morphs), ivec2(ij.x, ij.y + (bsi + 24) * 2), 0).xy * morphs_24[bsi];
    for (int bsi = 0; bsi < 4; ++bsi)
        delta += texelFetch(BNB_SAMPLER_2D(tex_morphs), ivec2(ij.x, ij.y + (bsi + 28) * 2), 0).xy * morphs_28[bsi];
    for (int bsi = 0; bsi < 4; ++bsi)
        delta += texelFetch(BNB_SAMPLER_2D(tex_morphs), ivec2(ij.x, ij.y + (bsi + 32) * 2), 0).xy * morphs_32[bsi];
    delta += texelFetch(BNB_SAMPLER_2D(tex_morphs), ivec2(ij.x, ij.y + 36 * 2), 0).xy * morphs_36[0];

    vpos.xy += delta;

    float scale = 1. - float(i) / float(EXPAND_PASSES + 1);
    scale = scale * scale * (3. - 2. * scale); // smoothstep fall-off
    float d0 = float(i) / float(EXPAND_PASSES + 1);
    float d1 = float(i + 1) / float(EXPAND_PASSES + 1);
#ifndef BNB_VK_1
    vec4 npush_scale = vec4(NPUSH * float(i) / float(EXPAND_PASSES), scale * 0.5, d1 - d0, d0 + d1 - 1.);
#else
    vec4 npush_scale = vec4(NPUSH * float(i) / float(EXPAND_PASSES), scale * 0.5, (d1 - d0) * 0.5, (d0 + d1) * 0.5);
#endif

    gl_Position = bnb_MVP * vec4(vpos * (1. + npush_scale.x / length(vpos)), 1.);
    gl_Position.z = gl_Position.z * npush_scale.z + gl_Position.w * npush_scale.w;

    vec4 pos_no_push = bnb_MVP * vec4(vpos, 1.);
    vec4 original_pos = bnb_MVP * vec4(attrib_pos, 1.);
    var_c = npush_scale.y * (original_pos.xy / original_pos.w - pos_no_push.xy / pos_no_push.w);
}
