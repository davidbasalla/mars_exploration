var Habitat = function(){
}

Habitat.model_scaling = function(){
  return new BABYLON.Vector3(0.015, 0.015, 0.015);
}

Habitat.model_rotation = function(){
  return new BABYLON.Vector3(Math.PI*2, Math.PI*2, Math.PI*2);
}

Habitat.model_offset = function(){
  return new BABYLON.Vector3(0, 0, 0);
}

Habitat.price = function(){
  return 100;
}

Habitat.energy_use = function(){
  return 5;
}
