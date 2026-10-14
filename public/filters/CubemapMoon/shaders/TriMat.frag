#include <bnb/glsl.frag>


BNB_IN(0) vec3 var_v;



BNB_DECLARE_SAMPLER_CUBE(0, 1, tex_env);

void main()
{
	vec3 env = BNB_TEXTURE_CUBE(BNB_SAMPLER_CUBE(tex_env), var_v ).xyz;
	env = pow(env,vec3(0.6));

	float f = 0.35; // desaturate
    float L = 0.3*env.r + 0.6*env.g + 0.1*env.b;
    env.r = env.r + f * (L - env.r);
    env.g = env.g + f * (L - env.g);
    env.b = env.b + f * (L - env.b);

	bnb_FragColor = vec4( env, 1. );
}
