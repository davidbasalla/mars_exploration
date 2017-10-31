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
  this.gui.set_energy_text(this.scene_graph.energy_count)

  this.createHabitatInstance(this.scene_graph.selected_tile.position);
};

SceneController.prototype.buildBiodome = function(btn) {
  if (this.scene_graph.selected_tile == null) {
    console.log("NOTHING SELECTED");
    return;
  }

  if (this.scene_graph.energy_count < Biodome.price()){
    this.gui.flash_energy_warning();
    this.gui.flash_build_button(btn);
    return;
  }

  this.scene_graph.energy_count -= Biodome.price();
  this.gui.set_energy_text(this.scene_graph.energy_count)

  this.createBiodomeInstance(this.scene_graph.selected_tile.position);
};

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
  this.gui.set_energy_text(this.scene_graph.energy_count)

  this.createSolarStationInstance(this.scene_graph.selected_tile.position);
};

SceneController.prototype.createHabitatInstance = function(position) {
  var mesh = this.scene_graph.create_model_instance("habitat", position, Habitat);
  this.gui.create_label(mesh, `-${Habitat.energy_use()}⚡`, ColorManager.red());
}

SceneController.prototype.createBiodomeInstance = function(position) {
  var mesh = this.scene_graph.create_model_instance("biodome", position, Biodome);
  this.gui.create_label(mesh, `-${Biodome.energy_use()}⚡`, ColorManager.red());
}

SceneController.prototype.createSolarStationInstance = function(position) {
  var mesh = this.scene_graph.create_model_instance("solar_station", position, SolarStation);
  this.gui.create_label(mesh, `+${SolarStation.energy_gain()}⚡️`, ColorManager.green());
}

SceneController.prototype.startGame = function() {
  this.scene_graph.carrier_drop();

  var _this = this;
  setTimeout(function(){
    _this.increase_population();
    _this.gui.show_all_buttons();
    _this.gui.flash_main_text("Mission Start");
    _this.gui.show_quest_tracker();
  }, 4500);
}

SceneController.prototype.increase_population = function() {
  this.scene_graph.population_count += 1;
  this.gui.set_current_population_text(this.scene_graph.population_count, this.scene_graph.max_population_count());
}

SceneController.prototype.endTurn = function() {
  this.scene_graph.deplete_energy();
  this.scene_graph.deplete_food();

  this.scene_graph.generate_energy();

  this.gui.set_energy_text(this.scene_graph.energy_count)
  this.gui.set_food_text(this.scene_graph.food_count)

  this.processQuestProgress();

  if (this.scene_graph.energy_count < 0){
    this.gui.show_game_over_text("Insufficient energy (⚡) for life support");
    this.gui.hide_all_buttons();
  }
  else if (this.scene_graph.food_count < 0){
    this.gui.show_game_over_text("Insufficient food (🍏) for life support");
    this.gui.hide_all_buttons();
  } else {
    this.scene_graph.deselect_current_tile();

    this.scene_graph.dim_lights();
    this.gui.hide_all_buttons();
    this.gui.show_all_labels();

    var _this = this;
    setTimeout(function(){
      _this.gui.show_all_buttons();
      _this.gui.hide_all_labels();
    }, 1200);
  }
};

SceneController.prototype.processQuestProgress = function() {
  if(this.scene_graph.current_quest_is_complete() ==  true){

    this.gui.quest_tracker.text = `☑ ${this.scene_graph.current_quest().text}`;
    this.gui.quest_tracker.color = ColorManager.green();

    // CASE STATEMENT FOR DIFFERENT REWARDS
    if(this.scene_graph.current_quest().reward == "increase_population") {
      this.gui.quest_tracker.text += "\n\n Reward: +1 👥"

      this.scene_graph.carrier_drop();

      var _this = this;
      setTimeout(function(){
        _this.increase_population();
      }, 4500);
    } else if(this.scene_graph.current_quest().reward == "win_game") {
      this.gui.show_win_text();
      this.gui.hide_all_buttons();
    }

    // ADVANCE TO NEXT QUEST
    this.scene_graph.quests.pop()

    // WAIT FOR USER TO READ BEFORE SETTING NEW QUEST
    var _this = this;
    setTimeout(function(){
      _this.setNextQuest();
    }, 5000);
  }
}

SceneController.prototype.setNextQuest = function() {
  this.gui.quest_tracker.color = ColorManager.white()
  this.gui.quest_tracker.text = `☐ ${this.scene_graph.current_quest().text}`;
}

