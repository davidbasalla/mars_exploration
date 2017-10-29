var SceneGraph = function(scene, material_factory){
  this.scene = scene;
  this.material_factory = material_factory;

  this.tiles = [];
  this.ground = null;
  this.original_models = {};
  this.buildings = {
    "habitat": [],
    "solar_station": [],
    "fighter": [],
  };

  this.selected_tile = null;

  this.TILE_NUMBER_X = 10;
  this.TILE_NUMBER_Z = 10;

  this.energy_count = 50;

  this.loader = new BABYLON.AssetsManager(scene);
}

SceneGraph.prototype.load_initial_objects = function(){
  var _this = this;
  return new Promise(function(resolve, reject){
    _this.load_ground();
    _this.load_tiles();

    var load_promises = [];
    load_promises.push(_this.load_model("habitat", "habitat_v01.obj", Habitat));
    load_promises.push(_this.load_model("solar_station", "solar_station_v01.obj", SolarStation));
    load_promises.push(_this.load_model("fighter", "Trident-A10.obj", Fighter));

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

  for(var x = -this.TILE_NUMBER_X; x < this.TILE_NUMBER_X; x++) {
    for(var z = -this.TILE_NUMBER_Z; z < this.TILE_NUMBER_Z; z++) {
      var tile = BABYLON.MeshBuilder.CreatePlane("tile", {width: 1, height: 1, sideOrientation: 0}, this.scene);
      tile.rotation.x = Math.PI/2;
      tile.position.x = x;
      tile.position.z = z;
      tile.material = wireframe_material;

      this.tiles.push(tile)
    }
  }
}

SceneGraph.prototype.load_model = function(name, file_path, model_class){
  var _this = this;
  return new Promise(function(resolve, reject){
    var load_task = _this.loader.addMeshTask(name, "", "assets/models/", file_path);

    var _that = _this
    load_task.onSuccess = function(task) {
      var model = BABYLON.Mesh.MergeMeshes(task.loadedMeshes, true, true)
      model.scaling = model_class.model_scaling()

      // move out of screen
      model.rotation = model_class.model_rotation()
      model.position.x = 10000

      _that.original_models[name] = model;

      resolve();
    }

    load_task.onError = function(task) {
      console.log("FAIL")
    }

    _this.loader.load()
  })
}

SceneGraph.prototype.create_model_instance = function(model_name, position){
  var newInstance = this.original_models[model_name].createInstance("i1");
  newInstance.position = position;
  this.buildings[model_name].push(newInstance);
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

SceneGraph.prototype.deplete_energy = function(){
  for(var i = 0; i < this.buildings["habitat"].length; i++){
    this.energy_count -= Habitat.energy_use();
  }
}

SceneGraph.prototype.generate_energy = function(){
  for(var i = 0; i < this.buildings["solar_station"].length; i++){
    this.energy_count += SolarStation.energy_gain();
  }
}
