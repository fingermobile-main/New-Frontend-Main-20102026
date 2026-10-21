#include <bnb/glsl.frag>

BNB_IN(0) vec2 var_uv;

BNB_DECLARE_SAMPLER_2D(0, 1, glfx_L_EYE_MASK);
BNB_DECLARE_SAMPLER_2D(2, 3, glfx_R_EYE_MASK);

vec4 sum4pix(BNB_DECLARE_SAMPLER_2D_ARGUMENT(mask), ivec2 coords)
{
	float cx = 0.;
	float cy = 0.;
	float sum = 0.;

	float value;
	int x = coords.x*2;
	int y = coords.y*2;

	vec4 retval = vec4(0.);

	ivec2 sz = textureSize(BNB_SAMPLER_2D(mask),0);
	float inv_sz = 1./float(sz);

#define texFetchMask(s,t,l) texture(s,(vec2(t)+0.5)*inv_sz,0.)

	if( (x+1) < sz.x && (y+1) < sz.y )
	{
		value = texFetchMask(BNB_SAMPLER_2D(mask),ivec2(x,y),0).x; 
		cx += float(x)*value;
		cy += float(y)*value;
		sum += value;

		value = texFetchMask(BNB_SAMPLER_2D(mask),ivec2(x+1,y),0).x; 
		cx += float(x+1)*value;
		cy += float(y)*value;
		sum += value;

		value = texFetchMask(BNB_SAMPLER_2D(mask),ivec2(x,y+1),0).x; 
		cx += float(x)*value;
		cy += float(y+1)*value;
		sum += value;

		value = texFetchMask(BNB_SAMPLER_2D(mask),ivec2(x+1,y+1),0).x; 
		cx += float(x+1)*value;
		cy += float(y+1)*value;
		sum += value;
		
		retval = vec4(cx,cy,sum,0.);
	}

	return retval;
}

void main()
{
	vec2 bnb_FragCoord = var_uv*vec2(128.,64.);
	if( bnb_FragCoord.x < 64. )
		bnb_FragColor = sum4pix( BNB_PASS_SAMPLER_ARGUMENT(glfx_L_EYE_MASK), ivec2(bnb_FragCoord.xy) );
	else
		bnb_FragColor = sum4pix( BNB_PASS_SAMPLER_ARGUMENT(glfx_R_EYE_MASK), ivec2(bnb_FragCoord.x-64.,bnb_FragCoord.y) );
}
