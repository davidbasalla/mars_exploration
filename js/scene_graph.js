var SceneGraph = function(scene, material_factory){
  this.scene = scene;
  this.material_factory = material_factory;

  this.tiles = [];
  this.ground = null;
  this.original_models = {};
}

SceneGraph.prototype.load_initial_objects = function(){
  this.load_ground();
  this.load_tiles();
  this.load_habitat_model();
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

// Should use Promises here?
SceneGraph.prototype.load_habitat_model = function(){
  var loader = new BABYLON.AssetsManager(this.scene);
  var load_task = loader.addMeshTask("habitat_v01", "", "assets/models/", "habitat_v01.obj");

  var habitat = null;
  load_task.onSuccess = function(task) {
    habitat = task.loadedMeshes[0];
    habitat.scaling.x = 0.015
    habitat.scaling.y = 0.015
    habitat.scaling.z = 0.015

    this.original_models["habitat"] = habitat;
  }

  load_task.onError = function(task) {
    console.log("FAIL")
  }

  loader.load()
}

SceneGraph.prototype.habitat_model = function(){
  return this.original_models["habitat"];
}
