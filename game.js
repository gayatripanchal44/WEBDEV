const question = document.getElementById("question");
const choices = Array.from(document.getElementsByClassName("choice-text"));
const pregressText = document.getElementById("progressText");
const scoreText = document.getElementById("score");
const loader = document.getElementById("loader");
const game = document.getElementById("game");

console.log(choices);
let currentQuestion = {};
let acceptingAnswer = false;
let score = 0;
let questionCounter = 0;
let availableQuestion = [];

let questions = [];

fetch("https://opentdb.com/api.php?amount=10&category=9&difficulty=easy&type=multiple")
    .then((res) => {
        return res.json();
    })
    .then((loadedQuestions) => {
        console.log(loadedQuestions.results);
        questions = loadedQuestions.results.map(loadedQuestions => {
          const formattedQuestion = {
            question : loadedQuestions.question
          };

          const answerChoices = [...loadedQuestions.incorrect_answers];
          formattedQuestion.answer = Math.floor(Math.random() * 3) +1;
          answerChoices.splice(
            formattedQuestion.answer - 1,
            0,
            loadedQuestions.correct_answer
          );
          answerChoices.forEach((choice, index) => {
            formattedQuestion["choice" + (index + 1)] = choice;
          });
          return formattedQuestion;
        })
        startGame();
    })
    .catch((err) => {
        console.error(err);
    });
    
  
const CORRECT_BONUS = 10;
const MAX_QUESSTIONS = 3;

startGame = () => {
  questionCounter = 0;
  score = 0;
  availableQuestion = [...questions];
  console.log(availableQuestion);
  getNewQuestion();

  game.classList.remove("hidden");
  loader.classList.add("hidden");

};
getNewQuestion = () => {
  if (availableQuestion.length === 0 || questionCounter >= MAX_QUESSTIONS) {
    localStorage.setItem('mostRecentScore', score);
    return window.location.assign('end.html');
  }

  questionCounter++;
  progressText.innerText = `Question${questionCounter}/${MAX_QUESSTIONS}`;
  //console.log(())
  
  progressBarFull.style.width = `${(questionCounter / MAX_QUESSTIONS) * 100}%`;

  const questionIndex = Math.floor(Math.random() * availableQuestion.length);
  currentQuestion = availableQuestion[questionIndex];
  question.innerText = currentQuestion.question;

  choices.forEach(choice => {
    const number = choice.dataset['number'];
    choice.innerText = currentQuestion["choice" + number];
  });
  availableQuestion.splice(questionIndex, 1);
  acceptingAnswer = true;
};

choices.forEach(choice => {
  choice.addEventListener('click', (e) => {
    if (!acceptingAnswer) return;

    acceptingAnswer = false;
    const selectedChoice = e.target;
    const selectedAnswer = selectedChoice.dataset['number'];

    // const classApply = 'incorrect';
    //if(selectedAnswer == currentQuestion.answer){
    //  classApply = 'correct';
    //}
    const classApply = selectedAnswer == currentQuestion.answer ? 'correct' : 'incorrect'
   // console.log(classApply);

   if(classApply === 'correct'){
     incrementScore(CORRECT_BONUS);
   }

   selectedChoice.parentElement.classList.add(classApply);
   
   setTimeout( () =>{
     selectedChoice.parentElement.classList.remove(classApply);
     getNewQuestion();

   }, 100);
    
  });
});

incrementScore = num => {
  score += num;
  scoreText.innerText = score;
}

//startGame();