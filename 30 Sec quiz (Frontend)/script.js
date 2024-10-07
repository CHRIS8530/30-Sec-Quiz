$(document).ready(function() {
    var questions = [
        {
            question: "What is the capital of France?",
            correct: "Paris"
        },
        {
            question: "What is the largest planet in our solar system?",
            correct: "Jupiter"
        },
        {
            question: "Which artist painted the famous painting 'The Starry Night'?",
            correct: "Vincent van Gogh"
        },
        {
            question: "What is the chemical symbol for gold?",
            correct: "Au"
        },
        {
            question: "Which author wrote the famous novel 'To Kill a Mockingbird'?",
            correct: "Harper Lee"
        },
        {
            question: "What is the largest mammal on Earth?",
            correct: "Blue whale"
        },
        {
            question: "Which musician is known as the 'King of Rock and Roll'?",
            correct: "Elvis Presley"
        },
        {
            question: "What is the capital of Australia?",
            correct: "Canberra"
        },
        {
            question: "Which ancient civilization built the Great Pyramid of Giza?",
            correct: "Egyptians"
        },
        {
            question: "What is the smallest country in the world, both in terms of population and land area?",
            correct: "Vatican City"
        },
        {
            question: "Which actor played the role of Luke Skywalker in the original Star Wars trilogy?",
            correct: "Mark Hamill"
        },
        {
            question: "What is the largest living structure on Earth?",
            correct: "The Great Barrier Reef"
        },
        {
            question: "Which musician is known for his iconic guitar playing and hits like 'Purple Rain' and 'When Doves Cry'?",
            correct: "Prince"
        },
        {
            question: "What is the highest mountain peak in North America?",
            correct: "Denali (formerly known as Mount McKinley)"
        },
        {
            question: "Which author wrote the famous novel '1984'?",
            correct: "George Orwell"
        },
        {
            question: "What was the name of the company Steve Jobs founded?",
            correct: "Apple"
        }
       ];

    var currentQuestion = 0;
    var score = 0;
    var timeLeft = 30;
    var timerInterval;
    var leaderboard = [];
    var storedLeaderboard = JSON.parse(localStorage.getItem("leaderboard")) || []; // Get stored leaderboard from local storage

    function startQuiz() {
        showQuestion();
        startTimer();
    }

    function showQuestion() {
        var question = questions[currentQuestion];
        $("#question-text").text(question.question);
        $("#answer-input").val("");
        $("#submit-answer").removeClass("hidden");
        $("#leaderboard").hide();
        $("#timer").show();
    }

    function startTimer() {
        timerInterval = setInterval(function() {
            timeLeft--;
            $("#timer").text(timeLeft + " seconds");
            if (timeLeft === 0) {
                clearInterval(timerInterval);
                timeLeft = 30;
                checkAnswer(null); // Automatically submit answer as null if time runs out
            }
        }, 1000);
    }

    function checkAnswer(answer) {
        var question = questions[currentQuestion];
        if (answer !== null && answer.toLowerCase() === question.correct.toLowerCase()) {
            score++;
        }
        clearInterval(timerInterval);
        timeLeft = 30;
        currentQuestion++;
        if (currentQuestion >= questions.length) {
            showFinalScore();
            showLeaderboard();
        } else {
            showQuestion();
            startTimer();
        }
    }

    function showFinalScore() {
        var finalScore = "Your final score is: " + score + " out of " + questions.length;
        $("#question-text").text(finalScore);
        $("#timer").hide();
        $("#submit-answer").hide();
        $("#leaderboard").show();
        $("#restart-quiz").show();
    }

    function showLeaderboard() {
        var playerName = prompt("Please enter your name:");
        leaderboard.push({ name: playerName, score: score });
        leaderboard = leaderboard.concat(storedLeaderboard); // Add stored leaderboard to current leaderboard
        leaderboard.sort(function(a, b) {
            return b.score - a.score;
        });
        var top5 = leaderboard.slice(0, 5);
        var leaderboardHtml = "<h2>Leaderboard</h2>";
        for (var i = 0; i < top5.length; i++) {
            leaderboardHtml += "<li>" + (i + 1) + ". " + top5[i].name + " - " + top5[i].score + " correct answers</li>";
        }
        $("#leaderboard").html("<ul>" + leaderboardHtml + "</ul");

        // Store top 5 in local storage
        localStorage.setItem("leaderboard", JSON.stringify(top5));
    }

    $("#submit-answer").click(function() {
        var answer = $("#answer-input").val();
        clearInterval(timerInterval);
        checkAnswer(answer);
    });

    $("#restart-quiz").click(function() {
        currentQuestion = 0;
        score = 0;
        timeLeft = 30;
        startQuiz();
    });

    startQuiz();
});