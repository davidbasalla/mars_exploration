var Gui = function(scene_controller){
  this.scene_controller = scene_controller;

  this.advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

  this.build_button = null;
  this.end_turn_button = null;
  this.energy_text_field = null;
  this.turn_text_field = null;
}

Gui.prototype.setup_build_button = function(){
  var btn = BABYLON.GUI.Button.CreateSimpleButton("but1", "Build Habitat (50)");
  btn.width = "220px"
  btn.height = "100px";
  btn.color = "white";
  btn.cornerRadius = 10;
  btn.background = "green";
  btn.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
  btn.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
  btn.paddingLeft = 20;
  btn.paddingBottom = 20;

  var _this = this;
  btn.onPointerUpObservable.add(function() {
    _this.scene_controller.buildHabitat()
  });

  this.advancedTexture.addControl(btn);

  this.build_button = btn;
}

Gui.prototype.flash_build_button = function(){
  this.build_button.background = "red";

  var _this = this;
  setTimeout(function(){
    _this.build_button.background = "green";
    }, 300);
}

Gui.prototype.setup_end_turn_button = function(){
  var btn = BABYLON.GUI.Button.CreateSimpleButton("but2", "End Turn");
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

  this.advancedTexture.addControl(btn);

  this.end_turn_button = btn;
}

Gui.prototype.setup_energy_text = function(){
  var txt = new BABYLON.GUI.TextBlock("energy_counter");
  txt.text = "Energy: 50";
  txt.color = "white";
  txt.fontSize = 20;
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
  txt.text = "New Turn";
  txt.color = "white";
  txt.fontSize = 80;
  txt.alpha = 0;

  this.advancedTexture.addControl(txt); 

  this.turn_text_field = txt;
}

Gui.prototype.flash_turn_text = function(){
  this.turn_text_field.alpha = 1;
  this.advancedTexture.removeControl(this.build_button); 
  this.advancedTexture.removeControl(this.end_turn_button); 

  var _this = this;
  setTimeout(function(){
    _this.turn_text_field.alpha = 0;
    _this.advancedTexture.addControl(_this.build_button); 
    _this.advancedTexture.addControl(_this.end_turn_button); 

    }, 1000);
}
