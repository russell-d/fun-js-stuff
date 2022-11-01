precision mediump float;

uniform sampler2D uTexture;
uniform float uAlpha;

// todo #3 - receive texture coordinates and verify correctness by 
// using them to set the pixel color 
varying vec2 vTexcoords;

void main(void) {
    // todo #5
    gl_FragColor = texture2D(uTexture, vTexcoords); 
    gl_FragColor.a = uAlpha;
    // todo #3
    
    //gl_FragColor = vec4(uAlpha, vTexcoords, 0.0);

}

// EOF 00100001-10
