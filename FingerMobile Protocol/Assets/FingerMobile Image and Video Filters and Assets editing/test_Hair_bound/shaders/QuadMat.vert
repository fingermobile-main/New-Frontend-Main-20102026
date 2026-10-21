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



BNB_DECLARE_SAMPLER_2D(2, 3, hair_bounds);

BNB_OUT(0) float var_color_uv;
BNB_OUT(1) vec2 var_bg_uv;
BNB_OUT(2) vec2 var_hairmask_uv;

void main()
{
	mat2x3 hair_basis = mat2x3(hair_nn_transform[0].xyz, hair_nn_transform[1].xyz);
	mat3 hair_inv_basis = bnb_inverse_trs2d(mat3(hair_nn_transform[0].xyz,hair_nn_transform[1].xyz,vec3(0.,0.,1.)));
	
	vec2 bounds = texelFetch(BNB_SAMPLER_2D(hair_bounds),ivec2(0,0),0).xy;

	float y = bounds[0] + (attrib_pos.y*0.5+0.5)*(bounds[1]-bounds[0]);

	gl_Position = vec4( attrib_pos.x, y*2.-1., 0.,1. );

	var_color_uv = 1.-(attrib_pos.y*0.5+0.5);
	var_bg_uv = gl_Position.xy*0.5+0.5;
	#ifdef BNB_VK_1
		var_color_uv = 1. - var_color_uv;
		var_bg_uv.y = 1. - var_bg_uv.y;
	#endif
	
	var_hairmask_uv = vec3(gl_Position.xy,1.)*hair_basis;
}