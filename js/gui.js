var Gui = function(){
  this.advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

  this.build_button = null;
  this.energy_text_field = null;
}

Gui.prototype.setup_build_button = function(scene_controller){
  console.log("setup")
  var button1 = BABYLON.GUI.Button.CreateSimpleButton("but1", "Build Habitat (50)");
  button1.width = "220px"
  button1.height = "100px";
  button1.color = "white";
  button1.cornerRadius = 10;
  button1.background = "green";
  button1.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
  button1.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
  button1.paddingLeft = 20;
  button1.paddingBottom = 20;

  button1.onPointerUpObservable.add(function() {
    scene_controller.buildHabitat()
  });

  this.advancedTexture.addControl(button1);

  this.build_button = button1;
}

Gui.prototype.setup_energy_text = function(){
  var text1 = new BABYLON.GUI.TextBlock("testasdads");
  text1.text = "Energy: 50";
  text1.color = "white";
  text1.fontSize = 20;
  text1.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
  text1.textVerticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
  text1.paddingLeft = 20;
  text1.paddingTop = 20;

  this.advancedTexture.addControl(text1); 

  this.energy_text_field = text1;
}

Gui.prototype.flash_energy_warning = function(){
  this.energy_text_field.color = "red";

  var _this = this;
  setInterval(function(){
    _this.energy_text_field.color = "white";
    }, 300);
}
