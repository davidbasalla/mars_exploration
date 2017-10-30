var MaterialFactory = function (scene) {
  this.scene = scene;
}

MaterialFactory.prototype.is_selected_material = function() {
  var mat = new BABYLON.StandardMaterial("texture_xxx", this.scene);
  mat.diffuseColor = new BABYLON.Color3(0, 1, 0.4);
  mat.alpha = 0.4;
  return mat;
}

MaterialFactory.prototype.wireframe_material = function() {
  var mat = new BABYLON.StandardMaterial("wireframe_texture", this.scene);
  mat.wireframe = true;
  mat.alpha = 0.15;
  return mat;
}

MaterialFactory.prototype.ground_material = function() {
  var mat = new BABYLON.StandardMaterial("texture1", this.scene);
  mat.specularColor = new BABYLON.Color3(0, 0, 0);
  mat.diffuseTexture = new BABYLON.Texture("assets/images/mars_square_4k_v01.jpg", this.scene);
  // mat.bumpTexture = new BABYLON.Texture("assets/images/mars_square_4k_BMP_v02.jpg", scene);
  return mat;
}
