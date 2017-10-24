var SceneLoader = function () {
};

SceneLoader.prototype.call = function(){
  var canvas = document.querySelector("#renderCanvas");
  var engine = new BABYLON.Engine(canvas, true);
  var scene = new BABYLON.Scene(engine);

  material_factory = new MaterialFactory(scene)

  this.createCamera(scene, canvas);

  this.createLights(scene);

  // Set up the data layer for the game
  var scene_graph = new SceneGraph(scene, material_factory);
  scene_graph.load_initial_objects();

  // Set up controller which will interact with scene graph
  var scene_controller = new SceneController(material_factory, scene_graph);

  this.setup_gui(scene_controller)

  this.setup_click_handler(scene, scene_controller)

  // Register a render loop to repeatedly render the scene
  engine.runRenderLoop(function () {
    scene.render();
  });

  // Watch for browser/canvas resize events
  window.addEventListener("resize", function () {
    engine.resize();
  });
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

SceneLoader.prototype.createLights = function(scene, scene_controller){
  var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);
  light.intensity = .5;

  var dir_light = new BABYLON.DirectionalLight("light2", new BABYLON.Vector3(1, -1, 1), scene);
};

SceneLoader.prototype.setup_gui = function(scene_controller){
  var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

  var button1 = BABYLON.GUI.Button.CreateSimpleButton("but1", "Build Habitat");
  button1.width = "220px"
  button1.height = "100px";
  button1.color = "white";
  button1.cornerRadius = 10;
  button1.background = "green";
  button1.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
  button1.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
  button1.paddingLeft = 20;
  button1.paddingBottom = 20;

  button1.onPointerUpObservable.add(function() {
    scene_controller.buildHabitat();
  });
  advancedTexture.addControl(button1);
};

SceneLoader.prototype.setup_click_handler = function(scene, scene_controller){
  window.addEventListener("click", function (evt) {
    var pickResult = scene.pick(evt.clientX, evt.clientY);
    var selected_tile = pickResult.pickedMesh;

    scene_controller.selectItem(pickResult.pickedMesh);
  });
};
