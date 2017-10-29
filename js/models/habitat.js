var Habitat = function(){
}

Habitat.model_scaling = function(){
  return new BABYLON.Vector3(0.015, 0.015, 0.015);
}

Habitat.model_rotation = function(){
  return new BABYLON.Vector3(Math.PI*2, Math.PI*2, Math.PI*2);
}

Habitat.price = function(){
  return 50;
}

Habitat.energy_use = function(){
  return 5;
}
