// Get the canvas element from our HTML below
var canvas = document.querySelector("#renderCanvas");
// Load the BABYLON 3D engine
var engine = new BABYLON.Engine(canvas, true);

var createScene = function () {

  // This creates a Babylon Scene object (not a shape/mesh)
  var scene = new BABYLON.Scene(engine);
  


  var camera = new BABYLON.FreeCamera("camera1", 
                                      new BABYLON.Vector3(10, 6, -10),
                                      scene);
  camera.mode = BABYLON.Camera.ORTHOGRAPHIC_CAMERA;

  camera.orthoTop = 6;
  camera.orthoBottom = -6;
  camera.orthoLeft = -10;
  camera.orthoRight = 10;

  // target the camera to scene origin
  camera.setTarget(BABYLON.Vector3.Zero());

  // attach the camera to the canvas
  camera.attachControl(canvas, false);

  // This attaches the camera to the canvas
  camera.attachControl(canvas, false);
  
  // This creates a light - aimed 0,1,0 - to the sky.
  var light = new BABYLON.HemisphericLight("light1", 
      new BABYLON.Vector3(0, 1, 0), scene);
  
  // Dim the light a small amount
  light.intensity = .75;
  
  // Our built-in 'sphere' shape. Params: name, subdivisions, size, scene
  // var sphere = BABYLON.Mesh.CreateSphere("sphere1", 16, 2, scene);
  var box = BABYLON.MeshBuilder.CreateBox("box", {height: 1}, scene);

  // Move the sphere upward 1/2 its height
  // box.position.y = 1;
  
  // Our built-in 'ground' shape.  Params: name, width, depth, subdivs, scene
  var ground = BABYLON.Mesh.CreateGround("ground1", 35, 35, 2, scene);
  
  var material = new BABYLON.StandardMaterial("texture1", scene);
  material.specularColor = new BABYLON.Color3(0, 0, 0);
  material.diffuseTexture = new BABYLON.Texture("assets/images/mars_square_4k_v01.jpg", scene);
  // material.bumpTexture = new BABYLON.Texture("assets/images/mars_square_4k_BMP_v02.jpg", scene);

  ground.material = material;


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
