// Get the canvas element from our HTML below
var canvas = document.querySelector("#renderCanvas");
// Load the BABYLON 3D engine
var engine = new BABYLON.Engine(canvas, true);

var createScene = function () {

  // This creates a Babylon Scene object (not a shape/mesh)
  var scene = new BABYLON.Scene(engine);
  
  var camera = new BABYLON.FreeCamera("camera1", 
                                      new BABYLON.Vector3(6, 4, -6),
                                      scene);
  camera.mode = BABYLON.Camera.ORTHOGRAPHIC_CAMERA;

  camera.orthoTop = 4;
  camera.orthoBottom = -4;
  camera.orthoLeft = -10;
  camera.orthoRight = 10;

  // target the camera to scene origin
  camera.setTarget(BABYLON.Vector3.Zero());

  // attach the camera to the canvas
  camera.attachControl(canvas, false);

  // This attaches the camera to the canvas
  camera.attachControl(canvas, false);
  
  // SETUP LIGHTS
  var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);
  light.intensity = .5;

  var dir_light = new BABYLON.DirectionalLight("light2", new BABYLON.Vector3(1, -1, 1), scene);

  // Our built-in 'sphere' shape. Params: name, subdivisions, size, scene
  // var sphere = BABYLON.Mesh.CreateSphere("sphere1", 16, 2, scene);
  var box = BABYLON.MeshBuilder.CreateBox("box", {height: 1}, scene);
  box.position.x = -1;

  // SETUP GROUND
  var ground = BABYLON.Mesh.CreateGround("ground1", 35, 35, 2, scene);
  ground.position.y = -.01

  // SETUP GROUND MATERIAL
  var material = new BABYLON.StandardMaterial("texture1", scene);
  material.specularColor = new BABYLON.Color3(0, 0, 0);
  material.diffuseTexture = new BABYLON.Texture("assets/images/mars_square_4k_v01.jpg", scene);
  // material.bumpTexture = new BABYLON.Texture("assets/images/mars_square_4k_BMP_v02.jpg", scene);
  ground.material = material;


  // SETUP TILES
  var tiles = []
  for(var x = -10; x < 10; x++) {
    for(var z = -10; z < 10; z++) {
      var tile = BABYLON.MeshBuilder.CreatePlane("tile", {width: 1, height: 1, sideOrientation: 0}, scene);
      tile.rotation.x = Math.PI/2;
      tile.position.x = x;
      tile.position.z = z;

      tiles.push(tile)
    }
  }

  // SETUP TILE MATERIAL
  var wireframe_material = new BABYLON.StandardMaterial("wireframe_texture", scene);
  wireframe_material.wireframe = true;

  for(i = 0; i < tiles.length; i++){
    var tile = tiles[i];
    tile.material = wireframe_material;
  }

  // GUI
  var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

  var button1 = BABYLON.GUI.Button.CreateSimpleButton("but1", "Build Habitat");
  button1.width = "220px"
  button1.height = "100px";
  button1.color = "white";
  button1.cornerRadius = 10;
  button1.background = "green";
  button1.onPointerUpObservable.add(function() {
      alert("you did it!");
  });
  advancedTexture.addControl(button1);    
  button1.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
  button1.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
  button1.paddingLeft = 20
  button1.paddingBottom = 20


  // Leave this function
  return scene;
};

var scene = createScene();

// Register a render loop to repeatedly render the scene
engine.runRenderLoop(function () {
  scene.render();
});

// Watch for browser/canvas resize events
window.addEventListener("resize", function () {
  engine.resize();
});

//When click event is raised
window.addEventListener("click", function (evt) {
  var pickResult = scene.pick(evt.clientX, evt.clientY);
  var selected_tile = pickResult.pickedMesh;

  var is_selected_material = new BABYLON.StandardMaterial("texture_xxx", scene);
  is_selected_material.diffuseColor = new BABYLON.Color3(0, 1, 0);
  is_selected_material.alpha = 0.35;

  selected_tile.material = is_selected_material
});
