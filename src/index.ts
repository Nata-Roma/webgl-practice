import vertexShaderSource from './vertex-shader.glsl';
import fragmentShaderSource from './fragment-shader.glsl';
import './style.css';


const positions = [
  -1, -1, 
   1, 1, 
   1, -1, 
   -1, -1, 
   1, 1, 
   -1, 1
];

const colors = [
  1, 0, 0, 1, 
  0, 1, 0, 1, 
  0, 0, 1, 1,
  1, 0, 0, 1, 
  0, 1, 0, 1, 
  0, 0, 1, 1
];


const canvas = document.createElement('canvas');
canvas.height = document.documentElement.clientHeight;
canvas.width = document.documentElement.clientWidth;

document.body.append(canvas);
window.onresize = () => {
  canvas.height = document.documentElement.clientHeight;
  canvas.width = document.documentElement.clientWidth;
};

const gl = canvas.getContext('webgl');

const triangleBuffer = createBuffer(gl, [-1, -1, 1, 1,  1, -1, ]);
const triangleColor = createBuffer(gl, [1, 0, 0, 1, 0, 1, 0, 1, 0, 0, 1, 1,]);

function createShader(
  gl: WebGLRenderingContext,
  type: number,
  source: string,
): WebGLShader {
  const shader = gl.createShader(type); // создание шейдера
  gl.shaderSource(shader, source); // устанавливаем шейдеру его программный код
  gl.compileShader(shader); // компилируем шейдер
  const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (success) {
    // если компиляция прошла успешно - возвращаем шейдер
    return shader;
  }

  console.log(gl.getShaderInfoLog(shader));
  gl.deleteShader(shader);
}

const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
const fragmentShader = createShader(
  gl,
  gl.FRAGMENT_SHADER,
  fragmentShaderSource,
);

function createProgram(
  gl: WebGLRenderingContext,
  vertexShader: WebGLShader,
  fragmentShader: WebGLShader,
): WebGLProgram {
  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  const success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (success) {
    return program;
  }

  console.log(gl.getProgramInfoLog(program));
  gl.deleteProgram(program);
}

const program = createProgram(gl, vertexShader, fragmentShader);

const positionAttributeLocation = gl.getAttribLocation(program, 'a_position');
const positionBuffer = createBuffer(gl, positions);

const colorAttributeLocation = gl.getAttribLocation(program, 'a_color');

const colorBuffer = createBuffer(gl, colors);

gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

// очищаем canvas
gl.clearColor(0, 0, 0, 1);
gl.clear(gl.COLOR_BUFFER_BIT);

gl.useProgram(program);

gl.enableVertexAttribArray(colorAttributeLocation);
gl.vertexAttribPointer(colorAttributeLocation, 4, gl.FLOAT, false, 0, 0);

gl.enableVertexAttribArray(positionAttributeLocation);

// Указываем атрибуту, как получать данные от positionBuffer (ARRAY_BUFFER)
const size = 2; // 2 компоненты на итерацию
const type = gl.FLOAT; // наши данные - 32-битные числа с плавающей точкой
const normalize = false; // не нормализовать данные
const stride = 0; // 0 = перемещаться на size * sizeof(type) каждую итерацию для получения следующего положения
const offset = 0; // начинать с начала буфера

const primitiveType = gl.TRIANGLES;
const count = 6;
const u_angle = gl.getUniformLocation(program, 'u_angle');

let currentAngle = 0;
function render() {
  requestAnimationFrame(() => {
    currentAngle += 0.01;

    for (let i = 0; i < 10; i++) {
      gl.bindBuffer(gl.ARRAY_BUFFER, i % 2 === 0 ? triangleBuffer: positionBuffer) ;
      gl.vertexAttribPointer(
        positionAttributeLocation,
        size,
        type,
        normalize,
        stride,
        offset,
      );
      
      gl.uniform1f(u_angle, currentAngle+i/5);
      gl.drawArrays(primitiveType, offset, count);
    }
    render();
  });
}

render();

function createBuffer(
  gl:WebGLRenderingContext, 
  arr: Array<number>, 
  ): WebGLBuffer {
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(arr), gl.STATIC_DRAW);

  return buffer;
}