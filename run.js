var canvas;
var programs = ["first"];
var para = {
    "first": {
        "var": {
            "attributes": ["aVertexPosition", "aVertexColor"],
            "uniforms": ["uPMatrix", "uMVMatrix"]
        },
        "shaders": {
            "vs": "shader-vs",
            "fs": "shader-fs"
        }
    }
};
var vertices = [
    0.9, 0.9, 0.0,
   -0.9, 0.9, 0.0,
    0.9,-0.9, 0.0,
   -0.9,-0.9, 0.0
];
var colors = [
    1.0, 1.0, 1.0, 1.0,    // white
    1.0, 0.0, 0.0, 1.0,    // red
    0.0, 1.0, 0.0, 1.0,    // green
    0.0, 0.0, 1.0, 1.0     // blue
];


function start() {
    canvas = new GLCanvas("canvasGL");
    if (canvas.gl) {
        canvas.initProgram(getShader(para[programs[0]]["shaders"]["vs"]), getShader(para[programs[0]]["shaders"]["fs"]), programs[0]);
        canvas.useProgram(programs[0], para[programs[0]]["var"]);
        canvas.initBuffer(para[programs[0]]["var"]["attributes"][0], vertices);
        canvas.initBuffer(para[programs[0]]["var"]["attributes"][1], colors);
    
        window.addEventListener('resize', draw, false);
        draw();
    }
}

function getShader(id) {
    var shaderScript = document.getElementById(id);
    if (!shaderScript) {
        console.log('ERROR: Shader not loaded.');
        return null;
    }
    return shaderScript.text;
}

function draw() {
    canvas.resize();
    var perspective = makePerspective(30, canvas.aspect(), 0.1, 100);
    canvas.clear();
    loadIdentity();
    mvTranslate([0.0, 0.0, -3.5]);
    
    canvas.useBuffer(para[programs[0]]["var"]["attributes"][0]);
    canvas.useBuffer(para[programs[0]]["var"]["attributes"][1], 4);
    
    canvas.uniformMatrix4fv(para[programs[0]]["var"]["uniforms"][0], perspective.flatten());
    canvas.uniformMatrix4fv(para[programs[0]]["var"]["uniforms"][1], mvMatrix.flatten());
    
    canvas.gl.drawArrays(canvas.gl.TRIANGLE_STRIP, 0, 4);
}
