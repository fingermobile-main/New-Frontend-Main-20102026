#include <bnb/glsl.frag>


BNB_IN(0) float var_y;




BNB_DECLARE_SAMPLER_2D(0, 1, glfx_HAIR_MASK);

void main()
{
	ivec2 sz = textureSize(BNB_SAMPLER_2D(glfx_HAIR_MASK),0).xy;
	float w = float(max(sz.x,sz.y));
	float uv_y = var_y *2. - 1.;
	mat2x3 hair_basis = mat2x3(hair_nn_transform[0].xyz, hair_nn_transform[1].xyz);
	float ret_mask = 0.;
	for( float x = 1./w; x < 1.; x += 2./w )
	{
		vec2 uv = vec3(x*2.-1.,uv_y,1.)*hair_basis;
		if( BNB_TEXTURE_2D_LOD(BNB_SAMPLER_2D(glfx_HAIR_MASK), uv, 0. ).x > 0.25 )
		{
			ret_mask = 1.;
			x = 1.;
		}
	}
	bnb_FragColor = vec4(ret_mask);
}
