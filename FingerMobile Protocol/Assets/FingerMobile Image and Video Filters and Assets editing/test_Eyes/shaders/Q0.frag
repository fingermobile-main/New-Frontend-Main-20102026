#include <bnb/glsl.frag>




BNB_IN(0) vec2 var_uv;



BNB_DECLARE_SAMPLER_2D(0, 1, glfx_L_EYE_MASK);

void main()
{   
	vec4 c = js_color;
	c.xyz *= BNB_TEXTURE_2D(BNB_SAMPLER_2D(glfx_L_EYE_MASK), var_uv ).x;
	bnb_FragColor = c;
}
