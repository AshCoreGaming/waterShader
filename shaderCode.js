// gl_FragColor = vec4(
//     (abs(sin(gl_FragCoord.x * 0.05) * 0.5) + 0.5),
//     (abs(sin(gl_FragCoord.y * 0.05) * 0.5) + 0.5), 
//     (abs(sin((gl_FragCoord.y * 0.05) + ((gl_FragCoord.x * 0.05))) * 0.5) + 0.5), 
//     1.0);

// void main() {
//     vUvs = aUvs;
//     gl_Position = vec4(
//         (projectionMatrix * translationMatrix * vec3(aVertexPosition.x + (sin(time * 3.0) * 100.0), aVertexPosition.y + (sin((time * 3.0) + 90.0) * 100.0), 1.0)).xy, 
//             0.0, 
//             1.0);
// }

// void main() {
//     vUvs = aUvs;

//     wobble = translationMatrix;

//     //wobble = translationMatrix + (sin(time) * 0.5) * 0.01;

//     gl_Position = vec4(
//         (projectionMatrix * translationMatrix * vec3(aVertexPosition.x, aVertexPosition.y + (sin(time + aVertexPosition.x) * 90.0), 1.0)).xy,
//             0.0, 
//             1.0);
// }

const geometry = new PIXI.Geometry()
    .addAttribute('aVertexPosition', 
        [-200, -200, // x, y
        200, -200, 
        200, 200,
        -200, 200], 
        2) // size of attibute
    .addAttribute('aUvs', 
        [0, 0, 
        1, 0, 
        1, 1, 
        0, 1],
        2)
    .addIndex([0, 1, 2, 0, 2, 3]);

    // void main() {
    //     gl_FragColor = vec4(
    //         vUvs.x + (0.5 + (0.5 * (sin(time)))), 
    //         vUvs.y + (0.5 + (0.5 * (sin(time + 90.0)))),
    //         abs(sin((gl_FragCoord.x * 0.005) + (time * 0.5))), 
    //         vUvs.y * 0.1);
    // }

//     gl_FragColor = vec4(
//         0, //(vUvs.x + (0.5 + (0.5 * (sin(time)))) * 0.1) + noise, 
//         (-vUvs.y + (0.5 + (0.5 * (sin(time + 90.0)))) * 0.7) + noise,
//         0.8 + noise, 
//         0.1 + (vUvs.y * 0.5));
// }

// gl_FragColor = texture2D(uSampler2, vUvs + sin( (time + (vUvs.x) * 14.) ) * 0.1 );