var SceneController = function (material_factory, scene_graph) {
  this.material_factory = material_factory;
  this.scene_graph = scene_graph;

  this.gui = null;
}

SceneController.prototype.setGui = function(gui) {
  this.gui = gui;
};

SceneController.prototype.selectItem = function(selected_tile) {
  if (selected_tile == this.scene_graph.ground) {
    return;
  }

  this.scene_graph.deselect_current_tile();
  this.scene_graph.select_tile(selected_tile);
};

SceneController.prototype.buildHabitat = function() {
  if (this.scene_graph.selected_tile == null) {
    console.log("NOTHING SELECTED");
    return;
  }

  if (this.scene_graph.energy_count < 50){
    this.gui.flash_energy_warning();
    this.gui.flash_build_button();
    return;
  }

  this.scene_graph.energy_count -= 50;
  this.gui.energy_text_field.text = `Energy: ${this.scene_graph.energy_count}`;

  this.scene_graph.create_habitat_instance(this.scene_graph.selected_tile.position);
};

SceneController.prototype.endTurn = function() {
  this.gui.flash_turn_text();

  this.scene_graph.energy_count += 10;
  this.gui.energy_text_field.text = `Energy: ${this.scene_graph.energy_count}`;
};
