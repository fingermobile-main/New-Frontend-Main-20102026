#include <bnb/glsl.frag>




BNB_DECLARE_SAMPLER_2D(0, 1, hair_vertical);

void main()
{
	vec2 minmax = vec2(0.,1.);
	for( int y = 0; y != 256; ++y )
	{
		if( texelFetch(BNB_SAMPLER_2D(hair_vertical),ivec2(0,y),0).x > 0.5 )
		{
			minmax[0] = (0.5+float(y))/256. - 1./256.;
			break;
		}
	}

	for( int y = 255; y > 0; --y )
	{
		if( texelFetch(BNB_SAMPLER_2D(hair_vertical),ivec2(0,y),0).x > 0.5 )
		{
			minmax[1] = (0.5+float(y))/256. + 1./256.;
			break;
		}
	}


	bnb_FragColor = vec4(minmax, 0., 1.);
}
