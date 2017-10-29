var SolarStation = function(){
}

SolarStation.model_scaling = function(){
  return new BABYLON.Vector3(0.005, 0.005, 0.005);
}

SolarStation.model_rotation = function(){
  return new BABYLON.Vector3(Math.PI*2, Math.PI*2, Math.PI*2);
}

SolarStation.price = function(){
  return 25;
}

SolarStation.energy_gain = function(){
  return 10;
}
