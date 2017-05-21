var webGLTools = {
    vertexShader: null,
    fragmentShader: null,
    program: null,
    positionAttributeLocation: null,
    positionBuffer: null,
    context: null,
    vao: null,
    vertexShaderSource: '#version 300 es' +
        'in vec4 a_position;' +
        'void main() {' +
        '   gl_Position = a_position;' +
        '}',
    fragmentShaderSource: '#version 300 es' +
        'precision mediump float;' +
        'out vec4 outColor;' +
        'void main() {' +
        '   outColor = vec4(1, 0, 0.5, 1);' +
        '}',
    createShader: function (gl, type, source) {
        var shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            return shader;
        }
        console.log(gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
    },
    createProgram: function (gl, vertexShader, fragmentShader) {
        var program = gl.createProgram();
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);
        if (gl.getProgramParameter(program, gl.LINK_STATUS)) {
            return program;
        }
        console.log(gl.getProgramInfoLog(program));
        gl.deleteProgram(program);
    },
    resize: function (canvas) {
        var cssToRealPixels = window.devicePixelRatio || 1;
        // Lookup the size the browser is displaying the canvas.
        var displayWidth  = Math.floor(canvas.clientWidth  * cssToRealPixels);
        var displayHeight = Math.floor(canvas.clientHeight * cssToRealPixels);
 
        // Check if the canvas is not the same size.
        if (canvas.width  !== displayWidth &&
            canvas.height !== displayHeight) {
 
            // Make the canvas the same size
            canvas.width  = displayWidth;
            canvas.height = displayHeight;
        }
    },
    init: function (gl, data) {
        this.context = gl;
        this.resize(this.context.canvas);
        this.context.viewport(0, 0, this.context.canvas.width, this.context.canvas.height);
        this.vertexShader = this.createShader(this.context, this.context.VERTEX_SHADER, this.vertexShaderSource);
        this.fragmentShader = this.createShader(this.context, this.context.FRAGMENT_SHADER, this.fragmentShaderSource);
        this.program = this.createProgram(this.context, this.vertexShader, this.fragmentShader);
        this.positionAttributeLocation = this.context.getAttribLocation(this.program, "a_position");
        this.positionBuffer = this.context.createBuffer();
        this.context.bindBuffer(this.context.ARRAY_BUFFER, this.positionBuffer);
        this.context.bufferData(this.context.ARRAY_BUFFER, new Float32Array(data), this.context.STATIC_DRAW);
        this.vao = this.context.createVertexArray();
        this.context.bindVertexArray(this.vao);
        this.context.enableVertexAttribArray(this.positionAttributeLocation);
    }
};