#include <bnb/glsl.frag>
#include <bnb/matrix_operations.glsl>


BNB_DECLARE_SAMPLER_2D(0, 1, glfx_L_EYE_MASK);
BNB_DECLARE_SAMPLER_2D(2, 3, glfx_R_EYE_MASK);
BNB_DECLARE_SAMPLER_2D(4, 5, eye_mask_t_prev);
BNB_DECLARE_SAMPLER_2D(6, 7, cmass);

BNB_IN(0) vec2 var_cr;

#define texFetchMask(s,t,l) texture(s,(vec2(t)+0.5)*inv_sz,0.)

mat3 find_mask_coords( BNB_DECLARE_SAMPLER_2D_ARGUMENT(eye_mask), int left_right )
{
    int sz = textureSize(BNB_SAMPLER_2D(eye_mask),0).x;
    float inv_sz = 1./float(sz);
    float half_pix = 0.5/float(sz);

#ifdef BNB_VK_1
    float c0_y = 1.;
    float c1_y = 0.;
#else
    float c0_y = 0.;
    float c1_y = 1.;
#endif
    mat3 prev_et = transpose(mat3(
        texelFetch(BNB_SAMPLER_2D(eye_mask_t_prev),ivec2(left_right,c0_y), 0).xyz,
        texelFetch(BNB_SAMPLER_2D(eye_mask_t_prev),ivec2(left_right,c1_y), 0).yxz, // swapped x and y just like in output
        vec3(0.,0.,1.) ));

    float alpha = 0.3;
    
    vec3 c_pts3 = texelFetch(BNB_SAMPLER_2D(cmass),ivec2(left_right,0),6).xyz;
    vec2 c_pts = c_pts3.xy/c_pts3.z;
    
    float szy0 = 0.;
    for( int y = 0; y != sz; ++y )
    {
        float x = texFetchMask(BNB_SAMPLER_2D(eye_mask),ivec2(c_pts[0],y),0)[0];
        if( x > 0.25 )
        {
            szy0 = float(y)*inv_sz+half_pix;
            break;
        }
    }

    float szy1 = 0.;
    for( int y = sz-1; y > 0; --y )
    {
        float x = texFetchMask(BNB_SAMPLER_2D(eye_mask),ivec2(c_pts[0],y),0)[0];
        if( x > 0.25 )
        {
            szy1 = float(y)*inv_sz+half_pix;
            break;
        }
    }

    float szx0 = 0.;
    for( int x = 0; x != sz; ++x )
    {
        float y = texFetchMask(BNB_SAMPLER_2D(eye_mask),ivec2(x,c_pts[1]),0)[0];
        if( y > 0.25)
        {
            szx0 = float(x)*inv_sz+half_pix;
            break;
        }
    }

    float szx1 = 0.;
    for( int x = sz-1; x > 0; --x )
    {
        float y = texFetchMask(BNB_SAMPLER_2D(eye_mask),ivec2(x,c_pts[1]),0)[0];
        if( y > 0.25 )
        {
            szx1 = float(x)*inv_sz+half_pix;
            break;
        }
    }


    mat3 et;
    
    float xs = szx1-szx0;
    float ys = szy1-szy0;
    float corner_x = prev_et[2][0];
    float corner_y = prev_et[2][1];
    
    float T = 0.7;
    
    if ((xs>0.) && (prev_et[0][0]>0.)){
        et[0] = vec3(alpha*xs+(1.-alpha)*prev_et[0][0], 0., 0.);
    }
    else if (prev_et[0][0]<=0.){
        et[0] = vec3(xs, 0., 0.);
    }
    else if (xs<=0.){
        et[0] = prev_et[0];
    }

    if ((ys>0.) && (prev_et[1][1]>0.)){
        et[1] = vec3(0., alpha*ys+(1.-alpha)*prev_et[1][1], 0.);
    }
    else if (prev_et[1][1]<=0.){
        et[1] = vec3(0., ys, 0.);
    }
    else if (ys<=0.){
        et[1] = prev_et[1];
    }
      
    
    if (xs<=0.){
        corner_x = -1.;
    }
    else if (corner_x<=0.){
        corner_x = szx0;
    }
    else{
//        corner_x = (szx0 + T*corner_x) / (1.+T);
        corner_x = T*szx0 + (1.-T)*corner_x;
    }

    if (ys<=0.){
        corner_y = -1.;
    }
    else if (corner_y<=0.){
        corner_y = szy0;
    }
    else{
//        corner_y = (szy0 + T*corner_y) / (1.+T);
        corner_y = T*szy0 + (1.-T)*corner_y;
    }

    et[2] = vec3(corner_x, corner_y, 0.);
    
//    et[2].y -= (et[0].x-et[1].y)/2.;
    et[2].y -= (et[0].x-et[1].y)*1.7;
    et[1].y = et[0].x;

    return et;

}

void main()
{
    mat3 eye_transform;
    
    if( var_cr.x < 1. )
        eye_transform = find_mask_coords( BNB_PASS_SAMPLER_ARGUMENT(glfx_L_EYE_MASK), 0 );
    else
        eye_transform = find_mask_coords( BNB_PASS_SAMPLER_ARGUMENT(glfx_R_EYE_MASK), 1 );

    if( var_cr.y < 1. )
        bnb_FragColor = vec4( eye_transform[0].x, eye_transform[1].x, eye_transform[2].x, 1. );
    else
        bnb_FragColor = vec4( eye_transform[1].y, eye_transform[0].y, eye_transform[2].y, 1. ); // swap x and y to be able to set default to (0.33,0.,0.33)
}
