const stage = document.querySelector("[data-sock-viewer]");

if (stage) {
  const startViewer = (() => {
    let started = false;

    return () => {
      if (started) return;
      started = true;
      initSockViewer(stage);
    };
  })();

  if ("IntersectionObserver" in window) {
    const loadObserver = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        loadObserver.disconnect();
        startViewer();
      }
    }, { rootMargin: "360px 0px" });

    loadObserver.observe(stage);
  } else {
    startViewer();
  }
}

async function initSockViewer(stage) {
  const canvas = stage.querySelector(".sock-canvas");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!canvas || !window.WebGLRenderingContext) {
    stage.classList.add("is-fallback");
    return;
  }

  try {
    const THREE = await import("three");
    const { MTLLoader } = await import("three/addons/loaders/MTLLoader.js");
    const { OBJLoader } = await import("three/addons/loaders/OBJLoader.js");

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      preserveDrawingBuffer: true
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
    camera.position.set(0, 0.08, 5.4);

    scene.add(new THREE.HemisphereLight(0xf7efe1, 0x1d211b, 1.65));

    const keyLight = new THREE.DirectionalLight(0xffefd1, 2.55);
    keyLight.position.set(3.5, 4.2, 5.2);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xb8c8b0, 1.1);
    rimLight.position.set(-4, 2.2, -2.8);
    scene.add(rimLight);

    const fillLight = new THREE.DirectionalLight(0xd6ba88, .55);
    fillLight.position.set(-2.4, -1.6, 3.2);
    scene.add(fillLight);

    const basePath = "assets/3d/";
    const materials = await new MTLLoader()
      .setPath(basePath)
      .setResourcePath(basePath)
      .loadAsync("Project%20Name.mtl");

    materials.preload();

    const model = await new OBJLoader()
      .setMaterials(materials)
      .setPath(basePath)
      .loadAsync("Project%20Name.obj");

    const textureLoader = new THREE.TextureLoader();
    textureLoader.setPath(basePath);

    const sockTextures = {
      "medias": await textureLoader.loadAsync("Left.png"),
      "medias.001": await textureLoader.loadAsync("hvitv-enstre.png")
    };

    prepareModel(THREE, model, renderer, sockTextures);
    scene.add(model);

    const state = {
      active: !reduceMotion,
      pointerX: 0,
      pointerY: 0,
      targetX: 0,
      targetY: 0,
      baseY: -0.52
    };

    stage.addEventListener("pointermove", (event) => {
      const bounds = stage.getBoundingClientRect();
      state.targetX = ((event.clientX - bounds.left) / bounds.width - .5) * .95;
      state.targetY = ((event.clientY - bounds.top) / bounds.height - .5) * .56;
    });

    stage.addEventListener("pointerleave", () => {
      state.targetX = 0;
      state.targetY = 0;
    });

    const resize = () => {
      const width = Math.max(1, stage.clientWidth);
      const height = Math.max(1, stage.clientHeight);
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(stage);
    resize();

    stage.classList.add("is-ready");

    renderer.setAnimationLoop((time) => {
      state.pointerX += (state.targetX - state.pointerX) * .08;
      state.pointerY += (state.targetY - state.pointerY) * .08;

      const drift = state.active ? Math.sin(time * .00026) * .48 : 0;
      model.rotation.y = state.baseY + drift + state.pointerX;
      model.rotation.x = -0.1 + state.pointerY;
      model.rotation.z = -0.05 + Math.sin(time * .00018) * .035;

      renderer.render(scene, camera);
    });
  } catch (error) {
    console.error("Kunne ikke laste 3D-sokken.", error);
    stage.classList.add("is-fallback");
  }
}

function prepareModel(THREE, model, renderer, sockTextures) {
  model.traverse((child) => {
    if (!child.isMesh) return;

    child.geometry.computeVertexNormals();

    const materials = Array.isArray(child.material) ? child.material : [child.material];
    materials.forEach((material) => {
      if (!material) return;
      material.side = THREE.DoubleSide;
      material.shininess = 10;
      material.specular = new THREE.Color(0x1f1d18);

      if (sockTextures[material.name]) {
        material.map = sockTextures[material.name];
        material.color = new THREE.Color(0xffffff);
      }

      if (material.map) {
        material.map.colorSpace = THREE.SRGBColorSpace;
        material.map.anisotropy = renderer.capabilities.getMaxAnisotropy();
      }
    });
  });

  const box = new THREE.Box3().setFromObject(model);
  const center = box.getCenter(new THREE.Vector3());
  const size = box.getSize(new THREE.Vector3());
  const maxDimension = Math.max(size.x, size.y, size.z);
  const scale = 2.85 / maxDimension;

  model.scale.setScalar(scale);
  model.position.copy(center).multiplyScalar(-scale);
  model.position.y -= .08;
  model.rotation.set(-0.1, -0.52, -0.05);
}
