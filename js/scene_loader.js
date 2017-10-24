var SceneLoader = function () {
};

SceneLoader.prototype.call = function(){
  var canvas = document.querySelector("#renderCanvas");
  var engine = new BABYLON.Engine(canvas, true);
  var scene = this.createScene(engine, canvas);

  // Register a render loop to repeatedly render the scene
  engine.runRenderLoop(function () {
    scene.render();
  });

  // Watch for browser/canvas resize events
  window.addEventListener("resize", function () {
    engine.resize();
  });
};

SceneLoader.prototype.createScene = function(engine, canvas){
  var scene = new BABYLON.Scene(engine);

  this.createCamera(scene, canvas);
  this.createLights(scene);
  this.createGround(scene);

  // SETUP TILES
  var tiles = []

  var wireframe_material = new BABYLON.StandardMaterial("wireframe_texture", scene);
  wireframe_material.wireframe = true;
  wireframe_material.alpha = 0.5;

  for(var x = -10; x < 10; x++) {
    for(var z = -10; z < 10; z++) {
      var tile = BABYLON.MeshBuilder.CreatePlane("tile", {width: 1, height: 1, sideOrientation: 0}, scene);
      tile.rotation.x = Math.PI/2;
      tile.position.x = x;
      tile.position.z = z;
      tile.material = wireframe_material;

      tiles.push(tile)
    }
  }

  var selected_tile_state = null;


  // LOAD HABITAT MODEL
  var loader = new BABYLON.AssetsManager(scene);
  var load_task = loader.addMeshTask("habitat_v01", "", "assets/models/", "habitat_v01.obj");

  var habitat = null;
  load_task.onSuccess = function(task) {
    habitat = task.loadedMeshes[0];
    habitat.scaling.x = 0.015
    habitat.scaling.y = 0.015
    habitat.scaling.z = 0.015
  }

  load_task.onError = function(task) {
    console.log("FAIL")
  }

  loader.onFinish = function (tasks) {
    engine.runRenderLoop(function () {
      scene.render();
    });
  };

  loader.load()


  // GUI
  var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

  var button1 = BABYLON.GUI.Button.CreateSimpleButton("but1", "Build Habitat");
  button1.width = "220px"
  button1.height = "100px";
  button1.color = "white";
  button1.cornerRadius = 10;
  button1.background = "green";
  button1.onPointerUpObservable.add(function() {
    if (selected_tile_state == null) {
      console.log("NOTHING SELECTED");
    }

    var newInstance = habitat.createInstance("i1");
    newInstance.position =  selected_tile_state.position;
  });
  advancedTexture.addControl(button1);
  button1.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
  button1.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
  button1.paddingLeft = 20;
  button1.paddingBottom = 20;


  // CLICK HANDLER
  window.addEventListener("click", function (evt) {
    var pickResult = scene.pick(evt.clientX, evt.clientY);
    var selected_tile = pickResult.pickedMesh;

    // Return early in case of mesh
    if (selected_tile == ground) {
      return;
    }

    var is_selected_material = new BABYLON.StandardMaterial("texture_xxx", scene);
    is_selected_material.diffuseColor = new BABYLON.Color3(0, 1, 0);
    is_selected_material.alpha = 0.35;

    selected_tile.material = is_selected_material
    selected_tile_state = selected_tile
  });

  return scene;
};

SceneLoader.prototype.createCamera = function(scene, canvas){
  var camera = new BABYLON.FreeCamera("camera1",
                                      new BABYLON.Vector3(6, 4, -6),
                                      scene);
  camera.mode = BABYLON.Camera.ORTHOGRAPHIC_CAMERA;

  camera.orthoTop = 4;
  camera.orthoBottom = -4;
  camera.orthoLeft = -10;
  camera.orthoRight = 10;

  camera.setTarget(BABYLON.Vector3.Zero());

  camera.attachControl(canvas, false);
};

SceneLoader.prototype.createLights = function(scene){
  var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);
  light.intensity = .5;

  var dir_light = new BABYLON.DirectionalLight("light2", new BABYLON.Vector3(1, -1, 1), scene);
};

SceneLoader.prototype.createGround = function(scene){
  var ground = BABYLON.Mesh.CreateGround("ground1", 30, 30, 2, scene);
  ground.position.y = -.01

  var material = new BABYLON.StandardMaterial("texture1", scene);
  material.specularColor = new BABYLON.Color3(0, 0, 0);
  material.diffuseTexture = new BABYLON.Texture("assets/images/mars_square_4k_v01.jpg", scene);
  // material.bumpTexture = new BABYLON.Texture("assets/images/mars_square_4k_BMP_v02.jpg", scene);
  ground.material = material;
};
