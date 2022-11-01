precision mediump float;

uniform sampler2D uTexture;
uniform float uAlpha;

// todo #3 - receive texture coordinates and verify correctness by 
// using them to set the pixel color 
varying vec2 textureVcoordinates;

void main(void) {
    // todo #5
    

    // todo #3
    //gl_FragColor = vec4(0.0, 0.0, 0.0, uAlpha);
    gl_FragColor = vec4(uAlpha, textureVcoordinates, 0.0 );
    //gl_FragColor = texture2D(uTexture, textureVcoordinates);

}

// EOF 00100001-10
