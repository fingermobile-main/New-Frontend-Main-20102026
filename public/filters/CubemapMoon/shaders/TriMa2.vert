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


BNB_OUT(0) vec2 var_uv;
BNB_OUT(1) vec4 random;

void main()
{	
	random = randomVec;
	float aspect = bnb_PROJ[1][1]/bnb_PROJ[0][0];
	float s = sign(bnb_PROJ[0][0]);

	vec2 v = attrib_pos.xy;
	vec2 uv = v*0.5 + 0.5;

gl_Position = vec4( v, 0.0, 1.0 );
	#ifdef BNB_VK_1	
		uv.y = 1. - uv.y;
	#endif
	var_uv = uv;

}