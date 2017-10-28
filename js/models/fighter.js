var Fighter = function(){
}

Fighter.model_scaling = function(){
  return new BABYLON.Vector3(0.0005, 0.0005, 0.0005);
}

Fighter.model_rotation = function(){
  return new BABYLON.Vector3(Math.PI/-2, Math.PI*2, Math.PI*2);
}

Fighter.price = function(){
  return 50;
}
