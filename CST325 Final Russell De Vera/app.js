// Russell De Vera's Code

'use strict'

var gl;

var appInput = new Input();
var time = new Time();
var camera = new OrbitCamera(appInput)

// var sphereGeometry = null; // this will be created after loading from a file
var groundGeometry = null;
var particleSystemGeometry = null;
var backWall = null;
var leftWall = null;
var rightWall = null;
var frontWall = null;
var roof = null;
var sunGeo = null;
var earthGeo = null;
var moonGeo = null;
var lightGeo = null;

// positions
var earthPos = new Vector3();
var moonPos = new Vector3();

var projectionMatrix = new Matrix4();

// the shader that will be used by each piece of geometry (they could each use their own shader but in this case it will be the same)
var textureShaderProgram;
//LIGHT
var colorProgram;

// auto start the app when the html page is ready
window.onload = window['initializeAndStartRendering'];

// we need to asynchronously fetch files from the "server" (your local hard drive)
var loadedAssets = {
    textureTextVS: null, textureTextFS: null,
    sun: null,
    earth: null,
    moon: null,
    nx: null, nz: null, px: null, py: null, pz: null,
    sphereJSON: null,
    colorVS: null, colorFS: null
};

// -------------------------------------------------------------------------
function initializeAndStartRendering() {
    initGL();
    loadAssets(function() {
        createShaders(loadedAssets);
        createScene();

        updateAndRender();
    });
}

// -------------------------------------------------------------------------
function initGL(canvas) {
    var canvas = document.getElementById("webgl-canvas");

    try {
        gl = canvas.getContext("webgl");
        gl.canvasWidth = canvas.width;
        gl.canvasHeight = canvas.height;

        gl.enable(gl.DEPTH_TEST);
    } catch (e) {}

    if (!gl) {
        alert("Could not initialise WebGL, sorry :-(");
    }
}

// -------------------------------------------------------------------------
function loadAssets(onLoadedCB) {
    var filePromises = [
        fetch('./shaders/unlit.textured.vs.glsl').then((response) => { return response.text(); }),
        fetch('./shaders/unlit.textured.fs.glsl').then((response) => { return response.text(); }),
        loadImage('./data/sun.jpg'),
        loadImage('./data/earth.jpg'),
        loadImage('./data/moon.png'),
        loadImage('./data/GalaxyTex_NegativeX.png'),
        loadImage('./data/GalaxyTex_NegativeZ.png'),
        loadImage('./data/GalaxyTex_PositiveX.png'),
        loadImage('./data/GalaxyTex_PositiveY.png'),
        loadImage('./data/GalaxyTex_PositiveZ.png'),
        fetch('./data/sphere.json').then((response) => { return response.json(); }),
        fetch('./shaders/flat.color.vs.glsl').then((response) => { return response.text(); }),
        fetch('./shaders/flat.color.fs.glsl').then((response) => { return response.text(); }),

    ];

    Promise.all(filePromises).then(function(values) {
        // Assign loaded data to our named variables
        loadedAssets.textureTextVS = values[0];
        loadedAssets.textureTextFS = values[1];
        loadedAssets.sun = values[2];
        loadedAssets.earth = values[3];
        loadedAssets.moon = values[4];
        loadedAssets.nx = values[5];
        loadedAssets.nz = values[6];
        loadedAssets.px = values[7];
        loadedAssets.py = values[8];
        loadedAssets.pz = values[9];
        loadedAssets.sphereJSON = values[10];
        loadedAssets.colorVS = values[11];
        loadedAssets.colorFS = values[12];
    }).catch(function(error) {
        console.error(error.message);
    }).finally(function() {
        onLoadedCB();
    });
}

// -------------------------------------------------------------------------
function createShaders(loadedAssets) {
    textureShaderProgram = createCompiledAndLinkedShaderProgram(loadedAssets.textureTextVS, loadedAssets.textureTextFS)

    textureShaderProgram.attributes = {
        vertexPositionAttribute: gl.getAttribLocation(textureShaderProgram, "aVertexPosition"),
        vertexTexcoordsAttribute: gl.getAttribLocation(textureShaderProgram, "aTexcoords")
    };

    textureShaderProgram.uniforms = {
        worldMatrixUniform: gl.getUniformLocation(textureShaderProgram, "uWorldMatrix"),
        viewMatrixUniform: gl.getUniformLocation(textureShaderProgram, "uViewMatrix"),
        projectionMatrixUniform: gl.getUniformLocation(textureShaderProgram, "uProjectionMatrix"),
        textureUniform: gl.getUniformLocation(textureShaderProgram, "uTexture"),
        alphaUniform: gl.getUniformLocation(textureShaderProgram, "uAlpha"),
    };

    colorProgram = createCompiledAndLinkedShaderProgram(loadedAssets.colorVS, loadedAssets.colorFS);
    gl.useProgram(colorProgram);

    colorProgram.attributes = {
        vertexPositionAttribute: gl.getAttribLocation(colorProgram, "aVertexPosition"),
        vertexColorsAttribute: gl.getAttribLocation(colorProgram, "aVertexColor"),
    };

    colorProgram.uniforms = {
        worldMatrixUniform: gl.getUniformLocation(colorProgram, "uWorldMatrix"),
        viewMatrixUniform: gl.getUniformLocation(colorProgram, "uViewMatrix"),
        projectionMatrixUniform: gl.getUniformLocation(colorProgram, "uProjectionMatrix"),
        colorUniform: gl.getUniformLocation(colorProgram, "uColor")
    };
}

// -------------------------------------------------------------------------
function createScene() {
    var scale = new Matrix4(20, 20, 20);

    groundGeometry = new WebGLGeometryQuad(gl, textureShaderProgram);
    groundGeometry.create(loadedAssets.py);

    // compensate for the model being flipped on its side
    var groundRot = new Matrix4().setRotationX(-90);

    groundGeometry.worldMatrix.setIdentity().scale(40, 40, 40)
    groundGeometry.worldMatrix.multiplyRightSide(groundRot);
    groundGeometry.worldMatrix.translate(0, -40, 0)

    roof = new WebGLGeometryQuad(gl);
    roof.create(loadedAssets.py)
    roof.worldMatrix.setIdentity().scale(40, 40, 40)
    roof.worldMatrix.multiplyRightSide(groundRot)
    roof.worldMatrix.translate(0, 40, 0)

    backWall = new WebGLGeometryQuad(gl)
    backWall.create(loadedAssets.nx)
    backWall.worldMatrix.setIdentity().scale(40, 40, 40)
    backWall.worldMatrix.translate(0, 0, -40)

    var leftWallRot = new Matrix4().setRotationY(-90)
    leftWall = new WebGLGeometryQuad(gl)
    leftWall.create(loadedAssets.nz)
    var leftWallMatrix = leftWall.worldMatrix.setIdentity()
    leftWallMatrix.multiplyRightSide(leftWallRot)
    leftWallMatrix.scale(40, 40, 40)
    leftWall.worldMatrix.translate(-40, 0, 0)

    rightWall = new WebGLGeometryQuad(gl)
    rightWall.create(loadedAssets.pz)
    rightWall.worldMatrix.setIdentity().scale(40, 40, 40)
    rightWall.worldMatrix.multiplyRightSide(leftWallRot)
    rightWall.worldMatrix.translate(40, 0, 0)

    frontWall = new WebGLGeometryQuad(gl)
    frontWall.create(loadedAssets.px)
    frontWall.worldMatrix.setIdentity().scale(40, 40, 40)
    frontWall.worldMatrix.translate(0, 0, 40)

    lightGeo = new WebGLGeometryJSON(gl, colorProgram)
    lightGeo.create(loadedAssets.sphereJSON)
    lightGeo.worldMatrix.setIdentity()
    lightGeo.worldMatrix.multiplyRightSide(new Matrix4().scale(0.029, 0.029, 0.029))

    sunGeo = new WebGLGeometryJSON(gl, textureShaderProgram)
    sunGeo.create(loadedAssets.sphereJSON, loadedAssets.sun)
    sunGeo.worldMatrix.setIdentity()
    sunGeo.worldMatrix.multiplyRightSide(new Matrix4().scale(0.03, 0.03, 0.03))
    // sunGeo.worldMatrix.translate(0, 16, 0)

    earthGeo = new WebGLGeometryJSON(gl, textureShaderProgram)
    earthGeo.create(loadedAssets.sphereJSON, loadedAssets.earth)
    earthGeo.worldMatrix.setIdentity()
    earthGeo.worldMatrix.multiplyRightSide(new Matrix4().scale(0.01, 0.01, 0.01))
    // earthGeo.worldMatrix.translate(5, 16, 0)

    moonGeo = new WebGLGeometryJSON(gl, textureShaderProgram)
    moonGeo.create(loadedAssets.sphereJSON, loadedAssets.moon)
    moonGeo.worldMatrix.setIdentity()
    moonGeo.worldMatrix.multiplyRightSide(new Matrix4().scale(0.01, 0.01, 0.01))
    // moonGeo.worldMatrix.translate(10, 16, 0)
    
}

// -------------------------------------------------------------------------
function updateAndRender() {
    requestAnimationFrame(updateAndRender);

    var aspectRatio = gl.canvasWidth / gl.canvasHeight;

    time.update();
    camera.update(time.deltaTime);


    sunGeo.worldMatrix.setRotationY(time.secondsElapsedSinceStart * 10)
    sunGeo.worldMatrix.multiplyRightSide(new Matrix4().scale(0.03, 0.03, 0.03))
    sunGeo.worldMatrix.translate(0, 0, 0)

    earthGeo.worldMatrix.setRotationY(time.secondsElapsedSinceStart * 80)
    earthGeo.worldMatrix.multiplyRightSide(new Matrix4().scale(0.01, 0.01, 0.01))
    earthGeo.worldMatrix.translate(5, 0, 0)

    moonGeo.worldMatrix.setRotationY(time.secondsElapsedSinceStart * 200)
    moonGeo.worldMatrix.multiplyRightSide(new Matrix4().scale(0.0025, 0.0025, 0.0025))
    moonGeo.worldMatrix.translate(6.5, 0, 0)


    var cosTime = Math.cos(time.secondsElapsedSinceStart);
    var sinTime = Math.sin(time.secondsElapsedSinceStart);

    earthGeo.worldMatrix.setTranslation(sinTime * 5, 0, cosTime * 5)

    var cosTimeM = Math.cos(time.secondsElapsedSinceStart * 4);
    var sinTimeM = Math.sin(time.secondsElapsedSinceStart * 4);

    moonGeo.worldMatrix.setTranslation(sinTimeM * 1 + (sinTime * 5), 0, cosTimeM * 1 + (cosTime * 5))

    // specify what portion of the canvas we want to draw to (all of it, full width and height)
    gl.viewport(0, 0, gl.canvasWidth, gl.canvasHeight);

    // this is a new frame so let's clear out whatever happened last frame
    gl.clearColor(0.707, 0.707, 1, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    projectionMatrix.setPerspective(45, aspectRatio, 0.1, 1000);

    groundGeometry.render(camera, projectionMatrix, textureShaderProgram)
    backWall.render(camera, projectionMatrix, textureShaderProgram)
    leftWall.render(camera, projectionMatrix, textureShaderProgram)
    rightWall.render(camera, projectionMatrix, textureShaderProgram)
    frontWall.render(camera, projectionMatrix, textureShaderProgram)
    roof.render(camera, projectionMatrix, textureShaderProgram)
    sunGeo.render(camera, projectionMatrix,  textureShaderProgram)
    earthGeo.render(camera, projectionMatrix,  textureShaderProgram)
    moonGeo.render(camera, projectionMatrix,  textureShaderProgram)
    lightGeo.render(camera, projectionMatrix, colorProgram)
}
