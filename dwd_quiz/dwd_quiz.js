var $scope = {};
var data;
var correctQuest = 0;
var total;
var selected;
var currQuest = 0;

(function() {
    $('#modal1').modal();
    $('#modal1').modal("open");
    $('#modal2').modal();
    var getData = new Promise(function(resolve, reject) {
        $.getJSON("data.json", function(result) {
            data = result[0].questions;
            total = data.length
            resolve(data);
        });
    });
    getData.then(function(data) {
        nextQuestion(currQuest);
    })
    $('.submitAnswer').click(submitAnswer)
})();

function nextQuestion(currQuest) {
    $('.question').text(data[currQuest].question)
    console.log(data, 'data');
    total = data.length;
    var answers = data[currQuest].answers;
		console.log(data[currQuest].question, "questions");
		console.log(answers, "answers");
    for (let i = 0; i < answers.length; i++) {
        $('.answers').prepend('<div class="answer col s12 l6" data-score=' + answers[i].score + ' id=' + i + '><p>' + answers[i].answer + '</p></div>')
        $('#' + i).click($.each(function() {
            selected = {
                id: this.id,
                score: $(this).data("score")
            }
            $.each($('.answer'), function() {
                if (this.id == selected.id) {
                    $(this).css('background-image', "url(../assets/answer-selected.png)");
                } else {
                    $(this).css('background-image', "url(../assets/answer-unselected.png)");
                }
            })
        }))
    }
}

function 

function removeLast() {
    $.each($('.answer'), function() {
        $(this).remove()
    })
}

function submitAnswer() {
    if (selected.score == undefined) {
        console.log('hit');
        removeLast()
        Materialize.toast('Chose one to continue!', 3000, 'rounded');
    } else if (selected.score == 1) {
        removeLast();
        currQuest++;
    } else {
        removeLast()
        currQuest++;
    }
    selected.score = undefined;
    nextQuestion(currQuest)
}

function endGame() {
  correctQuest = 0;
  currQuest = 0;
  $("#modal2").modal("open")
}
