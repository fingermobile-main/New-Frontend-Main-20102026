#include <bnb/glsl.vert>
#include <bnb/matrix_operations.glsl>

BNB_LAYOUT_LOCATION(0) BNB_IN vec3 attrib_pos;
#ifdef BNB_VK_1
BNB_LAYOUT_LOCATION(1) BNB_IN uint attrib_n;
BNB_LAYOUT_LOCATION(2) BNB_IN uint attrib_t;
#else
BNB_LAYOUT_LOCATION(1) BNB_IN vec4 attrib_n;
BNB_LAYOUT_LOCATION(2) BNB_IN vec4 attrib_t;
#endif
BNB_LAYOUT_LOCATION(3) BNB_IN vec2 attrib_uv;

BNB_OUT(0) vec4 var_uv;

void main()
{
	mat3 lips_m = bnb_inverse_trs2d( mat3(
        lips_nn_transform[0].xyz,
        lips_nn_transform[1].xyz,
		vec3(0.,0.,1.) ) );

	gl_Position = vec4( (vec3(attrib_uv.xy, 1.) * lips_m).xy, 0., 1. );
	var_uv.xy = gl_Position.xy *0.5 + 0.5;
	var_uv.zw = attrib_uv;
#ifdef BNB_VK_1
    var_uv. y = 1. - var_uv.y;
#endif
}