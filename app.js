requirejs.config({
    //By default load any module IDs from js/lib
    baseUrl: 'js/',
    //except, if the module ID starts with "app",
    //load it from the js/app directory. paths
    //config is relative to the baseUrl, and
    //never includes a ".js" extension since
    //the paths config could be for a directory.
    paths: {
        app: '../app'
    }
});

requirejs(["scene_loader",
           "scene_controller",
           "material_factory",
           "color_manager",
           "scene_graph",
           "gui",
           "models/habitat",
           "models/solar_station",
           "models/biodome",
           "models/carrier",
           "models/quest"],
           function(scene_loader, scene_controller, material_factory, color_manager, scene_graph, gui, habitat, solar_station, biodome, carrier, quest) {
  //This function is called when scripts/helper/util.js is loaded.
  //If util.js calls define(), then this function is not fired until
  //util's dependencies have loaded, and the util argument will hold
  //the module value for "helper/util".

  console.log('Program starts...');

  var loader = new SceneLoader;
  loader.call();
});
