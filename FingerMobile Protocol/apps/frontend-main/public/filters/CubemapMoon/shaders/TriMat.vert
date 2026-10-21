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


BNB_OUT(1) vec2 var_bgmask_uv;
BNB_OUT(0) vec3 var_v;

vec3 quat_rotate( vec4 q, vec3 v )
{
	return v + 2.*cross( q.xyz, cross( q.xyz, v ) + q.w*v );
}

void main()
{
	vec2 v = attrib_pos.xy;
	gl_Position = vec4( v, 1., 1. );
	var_bgmask_uv = -v.yx*0.5 + 0.5;
	var_v = quat_rotate( bnb_QUAT, vec3(v/vec2(bnb_PROJ[0][0],bnb_PROJ[1][1]),-1.) );
}
