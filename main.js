//require necessary modules
const inquirer = require('inquirer');
const QandAsCloze = require('./QandAsCloze.json');
const QandAsBasic = require('./QandAsBasic.json');
const ClozeCard = require ('./ClozeCard');
const BasicCard = require ('./BasicCard');
const Chance = require('chance');
const colors = require('colors');

//initializing app properties
var app = {};
app.numberOfQuestions = 6;  
app.counter = 0; 
app.rights = 0; 
app.wrongs = 0;  
app.question = '';
app.answer = '';  
app.fullText = ''; 
app.type = ''; 
app.questionArrs = [];  

var chance = new Chance();

//using Inquirer to ask question
app.askQuestion = function (){
  var that = this;  
  inquirer.prompt({
    type: 'input',
    message: that.question,
    name: 'userChoice'
  }).then((res) => {
    //outcome of answering flash card
    if (res.userChoice.toLowerCase().trim() === that.answer) that.rightAnswer(); 
    else that.wrongAnswer(); 
    //logic to run next question
    that.counter++;   
    if (that.counter < that.numberOfQuestions) that.nextQuestion();
    else that.gameOver();
  })
}

app.rightAnswer = function (){
  console.log(colors.green(`Yes! ${this.fullText}`));
  this.rights++;
}
app.wrongAnswer = function () {
  console.log(colors.yellow(`That is incorrect! ${this.fullText}`));
  this.wrongs++;  
}

//logic to move onto next question
app.nextQuestion = function (){
  var that = this;  
  //update question and answer states
  if (this.type === 'Cloze'){
    this.question = this.questionArrs[this.counter]['partial'];
    this.answer = this.questionArrs[this.counter]['cloze'];
    this.fullText = this.questionArrs[this.counter]['fullText'].charAt(0).toUpperCase() + this.questionArrs[this.counter]['fullText'].slice(1, -1);
    if (that.fullText.indexOf('(') !== -1) this.fullText = this.fullText.slice(0, that.fullText.indexOf('(')-2)
  } else if (this.type === 'Basic'){
    this.question = this.questionArrs[this.counter]['front'];
    this.answer = this.questionArrs[this.counter]['back'];
    this.fullText = this.questionArrs[this.counter]['front'].replace(/Who|What/g, that.answer.charAt(0).toUpperCase() + that.answer.slice(1)).slice(0, -1);
    if (that.fullText.indexOf('(') !== -1)  this.fullText = this.fullText.slice(0, that.fullText.indexOf('(')-2)
}

  this.askQuestion();
}

//display game over and ask user if he/she wants to replay the game
app.gameOver = function (){
  var that = this;  
  console.log(`Game Over! You answered ${this.rights} questions correctly and ${this.wrongs} questions incorrectly.`)
  //Ask user if he/she wants to play another game, 
  inquirer.prompt({
    type: 'confirm',
    message: 'Would you like to play another game?',
    name: 'newGame'
  }).then((res2) => {
    //if user wants to play another game, then run initialize again
    if (res2.newGame) that.initialize()
  })
}
//game initializing logic
app.initialize = function (){
  var that = this;  
  console.log(colors.inverse('Welcome to Science Flash Card'))
  //reset game 
  this.rights = this.wrongs = this.counter = 0; 
  this.questionArrs = [];
  //ask user what type of game to play then choose questions accordingly 
  inquirer.prompt({
    type: 'list',
    choices: ['Basic', 'Cloze'],
    message: 'What type of flash card game would you like to play?',
    name: 'gameType'
  }).then(function(res3){
    that.type = res3.gameType;  
    that.chooseQuestions();
    that.nextQuestion();

  })
}

app.chooseQuestions = function (type){
  var that = this;  
  //logic for randomly picking questions for a Cloze game
  if (this.type === 'Cloze') {
    var ClozeJSONLength = QandAsCloze.length;
    var numArr = Array.from(Array(ClozeJSONLength).keys());
    var randArr = chance.pickset(numArr, this.numberOfQuestions); 
    randArr.forEach((v) => {
      var newClozeCard = new ClozeCard(QandAsCloze[v].question, QandAsCloze[v].answer)
      that.questionArrs.push(newClozeCard)  
    })
  }
  //Logic for randomly picking questions for a Basic game
  else if (this.type === 'Basic') {
    var BasicJSONLength = QandAsBasic.length;
    var numArr = Array.from(Array(BasicJSONLength).keys());
    var randArr = chance.pickset(numArr, this.numberOfQuestions); 
    randArr.forEach((v) => {
      var newBasicCard = new BasicCard(QandAsBasic[v].question, QandAsBasic[v].answer)
      that.questionArrs.push(newBasicCard)  
    })
  }
}

app.initialize();