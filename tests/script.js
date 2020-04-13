// script.js

var title = ""; // title of the test
var randomize_questions = false;
var randomize_answers = true;
var numQ = 0; // number of questions
var score_displayed = false; // is the score being displayed?
var hogwartsGrading; // use Hogwarts grading system?
var test; // the test object stored in test.js
var answers; // contains the arrays with the correct answers

document.addEventListener("DOMContentLoaded", init());

function init() {
	// set title:
	title = test.title;
	document.title = title;
	document.getElementById("title").textContent = title;
	
	// set variables:
	randomize_questions = test["randomize questions"];
	randomize_answers = test["randomize answers"];
	hogwartsGrading = test["use Hogwarts grading"];
	var questions = test["questions"];
	numQ = questions.length;
	answers = new Array(numQ);
	
	// read questions and answers from test object:
	for (var n=0; n<numQ; n++) {
		var i = 0;
		if (randomize_questions)
			i = Math.floor(Math.random() * questions.length);
		answers[n] = questions[i].correct;
		
		// generate new HTML:
		var newHTML = '<b>Frage ' + (n+1) + '.<br>' + questions[i].question + '<\/b>\
			<ul style="list-style-type:none">';
			
		// add answer choices or input box:
		if (questions[i].wrong != undefined) { // multiple choice question
			var choices = questions[i].correct.concat(questions[i].wrong);
			var choices_len = choices.length;
			for (var m=0; m<choices_len; m++) {
				var j = 0;
				if (randomize_answers)
					j = Math.floor(Math.random() * choices.length);
				newHTML += '<li><input style="text-indent:10pt;" type="radio" class="myradio"\
					id="question_' + (n+1) + '_' + m + '" name="question' + (n+1) + '" value="' + choices[j] + '">\
					<label for="question_' + (n+1) + '_' + m + '">' + choices[j] + '</label><br></li>';
					choices.splice(j, 1);
			}
		}
		else { // open-ended question
			newHTML += '<li><input type="text" name="question' + (n+1) + '" autocomplete="off" \
			onkeydown="if(event.keyCode==13) return false" placeholder="Antwort eingeben"><\/li>';
		}
			
		newHTML += '<\/ul>\
			<hr>';
		// add HTML to the document:
		document.getElementById("end").insertAdjacentHTML("beforebegin", newHTML);
		questions.splice(i, 1);
	}
}

function resetForm(form) {
	if(score_displayed == true) { // remove score and feedback
		document.getElementById("result").remove();
		for (var n=0; n<numQ; n++)
			document.getElementById("question_" + (n+1) + "_feedback").remove();
	}
	score_displayed = false;
}

function getScore(form) {
	var score = 0;
	
	if(score_displayed == true) { // remove score and feedback
		document.getElementById("result").remove();
		for(var n=0; n<numQ; n++)
			document.getElementById("question_" + (n+1) + "_feedback").remove();
	}
	
	// check answers and add feedback:
	for (var n=0; n<numQ; n++) {
		var any_checked = false;
		
		// get all choices of this question:
		var choices = document.getElementsByName("question" + (n+1));
		if (choices.length > 1) { // multiple-choice question
			for (choice of choices) {
				if (choice.checked) {
					any_checked = true;
					if (answers[n].includes(choice.value)) { // correct answer
						score++;
						choice.nextSibling.nextSibling.insertAdjacentHTML('afterend', '<b id="question_' + (n+1) + '_feedback" \
							style="color: lime"><tt>    <\/tt>&#x2714<\/b>');
						break;
					}
					else { // wrong answer
						choice.nextSibling.nextSibling.insertAdjacentHTML('afterend', '<b id="question_' + (n+1) + '_feedback" \
							style="color: red"><tt>    <\/tt>&#x2718 Richtige Antwort(en): ' + answers[n].join(', ') + '<\/b>');
					}
				}
			}
			if (!any_checked) {
				// nothing selected
				choices[0].parentNode.parentNode.insertAdjacentHTML('beforebegin', '<b id="question_' + (n+1) +
					'_feedback" style="color: red"><tt>    <\/tt>&#x2718 Richtige Antwort(en): ' + String(answers[n]) + '<\/b>');
			}
		}
		else { // open-ended question
			var choice = choices[0];
			if (answers[n].includes(choice.value)) { // correct answer
				score++;
				choice.insertAdjacentHTML('afterend', '<b id="question_' + (n+1) + '_feedback" \
					style="color: lime"><tt>    <\/tt>&#x2714<\/b>');
			}
			else { // wrong answer
				choice.parentNode.parentNode.insertAdjacentHTML('beforebegin', '<b id="question_' + (n+1) + '_feedback" \
					style="color: red"><tt>    <\/tt>&#x2718 Richtige Antwort(en): ' + answers[n].join(', ') + '<\/b>');
			}
		}
	}
	
	// calculate and display result:
	var p = score/numQ;
	var grade = calculateGrade(p, hogwartsGrading);
	var result = " " + score + " / " + numQ + " Punkte = " + (100*p).toFixed(2).toString().replace('.', ',') + " %, Note: " + grade;
	document.getElementById("score").insertAdjacentHTML('afterend', '<h3 style="text-align:center" id="result">' + result + '<\/h3>');
	score_displayed = true;
}

function calculateGrade(p, useHogwartsGrading) { // calculates the grade achieved with score 0 <= p <= 1.
	if (useHogwartsGrading) {
		if (p > 0.9)
			return "Ohnegleichen"
			else if (p > 0.75)
				return "Erwartungen übertroffen"
			else if (p > 0.5)
				return "Annehmbar"
			else if (p > 0.3)
				return "Mies"
			else if (p > 0.1)
				return "Schrecklich"
			else
				return "Troll"
	} else {
		if (p >= 0.9)
			return "1"
		else if (p >= 0.77)
			return "2";
		else if (p >= 0.63)
			return "3"
		else if (p >= 0.5)
			return "4"
		else
			return "5"
	}
}