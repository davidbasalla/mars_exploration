var SceneGraph = function(scene, material_factory){
  this.scene = scene;
  this.material_factory = material_factory;

  this.tiles = [];
  this.ground = null;
  this.original_models = {};

  this.selected_tile = null;

  this.energy_count = 50;

  this.loader = new BABYLON.AssetsManager(scene);
}

SceneGraph.prototype.load_initial_objects = function(){
  this.load_ground();
  this.load_tiles();
  this.load_habitat_model();
  this.load_solar_panel_model();
}

SceneGraph.prototype.load_ground = function(){
  this.ground = BABYLON.Mesh.CreateGround("ground1", 30, 30, 2, this.scene);
  this.ground.position.y = -.01

  this.ground.material = this.material_factory.ground_material();
}

SceneGraph.prototype.load_tiles = function(){
  var wireframe_material = this.material_factory.wireframe_material()

  for(var x = -10; x < 10; x++) {
    for(var z = -10; z < 10; z++) {
      var tile = BABYLON.MeshBuilder.CreatePlane("tile", {width: 1, height: 1, sideOrientation: 0}, this.scene);
      tile.rotation.x = Math.PI/2;
      tile.position.x = x;
      tile.position.z = z;
      tile.material = wireframe_material;

      this.tiles.push(tile)
    }
  }
}

SceneGraph.prototype.load_habitat_model = function(){
  var load_task = this.loader.addMeshTask("habitat_v01", "", "assets/models/", "habitat_v01.obj");

  var _this = this
  load_task.onSuccess = function(task) {
    var model = BABYLON.Mesh.MergeMeshes(task.loadedMeshes, true, true)
    model.scaling.x = 0.015
    model.scaling.y = 0.015
    model.scaling.z = 0.015

    // move out of screen
    model.position.x = 10000

    _this.original_models["habitat"] = model;

    _this.create_habitat_instance(new BABYLON.Vector3(0, 0, 1))
  }

  load_task.onError = function(task) {
    console.log("FAIL")
  }

  this.loader.load()
}

SceneGraph.prototype.create_habitat_instance = function(position){
  var newInstance = this.original_models["habitat"].createInstance("i1");
  newInstance.position = position;
}

SceneGraph.prototype.load_solar_panel_model = function(){
  var load_task = this.loader.addMeshTask("solar_station_v01", "", "assets/models/", "solar_station_v01.obj");

  var _this = this
  load_task.onSuccess = function(task) {
    var model = BABYLON.Mesh.MergeMeshes(task.loadedMeshes, true, true)
    model.scaling.x = 0.005;
    model.scaling.y = 0.005;
    model.scaling.z = 0.005;

    // move out of screen
    model.position.x = 10000

    _this.original_models["solar_panel"] = model;

    _this.create_solar_panel_instance(new BABYLON.Vector3(0, 0, 0))
  }

  load_task.onError = function(task) {
    console.log("FAIL")
  }

  this.loader.load()
}

SceneGraph.prototype.create_solar_panel_instance = function(position){
  var newInstance = this.original_models["solar_panel"].createInstance("i1");
  newInstance.position = position;
}

SceneGraph.prototype.deselect_current_tile = function(){
  if (this.selected_tile == null) {
    return
  }

  this.selected_tile.material = this.material_factory.wireframe_material();
  this.selected_tile = null;
}

SceneGraph.prototype.select_tile = function(tile){
  if (!this.tiles.includes(tile)){
    return
  }

  tile.material = this.material_factory.is_selected_material();
  this.selected_tile = tile;
}

