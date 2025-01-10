$(document).ready(function() {
    // Shuffle function
    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    var questions = [];
    var totalQuestions; // Total number of questions

    // Fetch questions from the JSON file
    $.getJSON("questionnaire.json", function(data) {
        data.forEach(question => {
            question.answers = shuffle(question.answers); // Shuffle answers
        });
        questions = data;
        totalQuestions = questions.length; // Get total number of questions
        startQuiz(); // Start the quiz once questions are loaded
    });

    // Initialize quiz variables
    var currentQuestion = 0; // Index of the current question
    var correctAnswers = 0; // Count of correct answers
    var timeLeft = 30; // Timer for each question
    var timerInterval; // Reference to the timer interval
    var leaderboard = []; // Array to store leaderboard entries
    var storedLeaderboard = JSON.parse(localStorage.getItem("leaderboard")) || []; // Retrieve leaderboard from local storage

    // Function to start the quiz
    function startQuiz() {
        currentQuestion = 0; // Reset question index
        correctAnswers = 0; // Reset correct answers count
        showQuestion(); // Display the first question
        startTimer(); // Start the quiz timer
        $("#restart-quiz").hide(); // Hide the restart button initially
    }

    // Function to display the current question
    function showQuestion() {
        if (currentQuestion >= totalQuestions) {
            showFinalScore(); // Display the final score if all questions have been answered
            return;
        }

        var question = questions[currentQuestion]; // Get the current question
        $("#question-text").text("Question " + (currentQuestion + 1) + "/" + totalQuestions + ": " + question.question); // Update question text
        var answerButtons = document.querySelectorAll('.answer-btn'); // Get all answer buttons
        answerButtons.forEach((button, index) => {
            button.innerText = question.answers[index].text; // Set the text of each answer button
            button.dataset.correct = question.answers[index].correct; // Set the correct answer data attribute
            button.classList.remove('correct', 'incorrect', 'hidden'); // Remove previous correct/incorrect/hidden classes
        });
        $("#leaderboard").hide(); // Hide the leaderboard
        $("#timer").show(); // Show the timer
        $("#score").text("Correct Answers: " + correctAnswers + "/" + totalQuestions); // Update score display
        $("#score").removeClass("hidden"); // Ensure the score is visible during the quiz
    }

    // Function to start the timer
    function startTimer() {
        timerInterval = setInterval(function() {
            timeLeft--; // Decrease time left
            $("#timer").text(timeLeft); // Update the timer display
            if (timeLeft === 0) {
                clearInterval(timerInterval); // Stop the timer
                timeLeft = 30; // Reset the timer
                selectAnswer(null); // Automatically submit answer as null if time runs out
            }
        }, 1000); // Update every second
    }

    // Function to handle answer selection
    window.selectAnswer = function(button) {
        if (currentQuestion >= totalQuestions) {
            return; // Do nothing if all questions have been answered
        }

        if (button !== null) {
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

            if (correct && currentQuestion < totalQuestions) {
                correctAnswers++; // Increment the correct answers count if the answer is correct
            }
        }

        clearInterval(timerInterval); // Stop the timer
        setTimeout(() => {
            timeLeft = 30; // Reset the timer
            currentQuestion++; // Move to the next question
            if (currentQuestion >= totalQuestions) {
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
        var finalScore = "Your final score is: " + correctAnswers + " out of " + totalQuestions; // Prepare the final score message
        $("#question-text").text(finalScore); // Display the final score
        $("#timer").hide(); // Hide the timer
        $(".answer-btn").addClass("hidden"); // Hide the answer buttons
        $("#score").addClass("hidden"); // Hide the score display at the end
        $("#leaderboard").show(); // Show the leaderboard
        $("#restart-quiz").show(); // Show the restart button
    }

    // Function to display the leaderboard
    function showLeaderboard() {
        var playerName = prompt("Please enter your name:"); // Ask for player name
        leaderboard.push({ name: playerName, score: correctAnswers }); // Add the current player to the leaderboard
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
        startQuiz(); // Restart the quiz
    });
});