var SceneController = function (material_factory, scene_graph) {
  this.material_factory = material_factory;
  this.scene_graph = scene_graph;
}

SceneController.prototype.selectItem = function(selected_mesh) {
  if (selected_mesh == this.scene_graph.ground) {
    return;
  }

  selected_mesh.material = this.material_factory.is_selected_material();
  this.selected_tile_state = selected_mesh;
};

SceneController.prototype.buildHabitat = function() {
  if (this.selected_tile_state == null) {
    console.log("NOTHING SELECTED");
  }

  var newInstance = this.scene_graph.habitat_model().createInstance("i1");
  newInstance.position =  this.selected_tile_state.position;
};
