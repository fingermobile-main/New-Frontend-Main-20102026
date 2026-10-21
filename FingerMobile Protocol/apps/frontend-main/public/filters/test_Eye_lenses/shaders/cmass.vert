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
void main()
{
	gl_Position = vec4( attrib_pos.xy, 0., 1. );
	var_uv = attrib_pos.xy*0.5 + 0.5;
#ifdef BNB_VK_1
	// No need to flip var_uv.y here because we're sampling NN masks, not render targets from previous render pass
#endif
}