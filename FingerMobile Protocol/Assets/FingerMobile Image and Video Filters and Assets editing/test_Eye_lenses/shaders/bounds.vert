#include <bnb/glsl.vert>

layout(location = 0) in vec3 attrib_pos;
BNB_OUT(0) vec2 var_cr;
void main()
{
	gl_Position = vec4( attrib_pos.xy, 0., 1. );
	var_cr = attrib_pos.xy + 1.;
}