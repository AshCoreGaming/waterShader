console.log("ting");
const app = new PIXI.Application();
document.body.appendChild(app.view);

const quad = new PIXI.Geometry();
quad.addAttribute(
  "aVertexPosition",
  //[-1000, -1000, 1000, -1000, 1000, 1000, -1000, 1000],
  [0,         0,  800,     0,  800,  600,     0, 600],
  2
);
quad
  .addAttribute("aUvs", [0, 0, 1, 0, 1, 1, 0, 1], 2)
  .addIndex([0, 1, 2, 0, 2, 3]);

const xSize = 5;
const ySize = 5;
let verticies = [];
let uvs = [];
let triangles = [];

function createMeshData() {
    verticies = [(xSize + 1) * (ySize + 1)];
    i = 0;
    for (let x = 0; x < xSize + 1; x++) {
        for (let y = 0; y < ySize + 1; y++) {
            verticies[i] = x * 50;
            i++;
            verticies[i] = y * 50;
            i++
        }
    }

    uvs = [verticies.length];
    i = 0;
    for (let x = 0; x < xSize + 1; x++) {
        for (let y = 0; y < ySize + 1; y++) {
            uvs[i] = x / xSize;
            i++;
            uvs[i] = y / ySize;
            i++;
        }
    }

    triangles = [xSize * ySize * 6];
    let vert = 0;
    let tris = 0;
    for (let x = 0; x < xSize; x++) {
        for (let y = 0; y < ySize; y++) {
            triangles[tris + 0] = vert + 0;
            triangles[tris + 1] = vert + xSize + 1;
            triangles[tris + 2] = vert + 1;
            triangles[tris + 3] = vert + 1;
            triangles[tris + 4] = vert + xSize + 1;
            triangles[tris + 5] = vert + xSize + 2;

            vert++;
            tris += 6;
        }
        vert++;
    }
    console.log(verticies);
    console.log(uvs);
    console.log(triangles);
}

createMeshData();

const geometry = new PIXI.Geometry()
    .addAttribute('aVertexPosition', 
        verticies, 
        2) // size of attibute
    .addAttribute('aUvs', 
        uvs,
        2)
    .addIndex(triangles);


const vertexSrcBg = `

    precision mediump float;

    attribute vec2 aVertexPosition;
    attribute vec2 aUvs;

    uniform mat3 translationMatrix;
    uniform mat3 projectionMatrix;

    varying vec2 vUvs;

    void main() {

        vUvs = aUvs;
        gl_Position = vec4((projectionMatrix * translationMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);

    }`;

const fragmentSrcBg = `

    precision mediump float;

    varying vec2 vUvs;

    uniform sampler2D uSampler2;
    uniform float time;

    void main() {

        gl_FragColor = texture2D(uSampler2, 
            vec2(vUvs.x + (sin((time * 2.6) + (vUvs.y * 0.5)) * 0.005),
             vUvs.y + sin( (((time + 90.0) * 4.0) + (vUvs.x) * 14.) ) * 0.01 ));
    }`;


const vertexSrcWater = `

    precision mediump float;

    attribute vec2 aVertexPosition;
    attribute vec2 aUvs;

    uniform mat3 translationMatrix;
    uniform mat3 projectionMatrix;

    uniform float time;

    varying vec2 vUvs;
    varying vec2 wave;

    void main() {
        vUvs = aUvs;

        wave = aVertexPosition;

        wave = vec2(
            aVertexPosition.x, //                   wavelength          freq     amp      only top
            aVertexPosition.y + (sin((aVertexPosition.x * 2.0) + (time * 3.0)) * 37.0) * (1.0 - aUvs.y));

        gl_Position = vec4(
            (projectionMatrix * translationMatrix * vec3(wave, 1.0)).xy,
                0.0, 
                1.0);
    }`;

const fragmentSrcWater = `
    
    precision mediump float;

    uniform float time;

    varying vec2 vUvs;

    const mat2 myt = mat2(.12121212, .13131313, -.13131313, .12121212);
    const vec2 mys = vec2(1e4, 1e6);

    vec2 rhash(vec2 uv) {
        uv *= myt;
        uv *= mys;
        return fract(fract(uv / mys) * uv);
    }

    float voronoi2d(const in vec2 point) {
        vec2 p = floor(point);
        vec2 f = fract(point);
        float res = 0.0;
        for (int j = -1; j <= 1; j++) {
            for (int i = -1; i <= 1; i++) {
                vec2 b = vec2(i, j);
                vec2 r = vec2(b) - f + rhash(p + b);
                res += 1. / pow(dot(r, r), 8.);
            }
        }
        return pow(1. / res, 0.0625);
    }

    void main() {

        float noise = voronoi2d(
            vec2(
                (vUvs.x + (sin(time * 0.3))) * 3.0,
                (vUvs.y - (time * 0.6)) * 3.0
            )
        );
        noise = noise * noise * noise * noise;
        noise = noise;


        gl_FragColor = vec4(
            0, //(vUvs.x + (0.5 + (0.5 * (sin(time)))) * 0.1) + noise, 
            (-vUvs.y + (0.5 + (0.5 * (sin(time + 90.0)))) * 0.7) + noise,
            0.8 + noise, 
            0.1 + (vUvs.y * 0.5));
    }`;

const uniformsWater = {
    time: 0
}

const uniformsBg = {
    uSampler2: PIXI.Texture.from('officeVibe.jpg'),
    time: 0
}

const waterShader = PIXI.Shader.from(vertexSrcWater, fragmentSrcWater, uniformsWater);
const meshy = new PIXI.Mesh(geometry, waterShader);
meshy.position.set(250, 250);

const maskShader = new PIXI.Shader.from(vertexSrcWater, fragmentSrcWater, uniformsWater);
const mask = new PIXI.Mesh(geometry, maskShader);
mask.position.set(250, 250);

const bgShader = PIXI.Shader.from(vertexSrcBg, fragmentSrcBg, uniformsBg);
const bg = new PIXI.Mesh(quad, bgShader);

bg.mask = mask;
//bg.anchor.set(0.3);

// background img
const background = PIXI.Sprite.from('officeVibe.jpg');
background.width = 800;
background.height = 600;
app.stage.addChild(background);
app.stage.addChild(bg);
app.stage.addChild(meshy);

app.ticker.add((delta) => {
    //meshy.rotation += 0.01 * delta;
    meshy.shader.uniforms.time += delta * 0.02;
    bg.shader.uniforms.time += delta * 0.02;
});