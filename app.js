let questions = [];
let currentIndex = 0;

let score = 0;
let totalAnswered = 0;

let quizSet = [];

async function loadQuestions(){

const files = [

"questions_1kasetsu.json",
"questions_2dokouji.json",
"questions_3yamadome.json",
"questions_4kuikouji.json",
"questions_5tekkin.json",
"questions_6katawaku.json",
"questions_7konkuri.json",
"questions_8tekkotsu.json"

];

questions=[];

for(const file of files){

const response = await fetch(file);

const data = await response.json();

questions.push(...data);

}

console.log(
`${questions.length}問 読み込み完了`
);

}

loadQuestions();
.then(data=>{
    questions=data;
});

function shuffle(array){

for(let i=array.length-1;i>0;i--){

const j = Math.floor(Math.random()*(i+1));

[array[i],array[j]]=[array[j],array[i]];
}

return array;

}

function startRandomQuiz(){

quizSet=[...questions];

shuffle(quizSet);

currentIndex=0;

showQuestion();

}

function startMockExam(){

quizSet=[...questions];

shuffle(quizSet);

quizSet=quizSet.slice(0,50);

currentIndex=0;

score=0;

showQuestion();

}

function showQuestion(){

let q=quizSet[currentIndex];

if(!q){

showResult();

return;
}

let choices=q.choices.map((item,index)=>({

text:item,
original:index

}));

shuffle(choices);

let html=`

<div class="quiz-card">

<h2>

第${currentIndex+1}問

</h2>

<p>${q.question}</p>

`;

choices.forEach(c=>{

html+=`

<button class="choice"

onclick="judge(${c.original})">

${c.text}

</button>

`;

});

html+=`</div>`;

document.getElementById("quizArea").innerHTML=html;

window.currentQuestion=q;

}

function judge(selected){

let q=window.currentQuestion;

let correct=(selected===q.answer);

totalAnswered++;

if(correct){

score++;

}

updateStats();

let html=`

<div class="quiz-card">

<h2>

${correct ? "✅正解":"❌不正解"}

</h2>

<p>

正答：

${q.choices[q.answer]}

</p>

<div class="explanation">

${q.explanation}

</div>

<button onclick="nextQuestion()">

次へ

</button>

<button onclick="addFavorite()">

⭐お気に入り

</button>

</div>

`;

document.getElementById("quizArea").innerHTML=html;

if(!correct){

saveWeakQuestion(q.id);

}

}

function nextQuestion(){

currentIndex++;

showQuestion();

}

function updateStats(){

document.getElementById("score").innerText=score;

let rate=Math.round(score/totalAnswered*100);

document.getElementById("rate").innerText=rate+"%";

}

function addFavorite(){

let list=
JSON.parse(localStorage.getItem("favorites") || "[]");

list.push(window.currentQuestion.id);

localStorage.setItem(
"favorites",
JSON.stringify(list)
);

alert("お気に入り登録しました");

}

function saveWeakQuestion(id){

let list=
JSON.parse(localStorage.getItem("weak") || "[]");

if(!list.includes(id)){

list.push(id);

}

localStorage.setItem(
"weak",
JSON.stringify(list)
);

}

function showFavorites(){

let ids=
JSON.parse(localStorage.getItem("favorites") || "[]");

quizSet=
questions.filter(q=>ids.includes(q.id));

currentIndex=0;

showQuestion();

}

function showWeakQuestions(){

let ids=
JSON.parse(localStorage.getItem("weak") || "[]");

quizSet=
questions.filter(q=>ids.includes(q.id));

currentIndex=0;

showQuestion();

}

function showCategoryMenu(){

let categories=[
...new Set(
questions.map(q=>q.category)
)
];

let html="<div class='quiz-card'>";

categories.forEach(cat=>{

html+=`

<button
onclick="startCategory('${cat}')">

${cat}

</button>

`;

});

html+="</div>";

document.getElementById("quizArea")
.innerHTML=html;

}

function startCategory(category){

quizSet=
questions.filter(
q=>q.category===category
);

shuffle(quizSet);

currentIndex=0;

showQuestion();

}

function showResult(){

let rate=
Math.round(score/totalAnswered*100);

document.getElementById("quizArea")
.innerHTML=`

<div class="quiz-card">

<h2>

🎉終了

</h2>

<p>

得点

${score}

</p>

<p>

正答率

${rate}%

</p>

</div>

`;

}