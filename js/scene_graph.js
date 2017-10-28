var SceneGraph = function(scene, material_factory){
  this.scene = scene;
  this.material_factory = material_factory;

  this.tiles = [];
  this.ground = null;
  this.original_models = {};
  this.buildings = {
    "habitat": [],
    "solar_station": [],
  };

  this.selected_tile = null;

  this.energy_count = 50;

  this.loader = new BABYLON.AssetsManager(scene);
}

SceneGraph.prototype.load_initial_objects = function(){
  var _this = this;
  return new Promise(function(resolve, reject){
    _this.load_ground();
    _this.load_tiles();

    var load_promises = [];
    load_promises.push(_this.load_habitat_model());
    load_promises.push(_this.load_solar_panel_model());

    Promise.all(load_promises).then(resolve);
  })
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
  var _this = this;
  return new Promise(function(resolve, reject){
    var load_task = _this.loader.addMeshTask("habitat_v01", "", "assets/models/", "habitat_v01.obj");

    var _that = _this
    load_task.onSuccess = function(task) {
      var model = BABYLON.Mesh.MergeMeshes(task.loadedMeshes, true, true)
      model.scaling.x = 0.015
      model.scaling.y = 0.015
      model.scaling.z = 0.015

      // move out of screen
      model.position.x = 10000

      _that.original_models["habitat"] = model;

      resolve();
    }

    load_task.onError = function(task) {
      console.log("FAIL")
    }

    _this.loader.load()
  })
}

SceneGraph.prototype.create_habitat_instance = function(position){
  var newInstance = this.original_models["habitat"].createInstance("i1");
  newInstance.position = position;
  this.buildings["habitat"].push(newInstance);
  return newInstance;
}

SceneGraph.prototype.load_solar_panel_model = function(){
  var _this = this;
  return new Promise(function(resolve, reject){
    var load_task = _this.loader.addMeshTask("solar_station_v01", "", "assets/models/", "solar_station_v01.obj");

    var _that = _this
    load_task.onSuccess = function(task) {
      var model = BABYLON.Mesh.MergeMeshes(task.loadedMeshes, true, true)
      model.scaling.x = 0.005;
      model.scaling.y = 0.005;
      model.scaling.z = 0.005;

      // move out of screen
      model.position.x = 10000

      _that.original_models["solar_panel"] = model;

      resolve();
    }

    load_task.onError = function(task) {
      console.log("FAIL")
    }

    _this.loader.load()
  })
}

SceneGraph.prototype.create_solar_station_instance = function(position){
  var newInstance = this.original_models["solar_panel"].createInstance("i1");
  newInstance.position = position;
  this.buildings["solar_station"].push(newInstance);
  return newInstance;
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

SceneGraph.prototype.generate_energy = function(){
  for(var i = 0; i < this.buildings["solar_station"].length; i++){
    this.energy_count += 10;
  }
}
