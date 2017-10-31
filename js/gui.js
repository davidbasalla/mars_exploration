var Gui = function(scene_controller){
  this.scene_controller = scene_controller;

  this.advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

  this.end_turn_button = null;
  this.main_text_field = null;

  this.labels = [];

  this.resource_text_fields = {
    energy: null,
    food: null,
    population: null,
  };

  this.build_button_panel = null;
  this.build_buttons = {
    habitat: null,
    solar_station: null,
  };

  this.setup_ui();
}

Gui.prototype.setup_ui = function(){
  this.setup_main_text()
  this.setup_quest_tracker();
  this.setup_energy_text();
  this.setup_food_text();
  this.setup_population_text()
  this.setup_build_buttons();
  this.setup_end_turn_button();
}

Gui.prototype.setup_build_buttons = function(){
  var panel = new BABYLON.GUI.StackPanel();
  panel.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
  this.build_button_panel = panel;

  var buttons = [
    this.setup_build_button('habitat',
                            `Build Habitat (${Habitat.price()})`,
                            this.scene_controller.buildHabitat.bind(this.scene_controller)),
    this.setup_build_button('solar_station',
                            `Build Solar Station (${SolarStation.price()})`,
                            this.scene_controller.buildSolarStation.bind(this.scene_controller)),
    this.setup_build_button('biodome',
                            `Build Biodome (${Biodome.price()})`,
                            this.scene_controller.buildBiodome.bind(this.scene_controller)),
  ]

  for(var i = 0; i < buttons.length; i++) {
    panel.addControl(buttons[i]);
  }
}

Gui.prototype.setup_build_button = function(name, title, callback){
  var btn = BABYLON.GUI.Button.CreateSimpleButton(name, title);
  btn.width = "250px"
  btn.height = "80px";
  btn.color = ColorManager.white();
  btn.cornerRadius = 5;
  btn.background = ColorManager.green();
  btn.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
  btn.paddingBottom = 10;
  btn.paddingLeft = 10;
  btn.fontSize = 20;

  btn.onPointerUpObservable.add(function() {
    callback(btn)
  });

  this.build_buttons[name] = btn;
  return btn;
}

Gui.prototype.flash_build_button = function(btn){
  btn.background = ColorManager.red();

  setTimeout(function(){
    btn.background = ColorManager.green();
    }, 300);
}

Gui.prototype.setup_end_turn_button = function(){
  var btn = BABYLON.GUI.Button.CreateSimpleButton("but2", "Next Day");
  btn.width = "250px"
  btn.height = "80px";
  btn.color = ColorManager.white();
  btn.cornerRadius = 5;
  btn.background = ColorManager.green();
  btn.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
  btn.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
  btn.paddingRight = 10;
  btn.paddingBottom = 10;
  btn.fontSize = 20;

  var _this = this;
  btn.onPointerUpObservable.add(function() {
    _this.scene_controller.endTurn();
  });

  this.end_turn_button = btn;
}

Gui.prototype.setup_energy_text = function(){
  this.setup_resource_text('energy', '⚡', 20, 50)
}

Gui.prototype.setup_food_text = function(){
  this.setup_resource_text('food', '🍏', 60, 50)
}

Gui.prototype.setup_population_text = function(){
  this.setup_resource_text('population', '👥', 100, "0/5")
}

Gui.prototype.setup_resource_text = function(name, symbol, padding_top, initial_value){
  var txt = new BABYLON.GUI.TextBlock(`${name}_counter`);
  txt.text = `${symbol}: ${initial_value} ️`;
  txt.color = ColorManager.white();
  txt.fontSize = 20;
  txt.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
  txt.textVerticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
  txt.paddingLeft = 20;
  txt.paddingTop = padding_top;

  this.advancedTexture.addControl(txt);

  this.resource_text_fields[name] = txt;
}

Gui.prototype.set_energy_text = function(amount){
  this.resource_text_fields["energy"].text = `⚡: ${amount}`;
}

Gui.prototype.set_food_text = function(amount){
  this.resource_text_fields["food"].text = `🍏: ${amount}`;
}

Gui.prototype.set_current_population_text = function(amount, max_amount){
  this.resource_text_fields["population"].text = `👥: ${amount}/${max_amount}`;
}

Gui.prototype.setup_quest_tracker = function(){
  var txt = new BABYLON.GUI.TextBlock();
  // if (completed) ☑ else ☐
  txt.text = "";
  // txt.width = "250px";
  txt.height = "180px";
  txt.top = "-320px"
  // txt.marginLeft = "5px";
  txt.fontSize = 20;
  txt.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
  txt.textVerticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
  txt.color = ColorManager.white();
  txt.paddingTop = 20;
  txt.paddingRight = 50;

  this.quest_tracker = txt;
}

Gui.prototype.flash_energy_warning = function(){
  this.energy_text_field.color = ColorManager.red();

  var _this = this;
  setTimeout(function(){
    _this.energy_text_field.color = ColorManager.white();
    }, 300);
}

Gui.prototype.setup_main_text = function(){
  var txt = new BABYLON.GUI.TextBlock("main_text");
  txt.textVerticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
  txt.paddingTop = 100;
  txt.text = "The next day...";
  txt.color = ColorManager.white();
  txt.fontSize = 44;
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

Gui.prototype.show_game_over_text = function(explanation){
  this.main_text_field.text = `GAME OVER\n\n${explanation}\n\nReload to start again`
  this.main_text_field.alpha = 1;
}

Gui.prototype.show_win_text = function(){
  this.main_text_field.text = "MISSION COMPLETE\n\nYou have successfully built a base on Mars\n\nReload to start again"
  this.main_text_field.alpha = 1;
}

Gui.prototype.hide_all_buttons = function(){
  this.advancedTexture.removeControl(this.build_button_panel);
  this.advancedTexture.removeControl(this.end_turn_button);
 }

Gui.prototype.show_all_buttons = function(){
  this.advancedTexture.addControl(this.build_button_panel);
  this.advancedTexture.addControl(this.end_turn_button);
  this.advancedTexture.addControl(this.quest_tracker);
}

Gui.prototype.show_quest_tracker = function(){
  this.advancedTexture.addControl(this.quest_tracker);
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

  var txt = new BABYLON.GUI.TextBlock();
  txt.text = text;
  txt.color = color;
  txt.fontSize = 20;
  label.addControl(txt);

  this.labels.push(label)

  this.advancedTexture.removeControl(label)
}
