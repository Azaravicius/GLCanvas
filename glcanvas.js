class GLCanvas {
    constructor(canvasID, clear = [1.0, 1.0, 1.0, 1.0], contextAttributes = {}) {
        // WebGLRenderingContext
        this.gl = null;
        // Object to hold all created programs. {programName:program}
        this.programs = {};
        // All variables of current program {variableName: variableLoction}
        this.variables = {};
        // Buffers in use
        this.buffers = {};
        // HTML5 canvas element
        this.canvas = document.getElementById(canvasID);
        
        if (!this.canvas) {
            console.log("ERROR: Can't find canvas with id", canvasID);
            return;
        }
        // contextAttributes = {alpha: true, depth: true, stencil: false, antialias: true, 
        //                      premultipliedAlpha: true, preserveDrawingBuffer: false, 
        //                      failIfMajorPerformanceCaveat: false }
        this.gl = this.canvas.getContext('webgl', contextAttributes) || 
                         this.canvas.getContext('experimental-webgl', contextAttributes);
        if (!this.gl) {
            console.log("ERROR: Unable to get WebGL context. Your browser may not support it.");
            return;
        }
        this.gl.clearColor(clear[0], clear[1], clear[2], clear[3]);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    }
    
    initProgram(vShader, fShader, program) {
        var fragmentShader, vertexShader;
        vertexShader = this.initShader(vShader, this.gl.VERTEX_SHADER);
        if (!vertexShader) {
            console.log('Vertex shader not loaded.');
            return;
        }
        fragmentShader = this.initShader(fShader, this.gl.FRAGMENT_SHADER);
        if (!fragmentShader) {
            console.log('Fragment shader not loaded.');
            return;
        }
        
        this.programs[program] = this.gl.createProgram();
        this.gl.attachShader(this.programs[program], vertexShader);
        this.gl.attachShader(this.programs[program], fragmentShader);
        this.gl.linkProgram(this.programs[program]);
        if (!this.gl.getProgramParameter(this.programs[program], this.gl.LINK_STATUS)) {
            console.log('Unable to initialize the shader program: ' + this.gl.getProgramInfoLog(this.programs[program]));
            this.gl.deleteProgram(this.programs[program]);
            delete this.programs[program];
            return;
        }
    }
    
    initShader(shaderScript, type) {
        var shader = this.gl.createShader(type);
        this.gl.shaderSource(shader, shaderScript);
        this.gl.compileShader(shader);
        if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
            console.log('An error occurred compiling the shaders: ' + this.gl.getShaderInfoLog(shader));
            this.gl.deleteShader(shader);
            return null;
        }
        return shader;
    }
    
    useProgram(program, variables) {
        var attr;
        this.gl.useProgram(this.programs[program]);
        for (attr in variables["attributes"]) {
            this.variables[variables["attributes"][attr]] = this.gl.getAttribLocation(this.programs[program], variables["attributes"][attr]);
            if (this.variables[variables["attributes"][attr]] == -1) {
                console.log(variables["attributes"][attr], " vertex position attribut not found.");
                continue;
            }
            this.gl.enableVertexAttribArray(this.variables[attr]);
        }
        for (attr in variables["uniforms"]) {
            this.variables[variables["uniforms"][attr]] = this.gl.getUniformLocation(this.programs[program], variables["uniforms"][attr]);
            if (!this.variables[variables["uniforms"][attr]]) {
                console.log(variables["uniforms"][attr], " uniform attribut not found.");
                continue;
            }
        }
    }
    
    // Create and bind buffer and initializes and creates the buffer object's data store.
    // Parameters:
    // name - buffer name
    // data - An ArrayBuffer that will be copied into the data store.
    // target - A GLenum specifying the binding point (target). Default ARRAY_BUFFER.
    // usage - A GLenum specifying the usage pattern of the data store. Default STATIC_DRAW
    initBuffer(name, data, target = this.gl.ARRAY_BUFFER, usage = this.gl.STATIC_DRAW) {
        this.buffers[name] = this.gl.createBuffer();
        this.gl.bindBuffer(target, this.buffers[name]);
        this.gl.bufferData(target, new Float32Array(data), usage);
    }
    
    //resize canvas and viewport.
    // Parameters:
    // width - width to resize. Default window.innerWidth.
    // height - height to resize. Default window.innerHeight.
    // return value - None.
    resize(width = window.innerWidth, height = window.innerHeight) {
        this.canvas.width = width;
        this.canvas.height = height;
        this.gl.viewport(0, 0, width, height);
    }
    
    // Clear COLOR_BUFFER_BIT and DEPTH_BUFFER_BIT.
    // return value - None.
    clear() {
         // COLOR_BUFFER_BIT; STENCIL_BUFFER_BIT; DEPTH_BUFFER_BIT
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    }
    
    // Parameters:
    // name - buffer name
    // location - string, name of the vertex attribute that is to be modified.
    // size - A GLint specifying the number of components per vertex attribute. Default 3.
    // type - A GLenum specifying the data type of each component in the array. Default FLOAT.
    // normalized - A GLboolean specifying whether integer data values should be normalized when being casted to a float. Default false.
    // stride - A GLsizei specifying the offset in bytes between the beginning of consecutive vertex attributes. Cannot be larger than 255. Default 0.
    // offset - A GLintptr specifying an offset in bytes of the first component in the vertex attribute array. Must be a multiple of type. Default 0.
    // return value - None.
    useBuffer(location, size = 3, target = this.gl.ARRAY_BUFFER, type = this.gl.FLOAT, normalized = false, stride = 0, offset = 0) {
        this.gl.bindBuffer(target, this.buffers[location]);
        this.gl.vertexAttribPointer(this.variables[location], size, type, normalized, stride, offset);
    }
    
    // Parameters:
    // location - string, name of the uniform attribute to modify.
    // value - A Float32Array of float values.
    // transpose - A GLboolean specifying whether to transpose the matrix. Default false.
    // return value - None.
    uniformMatrix4fv(location, value, transpose = false) {
        this.gl.uniformMatrix4fv(this.variables[location], transpose, new Float32Array(value));
    }
    
    // Returns canvas aspect ratio of width and height.
    aspect() {
        return this.canvas.width/this.canvas.height;
    }
    
}
