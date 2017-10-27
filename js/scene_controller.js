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

SceneController.prototype.buildHabitat = function(btn) {
  if (this.scene_graph.selected_tile == null) {
    console.log("NOTHING SELECTED");
    return;
  }

  if (this.scene_graph.energy_count < 50){
    this.gui.flash_energy_warning();
    this.gui.flash_build_button(btn);
    return;
  }

  this.scene_graph.energy_count -= 50;
  this.gui.energy_text_field.text = `Energy: ${this.scene_graph.energy_count}`;

  this.scene_graph.create_habitat_instance(this.scene_graph.selected_tile.position);
};

SceneController.prototype.buildSolarStation = function(btn) {
  if (this.scene_graph.selected_tile == null) {
    console.log("NOTHING SELECTED");
    return;
  }

  if (this.scene_graph.energy_count < 50){
    this.gui.flash_energy_warning();
    this.gui.flash_build_button(btn);
    return;
  }

  this.scene_graph.energy_count -= 50;
  this.gui.energy_text_field.text = `Energy: ${this.scene_graph.energy_count}`;

  this.createSolarStationInstance(this.scene_graph.selected_tile.position);
};

SceneController.prototype.createSolarStationInstance = function(position) {
  var mesh = this.scene_graph.create_solar_station_instance(position);
  this.gui.create_label(mesh);
}

SceneController.prototype.endTurn = function() {
  this.scene_graph.deselect_current_tile();
  this.gui.flash_turn_text();

  this.scene_graph.generate_energy();
  this.gui.energy_text_field.text = `Energy: ${this.scene_graph.energy_count}`;
};
