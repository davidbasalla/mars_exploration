var Biodome = function(){
}

Biodome.model_scaling = function(){
  return new BABYLON.Vector3(0.045, 0.03, 0.045);
}

Biodome.model_rotation = function(){
  return new BABYLON.Vector3(Math.PI*2, Math.PI*2, Math.PI*2);
}

Biodome.model_offset = function(){
  return new BABYLON.Vector3(1.8, 0, -2.15);
}

Biodome.price = function(){
  return 50;
}

Biodome.energy_use = function(){
  return 5;
}
