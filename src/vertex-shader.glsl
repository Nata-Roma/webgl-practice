// атрибут, который будет получать данные из буфера
  attribute vec4 a_position;
  attribute vec4 a_color;
  uniform float u_angle;
  varying vec4 v_position;
  varying vec4 v_color;
  // все шейдеры имеют функцию main
  void main() {
    // float u_angle = 0.1;
    mat4 matrix1 = mat4(
    sin(u_angle), cos(u_angle), 0, 0,
    cos(u_angle), -sin(u_angle), 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1);

    mat4 matrix2= mat4(
    sin(u_angle),0,cos(u_angle), 0,
    0, 1, 0, 0,
    cos(u_angle),0,-sin(u_angle), 0,
    0, 0, 0, 1);

    mat4 matrix3= mat4(
    0.5, 0, 0, -1,
    0, 0.5, 0, 0,
    0, 0, 0.5, 0,
    0, 0, 0, 1);

    // gl_Position - специальная переменная вершинного шейдера,
    // которая отвечает за установку положения
    gl_Position = a_position * matrix1 * matrix3 * matrix2;
    // gl_Position = a_position;
    // v_position = gl_Position;
    v_position = a_position;
    v_color = a_color;
  }
 
 