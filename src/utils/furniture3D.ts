import * as THREE from 'three';
import type { PlacedFurnitureObject } from '../types';

export function buildFurniture3DGroup(obj: PlacedFurnitureObject): THREE.Group {
  const group = new THREE.Group();
  group.name = `furniture-${obj.id}`;

  const mainColor = new THREE.Color(obj.color || '#5F4336');
  const accentWood = new THREE.Color('#3D281D');
  const brassColor = new THREE.Color('#D4AF37');
  const whiteMarble = new THREE.Color('#F2EFE9');
  const charcoalDark = new THREE.Color('#1F2421');

  // Materials
  const mainMat = new THREE.MeshStandardMaterial({
    color: mainColor,
    roughness: obj.material === 'leather' ? 0.35 : obj.material === 'marble' ? 0.15 : 0.8,
    metalness: obj.material === 'metal' ? 0.75 : obj.material === 'marble' ? 0.08 : 0.02,
  });

  const woodMat = new THREE.MeshStandardMaterial({
    color: accentWood,
    roughness: 0.65,
    metalness: 0.0,
  });

  const brassMat = new THREE.MeshStandardMaterial({
    color: brassColor,
    roughness: 0.25,
    metalness: 0.8,
  });

  const marbleMat = new THREE.MeshStandardMaterial({
    color: whiteMarble,
    roughness: 0.15,
    metalness: 0.05,
  });

  const darkMat = new THREE.MeshStandardMaterial({
    color: charcoalDark,
    roughness: 0.7,
  });

  const applyShadowsAndUserData = (mesh: THREE.Object3D) => {
    mesh.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        child.userData = { id: obj.id, catalogId: obj.catalogId };
      }
    });
  };

  switch (obj.catalogId) {
    case 'sofa-sectional': {
      // Main 3-seater base
      const base = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.22, 0.95), woodMat);
      base.position.set(-0.2, 0.16, 0);
      group.add(base);

      // Chaise extension (L-shape)
      const chaiseBase = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.22, 1.1), woodMat);
      chaiseBase.position.set(0.95, 0.16, 0.55);
      group.add(chaiseBase);

      // Seat Cushions
      for (let i = 0; i < 2; i++) {
        const cushion = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.25, 0.9), mainMat);
        cushion.position.set(-0.95 + i * 0.75, 0.38, 0.02);
        group.add(cushion);
      }
      const chaiseCushion = new THREE.Mesh(new THREE.BoxGeometry(0.86, 0.25, 1.95), mainMat);
      chaiseCushion.position.set(0.95, 0.38, 0.5);
      group.add(chaiseCushion);

      // Backrests
      const backLong = new THREE.Mesh(new THREE.BoxGeometry(2.76, 0.55, 0.22), mainMat);
      backLong.position.set(0.02, 0.68, -0.42);
      group.add(backLong);

      // Left Armrest
      const armLeft = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.45, 1.0), mainMat);
      armLeft.position.set(-1.42, 0.5, 0.02);
      group.add(armLeft);

      // Throw Pillows
      const pillowMat = new THREE.MeshStandardMaterial({ color: '#D4A373', roughness: 0.9 });
      const pillow1 = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.35, 0.12), pillowMat);
      pillow1.position.set(-1.18, 0.58, -0.25);
      pillow1.rotation.y = 0.3;
      pillow1.rotation.z = -0.15;
      const pillow2 = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.35, 0.12), pillowMat);
      pillow2.position.set(0.95, 0.58, 1.25);
      pillow2.rotation.y = -0.25;
      group.add(pillow1, pillow2);

      // Legs
      const legCoords = [
        [-1.35, -0.4], [1.35, -0.4], [-1.35, 0.4], [1.35, 1.4], [0.55, 1.4]
      ];
      legCoords.forEach(([lx, lz]) => {
        const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.02, 0.18, 12), brassMat);
        leg.position.set(lx, 0.09, lz);
        group.add(leg);
      });
      break;
    }

    case 'sofa-modern': {
      // 3-seater linear sofa
      const base = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.2, 0.9), woodMat);
      base.position.set(0, 0.18, 0);
      group.add(base);

      for (let i = 0; i < 3; i++) {
        const seat = new THREE.Mesh(new THREE.BoxGeometry(0.68, 0.26, 0.82), mainMat);
        seat.position.set(-0.7 + i * 0.7, 0.4, 0.02);
        group.add(seat);
      }

      const back = new THREE.Mesh(new THREE.BoxGeometry(2.18, 0.52, 0.2), mainMat);
      back.position.set(0, 0.68, -0.38);
      group.add(back);

      const leftArm = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.42, 0.92), mainMat);
      leftArm.position.set(-1.12, 0.5, 0);
      const rightArm = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.42, 0.92), mainMat);
      rightArm.position.set(1.12, 0.5, 0);
      group.add(leftArm, rightArm);

      [[-1.05, -0.38], [1.05, -0.38], [-1.05, 0.38], [1.05, 0.38]].forEach(([lx, lz]) => {
        const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.018, 0.2, 12), woodMat);
        leg.position.set(lx, 0.1, lz);
        group.add(leg);
      });
      break;
    }

    case 'armchair-dondolo': {
      // Sculptural lounge chair (Reference Image 5)
      // Slanted legs / rocker base
      const sideFrameGeo = new THREE.BoxGeometry(0.06, 0.6, 0.85);
      const leftFrame = new THREE.Mesh(sideFrameGeo, woodMat);
      leftFrame.position.set(-0.42, 0.38, 0);
      leftFrame.rotation.x = -0.15;
      const rightFrame = new THREE.Mesh(sideFrameGeo, woodMat);
      rightFrame.position.set(0.42, 0.38, 0);
      rightFrame.rotation.x = -0.15;
      group.add(leftFrame, rightFrame);

      // Armrests
      const armGeo = new THREE.BoxGeometry(0.08, 0.05, 0.75);
      const armL = new THREE.Mesh(armGeo, woodMat);
      armL.position.set(-0.42, 0.55, -0.05);
      const armR = new THREE.Mesh(armGeo, woodMat);
      armR.position.set(0.42, 0.55, -0.05);
      group.add(armL, armR);

      // Deep Leather Sling Seat
      const seat = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.14, 0.65), mainMat);
      seat.position.set(0, 0.32, 0.02);
      seat.rotation.x = -0.2;
      group.add(seat);

      // Angled Backrest
      const back = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.55, 0.1), mainMat);
      back.position.set(0, 0.62, -0.28);
      back.rotation.x = -0.3;
      group.add(back);
      break;
    }

    case 'table-coffee-marble': {
      // Marble oval table
      const marbleTop = new THREE.Mesh(new THREE.CylinderGeometry(0.68, 0.68, 0.05, 32), marbleMat);
      marbleTop.scale.set(1.35, 1, 0.85);
      marbleTop.position.set(0, 0.38, 0);
      group.add(marbleTop);

      // 4 brass hairpin legs
      [[-0.6, -0.3], [0.6, -0.3], [-0.6, 0.3], [0.6, 0.3]].forEach(([lx, lz]) => {
        const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.01, 0.38, 12), brassMat);
        leg.position.set(lx, 0.19, lz);
        leg.rotation.z = lx > 0 ? 0.1 : -0.1;
        group.add(leg);
      });
      break;
    }

    case 'media-console': {
      // TV Console Credenza
      const cabinet = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.45, 0.45), woodMat);
      cabinet.position.set(0, 0.32, 0);
      group.add(cabinet);

      // Wood legs
      [[-0.9, -0.18], [0.9, -0.18], [-0.9, 0.18], [0.9, 0.18]].forEach(([lx, lz]) => {
        const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.018, 0.14, 12), darkMat);
        leg.position.set(lx, 0.07, lz);
        group.add(leg);
      });

      // Wall mounted 4K TV Screen above console
      const tvScreen = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.95, 0.04), darkMat);
      tvScreen.position.set(0, 1.45, -0.2);
      const tvBezel = new THREE.Mesh(new THREE.BoxGeometry(1.56, 0.91, 0.045), new THREE.MeshBasicMaterial({ color: '#111714' }));
      tvBezel.position.set(0, 1.45, -0.195);
      group.add(tvScreen, tvBezel);
      break;
    }

    case 'lamp-arc-floor': {
      // Heavy marble base
      const base = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.08, 24), marbleMat);
      base.position.set(0, 0.04, 0);
      group.add(base);

      // Vertical lower pole
      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 1.4, 16), brassMat);
      pole.position.set(0, 0.74, 0);
      group.add(pole);

      // Arched arm extending forward
      const arch = new THREE.Mesh(new THREE.BoxGeometry(0.025, 0.025, 0.9), brassMat);
      arch.position.set(0, 1.55, 0.4);
      arch.rotation.x = 0.2;
      group.add(arch);

      // Dome shade
      const shade = new THREE.Mesh(new THREE.SphereGeometry(0.18, 24, 16, 0, Math.PI * 2, 0, Math.PI * 0.5), brassMat);
      shade.rotation.x = Math.PI;
      shade.position.set(0, 1.45, 0.8);
      group.add(shade);

      // Warm point light inside lamp
      const lampLight = new THREE.PointLight('#FFF1D6', 1.8, 4.5);
      lampLight.position.set(0, 1.35, 0.8);
      lampLight.castShadow = true;
      group.add(lampLight);
      break;
    }

    case 'table-dining-nordic': {
      // 6-seater dining table
      const top = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.06, 0.95), mainMat);
      top.position.set(0, 0.74, 0);
      group.add(top);

      [[-0.85, -0.38], [0.85, -0.38], [-0.85, 0.38], [0.85, 0.38]].forEach(([lx, lz]) => {
        const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.025, 0.72, 16), woodMat);
        leg.position.set(lx, 0.36, lz);
        group.add(leg);
      });
      break;
    }

    case 'chair-dining-upholstered': {
      // Dining chair
      const seat = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.08, 0.48), mainMat);
      seat.position.set(0, 0.46, 0);
      group.add(seat);

      const back = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.42, 0.07), mainMat);
      back.position.set(0, 0.7, -0.21);
      group.add(back);

      [[-0.2, -0.2], [0.2, -0.2], [-0.2, 0.2], [0.2, 0.2]].forEach(([lx, lz]) => {
        const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.015, 0.44, 12), woodMat);
        leg.position.set(lx, 0.22, lz);
        group.add(leg);
      });
      break;
    }

    case 'kitchen-island-bar': {
      // Kitchen Island with waterfall stone ends
      const islandBody = new THREE.Mesh(new THREE.BoxGeometry(2.3, 0.86, 0.96), woodMat);
      islandBody.position.set(0, 0.43, 0);
      group.add(islandBody);

      const waterfallTop = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.07, 1.02), marbleMat);
      waterfallTop.position.set(0, 0.88, 0);
      group.add(waterfallTop);

      // Waterfall sides
      const leftFall = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.88, 1.02), marbleMat);
      leftFall.position.set(-1.17, 0.44, 0);
      const rightFall = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.88, 1.02), marbleMat);
      rightFall.position.set(1.17, 0.44, 0);
      group.add(leftFall, rightFall);

      // Undermount sink & Chrome Faucet
      const sink = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.02, 0.36), darkMat);
      sink.position.set(0.45, 0.91, 0);
      const faucet = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.28, 12), brassMat);
      faucet.position.set(0.45, 1.05, -0.15);
      group.add(sink, faucet);
      break;
    }

    case 'barstool-counter': {
      // High Counter Barstool
      const seat = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.08, 24), mainMat);
      seat.position.set(0, 0.72, 0);
      group.add(seat);

      const footring = new THREE.Mesh(new THREE.TorusGeometry(0.18, 0.015, 12, 24), darkMat);
      footring.rotation.x = Math.PI / 2;
      footring.position.set(0, 0.3, 0);
      group.add(footring);

      for (let i = 0; i < 4; i++) {
        const angle = (i * Math.PI) / 2;
        const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.012, 0.7, 12), darkMat);
        leg.position.set(Math.cos(angle) * 0.16, 0.35, Math.sin(angle) * 0.16);
        group.add(leg);
      }
      break;
    }

    case 'bed-king-platform': {
      // King Platform bed
      const basePlatform = new THREE.Mesh(new THREE.BoxGeometry(2.15, 0.25, 2.25), woodMat);
      basePlatform.position.set(0, 0.15, 0);
      group.add(basePlatform);

      // Channel tufted tall headboard
      const headboard = new THREE.Mesh(new THREE.BoxGeometry(2.25, 1.05, 0.22), mainMat);
      headboard.position.set(0, 0.75, -1.05);
      group.add(headboard);

      // Thick mattress
      const mattress = new THREE.Mesh(new THREE.BoxGeometry(1.95, 0.3, 1.95), new THREE.MeshStandardMaterial({ color: '#FBF9F5', roughness: 0.9 }));
      mattress.position.set(0, 0.42, 0.05);
      group.add(mattress);

      // Duvet / Comforter
      const duvet = new THREE.Mesh(new THREE.BoxGeometry(1.98, 0.12, 1.35), mainMat);
      duvet.position.set(0, 0.52, 0.35);
      group.add(duvet);

      // Dual Pillows
      const pillowGeo = new THREE.BoxGeometry(0.7, 0.14, 0.45);
      const pillowMat = new THREE.MeshStandardMaterial({ color: '#EDE6DC', roughness: 0.85 });
      const p1 = new THREE.Mesh(pillowGeo, pillowMat);
      p1.position.set(-0.52, 0.6, -0.65);
      p1.rotation.x = 0.15;
      const p2 = new THREE.Mesh(pillowGeo, pillowMat);
      p2.position.set(0.52, 0.6, -0.65);
      p2.rotation.x = 0.15;
      group.add(p1, p2);
      break;
    }

    case 'nightstand-floating': {
      // Bedside nightstand
      const box = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.35, 0.45), woodMat);
      box.position.set(0, 0.38, 0);
      group.add(box);

      const handle = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.02, 0.02), brassMat);
      handle.position.set(0, 0.38, 0.23);
      group.add(handle);

      // Mini bedside lamp on top
      const lampBase = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, 0.03, 16), brassMat);
      lampBase.position.set(0, 0.57, 0);
      const shade = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.14, 0.18, 20), new THREE.MeshStandardMaterial({ color: '#FFF8E7' }));
      shade.position.set(0, 0.72, 0);
      group.add(lampBase, shade);
      break;
    }

    case 'bench-end-bed': {
      // Upholstered Bench
      const cushion = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.18, 0.45), mainMat);
      cushion.position.set(0, 0.42, 0);
      group.add(cushion);

      [[-0.6, -0.16], [0.6, -0.16], [-0.6, 0.16], [0.6, 0.16]].forEach(([lx, lz]) => {
        const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.016, 0.33, 12), brassMat);
        leg.position.set(lx, 0.17, lz);
        group.add(leg);
      });
      break;
    }

    case 'wardrobe-closet': {
      // Wardrobe
      const closet = new THREE.Mesh(new THREE.BoxGeometry(1.8, 2.1, 0.6), woodMat);
      closet.position.set(0, 1.05, 0);
      group.add(closet);

      for (let i = -1; i <= 1; i++) {
        const doorLine = new THREE.Mesh(new THREE.BoxGeometry(0.01, 1.95, 0.02), darkMat);
        doorLine.position.set(i * 0.58, 1.05, 0.305);
        const handle = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.25, 0.02), brassMat);
        handle.position.set(i * 0.58 - 0.04, 1.05, 0.32);
        group.add(doorLine, handle);
      }
      break;
    }

    case 'decor-vase-ceramic': {
      // Artisan Ceramic Vase
      const vaseBody = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.18, 0.42, 24), mainMat);
      vaseBody.position.set(0, 0.21, 0);
      const vaseNeck = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.12, 0.18, 24), mainMat);
      vaseNeck.position.set(0, 0.48, 0);
      group.add(vaseBody, vaseNeck);
      break;
    }

    case 'plant-fiddle-fig': {
      // Cylindrical fluted planter
      const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.2, 0.45, 24), marbleMat);
      pot.position.set(0, 0.22, 0);
      const soil = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.03, 24), darkMat);
      soil.position.set(0, 0.42, 0);
      group.add(pot, soil);

      // Wood trunk
      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.045, 1.2, 12), woodMat);
      trunk.position.set(0, 0.95, 0);
      group.add(trunk);

      // Lush green leaves (elliptical disc meshes)
      const leafMat = new THREE.MeshStandardMaterial({ color: '#2E5828', roughness: 0.4, side: THREE.DoubleSide });
      const leafPositions = [
        [0, 1.45, 0, 0.4, 0.35, 0.15],
        [0.18, 1.25, 0.15, -0.3, 0.4, -0.4],
        [-0.18, 1.15, -0.15, 0.35, -0.2, 0.3],
        [0.12, 1.0, -0.18, -0.2, 0.1, -0.5],
        [-0.15, 0.85, 0.18, 0.4, 0.2, 0.4],
      ];
      leafPositions.forEach(([lx, ly, lz, rx, ry, rz]) => {
        const leaf = new THREE.Mesh(new THREE.SphereGeometry(0.24, 12, 8), leafMat);
        leaf.scale.set(1.2, 0.08, 1.6);
        leaf.position.set(lx, ly, lz);
        leaf.rotation.set(rx, ry, rz);
        group.add(leaf);
      });
      break;
    }

    case 'rug-geometric-wool': {
      // Wool Area Rug
      const rug = new THREE.Mesh(
        new THREE.BoxGeometry(3.2, 0.015, 2.4),
        new THREE.MeshStandardMaterial({ color: mainColor, roughness: 0.95 })
      );
      rug.position.set(0, 0.008, 0);
      group.add(rug);
      break;
    }

    case 'art-wall-canvas': {
      // Wall Art Canvas
      const canvas = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.9, 0.04), new THREE.MeshStandardMaterial({ color: '#FFFFFF', roughness: 0.85 }));
      canvas.position.set(0, 1.8, 0);
      const frame = new THREE.Mesh(new THREE.BoxGeometry(1.26, 0.96, 0.035), darkMat);
      frame.position.set(0, 1.8, -0.01);
      const abstractShape = new THREE.Mesh(new THREE.TorusGeometry(0.25, 0.04, 8, 24), new THREE.MeshBasicMaterial({ color: '#5F4336' }));
      abstractShape.position.set(0, 1.8, 0.022);
      group.add(frame, canvas, abstractShape);
      break;
    }

    case 'fireplace-column': {
      // Modern Fireplace Architectural Column (Image 2)
      const column = new THREE.Mesh(new THREE.BoxGeometry(1.1, 2.4, 0.45), new THREE.MeshStandardMaterial({ color: '#F6F3EE', roughness: 0.8 }));
      column.position.set(0, 1.2, 0);
      group.add(column);

      // Firebox recess
      const firebox = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.45, 0.25), darkMat);
      firebox.position.set(0, 0.55, 0.12);
      group.add(firebox);

      // Glowing Fire Embers
      const embers = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.08, 0.16), new THREE.MeshBasicMaterial({ color: '#FF6D00' }));
      embers.position.set(0, 0.38, 0.14);
      group.add(embers);

      // Fireplace warmth point light
      const fireLight = new THREE.PointLight('#FF8A65', 1.6, 3.5);
      fireLight.position.set(0, 0.6, 0.3);
      group.add(fireLight);

      // Stacked firewood logs niche
      for (let i = 0; i < 3; i++) {
        const log = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.45, 12), woodMat);
        log.rotation.x = Math.PI / 2;
        log.position.set(-0.35 + i * 0.12, 0.18, 0.12);
        group.add(log);
      }
      break;
    }

    case 'pendant-trio-dining': {
      // Trio of modern black/brass ceiling dome pendants (Image 2)
      for (let i = -1; i <= 1; i++) {
        const cord = new THREE.Mesh(new THREE.CylinderGeometry(0.005, 0.005, 0.8, 8), darkMat);
        cord.position.set(i * 0.55, 2.0, 0);
        const dome = new THREE.Mesh(new THREE.SphereGeometry(0.18, 20, 14, 0, Math.PI * 2, 0, Math.PI * 0.5), darkMat);
        dome.position.set(i * 0.55, 1.6, 0);
        dome.rotation.x = Math.PI;

        // Warm light under each dome
        const pLight = new THREE.PointLight('#FFF1D6', 1.2, 2.5);
        pLight.position.set(i * 0.55, 1.48, 0);
        group.add(cord, dome, pLight);
      }
      break;
    }

    case 'wood-slat-divider': {
      // Vertical Architectural Wooden Louver Screen (Image 2)
      const slatCount = 10;
      const spacing = 0.12;
      for (let i = 0; i < slatCount; i++) {
        const slat = new THREE.Mesh(new THREE.BoxGeometry(0.04, 2.3, 0.14), woodMat);
        slat.position.set(-0.55 + i * spacing, 1.15, 0);
        group.add(slat);
      }
      // Top and bottom guide rails
      const topRail = new THREE.Mesh(new THREE.BoxGeometry(slatCount * spacing + 0.04, 0.05, 0.16), woodMat);
      topRail.position.set(0, 2.3, 0);
      const botRail = new THREE.Mesh(new THREE.BoxGeometry(slatCount * spacing + 0.04, 0.05, 0.16), woodMat);
      botRail.position.set(0, 0.025, 0);
      group.add(topRail, botRail);
      break;
    }

    case 'staircase-architectural': {
      // Architectural Open Flight Staircase (Image 2)
      const stepCount = 9;
      const stepWidth = 1.0;
      const stepHeight = 0.18;
      const stepDepth = 0.28;

      for (let i = 0; i < stepCount; i++) {
        const step = new THREE.Mesh(new THREE.BoxGeometry(stepWidth, 0.04, stepDepth), woodMat);
        step.position.set(0, (i + 1) * stepHeight, -i * stepDepth);
        group.add(step);

        // Stainless post
        const post = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.9, 8), darkMat);
        post.position.set(stepWidth / 2 - 0.04, (i + 1) * stepHeight + 0.45, -i * stepDepth);
        group.add(post);
      }

      // Handrail
      const railLength = Math.sqrt(Math.pow(stepCount * stepHeight, 2) + Math.pow(stepCount * stepDepth, 2));
      const rail = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, railLength, 12), darkMat);
      rail.position.set(stepWidth / 2 - 0.04, (stepCount * stepHeight) / 2 + 0.9, -(stepCount * stepDepth) / 2);
      rail.rotation.x = Math.atan2(stepCount * stepDepth, stepCount * stepHeight) - Math.PI / 2;
      group.add(rail);
      break;
    }

    case 'coffee-table-square': {
      // Modern Low Square Coffee Table with Lower Shelf (Image 2)
      const topSlab = new THREE.Mesh(new THREE.BoxGeometry(1.05, 0.06, 1.05), woodMat);
      topSlab.position.set(0, 0.36, 0);
      const botSlab = new THREE.Mesh(new THREE.BoxGeometry(1.05, 0.04, 1.05), darkMat);
      botSlab.position.set(0, 0.12, 0);
      group.add(topSlab, botSlab);

      [[-0.48, -0.48], [0.48, -0.48], [-0.48, 0.48], [0.48, 0.48]].forEach(([lx, lz]) => {
        const leg = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.36, 0.05), darkMat);
        leg.position.set(lx, 0.18, lz);
        group.add(leg);
      });
      break;
    }

    default: {
      // Fallback elegant box
      const box = new THREE.Mesh(new THREE.BoxGeometry(1, 0.8, 1), mainMat);
      box.position.y = 0.4;
      group.add(box);
      break;
    }
  }

  // Set position, rotation and scale
  group.position.set(obj.x, obj.y, obj.z);
  group.rotation.y = obj.rotY;
  group.scale.set(obj.scaleX, obj.scaleY, obj.scaleZ);

  // Apply shadows and click target user data
  applyShadowsAndUserData(group);

  return group;
}
