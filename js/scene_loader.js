var SceneLoader = function () {
};

SceneLoader.prototype.call = function(){
  var canvas = document.querySelector("#renderCanvas");
  var engine = new BABYLON.Engine(canvas, true);
  var scene = new BABYLON.Scene(engine);

  material_factory = new MaterialFactory(scene)

  this.createCamera(scene, canvas);

  // Set up the data layer for the game
  var scene_graph = new SceneGraph(scene, material_factory);

  var _this = this;
  scene_graph.load_initial_objects().then(function(){

    console.log("PROMISES FULFILLED")
    var scene_controller = new SceneController(material_factory, scene_graph);

    var gui = _this.setup_gui(scene_controller)
    scene_controller.setGui(gui);

    _this.setup_click_handler(scene, scene_controller)

    scene_controller.createHabitatInstance(new BABYLON.Vector3(0, 0, 0));
    // scene_controller.createSolarStationInstance(new BABYLON.Vector3(0, 0, -1));
    // scene_controller.createFighterInstance(new BABYLON.Vector3(0, 2, 0));

    // Register a render loop to repeatedly render the scene
    engine.runRenderLoop(function () {
      scene.render();
    });

    // Watch for browser/canvas resize events
    window.addEventListener("resize", function () {
      engine.resize();
    });
  });

  // Set up controller which will interact with scene graph
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

SceneLoader.prototype.setup_gui = function(scene_controller){
  var gui = new Gui(scene_controller);
  gui.setup_turn_text()
  gui.setup_energy_text()
  gui.setup_build_habitat_button();
  gui.setup_build_solar_station_button();
  gui.setup_end_turn_button();
  return gui;
};

SceneLoader.prototype.setup_click_handler = function(scene, scene_controller){
  window.addEventListener("click", function (evt) {
    var pickResult = scene.pick(evt.clientX, evt.clientY);
    var selected_tile = pickResult.pickedMesh;

    scene_controller.selectItem(pickResult.pickedMesh);
  });
};
