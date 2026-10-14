#include <bnb/glsl.vert>

BNB_LAYOUT_LOCATION(0) BNB_IN vec2 attrib_pos;

BNB_OUT(0) vec2 var_uv;

void main()
{
    vec2 v = attrib_pos.xy;

    mat4 mv = mat4(
        vec4(0.3, 0., 0., 0.),
        vec4(0., 0.3, 0., 0.),
        vec4(0., 0., 1., 1.),
        vec4(0., 0.8, 0., 1.)
    );

    gl_Position = bnb_MV * mv* vec4( v, 0., 1. );
    var_uv = v*0.5 + 0.5;
    var_uv.y = 1. - var_uv.y;
}