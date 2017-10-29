var Gui = function(scene_controller){
  this.scene_controller = scene_controller;

  this.advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

  this.build_habitat_button = null;
  this.build_solar_panel_button = null;
  this.end_turn_button = null;
  this.energy_text_field = null;
  this.population_text_field = null;
  this.main_text_field = null;
  this.labels = [];
}

Gui.prototype.setup_build_habitat_button = function(){
  var btn = BABYLON.GUI.Button.CreateSimpleButton("but1", `Build Habitat (${Habitat.price()})`);
  btn.width = "220px"
  btn.height = "100px";
  btn.color = "white";
  btn.cornerRadius = 10;
  btn.background = "green";
  btn.left = -120;
  btn.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
  btn.paddingBottom = 20;

  var _this = this;
  btn.onPointerUpObservable.add(function() {
    _this.scene_controller.buildHabitat(btn)
  });

  this.build_habitat_button = btn;
}

Gui.prototype.flash_build_button = function(btn){
  btn.background = "red";

  setTimeout(function(){
    btn.background = "green";
    }, 300);
}

Gui.prototype.setup_build_solar_station_button = function(){
  var btn = BABYLON.GUI.Button.CreateSimpleButton("ss1", `Build Solar Station (${SolarStation.price()})`);
  btn.width = "220px"
  btn.height = "100px";
  btn.color = "white";
  btn.cornerRadius = 10;
  btn.background = "green";
  btn.left = 120;
  btn.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
  btn.paddingBottom = 20;

  var _this = this;
  btn.onPointerUpObservable.add(function() {
    _this.scene_controller.buildSolarStation(btn)
  });

  this.build_solar_station_button = btn;
}


Gui.prototype.setup_end_turn_button = function(){
  var btn = BABYLON.GUI.Button.CreateSimpleButton("but2", "Next Day");
  btn.width = "220px"
  btn.height = "100px";
  btn.color = "white";
  btn.cornerRadius = 10;
  btn.background = "green";
  btn.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
  btn.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
  btn.paddingRight = 20;
  btn.paddingBottom = 20;

  var _this = this;
  btn.onPointerUpObservable.add(function() {
    _this.scene_controller.endTurn();
  });

  this.end_turn_button = btn;
}

Gui.prototype.setup_population_text = function(){
  var txt = new BABYLON.GUI.TextBlock("energy_counter");
  txt.text = "Population: 0/5";
  txt.color = "white";
  txt.fontSize = 22;
  txt.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
  txt.textVerticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
  txt.paddingLeft = 20;
  txt.paddingTop = 50;

  this.advancedTexture.addControl(txt);

  this.population_text_field = txt;
}

Gui.prototype.setup_energy_text = function(){
  var txt = new BABYLON.GUI.TextBlock("energy_counter");
  txt.text = "Energy: 50";
  txt.color = "white";
  txt.fontSize = 22;
  txt.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
  txt.textVerticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
  txt.paddingLeft = 20;
  txt.paddingTop = 20;

  this.advancedTexture.addControl(txt);

  this.energy_text_field = txt;
}

Gui.prototype.flash_energy_warning = function(){
  this.energy_text_field.color = "red";

  var _this = this;
  setTimeout(function(){
    _this.energy_text_field.color = "white";
    }, 300);
}

Gui.prototype.setup_turn_text = function(){
  var txt = new BABYLON.GUI.TextBlock("turn_text");
  txt.textVerticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
  txt.paddingTop = 100;
  txt.text = "The next day...";
  txt.color = "white";
  txt.fontSize = 60;
  txt.alpha = 0;

  this.advancedTexture.addControl(txt);

  this.main_text_field = txt;
}

Gui.prototype.flash_main_text = function(text){
  this.main_text_field.alpha = 1;
  this.main_text_field.text = text;

  var _this = this;
  setTimeout(function(){
    _this.main_text_field.alpha = 0;
  }, 1000);
}

Gui.prototype.show_game_over_text = function(){
  this.main_text_field.text = "GAME OVER\n\n(Insufficient energy for life support)"
  this.main_text_field.alpha = 1;
}

Gui.prototype.hide_all_buttons = function(){
  this.advancedTexture.removeControl(this.build_habitat_button);
  this.advancedTexture.removeControl(this.build_solar_station_button);
  this.advancedTexture.removeControl(this.end_turn_button);
}

Gui.prototype.show_all_buttons = function(){
  this.advancedTexture.addControl(this.build_habitat_button);
  this.advancedTexture.addControl(this.build_solar_station_button);
  this.advancedTexture.addControl(this.end_turn_button);
}

Gui.prototype.show_all_labels = function(){
  for(var i = 0; i < this.labels.length; i++) {
    this.advancedTexture.addControl(this.labels[i]);
  }
}

Gui.prototype.hide_all_labels = function(){
  for(var i = 0; i < this.labels.length; i++) {
    this.advancedTexture.removeControl(this.labels[i]);
  }
}

Gui.prototype.create_label = function(mesh, text, color){
  var label = new BABYLON.GUI.Rectangle("label for " + mesh.name);
  label.height = "30px";
  label.width = "100px";
  label.linkOffsetY = -30;
  label.thickness = 0;
  this.advancedTexture.addControl(label)
  label.linkWithMesh(mesh);

  var text1 = new BABYLON.GUI.TextBlock();
  text1.text = text;
  text1.color = color;
  label.addControl(text1);

  this.labels.push(label)

  this.advancedTexture.removeControl(label)
}
