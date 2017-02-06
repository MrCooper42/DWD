var $scope = {};
var data;
var correctQuest = 0;
var total;
var selected;
var currQuest = 0;

( function( ) {
  $( '#modal1' ).modal( );
  $( '#modal1' ).modal( "open" );
  $( '#modal2' ).modal( );
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
  $( '#currentQuest' ).text( (currQuest + 1) + "/" + total );
  $( '#currScore' ).text( correctQuest + "/" + total );

  console.log( data, 'data' );
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
}

function User(pic, name, played){
  this.pic = pic;
  this.name = name;
  this.played = played;
}

function onSubmit( form ) {
  var Users = localStorage.getItem("Users")
  var formData = $( "#userForm" ).serializeArray( )
  var name = formData[formData.length - 1].value
  var pic = formData[0].value;
  if (formData.length > 2) {
    pic = formData[Math.floor(Math.random() * 2)].value;
  }
  var played = [];
  var newUser = new User(pic, name, played);
  localStorage.setItem('Users', newUser);
  console.log(newUser, "newUser");
  console.log(Users, "Users");
  $( "#userForm" )[0].reset( );
  $( "#modal1" ).modal( "close" );
  return false;
}

function submitAnswer( ) {
  var Users = localStorage.getItem("Users")
  console.log(Users, "Users");
  if ( selected.score == undefined ) {
    Materialize.toast( 'Chose one to continue!', 3000, 'rounded' );
  } else if ( selected.score == 1 ) {
    correctQuest++;
    currQuest++;
  } else if ( selected.score == 0 ) {
    currQuest++;
  }
  if ( currQuest == total) {
    endGame();
  }
  removeLast( )
  selected.score = undefined;
  nextQuestion( currQuest )
}

function endGame( ) {
  correctQuest = 0;
  currQuest = 0;
  var finalScore = correctQuest + "/" + total
  $( "#modal2" ).modal( "open" );
  $(".congrats").append("<h1>" + finalScore + "</h1>")
}
