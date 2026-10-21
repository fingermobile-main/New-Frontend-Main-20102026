#include <bnb/glsl.frag>


BNB_IN(0) float var_color_uv;
BNB_IN(1) vec2 var_bg_uv;
BNB_IN(2) vec2 var_hairmask_uv;




BNB_DECLARE_SAMPLER_2D(4, 5, glfx_BACKGROUND);

BNB_DECLARE_SAMPLER_2D(0, 1, glfx_HAIR_MASK);

vec3 rgb2yuv(vec3 rgb)
{
	vec3 yuv;
	yuv.x = rgb.r * 0.299 + rgb.g * 0.587 + rgb.b * 0.114;
	yuv.y = rgb.r * -0.169 + rgb.g * -0.331 + rgb.b * 0.5 + 0.5;
	yuv.z = rgb.r * 0.5 + rgb.g * -0.419 + rgb.b * -0.081 + 0.5;
	return yuv;
}

vec3 yuv2rgb(vec3 yuv)
{
	float Y = yuv.x;
	vec2 UV = yuv.yz - 0.5;
	return vec3(Y+1.4*UV.y,Y-0.343*UV.x-0.711*UV.y,Y+1.765*UV.x);
}

void main()
{
	vec4 hair_colors_size = vec4(8., 0., 0., 0.);

	vec4 hair_colors[] = vec4[](
		vec4(1.0, 0.0, 0.0, 1.0),
		vec4(1.0, 0.0, 0.0, 1.0),

		vec4(0.0, 1.0, 0.0, 1.0),
		vec4(0.0, 1.0, 0.0, 1.0),

		vec4(0.0, 0.0, 1.0, 1.0),
		vec4(0.0, 0.0, 1.0, 1.0),

		vec4(1.0, 1.0, 0.0, 1.0),
		vec4(1.0, 1.0, 0.0, 1.0)
	);

	vec3 bg = BNB_TEXTURE_2D(BNB_SAMPLER_2D(glfx_BACKGROUND), var_bg_uv ).xyz;

	float color_coord = var_color_uv*(hair_colors_size.x-1.);
	int color_i0 = int(color_coord);
	int color_i1 = min(color_i0+1,int(hair_colors_size.x)-1);
	vec4 hair_color = mix( hair_colors[color_i0], hair_colors[color_i1], fract(color_coord) );

	float alpha = BNB_TEXTURE_2D(BNB_SAMPLER_2D(glfx_HAIR_MASK), var_hairmask_uv )[0];
	float beta = 0.;//0.5;

	vec3 pixel = rgb2yuv(bg);
	vec3 yuv = rgb2yuv(hair_color.xyz);

	if(alpha > 0.05)
	{
		pixel[1] = (1. - alpha)*pixel[1] + alpha*((beta)*pixel[1] + (1. - beta)*yuv[1]);
		pixel[2] = (1. - alpha)*pixel[2] + alpha*((beta)*pixel[2] + (1. - beta)*yuv[2]);
	}

	bnb_FragColor = vec4(yuv2rgb(pixel), 1.);
}
