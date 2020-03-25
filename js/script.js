let next = document.querySelector('.next');
let previous = document.querySelector('.previous');

let question = document.querySelector('.question');
let answers = document.querySelectorAll('.list-group-item');
let questionNumber = document.querySelector('.questionNumber');

let pointsElem = document.querySelector('.score');
let restart = document.querySelector('.restart');

let list = document.querySelector(".list");
let results = document.querySelector(".results");
let average = document.querySelector(".average");
let userScorePoint = document.querySelector(".userScorePoint");

let index = 0;
let points = 0;
let preQuestions = [];
let previousAnswers = new Map();

fetch('https://quiztai.herokuapp.com/api/quiz')
    .then(resp => resp.json())
    .then(resp => {
        preQuestions = resp;
        setQuestion(index);
        activateAnswers();
    }).catch((e) => {
        console.log(e);
});

function activateAnswers() {
    for (let i = 0; i < answers.length; i++) {
        answers[i].addEventListener('click', doAction);
        answers[i].classList.remove("correct", "incorrect");
    }
}
// activateAnswers();

function setQuestion(index) {

    if(previousAnswers.size===preQuestions.length){
        quizEnd(points);
    }

    if(previousAnswers.has(index)) {
        getPreviousAnswer(index)
    }

    question.innerHTML = preQuestions[index].question;

    answers[0].innerHTML = preQuestions[index].answers[0];
    answers[1].innerHTML = preQuestions[index].answers[1];
    answers[2].innerHTML = preQuestions[index].answers[2];
    answers[3].innerHTML = preQuestions[index].answers[3];
    if (preQuestions[index].answers.length === 2) {
        answers[2].style.display = 'none';
        answers[3].style.display = 'none';
    } else {
        answers[2].style.display = 'block';
        answers[3].style.display = 'block';
    }
    setQuestionNumber(index);
}

// setQuestion(0);

function setQuestionNumber(index) {
    questionNumber.innerHTML = index+1+"/"+preQuestions.length;
}

next.addEventListener('click', function (event) {

    if(index >= preQuestions.length-1) {

    } else {
        index++;

        activateAnswers();
        setQuestion(index);
    }


});

previous.addEventListener('click', function (event) {
    if(index>0){
        index--;
        activateAnswers();
        setQuestion(index);
    }
});


function getPreviousAnswer(index) {
    answers.forEach(item => {
        item.classList.remove("correct", "incorrect");
    });

    let question = preQuestions[index];
    markCorrect(answers[question.answers.indexOf(question.correct_answer)]);

    if (question.correct_answer !== previousAnswers.get(index)) {
        markInCorrect(answers[question.answers.indexOf(previousAnswers.get(index))]);
    }
    disableAnswers();
}

function doAction(event) {
    previousAnswers.set(index, event.target.innerHTML);

    if (event.target.innerHTML === preQuestions[index].correct_answer) {
        points++;
        pointsElem.innerText = points;
        markCorrect(event.target);
    }
    else {
        markInCorrect(event.target);
    }
    disableAnswers();
}

function markCorrect(elem) {
    elem.classList.add('correct');
}

function markInCorrect(elem) {
    elem.classList.add('incorrect');
}

function disableAnswers() {
    for(let i=0; i< answers.length; i++) {
        answers[i].removeEventListener('click', doAction);
    }
}

function quizEnd(points) {
    saveToLS();
    list.style.display = 'none';
    results.style.display = 'block';
    userScorePoint.innerHTML = points;
    average.innerHTML = localStorage.getItem('avgResult');
}

restart.addEventListener('click', function (event) {
    event.preventDefault();

    index = 0;
    points = 0;
    previousAnswers = new Map();
    let userScorePoint = document.querySelector('.score');
    userScorePoint.innerHTML = points;
    setQuestion(index);
    activateAnswers();
    list.style.display = 'block';
    results.style.display = 'none';
});

function saveToLS() {
    const avgResultLS = localStorage.getItem('avgResult');
    const gamesCountLS = localStorage.getItem('gamesCount');

    if (avgResultLS === null) {
        localStorage.setItem('avgResult', points);
        localStorage.setItem('gamesCount', 1);
    } else {
        const avgResult = getAvg(avgResultLS, gamesCountLS, points);
        localStorage.setItem('avgResult', avgResult);
        localStorage.setItem('gamesCount', parseInt(gamesCountLS) + 1);
    }
}

function getAvg(avgResult, gamesCount, currentResult) {
    const sum = parseFloat(avgResult) * parseInt(gamesCount);
    return (sum + currentResult) / (parseInt(gamesCount) + 1);
}
