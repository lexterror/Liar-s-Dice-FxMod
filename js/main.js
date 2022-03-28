//Game Class
var colors = ["ff0000", "ccff00","00ff66", "0066ff", "cc00ff"];
function Game(number_of_players){

  this.players=[];
  this.bid={quantity:null,face:null,player:null};
  this.turn=null;
  this.log=[];
  this.all_dice= function(){
    dice=[];
    this.players.forEach(function(player){
      player.dice.forEach(function(die){
        dice.push(die);
      });
    });
    return dice;
  };
  this.next_turn = function (){
    this.turn=this.players[this.players.indexOf(this.turn)+1] ?
    this.players[this.players.indexOf(this.turn)+1]:
    this.players[0];
    console.log('<span style="color:#' + colors[this.turn.id  - 1] + '">' +  'Player '+this.turn.id+"'s turn" + '</span>');
    game.log.push('<span style="color:#' + colors[this.turn.id  - 1] + '">' +  'Player '+this.turn.id+"'s turn" + '</span>');
    this.render();

  };
  this.auto = function(){
    while(this.turn.auto){
      this.turn.auto_bid();
    }
  };
  this.render = function (){
    dice = [null,'<img src="1.png" width="64" height="64">', '<img src="2.png" width="64" height="64">', '<img src="3.png" width="64" height="64">', '<img src="4.png" width="64" height="64">', '<img src="5.png" width="64" height="64">', '<img src="6.png" width="64" height="64">' ];
    $('#players').html("");
    $('#log').html('<h4><u>Game Log</u></h4>');

    if (game.turn){
      this.players.forEach(function(player){
        $('#players').append(
          '<div id="player'+player.id+'" class="player col-md-6 text-center"></div>');
          $('#player'+player.id).append('<div style="padding: 10px"><div class="" style="line-height: 32px; vertical-align: middle; display: inline-block; position: absolute;height: 32px;max-height: 32px !important;"><h4></h4><img src="player' + player.id + '.png" width="24" height="24" style="display:none"></div>');

          player.dice.forEach(function(die){
            $('#player'+player.id).append('<div class="" style="margin-left: 15px; vertical-align: middle; display: inline-block; line-height: 32px; height: 32px !important; max-height: 32px !important;background: #' + colors[player.id - 1]  +';padding: 10px; border-radius: 32px;"><img src="concealed.gif" width="36" height="32"></div>');
          });

      });
      $('#player'+game.turn.id).removeClass('col-md-3');
    $('#player'+game.turn.id).addClass('active  col-md-4');
    $('#player'+game.turn.id).html('<h3 style="margin-left: 10px; color:#' + colors[game.turn.id  - 1] + '">Player' + game.turn.id+'</h3>');
    $('#player'+game.turn.id).append('<div id="dice" class=form-group style="padding: 5px; border: none; "></div>');
    $('#player'+game.turn.id).append('<form><fieldset id="controls" class="form-group" style="padding: 12px; background: linear-gradient(135deg, gold, red); width: 100px; height: 250px;float: right; right: 0;top: 20px;"><legend>Your Bid</legend></fieldset></form>');
    //Show dice for current player
    game.turn.dice.forEach(function(die){
      $('#dice').append('<span class="die" style="margin-left: 7px;">'+dice[die]+'</span>');

    });
      //Add Controls and assign functions
    $('#controls').append('<p>Quantity: '+
      '<input type="number" class="form-control" style="font-family: pepsi !important;height: 32px;font-size: 32px;width: 70px;" min="1" max="'+game.all_dice().length+'" id="bid_quantity" step="1" value="'+
      game.bid.quantity+'" /></p>');
    $('#controls').append('<p>Face:<br>'+
      '<input type="number" style="font-family: pepsi !important;height:32px;font-size: 32px;width: 70px;"class="form-control" id="bid_face" min="1" max="6" step="1" value="'+
      game.bid.face+'" /></p>');
    $('#controls').append(
        '<button type="button" class="btn btn-default" id="raise_bid" style="width: 100px;">Raise Bid</button>');
    $('#controls').append(
        '<button type="button" class="btn btn-default" id="challenge" style="width: 100px;">Challenge</button>');
      }

    $("#raise_bid").click(function(){
        quantity=parseInt($('#bid_quantity').val());
        face=parseInt($('#bid_face').val());
        game.turn.raise_bid(quantity,face);
      });
    $("#challenge").click(function(){
        game.turn.challenge_bid();
      });
    //fill in log
    game.log.reverse().forEach(function(entry){
      $('#log').append('<p>'+entry+'</p>');
    });
  };
  this.roll_all=function(){
    this.players.forEach(function(player){
      player.roll();
    });
  };
  this.start=function(){
    for (i=0;i<number_of_players;i++){
      this.players.push(new Player(this,i+1));
    }
    this.roll_all();
    game.log.push('Game started with '+number_of_players+' players!');
    //set player 0 (id 1) to non-AI
    this.players[0].auto=false;
    //Assign turn to random player
    this.turn = this.players[Math.floor(Math.random() * this.players.length)];
    game.log.push('<span style="color:#' + colors[this.turn.id  - 1] + '">' +  'Player '+this.turn.id+"'s turn" + '</span>');
    // if player is AI, turn on game auto
    if (game.turn.auto) {game.auto();} else {game.render();}
  };
  this.new_round=function(){
    //remove inactive players
    game.players.forEach(function(player){
      if (player.number_of_dice===0){
        console.log('player '+player.id+' has lost all dice and is out!');
        game.log.push('player '+player.id+' has lost all dice and is out!');
        game.players.splice(game.players.indexOf(player), 1 );
      }
    });
    //check for victory
    if (game.players.length === 1){
      console.log('player '+game.players[0].id+' won!');
      game.log.push('player '+game.players[0].id+' won!');

      game.turn=null;
      game.render();
    } else {
    this.roll_all();
    //if current player is out, pass turn to next player
    if (game.turn && !game.players.includes(this.turn)) {game.next_turn();}
    this.bid={quantity:null,face:null,player:null};
  }
  if(game.turn){game.log.push('<span style="color:#' + colors[this.turn.id  - 1] + '">' +  'Player '+this.turn.id+"'s turn" + '</span>');this.render();}
};
}

//Player Class
function Player(game,id){
  this.id=id;
  this.game=game;
  this.auto=true;
  this.number_of_dice=5;
  this.dice=[];
  this.roll = function (){
    this.dice=[];
    for (i=0; i<this.number_of_dice; i++){
      this.dice.push(Math.floor(Math.random() * 6) + 1);
    }
  };

  this.raise_bid=function(quantity,face){

    if(((quantity>game.bid.quantity && face >= game.bid.face)||
    (face > game.bid.face))&&(quantity>0 && face>0)&&(face<=6)){
      console.log('player '+this.id+' raised the bid to: '+quantity+' of '+
      face);
      game.log.push('player '+this.id+' raised the bid to: '+quantity+' of '+
      face);
      this.game.bid={quantity:quantity,face:face,player:this};
      this.game.next_turn();
      if (game.turn.auto) {game.auto();}
    } else {console.log('Invalid Bid!');game.log.push('Invalid Bid!');game.render();}


  };

  this.challenge_bid=function(){
    if (this.game.bid.player) {
    console.log('player '+this.id+' challenged player '+
    this.game.bid.player.id+"'s bid!");
    game.log.push('player '+this.id+' challenged player '+
    this.game.bid.player.id+"'s bid!");
    dice_with_correct_face=game.all_dice()
    .filter(function(die){return die==game.bid.face || die==1;});
    console.log('There are '+dice_with_correct_face.length+' dice with face '+
    game.bid.face+' including wild 1s!:'+dice_with_correct_face);
    game.log.push('There are '+dice_with_correct_face.length+' dice with face '+
    game.bid.face+' including wild 1s!:'+dice_with_correct_face);
    if (dice_with_correct_face.length < game.bid.quantity ||
       !dice_with_correct_face.includes(game.bid.face)){
      this.game.bid.player.lose_die();
      console.log('player '+this.game.bid.player.id+' lost a die!');
      game.log.push('player '+this.game.bid.player.id+' lost a die!');
    } else{
      this.lose_die();
      console.log('player '+this.id+' lost a die!');
      game.log.push('player '+this.id+' lost a die!');
    }
    this.game.new_round();
    if (game.turn && game.turn.auto) {game.auto();}
  } else {console.log('no bid to challenge');game.log.push('no bid to challenge');}
  };
  this.auto_bid = function () {
    quantity = this.game.bid.quantity?  this.game.bid.quantity+1 : 1;
    face = this.game.bid.face ? this.game.bid.face +1 : 1;
    if (this.game.bid.player && Math.random()>0.8){this.challenge_bid();} else
    {this.raise_bid(quantity,Math.min(face,6));}

  };
  this.lose_die = function () {
    this.number_of_dice=this.number_of_dice-1;
  };
}

//Initiate
game=new Game(5);
game.start();
