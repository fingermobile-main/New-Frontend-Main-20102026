#include <bnb/glsl.vert>
#include <bnb/decode_int1010102.glsl>
#include<bnb/matrix_operations.glsl>
#define bnb_IDX_OFFSET 0
#ifdef BNB_VK_1
#ifdef gl_VertexID
#undef gl_VertexID
#endif
#ifdef gl_InstanceID
#undef gl_InstanceID
#endif
#define gl_VertexID gl_VertexIndex
#define gl_InstanceID gl_InstanceIndex
#endif


BNB_LAYOUT_LOCATION(0) BNB_IN vec3 attrib_pos;
BNB_LAYOUT_LOCATION(1) BNB_IN vec3 attrib_pos_static;
BNB_LAYOUT_LOCATION(2) BNB_IN vec2 attrib_uv;
BNB_LAYOUT_LOCATION(3) BNB_IN vec4 attrib_red_mask;


BNB_OUT(0) vec3 maskColor;
BNB_OUT(1) vec4 var_uv_bg_uv;
BNB_OUT(2) vec2 var_uv;
invariant gl_Position;

void main()
{
    gl_Position = bnb_MVP * vec4( attrib_pos, 1. );
    maskColor = attrib_red_mask.xyz;
    vec2 bg_uv  = (gl_Position.xy / gl_Position.w) * 0.5 + 0.5;
    vec2 half_fish_uv = smoothstep(0.,1.,attrib_uv);
    half_fish_uv.x = min(half_fish_uv.x,1.-half_fish_uv.x)*2.;
    var_uv_bg_uv = vec4(half_fish_uv,bg_uv);
    var_uv = attrib_uv;
#ifdef BNB_VK_1
var_uv_bg_uv.w = 1. - var_uv_bg_uv.w;
#endif
}
