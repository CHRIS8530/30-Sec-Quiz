$(document).ready(function() {
    var questions = [
        {
            question: "What is the capital of France?",
            answers: ["Paris", "London", "Berlin", "Rome"],
            correct: 0
        },
        {
            question: "What is the largest planet in our solar system?",
            answers: ["Earth", "Saturn", "Jupiter", "Uranus"],
            correct: 2
        },
        {
            question: "Which artist painted the famous painting 'The Starry Night'?",
            answers: ["Leonardo da Vinci", "Vincent van Gogh", "Pablo Picasso", "Claude Monet"],
            correct: 1
        },
        {
            question: "What is the chemical symbol for gold?",
            answers: ["Ag", "Au", "Hg", "Pb"],
            correct: 1
        },
        {
            question: "Which author wrote the famous novel 'To Kill a Mockingbird'?",
            answers: ["F. Scott Fitzgerald", "Harper Lee", "Jane Austen", "J.K. Rowling"],
            correct: 1
        },
        {
            question: "What is the largest mammal on Earth?",
            answers: ["Blue whale", "Fin whale", "Humpback whale", "Sperm whale"],
            correct: 0
        },
        {
            question: "Which musician is known as the 'King of Rock and Roll'?",
            answers: ["Elvis Presley", "Chuck Berry", "Little Richard", "Jerry Lee Lewis"],
            correct: 0
        },
        {
            question: "What is the capital of Australia?",
            answers: ["Sydney", "Melbourne", "Canberra", "Perth"],
            correct: 2
        },
        {
            question: "Which ancient civilization built the Great Pyramid of Giza?",
            answers: ["Egyptians", "Greeks", "Romans", "Mesopotamians"],
            correct: 0
        },
        {
            question: "What is the smallest country in the world, both in terms of population and land area?",
            answers: ["Vatican City", "Monaco", "Nauru", "Tuvalu"],
            correct: 0
        },
        {
            question: "Which actor played the role of Luke Skywalker in the original Star Wars trilogy?",
            answers: ["Mark Hamill", "Harrison Ford", "Carrie Fisher", "Alec Guinness"],
            correct: 0
        },
        {
            question: "What is the largest living structure on Earth?",
            answers: ["The Great Barrier Reef", "The Amazon rainforest", "The Grand Canyon", "The Great Wall of China"],
            correct: 0
        },
        {
            question: "Which musician is known for his iconic guitar playing and hits like 'Purple Rain' and 'When Doves Cry'?",
            answers: ["Prince", "David Bowie", "Elton John", "Stevie Wonder"],
            correct: 0
        },
        {
            question: "What is the highest mountain peak in North America?",
            answers: ["Denali (formerly known as Mount McKinley)", "Mount Whitney", "Mount Rainier", "Mount Hood"],
            correct: 0
        },
        {
            question: "Which author wrote the famous novel '1984'?",
            answers: ["George Orwell", "Aldous Huxley", "Ray Bradbury", "Kurt Vonnegut"],
            correct: 0
        }
    ];

    var currentQuestion = 0;
    var score = 0;
    var timeLeft = 30;
    var timerInterval;
    var leaderboard = [];

    function startQuiz() {
        showQuestion();
        startTimer();
    }

    function showQuestion() {
        var question = questions[currentQuestion];
        $("#question-text").text(question.question);
        $("#answers button").each(function(index) {
            $(this).text(question.answers[index]);
            $(this).addClass("hidden");
        });
        setTimeout(function() {
            $("#answers button").each(function(index) {
                $(this).removeClass("hidden");
            });
        }, 500);
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
        if (answer !== null && answer === question.correct) {
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
    }

    function showLeaderboard() {
        var playerName = prompt("Please enter your name:");
        leaderboard.push({ name: playerName, score: score });
        leaderboard.sort(function(a, b) {
            return b.score - a.score;
        });
        var top5 = leaderboard.slice(0, 5);
        var leaderboardHtml = "";
        for (var i = 0; i < top5.length; i++) {
            leaderboardHtml += "<li>" + (i + 1) + ". " + top5[i].name + " - " + top5[i].score + " correct answers</li>";
        }
        $("#leaderboard").html("<ul>" + leaderboardHtml + "</ul>");
        $("#leaderboard").show();
    }

    $("#answers button").click(function() {
        var answer = $(this).index();
        clearInterval(timerInterval);
        checkAnswer(answer);
    });

    startQuiz();
});