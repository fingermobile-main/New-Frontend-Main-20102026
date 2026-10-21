#include <bnb/glsl.frag>
#include <bnb/matrix_operations.glsl>

BNB_IN(0) vec2 var_uv;
flat BNB_IN(1) int var_eye_idx;

BNB_DECLARE_SAMPLER_2D(0, 1, eye_tex);
BNB_DECLARE_SAMPLER_2D(2, 3, glfx_L_EYE_MASK);
BNB_DECLARE_SAMPLER_2D(4, 5, glfx_L_PUPIL_MASK);
BNB_DECLARE_SAMPLER_2D(6, 7, glfx_L_CORNEOSCLERA_MASK);
BNB_DECLARE_SAMPLER_2D(8, 9, glfx_R_EYE_MASK);
BNB_DECLARE_SAMPLER_2D(10, 11, glfx_R_PUPIL_MASK);
BNB_DECLARE_SAMPLER_2D(12, 13, glfx_R_CORNEOSCLERA_MASK);
BNB_DECLARE_SAMPLER_2D(14, 15, eye_coords);

void main()
{
#ifdef BNB_VK_1
	float c0_y = 1.;
	float c1_y = 0.;
#else
	float c0_y = 0.;
	float c1_y = 1.;
#endif
	vec3 coords0 = texture(BNB_SAMPLER_2D(eye_coords),vec2(float(var_eye_idx),c0_y), 0.).xyz;
	vec3 coords1 = texture(BNB_SAMPLER_2D(eye_coords),vec2(float(var_eye_idx),c1_y), 0.).yxz; // swapped x and y
	
	mat3 et = mat3(coords0,coords1,vec3(0.,0.,1.));
	vec2 tex_uv = (vec3(var_uv,1.) * bnb_inverse_trs2d(et)).xy;
	vec2 bg_tex_uv = vec2(1./3.,1./7.) + tex_uv*vec2(1./3.,2./3.);
#ifdef BNB_VK_1
	bg_tex_uv.y = 1. - bg_tex_uv.y;
#endif
	vec4 c = texture(BNB_SAMPLER_2D(eye_tex),bg_tex_uv);

	float mask_sum =  var_eye_idx == 0 ? 
		texture(BNB_SAMPLER_2D(glfx_L_EYE_MASK), var_uv, 0. ).x 
		+ texture(BNB_SAMPLER_2D(glfx_L_PUPIL_MASK), var_uv, 0. ).x
		+ texture(BNB_SAMPLER_2D(glfx_L_CORNEOSCLERA_MASK), var_uv, 0. ).x
		:
		texture(BNB_SAMPLER_2D(glfx_R_EYE_MASK), var_uv, 0. ).x 
		+ texture(BNB_SAMPLER_2D(glfx_R_PUPIL_MASK), var_uv, 0. ).x
		+ texture(BNB_SAMPLER_2D(glfx_R_CORNEOSCLERA_MASK), var_uv, 0. ).x;


	c.xyz *= min(mask_sum,1.)*c.w;

	bnb_FragColor = vec4(c.xyz,1.);
}
