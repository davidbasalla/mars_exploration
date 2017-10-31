var SceneGraph = function(scene, material_factory){
  this.scene = scene;
  this.material_factory = material_factory;

  this.lights = {
    ambient_light: null,
    directional_light: null,
  };
  this.tiles = [];
  this.ground = null;
  this.original_models = {};
  this.buildings = {
    "habitat": [],
    "solar_station": [],
    "biodome": [],
  };

  this.selected_tile = null;

  this.TILE_NUMBER_X = 10;
  this.TILE_NUMBER_Z = 10;

  this.energy_count = 50;
  this.food_count = 50;
  this.population_count = 0;

  this.loader = new BABYLON.AssetsManager(scene);

  this.quests = Quest.quest_list(this);
}

SceneGraph.prototype.load_initial_objects = function(){
  var _this = this;
  return new Promise(function(resolve, reject){
    _this.load_lights();
    _this.load_ground();
    _this.load_tiles();

    var load_promises = [];
    load_promises.push(_this.load_model("habitat", "habitat_v01.obj", Habitat));
    load_promises.push(_this.load_model("solar_station", "solar_station_v01.obj", SolarStation));
    load_promises.push(_this.load_model("biodome", "biodome_v01.obj", Biodome));
    load_promises.push(_this.load_single_model("carrier", "Trident-A10.obj", Carrier));

    Promise.all(load_promises).then(resolve);
  })
}

SceneGraph.prototype.load_lights = function(){
  var ambient_light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), this.scene);
  ambient_light.intensity = 0.6;

  var dir_light = new BABYLON.DirectionalLight("light2", new BABYLON.Vector3(1, -1, 1), this.scene);
  dir_light.intensity = 0.6;

  this.lights = {
    ambient_light: ambient_light,
    directional_light: dir_light,
  };
};

SceneGraph.prototype.dim_lights = function(){
  var animationBox = new BABYLON.Animation("myAnimation",
                                           "intensity",
                                           30,
                                           BABYLON.Animation.ANIMATIONTYPE_FLOAT,
                                           BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
  var easingFunction = new BABYLON.SineEase();
  animationBox.setEasingFunction(easingFunction);

  var keys = [
    { frame: 0, value: 0.6 },
    { frame: 15, value: 0.0 },
    { frame: 20, value: 0.0 },
    { frame: 35, value: 0.6 },
  ]

  animationBox.setKeys(keys);

  this.lights["ambient_light"].animations = [];
  this.lights["ambient_light"].animations.push(animationBox);

  this.lights["directional_light"].animations = [];
  this.lights["directional_light"].animations.push(animationBox);


  this.scene.beginAnimation(this.lights["ambient_light"], 0, 100, true);
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
      var model = BABYLON.Mesh.MergeMeshes(task.loadedMeshes, true, true);
      model.scaling = model_class.model_scaling();

      // move out of screen
      model.rotation = model_class.model_rotation();
      model.position.x = 10000;

      _that.original_models[name] = model;

      resolve();
    }

    load_task.onError = function(task) {
      console.log("FAIL")
    }

    _this.loader.load()
  })
}

SceneGraph.prototype.load_single_model = function(name, file_path, model_class){
  var _this = this;
  return new Promise(function(resolve, reject){
    var load_task = _this.loader.addMeshTask(name, "", "assets/models/", file_path);

    var _that = _this
    load_task.onSuccess = function(task) {
      var model = BABYLON.Mesh.MergeMeshes(task.loadedMeshes, true, true)
      model.scaling = model_class.model_scaling()
      model.rotation = model_class.model_rotation()

      //offset
      model.position.x = -0.25;
      model.position.z = -0.25;
      model.position.y = 5;

      _that.original_models[name] = model;

      resolve();
    }

    load_task.onError = function(task) {
      console.log("FAIL")
    }

    _this.loader.load()
  })
}

SceneGraph.prototype.create_model_instance = function(model_name, position, model_class){
  var newInstance = this.original_models[model_name].createInstance("i1");
  newInstance.position = position;
  newInstance.position = newInstance.position.add(model_class.model_offset());
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

SceneGraph.prototype.deplete_food = function(){
  this.food_count -= this.population_count * 5;
}

SceneGraph.prototype.generate_energy = function(){
  for(var i = 0; i < this.buildings["solar_station"].length; i++){
    this.energy_count += SolarStation.energy_gain();
  }
}

SceneGraph.prototype.carrier_drop = function(){
  var position_anim = new BABYLON.Animation("carrierDropAnimation",
                                           "position.y",
                                           30,
                                           BABYLON.Animation.ANIMATIONTYPE_FLOAT,
                                           BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);

  var rotation_anim = new BABYLON.Animation("carrierDropAnimation",
                                           "rotation.z",
                                           30,
                                           BABYLON.Animation.ANIMATIONTYPE_FLOAT,
                                           BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);

  var easingFunction = new BABYLON.QuadraticEase();
  easingFunction.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEINOUT);
  position_anim.setEasingFunction(easingFunction);
  rotation_anim.setEasingFunction(easingFunction);

  var pos_keys = [{ frame: 0, value: 6 },
                  { frame: 100, value: 0.5 },
                  { frame: 150, value: 0.5 },
                  { frame: 250, value: 6 }]
  position_anim.setKeys(pos_keys);

  var rot_keys = [{ frame: 0, value: 1 },
                  { frame: 100, value: 0 },
                  { frame: 150, value: 0 },
                  { frame: 250, value: -1 }]
  rotation_anim.setKeys(rot_keys);

  this.original_models["carrier"].animations.push(position_anim);
  this.original_models["carrier"].animations.push(rotation_anim);

  this.scene.beginAnimation(this.original_models["carrier"], 0, 250, true);
}

SceneGraph.prototype.current_quest = function(){
  return this.quests[this.quests.length - 1];
}

SceneGraph.prototype.current_quest_is_complete = function(){
  if(this.current_quest().is_complete() == true){
    return true;
  } else {
    return false;
  }
}

SceneGraph.prototype.max_population_count = function(){
  return this.buildings["habitat"].length * 5;
}
