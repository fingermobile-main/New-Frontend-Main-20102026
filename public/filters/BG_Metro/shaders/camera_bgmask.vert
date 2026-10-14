#include <bnb/glsl.vert>

layout(location = 0) in vec2 attrib_pos;

BNB_OUT(0)
vec2 var_uv;

void main()
{
    vec2 v = attrib_pos;
    gl_Position = vec4(v, 0., 1.);

    var_uv = vec2(vec3(v, 1.) * mat3(background_nn_transform));
}