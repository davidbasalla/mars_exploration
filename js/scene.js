// Get the canvas element from our HTML below
var canvas = document.querySelector("#renderCanvas");
// Load the BABYLON 3D engine
var engine = new BABYLON.Engine(canvas, true);

var createScene = function () {

    // This creates a Babylon Scene object (not a shape/mesh)
    var scene = new BABYLON.Scene(engine);
    
    // This creates and positions an free camera
    var camera = new BABYLON.FreeCamera("camera1", 
        new BABYLON.Vector3(0, 5, -10), scene);

    // This targets the camera to scene origin
    camera.setTarget(new BABYLON.Vector3.Zero());

    // This attaches the camera to the canvas
    camera.attachControl(canvas, false);
    
    // This creates a light - aimed 0,1,0 - to the sky.
    var light = new BABYLON.HemisphericLight("light1", 
        new BABYLON.Vector3(0, 1, 0), scene);
    
    // Dim the light a small amount
    light.intensity = .5;
    
    // Our built-in 'sphere' shape. Params: name, subdivisions, size, scene
    var sphere = BABYLON.Mesh.CreateSphere("sphere1", 16, 2, scene);
    
    // Move the sphere upward 1/2 its height
    sphere.position.y = 1;
    
    // Our built-in 'ground' shape.  Params: name, width, depth, subdivs, scene
    var ground = BABYLON.Mesh.CreateGround("ground1", 6, 6, 2, scene);
    
    // Leave this function
    return scene;
};

var scene = createScene();
// Register a render loop to repeatedly render the scene
engine.runRenderLoop(function () {
  scene.render();
});
// Watch for browser/canvas resize events
window.addEventListener("resize", function () {
  engine.resize();
});
