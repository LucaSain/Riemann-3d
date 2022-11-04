import { createRoot } from "react-dom/client";
import { useEffect, useRef, useState, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, OrbitControls } from "@react-three/drei";
import alphathing from "../assets/alphathing.png";
//import { ParametricGeometry } from "../../node_modules/three/examples/jsm/geometries/ParametricGeometry";
import * as THREE from "three";

import { BufferGeometry, Float32BufferAttribute, Vector3 } from "three";

function Box(props) {
  //todo add opacitiy hover
  const mesh = useRef();
  return (
    <mesh position={props.props.position} ref={mesh}>
      <boxGeometry args={props.props.xyz} />
      <meshStandardMaterial
        opacity={"0.5"}
        transparent="true"
        color={props.props.color}
      />
    </mesh>
  );
}

class ParametricGeometry extends BufferGeometry {
  constructor(
    func = (u, v, target) => target.set(u, v, Math.cos(u) * Math.sin(v)),
    slices = 8,
    stacks = 8
  ) {
    super();

    this.type = "ParametricGeometry";

    this.parameters = {
      func: func,
      slices: slices,
      stacks: stacks,
    };

    // buffers

    const indices = [];
    const vertices = [];
    const normals = [];
    const uvs = [];

    const EPS = 0.00001;

    const normal = new Vector3();

    const p0 = new Vector3(),
      p1 = new Vector3();
    const pu = new Vector3(),
      pv = new Vector3();

    // generate vertices, normals and uvs

    const sliceCount = slices + 1;

    for (let i = 0; i <= stacks; i++) {
      const v = i / stacks;

      for (let j = 0; j <= slices; j++) {
        const u = j / slices;

        // vertex

        func(u, v, p0);
        vertices.push(p0.x, p0.y, p0.z);

        // normal

        // approximate tangent vectors via finite differences

        if (u - EPS >= 0) {
          func(u - EPS, v, p1);
          pu.subVectors(p0, p1);
        } else {
          func(u + EPS, v, p1);
          pu.subVectors(p1, p0);
        }

        if (v - EPS >= 0) {
          func(u, v - EPS, p1);
          pv.subVectors(p0, p1);
        } else {
          func(u, v + EPS, p1);
          pv.subVectors(p1, p0);
        }

        // cross product of tangent vectors returns surface normal

        normal.crossVectors(pu, pv).normalize();
        normals.push(normal.x, normal.y, normal.z);

        // uv uwu

        uvs.push(u, v);
      }
    }

    // generate indices

    for (let i = 0; i < stacks; i++) {
      for (let j = 0; j < slices; j++) {
        const a = i * sliceCount + j;
        const b = i * sliceCount + j + 1;
        const c = (i + 1) * sliceCount + j + 1;
        const d = (i + 1) * sliceCount + j;

        // faces one and two

        indices.push(a, b, d);
        indices.push(b, c, d);
        indices.push(d, b, a);
        indices.push(d, c, b);
      }
    }

    // build geometry

    this.setIndex(indices);
    this.setAttribute("position", new Float32BufferAttribute(vertices, 3));
    this.setAttribute("normal", new Float32BufferAttribute(normals, 3));
    this.setAttribute("uv", new Float32BufferAttribute(uvs, 2));
  }
}

function Grafic(props) {
  // This reference will give us direct access to the mesh
  const mesh = useRef();

  //useFrame((state, delta) => (mesh.current.rotation.x += 0.01));
  // Return view, these are regular three.js elements expressed in JSX
  const texture = new THREE.TextureLoader().load(alphathing);
  var segments = 300;

  var graphGeometry;

  let a, b, c, d;
  a = props.props.a;
  b = props.props.b;
  c = props.props.c;
  d = props.props.d;

  let meshFunction = function (u, v, target) {
    var x = (b - a) * u + a;
    var y = (d - c) * v + c;
    var z = eval(props.props.func);

    target.set(x, z, -y);
  };

  var paraMaterial = new THREE.MeshLambertMaterial({
    color: "rgba(98, 237, 255, 0.06)",
    opacity: 0.3,
    transparent: true,
  });

  // true => sensible image tile repeat...
  graphGeometry = new ParametricGeometry(meshFunction, segments, segments);

  return (
    <mesh
      opacity={0.1}
      transparent="true"
      geometry={graphGeometry}
      material={paraMaterial}
    ></mesh>
  );
}

export default function ThreeComponent(data) {
  //1 oy
  //2 ox
  //3 oz
  var arr = [];

  let a, b, c, d;
  a = data.data.a;
  b = data.data.b;
  c = data.data.c;
  d = data.data.d;
  let dx = data.data.dx;
  let dz = data.data.dy;

  let func = function (u, v) {
    let x = u;
    let y = v;
    var z = eval(data.data.func);
    return z;
  };

  for (let i = a; i < b; i += dx) {
    for (let j = c; j < d; j += dz) {
      arr.push({
        pos: [i + dx / 2, func(i + dx / 2, j + dz / 2) / 2, -(j + dz / 2)], //dx/2 pt ca mijloc
        heig: [dx, func(i + dx / 2, j + dz / 2), dz],
      });
    }
  }

  return (
    <Suspense fallback={<div>Nibb</div>}>
      <Canvas camera={{ position: [14, 3, 0] }}>
        <ambientLight />
        <OrbitControls />
        <Environment preset="sunset" />
        <pointLight position={[30, 30, 30]} />

        <Box
          props={{ position: [0, 0, 0], color: "red", xyz: [0.01, 1000, 0.01] }}
        />
        <Box
          props={{
            position: [0, 0, 0],
            color: "blue",
            xyz: [0.01, 0.01, 1000],
          }}
        />
        <Box
          props={{
            position: [0, 0, 0],
            color: "green",
            xyz: [1000, 0.01, 0.01],
          }}
        />
        {arr.map((x) => {
          return (
            <Box
              key={Math.random()}
              props={{
                position: x.pos,
                color: "green",
                xyz: x.heig,
              }}
            />
          );
        })}
        <Grafic
          props={{ a: a, b: b, c: c, d: d, func: data.data.func }}
          position={[0, 0, 0]}
        />
      </Canvas>
    </Suspense>
  );
}
