var Biodome = function(){
}

Biodome.model_scaling = function(){
  return new BABYLON.Vector3(0.015, 0.015, 0.015);
}

Biodome.model_rotation = function(){
  return new BABYLON.Vector3(Math.PI*2, Math.PI*2, Math.PI*2);
}

Biodome.price = function(){
  return 50;
}

Biodome.energy_use = function(){
  return 5;
}
