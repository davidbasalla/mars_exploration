var Carrier = function(){
}

Carrier.model_scaling = function(){
  return new BABYLON.Vector3(0.0005, 0.0005, 0.0005);
}

Carrier.model_rotation = function(){
  return new BABYLON.Vector3(Math.PI/-2, Math.PI*2, Math.PI*2);
}

Carrier.price = function(){
  return 50;
}
