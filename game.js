var gamePattern = [];
var userClickedPattern = [];
var buttonColors = ["red", "blue", "green", "yellow"];
var userChosenColor = "";
var level = 0;
var buttonSequence = 0;
var isStarted = false;

// Returns a Promise that resolves after "ms" Milliseconds
const timer = ms => new Promise(res => setTimeout(res, ms))

$(document).keydown(function() {
  if (!isStarted) {
    nextSequence();
    $("#level-title").text("Level "+level);
  }
  isStarted = true;
});

function nextSequence() {
  var randomNumber = Math.floor(Math.random()*4); //rng 0-3
  var randomChosenColor = buttonColors[randomNumber];
  gamePattern.push(randomChosenColor);
  playSequence();

  level++;
  $("#level-title").text("Level "+level);
  userClickedPattern = [];
  buttonSequence = 0;

  console.log("next sequence : "+gamePattern);
}

async function playSequence() { // We need to wrap the loop into an async function for this to work
  for (let i=0; i<gamePattern.length; i++) {
    console.log("sequence: "+gamePattern[i]);
    triggerButton(gamePattern[i]);
    buttonSound(gamePattern[i]);
    await timer(1000); // then the created Promise can be awaited
  }
}

$(".btn").on("click", function(e) {
  userChosenColor = e.target.id
  pressButton(userChosenColor);
  buttonSound(userChosenColor);
  userClickedPattern.push(userChosenColor);
  console.log("user clicked patter : "+userClickedPattern);
  checkAnswer(level);
  buttonSequence++;
});

function triggerButton(id) {
  $("#"+id).fadeOut(100).fadeIn(100);

}

function buttonSound(id) {
  var audio = new Audio("sounds/"+id+".mp3");
  audio.play();
}

function pressButton(id) {
  $("#"+id).addClass("pressed");
  setTimeout(function () {
    $("#"+id).removeClass("pressed");
  }, 100);
}

function checkAnswer(currentLevel) {
  console.log(userClickedPattern[buttonSequence]+" != "+gamePattern[buttonSequence]);
  console.log(buttonSequence+" == "+(currentLevel-1));
  if (userClickedPattern[buttonSequence] != gamePattern[buttonSequence]) {
    console.log("wrong");
    console.log(userClickedPattern[buttonSequence]+" != "+gamePattern[buttonSequence]);
    gameOver();
  } else if (buttonSequence == (currentLevel-1)) {
    console.log("correct")
    console.log(buttonSequence+" == "+(currentLevel-1));
    setTimeout(() => {nextSequence();}, 1000);
  }
}

function gameOver(){
  console.log("gameover");
  // play game over sound
  var audio = new Audio("sounds/wrong.mp3");
  audio.play();
  // add gameover class to body
  $("body").addClass("game-over");
  setTimeout(function () {
    $("body").removeClass("game-over");
  }, 100);
  restartGame();

}

function restartGame(){
  console.log("restart");
  $("#level-title").text("Press Any Key to Start!");
  level = 0;
  gamePattern = [];
  isStarted = false;

}
