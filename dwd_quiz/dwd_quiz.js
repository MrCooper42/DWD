var $scope = {};
var data;
var correctQuest = 0;
var total;
var selected;
var currQuest = 0;

( function( ) {
  $( '#modal1' ).modal( );
  $( '#modal2' ).modal( );
  $( '#modal1' ).modal( "open" );
  var getData = new Promise( function( resolve, reject ) {
    $.getJSON( "data.json", function( result ) {
      data = result[0].questions;
      total = data.length;
      data = shuffleArr( data );
      resolve( data );
    });
  });
  getData.then( function( data ) {
    nextQuestion( currQuest );
  });
  $( '.submitAnswer' ).click( submitAnswer );
  $( "#userForm" )[0].reset( );
})( );

function nextQuestion( currQuest ) {
  $( '.question' ).text( data[currQuest].question );
  $( '#currentQuest' ).text("Question: " + (currQuest + 1) + "/" + total );
  $( '#currScore' ).text("Score: " + correctQuest + "/" + total );
  total = data.length;
  var answers = data[currQuest].answers;
  shuffleArr( answers );
  for ( let i = 0; i < answers.length; i++ ) {
    $( '.answers' ).prepend( '<div class="hoverable answer col s12 l6" data-score=' + answers[i].score + ' id=' + i + '><p>' + answers[i].answer + '</p></div>' )
    $( '#' + i ).click($.each( function( ) {
      selected = {
        id: this.id,
        score: $( this ).data( "score" )
      }
      $.each( $( '.answer' ), function( ) {
        if ( this.id == selected.id ) {
          $( this ).css( 'background-image', "url(../assets/answer-selected.png)" );
        } else {
          $( this ).css( 'background-image', "url(../assets/answer-unselected.png)" );
        }
      })
    }))
  }
}

function shuffleArr( arr ) {
  for ( var i = arr.length - 1; i > 0; i-- ) {
    var j = Math.floor(Math.random( ) * ( i + 1 ));
    var temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
  }
  return arr;
}

function removeLast( ) {
  $.each( $( '.answer' ), function( ) {
    $( this ).remove( )
  })
  $('.fail').remove()
  $('.success').remove()
}

function User(pic, name, played){
  this.pic = pic;
  this.name = name;
  this.played = played;
}

function onSubmit( form ) {
  var Users = JSON.stringify(localStorage.getItem("Users"));
  if (Users == null) {
    Users = []
  }
  var formData = $( "#userForm" ).serializeArray( )
  var name = formData[formData.length - 1].value
  var pic = formData[0].value;
  if (formData.length > 2) {
    pic = formData[Math.floor(Math.random() * 2)].value;
  }
  var played = [];
  var newUser = new User(pic, name, played);
  // Users.push(JSON.stringify(newUser));
  localStorage.setItem('Users', Users);
  // console.log(JSON.stringify(newUser), "newUser");
  $( "#userForm" )[0].reset( );
  $( "#modal1" ).modal( "close" );
  return false;
}

function submitAnswer( ) {
  if ( selected.score == undefined ) {
    Materialize.toast( 'Chose one to continue!', 3000, 'rounded' );
  } else if ( selected.score == 1 ) {
    removeLast( );
    $('.answers').append('<img class="fail center" src="../assets/correct.png" alt="" />')
    correctQuest++;
    currQuest++;
  } else if ( selected.score == 0 ) {
    removeLast( );
    $('.answers').append('<img class="success center" src="../assets/incorrect.png" alt="" />')
    currQuest++;
  }
  if ( currQuest == total) {
    endGame();
  }
  selected.score = undefined;
  setTimeout(function() {
    removeLast();
    nextQuestion( currQuest );
  }, 2000);
}

function endGame( ) {
  var finalScore = correctQuest + "/" + total
  $( "#modal2" ).modal( "open" );
  $(".congrats").append("<h1>" + finalScore + "</h1>")
  correctQuest = 0;
  currQuest = 0;
}
