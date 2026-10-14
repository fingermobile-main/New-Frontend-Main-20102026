#include <bnb/glsl.vert>
#include <bnb/decode_int1010102.glsl>
#include<bnb/matrix_operations.glsl>

layout(location = 0) in vec3 attrib_pos;
layout(location = 3) in vec2 attrib_uv;

BNB_OUT(0) vec2 var_uv;
flat BNB_OUT(1) int var_eye_idx;

void main()
{
	mat4 nn_transform;
	int eye_idx = int(attrib_pos.z);
	if (eye_idx == 0) {
		nn_transform = left_eye_nn_transform;
	} else {
		nn_transform = right_eye_nn_transform;
	}

	mat3 eye_m = bnb_inverse_trs2d(mat3( 
		nn_transform[0].xyz, 
		nn_transform[1].xyz, 
		vec3(0.,0.,1.) ) );

	gl_Position = vec4( (vec3(attrib_uv,1.)*eye_m).xy, 0., 1. );
	var_uv = attrib_uv;
	var_eye_idx = eye_idx;
}
