var Quest = function(text, condition, reward){
  this.text = text;
  this.condition = condition;
  this.reward = reward;
}

Quest.prototype.is_complete = function(){
  if(this.condition() == true){
    return true;
  } else {
    return false;
  }
}

Quest.quest_list = function(scene_graph){
  // Quests are finished in reverse order and popped off the array
  quests = [
    new Quest("Collect 200 ⚡️",
              function(){
                if (scene_graph.energy_count >= 200){
                  return true;
                } else {
                  return false;
                }
              },
              "win_game"),
    new Quest("Collect 100 🍎",
              function(){
                if (scene_graph.food_count >= 100){
                  return true;
                } else {
                  return false;
                }
              },
              "increase_population"),
  ]
  return quests;
}
