import { BufferAttribute, BufferGeometry } from "three";

export function createRibbonGeometry(lengthSegments = 180, widthSegments = 12) {
  const positions: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];

  for (let x = 0; x <= lengthSegments; x += 1) {
    const u = x / lengthSegments;
    for (let y = 0; y <= widthSegments; y += 1) {
      const v = y / widthSegments;
      positions.push((u - 0.5) * 9.2, (v - 0.5) * 2, 0);
      uvs.push(u, v);
    }
  }

  const stride = widthSegments + 1;
  for (let x = 0; x < lengthSegments; x += 1) {
    for (let y = 0; y < widthSegments; y += 1) {
      const a = x * stride + y;
      const b = a + stride;
      indices.push(a, b, a + 1, b, b + 1, a + 1);
    }
  }

  const geometry = new BufferGeometry();
  geometry.setAttribute("position", new BufferAttribute(new Float32Array(positions), 3));
  geometry.setAttribute("uv", new BufferAttribute(new Float32Array(uvs), 2));
  geometry.setIndex(indices);
  geometry.computeBoundingSphere();
  return geometry;
}
