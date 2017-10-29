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

  if (this.scene_graph.energy_count < Habitat.price()){
    this.gui.flash_energy_warning();
    this.gui.flash_build_button(btn);
    return;
  }

  this.scene_graph.energy_count -= Habitat.price();
  this.gui.energy_text_field.text = `Energy: ${this.scene_graph.energy_count}`;

  this.createHabitatInstance(this.scene_graph.selected_tile.position);
};

SceneController.prototype.createHabitatInstance = function(position) {
  var mesh = this.scene_graph.create_model_instance("habitat", position);
  this.gui.create_label(mesh, `-${Habitat.energy_use()}`, "red");
}

SceneController.prototype.createFighterInstance = function(position) {
  return this.scene_graph.create_model_instance("fighter", position);
}

SceneController.prototype.buildSolarStation = function(btn) {
  if (this.scene_graph.selected_tile == null) {
    console.log("NOTHING SELECTED");
    return;
  }

  if (this.scene_graph.energy_count < SolarStation.price()){
    this.gui.flash_energy_warning();
    this.gui.flash_build_button(btn);
    return;
  }

  this.scene_graph.energy_count -= SolarStation.price();
  this.gui.energy_text_field.text = `Energy: ${this.scene_graph.energy_count}`;

  this.createSolarStationInstance(this.scene_graph.selected_tile.position);
};

SceneController.prototype.createSolarStationInstance = function(position) {
  var mesh = this.scene_graph.create_model_instance("solar_station", position);
  this.gui.create_label(mesh, `+${SolarStation.energy_gain()}`, "green");
}

SceneController.prototype.endTurn = function() {
  this.scene_graph.generate_energy();
  this.scene_graph.deplete_energy();
  this.gui.energy_text_field.text = `Energy: ${this.scene_graph.energy_count}`;

  if (this.scene_graph.energy_count < 0){
    this.gui.show_game_over_text();
    this.gui.hide_all_buttons();
  }
  else {
    this.scene_graph.deselect_current_tile();

    this.scene_graph.dim_lights();
    this.gui.hide_all_buttons();
    this.gui.show_all_labels();

    var _this = this;
    setTimeout(function(){
      _this.gui.flash_turn_text();
      _this.gui.show_all_buttons();
      _this.gui.hide_all_labels();
    }, 1200);
  }
};
