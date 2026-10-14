#include <bnb/glsl.frag>


BNB_IN(0) vec2 var_uv;



BNB_DECLARE_SAMPLER_VIDEO(0, 1, glfx_VIDEO);

void main()
{
	vec2 uv = var_uv;
	bnb_FragColor = BNB_TEXTURE_2D(BNB_SAMPLER_2D(glfx_VIDEO),uv);
}

