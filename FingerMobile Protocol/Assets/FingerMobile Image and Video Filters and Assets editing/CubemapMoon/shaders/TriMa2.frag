#include <bnb/glsl.frag>

#define COEFbnb_FragColor 0.2 // from 0.0 to 1.0


BNB_IN(0) vec2 var_uv;
BNB_IN(1) vec4 random;



BNB_DECLARE_SAMPLER_2D(0, 1, glfx_BACKGROUND);

float time;

float sat( float t ) {
	return clamp( t, 0.0, 1.0 );
}

vec2 sat( vec2 t ) {
	return clamp( t, 0.0, 1.0 );
}

float remap( float t, float a, float b ) {
	return sat( (t - a) / (b - a) );
}

float linterp( float t ) {
	return sat( 1.0 - abs( 2.0*t - 1.0 ) );
}

float rand( vec2 n ) {
  return fract(sin(dot(n.xy, vec2(12.9898, 78.233)))* 43758.5453);
}

float srand( vec2 n ) {
	return rand(n) * 2.0 - 1.0;
}

float mytrunc( float x, float num_levels )
{
	return floor(x*num_levels) / num_levels;
}

vec2 mytrunc( vec2 x, vec2 num_levels )
{
	return floor(x*num_levels) / num_levels;
}

vec3 rgb2yuv( vec3 rgb )
{
	vec3 yuv;
	yuv.x = dot( rgb, vec3(0.299,0.587,0.114) );
	yuv.y = dot( rgb, vec3(-0.14713, -0.28886, 0.436) );
	yuv.z = dot( rgb, vec3(0.615, -0.51499, -0.10001) );
	return yuv;
 }

 vec3 yuv2rgb( vec3 yuv )
 {
	vec3 rgb;
	rgb.r = yuv.x + yuv.z * 1.13983;
	rgb.g = yuv.x + dot( vec2(-0.39465, -0.58060), yuv.yz );
	rgb.b = yuv.x + yuv.y * 2.03211;
	return rgb;
 }

void main()
{	
	time = random.x;

	float THRESHOLD = 0.1 + COEFbnb_FragColor;
	float time_s = mod( time, 32.0 );

	float glitch_threshold = 1.0 - THRESHOLD;
	const float max_ofs_siz = 0.1;
	const float yuv_threshold = 0.5;
	const float time_frq = 16.0;

	vec2 uv = var_uv;
	
	const float min_change_frq = 4.0;
	float ct = mytrunc( time_s, min_change_frq );
	float change_rnd = rand( mytrunc(uv.yy,vec2(16)) + 150.0 * ct );

	float tf = time_frq*change_rnd;

	float t = 5.0 * mytrunc( time_s, tf );
	float vt_rnd = 0.5*rand( mytrunc(uv.yy + t, vec2(11)) );
	vt_rnd += 0.5 * rand(mytrunc(uv.yy + t, vec2(7)));
	vt_rnd = vt_rnd*2.0 - 1.0;
	vt_rnd = sign(vt_rnd) * sat( ( abs(vt_rnd) - glitch_threshold) / (1.0-glitch_threshold) );

	vec2 uv_nm = uv;
	uv_nm = sat( uv_nm + vec2(max_ofs_siz*vt_rnd, 0) );

	float rnd = rand( vec2( mytrunc( time_s, 8.0 )) );
	//uv_nm.y = (rnd>mix(1.0, 0.975, sat(THRESHOLD))) ? 1.0-uv_nm.y : uv_nm.y;

	vec4 smpl = BNB_TEXTURE_2D(BNB_SAMPLER_2D(glfx_BACKGROUND), uv_nm );
	vec3 smpl_yuv = rgb2yuv( smpl.rgb );
	smpl_yuv.y /= 1.0-3.0*abs(vt_rnd) * sat( yuv_threshold - vt_rnd );
	smpl_yuv.z += 0.125 * vt_rnd * sat( vt_rnd - yuv_threshold );

	bnb_FragColor = vec4( yuv2rgb(smpl_yuv), smpl.a );
}
