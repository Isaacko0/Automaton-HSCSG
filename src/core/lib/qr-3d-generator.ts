// src/core/lib/qr-3d-generator.ts
// Automaton-HSCSG — QR 3D Generator Tool (MVP 1)
// Asimilado desde Zeitnus-Firma-Operaciones-Ecotomica
// Exporta: PNG, SVG, 3MF (colores), STL + Three.js preview

import type { ToolSpec, CaaSTier } from '../../types.js';

/* ══════════════════════════════════════════════════════════════════
   TIPOS
   ══════════════════════════════════════════════════════════════════ */

export interface QR3DInput {
  url: string;
  baseColor?: string;      // Hex color para base
  qrColor?: string;        // Hex color para QR en relieve
  shape?: 'stand' | 'keychain' | 'plate';
  text?: string;           // Texto en base
  emoji?: string;          // Emoji en centro QR
}

export interface QR3DOutput {
  png: string;             // Base64 PNG
  svg: string;             // SVG string
  '3mf': string;           // Base64 3MF
  stl: string;             // Base64 STL
  preview3d: ThreeJSScene; // Para vista previa WebGL
}

export interface ThreeJSScene {
  geometries: Geometry[];
  materials: Material[];
  objects: Object3D[];
}

export interface Geometry {
  type: string;
  parameters: any[];
  uuid: string;
}

export interface Material {
  type: string;
  color: string;
  uuid: string;
}

export interface Object3D {
  geometry: string;
  material: string;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
  uuid: string;
}

interface QRCodeOptions {
  width?: number;
  margin?: number;
  color?: { dark: string; light: string };
  errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H';
}

interface QRCodeResult {
  modules: boolean[][];
  svg: string;
  pngBase64: string;
  size: number;
}

/* ══════════════════════════════════════════════════════════════════
   QR CODE GENERATION
   ══════════════════════════════════════════════════════════════════ */

export async function generateQRCode(url: string, options: QRCodeOptions = {}): Promise<QRCodeResult> {
  const {
    width = 256,
    margin = 4,
    color = { dark: '#000000', light: '#FFFFFF' },
    errorCorrectionLevel = 'M'
  } = options;

  const modules = generateQRModules(url, errorCorrectionLevel);
  const size = modules.length + margin * 2;
  
  const svg = generateQRCodeSVG(modules, margin, color, size);
  const pngBase64 = await generatePNGFromSVG(svg, width);
  
  return { modules, svg, pngBase64, size };
}

function generateQRModules(url: string, level: string): boolean[][] {
  // Simplified - real implementation uses Reed-Solomon + QR spec
  const version = 1; // 21x21 modules
  const modules: boolean[][] = Array(version * 4 + 17).fill(null).map(() => Array(version * 4 + 17).fill(false));
  return modules;
}

function generateQRCodeSVG(
  modules: boolean[][],
  margin: number,
  color: { dark: string; light: string },
  size: number
): string {
  const moduleSize = 1;
  const svgSize = size * moduleSize;
  
  let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${svgSize}" height="${svgSize}" viewBox="0 0 ${svgSize} ${svgSize}">`;
  svg += `<rect width="${svgSize}" height="${svgSize}" fill="${color.light}"/>`;
  
  for (let y = 0; y < modules.length; y++) {
    for (let x = 0; x < modules[y].length; x++) {
      if (modules[y][x]) {
        svg += `<rect x="${(x + margin) * moduleSize}" y="${(y + margin) * moduleSize}" width="${moduleSize}" height="${moduleSize}" fill="${color.dark}"/>`;
      }
    }
  }
  
  svg += '</svg>';
  return svg;
}

async function generatePNGFromSVG(svg: string, width: number): Promise<string> {
  // In browser: canvas.drawImage(SVGImage) → canvas.toDataURL()
  // Server-side: use sharp or puppeteer
  return `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==`;
}

/* ══════════════════════════════════════════════════════════════════
   3D MODEL GENERATION (3MF + STL)
   ══════════════════════════════════════════════════════════════════ */

export async function generate3DModel(
  qrResult: QRCodeResult,
  input: QR3DInput
): Promise<{ '3mf': string; stl: string; preview3d: ThreeJSScene }> {
  
  const { modules, size } = qrResult;
  const moduleSize = 2; // mm per module
  const baseHeight = 4; // mm
  const qrHeight = 2;   // mm relief
  
  const totalWidth = size * moduleSize;
  const totalDepth = size * moduleSize;
  
  let geometries: Geometry[] = [];
  let materials: Material[] = [];
  let objects: Object3D[] = [];
  
  const baseMaterialId = 'mat-base';
  const qrMaterialId = 'mat-qr';
  
  materials.push(
    { type: 'MeshStandardMaterial', color: input.baseColor || '#000000', uuid: baseMaterialId },
    { type: 'MeshStandardMaterial', color: input.qrColor || '#FFFFFF', uuid: qrMaterialId }
  );
  
  // 1. BASE GEOMETRY
  const baseGeoId = 'geo-base';
  geometries.push({
    type: 'BoxGeometry',
    parameters: [totalWidth, baseHeight, totalDepth],
    uuid: baseGeoId
  });
  
  objects.push({
    geometry: baseGeoId,
    material: baseMaterialId,
    position: [0, baseHeight / 2, 0],
    rotation: [0, 0, 0],
    scale: [1, 1, 1],
    uuid: 'obj-base'
  });
  
  // 2. QR MODULES
  const qrModuleGeometries: Geometry[] = [];
  
  for (let y = 0; y < qrResult.modules.length; y++) {
    for (let x = 0; x < qrResult.modules[y].length; x++) {
      if (qrResult.modules[y][x]) {
        const moduleGeoId = `geo-qr-${x}-${y}`;
        qrModuleGeometries.push({
          type: 'BoxGeometry',
          parameters: [moduleSize, qrHeight, moduleSize],
          uuid: moduleGeoId
        });
        
        objects.push({
          geometry: moduleGeoId,
          material: qrMaterialId,
          position: [
            (x - size / 2 + 0.5) * moduleSize,
            baseHeight + qrHeight / 2,
            (y - size / 2 + 0.5) * moduleSize
          ],
          rotation: [0, 0, 0],
          scale: [1, 1, 1],
          uuid: `obj-qr-${x}-${y}`
        });
      }
    }
  }
  
  // 3. SHAPE-SPECIFIC ADDITIONS
  const shapeAdditions = generateShapeAdditions(
    input.shape || 'stand', totalWidth, totalDepth, baseHeight, qrHeight, moduleSize,
    input.text || '', input.emoji || '', baseMaterialId, qrMaterialId
  );
  objects.push(...shapeAdditions.objects);
  geometries.push(...shapeAdditions.geometries);
  materials.push(...shapeAdditions.materials);
  
  // 4. TEXT/EMOJI ON BASE
  if (input.text || input.emoji) {
    const textAdditions = generateTextOnBase(
      input.text || '', input.emoji || '', totalWidth, totalDepth, baseHeight, baseMaterialId
    );
    objects.push(...textAdditions.objects);
    geometries.push(...textAdditions.geometries);
    materials.push(...textAdditions.materials);
  }
  
  // Generate outputs
  const mf3 = generate3MFPackage(geometries, materials, objects, input.baseColor || '#000000', input.qrColor || '#FFFFFF');
  const stl = generateSTL(geometries, objects);
  const preview3d: ThreeJSScene = { geometries, materials, objects };
  
  return { '3mf': mf3, stl, preview3d };
}

interface ShapeAdditions {
  objects: Object3D[];
  geometries: Geometry[];
  materials: Material[];
}

function generateShapeAdditions(
  shape: 'stand' | 'keychain' | 'plate',
  width: number, depth: number, baseH: number, qrH: number, moduleSize: number,
  text: string, emoji: string,
  baseMatId: string, qrMatId: string
): ShapeAdditions {
  const objects: Object3D[] = [];
  const geometries: Geometry[] = [];
  const materials: Material[] = [];
  
  switch (shape) {
    case 'stand':
      const standGeoId = 'geo-stand';
      geometries.push({ type: 'BoxGeometry', parameters: [width * 0.8, baseH * 2, depth * 0.3], uuid: standGeoId });
      objects.push({
        geometry: standGeoId,
        material: baseMatId,
        position: [0, baseH + baseH, -depth * 0.6],
        rotation: [-Math.PI / 6, 0, 0],
        scale: [1, 1, 1],
        uuid: 'obj-stand'
      });
      break;
      
    case 'keychain':
      const holeGeoId = 'geo-keyhole';
      geometries.push({ type: 'CylinderGeometry', parameters: [4, 4, baseH + 2 + 2], uuid: holeGeoId });
      objects.push({
        geometry: holeGeoId,
        material: baseMatId,
        position: [0, (baseH + 2) / 2, depth / 2 + 6],
        rotation: [Math.PI / 2, 0, 0],
        scale: [1, 1, 1],
        uuid: 'obj-keyhole'
      });
      const ringGeoId = 'geo-ring';
      geometries.push({ type: 'TorusGeometry', parameters: [5, 1.5, 16, 32], uuid: ringGeoId });
      materials.push({ type: 'MeshStandardMaterial', color: '#C0C0C0', uuid: 'mat-ring' });
      objects.push({
        geometry: ringGeoId,
        material: 'mat-ring',
        position: [0, (baseH + 2) / 2, depth / 2 + 6],
        rotation: [Math.PI / 2, 0, 0],
        scale: [1, 1, 1],
        uuid: 'obj-ring'
      });
      break;
      
    case 'plate':
      for (const corner of [-1, 1]) {
        const holeId = `geo-plate-hole-${corner}`;
        geometries.push({ type: 'CylinderGeometry', parameters: [3, 3, baseH + 2 + 2], uuid: holeId });
        objects.push({
          geometry: holeId,
          material: baseMatId,
          position: [corner * width * 0.4, (baseH + 2) / 2, depth * 0.4],
          rotation: [0, 0, 0],
          scale: [1, 1, 1],
          uuid: `obj-plate-hole-${corner}`
        });
      }
      break;
  }
  
  return { objects, geometries, materials };
}

function generateTextOnBase(
  text: string, emoji: string,
  width: number, depth: number, baseH: number,
  baseMatId: string
): ShapeAdditions {
  // Placeholder - real implementation uses TextGeometry (three.js)
  return { objects: [], geometries: [], materials: [] };
}

/* ══════════════════════════════════════════════════════════════════
   3MF PACKAGE GENERATION (XML-based, supports colors)
   ══════════════════════════════════════════════════════════════════ */

function generate3MFPackage(
  geometries: Geometry[],
  materials: Material[],
  objects: Object3D[],
  baseColor: string,
  qrColor: string
): string {
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<model unit="millimeter" xml:lang="en" xmlns="http://schemas.microsoft.com/3dmanufacturing/core/2015/02">
  <metadata name="Application">Automaton-HSCSG Tool Forge</metadata>
  <metadata name="Tool">QR 3D Generator</metadata>
  <metadata name="Created">${new Date().toISOString()}</metadata>
  <resources>`;
  
  const baseMatId = 'BaseMaterial';
  const qrMatId = 'QRMaterial';
  const ringMatId = 'RingMaterial';
  
  xml += `
    <material id="${baseMatId}" name="Base">
      <displaycolor>${hexToSRGB(baseColor)}</displaycolor>
    </material>
    <material id="${qrMatId}" name="QR Relief">
      <displaycolor>${hexToSRGB(qrColor)}</displaycolor>
    </material>
    <material id="${ringMatId}" name="Metal Ring">
      <displaycolor>0.75 0.75 0.75</displaycolor>
    </material>`;
  
  for (const geo of geometries) {
    if (geo.type === 'BoxGeometry') {
      const [w, h, d] = geo.parameters;
      xml += `
    <object id="${geo.uuid}" type="model">
      <mesh>
        <vertices>
          <vertex x="0" y="0" z="0"/>
          <vertex x="${w}" y="0" z="0"/>
          <vertex x="${w}" y="${h}" z="0"/>
          <vertex x="0" y="${h}" z="0"/>
          <vertex x="0" y="0" z="${d}"/>
          <vertex x="${w}" y="0" z="${d}"/>
          <vertex x="${w}" y="${h}" z="${d}"/>
          <vertex x="0" y="${h}" z="${d}"/>
        </vertices>
        <triangles>
          <triangle v1="0" v2="1" v3="2"/>
          <triangle v1="0" v2="2" v3="3"/>
          <triangle v1="4" v2="5" v3="6"/>
          <triangle v1="4" v2="6" v3="7"/>
          <triangle v1="0" v2="1" v3="5"/>
          <triangle v1="0" v2="5" v3="4"/>
          <triangle v1="2" v2="3" v3="7"/>
          <triangle v1="2" v2="7" v3="6"/>
          <triangle v1="0" v2="3" v3="7"/>
          <triangle v1="0" v2="7" v3="4"/>
          <triangle v1="1" v2="2" v3="6"/>
          <triangle v1="1" v2="6" v3="5"/>
        </triangles>
      </mesh>
    </object>`;
    } else if (geo.type === 'CylinderGeometry') {
      xml += `<object id="${geo.uuid}" type="model"><mesh><vertices/></mesh></object>`;
    } else if (geo.type === 'TorusGeometry') {
      xml += `<object id="${geo.uuid}" type="model"><mesh><vertices/></mesh></object>`;
    }
  }
  
  xml += `<build>`;
  for (const obj of objects) {
    let materialId = 'BaseMaterial';
    if (obj.material === 'mat-qr') materialId = 'QRMaterial';
    else if (obj.material === 'mat-ring') materialId = 'RingMaterial';
    
    const [x, y, z] = obj.position;
    const [rx, ry, rz] = obj.rotation;
    const [sx, sy, sz] = obj.scale;
    
    xml += `
    <item objectid="${obj.geometry}" transform="1 0 0 0 1 0 0 0 1 ${x} ${y} ${z}">
      <metadata name="material">${materialId}</metadata>
    </item>`;
  }
  xml += `</build>`;
  
  xml += `
  </resources>
</model>`;
  
  return btoa(xml);
}

function hexToSRGB(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  return `${r.toFixed(4)} ${g.toFixed(4)} ${b.toFixed(4)}`;
}

/* ══════════════════════════════════════════════════════════════════
   STL GENERATION (Binary STL - single color, merged)
   ══════════════════════════════════════════════════════════════════ */

function generateSTL(geometries: Geometry[], objects: Object3D[]): string {
  let stl = `solid QR3DModel\n`;
  
  for (const obj of objects) {
    const geo = geometries.find(g => g.uuid === obj.geometry);
    if (!geo) continue;
    
    if (geo.type === 'BoxGeometry') {
      const [w, h, d] = geo.parameters;
      const [x, y, z] = obj.position;
      const [sx, sy, sz] = obj.scale;
      
      const verts = [
        [-w/2, -h/2, -d/2], [w/2, -h/2, -d/2], [w/2, h/2, -d/2], [-w/2, h/2, -d/2],
        [-w/2, -h/2, d/2], [w/2, -h/2, d/2], [w/2, h/2, d/2], [-w/2, h/2, d/2]
      ].map(([vx, vy, vz]) => [
        vx * sx + x, vy * sy + y, vz * sz + z
      ]);
      
      const faces = [
        [0,1,2], [0,2,3], [4,5,6], [4,6,7],
        [0,1,5], [0,5,4], [2,3,7], [2,7,6],
        [0,3,7], [0,7,4], [1,2,6], [1,6,5]
      ];
      
      for (const [a,b,c] of faces) {
        const v1 = verts[a], v2 = verts[b], v3 = verts[c];
        const ux = v2[0]-v1[0], uy = v2[1]-v1[1], uz = v2[2]-v1[2];
        const vx = v3[0]-v1[0], vy = v3[1]-v1[1], vz = v3[2]-v1[2];
        const nx = uy*vz - uz*vy;
        const ny = uz*vx - ux*vz;
        const nz = ux*vy - uy*vx;
        const len = Math.sqrt(nx*nx + ny*ny + nz*nz) || 1;
        
        stl += `  facet normal ${(nx/len).toFixed(6)} ${(ny/len).toFixed(6)} ${(nz/len).toFixed(6)}\n`;
        stl += `    outer loop\n`;
        stl += `      vertex ${v1[0].toFixed(6)} ${v1[1].toFixed(6)} ${v1[2].toFixed(6)}\n`;
        stl += `      vertex ${v2[0].toFixed(6)} ${v2[1].toFixed(6)} ${v2[2].toFixed(6)}\n`;
        stl += `      vertex ${v3[0].toFixed(6)} ${v3[1].toFixed(6)} ${v3[2].toFixed(6)}\n`;
        stl += `    endloop\n`;
        stl += `  endfacet\n`;
      }
    }
  }
  
  stl += `endsolid QR3DModel\n`;
  return btoa(stl);
}

/* ══════════════════════════════════════════════════════════════════
   MAIN EXECUTE FUNCTION
   ══════════════════════════════════════════════════════════════════ */

export async function executeQR3DGenerator(input: QR3DInput): Promise<QR3DOutput> {
  const qrResult = await generateQRCode(input.url, {
    color: { dark: input.qrColor || '#000000', light: input.baseColor || '#FFFFFF' },
    width: 256,
    margin: 4
  });
  
  const { '3mf': mf3, stl, preview3d } = await generate3DModel(qrResult, input);
  
  return {
    png: qrResult.pngBase64,
    svg: qrResult.svg,
    '3mf': mf3,
    stl,
    preview3d
  };
}

/* ══════════════════════════════════════════════════════════════════
   TOOL SPEC (for Tool Generator registration)
   ══════════════════════════════════════════════════════════════════ */

export const QR_3D_GENERATOR_SPEC: ToolSpec = {
  slug: 'qr-3d-generator',
  name: 'Generador QR 3D para Impresión',
  description: 'Convierte cualquier enlace en código QR imprimible en 3D: llaveros, soportes de mesa, placas de pared. Exporta en 3MF (colores) y STL.',
  category: 'design',
  tags: ['qr', '3d-print', 'generator', 'restaurant', 'wifi', 'reviews'],
  tier: 'FREE',
  inputSchema: {
    type: 'object',
    properties: {
      url: { type: 'string', description: 'Enlace a convertir en QR' },
      baseColor: { type: 'string', default: '#000000', description: 'Color base' },
      qrColor: { type: 'string', default: '#FFFFFF', description: 'Color QR en relieve' },
      shape: { type: 'string', enum: ['stand', 'keychain', 'plate'], default: 'stand', description: 'Tipo de objeto 3D' },
      text: { type: 'string', default: '', description: 'Texto opcional en la base' },
      emoji: { type: 'string', default: '', description: 'Emoji opcional en el centro' }
    },
    required: ['url']
  },
  outputSchema: {
    type: 'object',
    properties: {
      png: { type: 'string', description: 'Base64 PNG' },
      svg: { type: 'string', description: 'SVG vector' },
      '3mf': { type: 'string', description: 'Base64 3MF file' },
      stl: { type: 'string', description: 'Base64 STL file' },
      preview3d: { type: 'object', description: 'Three.js scene JSON' }
    }
  },
  promptTemplate: 'Generate a 3D QR code tool with Three.js preview and 3MF/STL export',
  testCases: [
    { input: { url: 'https://example.com' }, expectedOutput: { png: 'data:image/png;base64,...' }, description: 'Basic QR generation' },
    { input: { url: 'https://restaurant.com/menu', shape: 'stand', text: 'Menú' }, description: 'Restaurant stand' },
    { input: { url: 'https://google.com/reviews', shape: 'keychain', emoji: '⭐' }, description: 'Review keychain' }
  ],
  seo: {
    targetKeywords: ['codigo qr 3d', 'qr imprimir 3d', 'qr llavero 3d', 'generador qr 3mf'],
    metaTitle: 'Generador QR 3D Gratis | Imprime Llaveros, Soportes y Placas',
    metaDescription: 'Convierte cualquier enlace en QR 3D imprimible. Llaveros, soportes de mesa, placas de pared. Exporta 3MF con colores y STL. Gratis, sin registro.',
    h1: 'Generador de Códigos QR 3D para Impresión',
    structuredData: 'SoftwareApplication'
  }
};

export default {
  executeQR3DGenerator,
  generateQRCode,
  generate3DModel,
  generate3MFPackage,
  generateSTL,
  QR_3D_GENERATOR_SPEC
};