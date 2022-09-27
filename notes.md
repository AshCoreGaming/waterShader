addIndex is where we define the triangles for a mesh
Seems like triangles might need to be rendered anticlockwise??
uniforms seem to be liek the buffers, we can use them to get stuff from the cpu to the shaders

We seem to be able to pass things to the fragment shader that are defined in the vertex shader (vUvs)

void main() {
        vUvs = aUvs;

        wobble = aVertexPosition;

        wobble = vec2(aVertexPosition.x, aVertexPosition.y + (sin(aVertexPosition.x + (time * 2.5)) * 90.0) * (1.0 - aUvs.y));

        gl_Position = vec4(
            (projectionMatrix * translationMatrix * vec3(wobble, 1.0)).xy,
                0.0, 
                1.0);
    }

(time * 2.5)    -> frequency of wave
* 90.0          -> amplitude
(1.0 - aUvs.y)  -> affect the top more than the bottom




