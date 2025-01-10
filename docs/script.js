$(document).ready(function() {
    var questions = []; // Array to store quiz questions

    // Fetch questions from the JSON file
    $.getJSON("questionnaire.json", function(data) {
        questions = data;
        startQuiz(); // Start the quiz once questions are loaded
    });

    // Initialize quiz variables
    var currentQuestion = 0; // Index of the current question
    var score = 0; // User's score
    var timeLeft = 30; // Timer for each question
    var timerInterval; // Reference to the timer interval
    var leaderboard = []; // Array to store leaderboard entries
    var storedLeaderboard = JSON.parse(localStorage.getItem("leaderboard")) || []; // Retrieve leaderboard from local storage

    // Function to start the quiz
    function startQuiz() {
        showQuestion(); // Display the first question
        startTimer(); // Start the quiz timer
        $("#restart-quiz").hide(); // Hide the restart button initially
    }

    // Function to display the current question
    function showQuestion() {
        var question = questions[currentQuestion]; // Get the current question
        $("#question-text").text("Question " + (currentQuestion + 1) + "/" + questions.length + ": " + question.question); // Update question text
        var answerButtons = document.querySelectorAll('.answer-btn'); // Get all answer buttons
        answerButtons.forEach((button, index) => {
            button.innerText = question.answers[index].text; // Set the text of each answer button
            button.dataset.correct = question.answers[index].correct; // Set the correct answer data attribute
            button.classList.remove('correct', 'incorrect'); // Remove previous correct/incorrect classes
        });
        $("#leaderboard").hide(); // Hide the leaderboard
        $("#timer").show(); // Show the timer
    }

    // Function to start the timer
    function startTimer() {
        timerInterval = setInterval(function() {
            timeLeft--; // Decrease time left
            $("#timer").text(timeLeft); // Update the timer display
            if (timeLeft === 0) {
                clearInterval(timerInterval); // Stop the timer
                timeLeft = 30; // Reset the timer
                checkAnswer(null); // Automatically submit answer as null if time runs out
            }
        }, 1000); // Update every second
    }

    // Function to handle answer selection
    window.selectAnswer = function(button) {
        const correct = button.dataset.correct === 'true'; // Check if the selected answer is correct
        button.classList.add(correct ? 'correct' : 'incorrect'); // Highlight the selected answer

        // Highlight all buttons
        const answerButtons = document.querySelectorAll('.answer-btn');
        answerButtons.forEach(btn => {
            if (btn.dataset.correct === 'true') {
                btn.classList.add('correct');
            } else {
                btn.classList.add('incorrect');
            }
        });

        clearInterval(timerInterval); // Stop the timer
        setTimeout(() => {
            timeLeft = 30; // Reset the timer
            currentQuestion++; // Move to the next question
            if (currentQuestion >= questions.length) {
                showFinalScore(); // Display the final score
                showLeaderboard(); // Display the leaderboard
            } else {
                showQuestion(); // Show the next question
                startTimer(); // Restart the timer
            }
        }, 1000); // Delay before moving to the next question
    };

    // Function to display the final score
    function showFinalScore() {
        var finalScore = "Your final score is: " + score + " out of " + questions.length; // Prepare the final score message
        $("#question-text").text(finalScore); // Display the final score
        $("#timer").hide(); // Hide the timer
        $("#leaderboard").show(); // Show the leaderboard
        $("#restart-quiz").show(); // Show the restart button
    }

    // Function to display the leaderboard
    function showLeaderboard() {
        var playerName = prompt("Please enter your name:"); // Ask for player name
        leaderboard.push({ name: playerName, score: score }); // Add the current player to the leaderboard
        leaderboard = leaderboard.concat(storedLeaderboard); // Merge with stored leaderboard
        leaderboard.sort(function(a, b) {
            return b.score - a.score; // Sort leaderboard by score in descending order
        });
        var top5 = leaderboard.slice(0, 5); // Get the top 5 scores
        var leaderboardHtml = "";
        for (var i = 0; i < top5.length; i++) {
            leaderboardHtml += "<li>" + (i + 1) + ". " + top5[i].name + " - " + top5[i].score + " correct answers</li>";
        }
        $("#leaderboard-list").html(leaderboardHtml); // Update the leaderboard display
        localStorage.setItem("leaderboard", JSON.stringify(top5)); // Store the top 5 in local storage
    }

    // Event listener for the restart button
    $("#restart-quiz").click(function() {
        currentQuestion = 0; // Reset question index
        score = 0; // Reset score
        timeLeft = 30; // Reset timer
        startQuiz(); // Restart the quiz
    });
});