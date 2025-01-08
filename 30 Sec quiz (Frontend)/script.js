$(document).ready(function() {
    // Array of quiz questions
    var questions = [
        { question: "What is the capital of France?", correct: "Paris" },
        { question: "What is the largest planet in our solar system?", correct: "Jupiter" },
        { question: "Which artist painted the famous painting 'The Starry Night'?", correct: "Vincent van Gogh" },
        { question: "What is the chemical symbol for gold?", correct: "Au" },
        { question: "Which author wrote the famous novel 'To Kill a Mockingbird'?", correct: "Harper Lee" },
        { question: "What is the largest mammal on Earth?", correct: "Blue whale" },
        { question: "Which musician is known as the 'King of Rock and Roll'?", correct: "Elvis Presley" },
        { question: "What is the capital of Australia?", correct: "Canberra" },
        { question: "Which ancient civilization built the Great Pyramid of Giza?", correct: "Egyptians" },
        { question: "What is the smallest country in the world, both in terms of population and land area?", correct: "Vatican City" },
        { question: "Which actor played the role of Luke Skywalker in the original Star Wars trilogy?", correct: "Mark Hamill" },
        { question: "What is the largest living structure on Earth?", correct: "The Great Barrier Reef" },
        { question: "Which musician is known for his iconic guitar playing and hits like 'Purple Rain' and 'When Doves Cry'?", correct: "Prince" },
        { question: "What is the highest mountain peak in North America?", correct: "Denali (formerly known as Mount McKinley)" },
        { question: "Which author wrote the famous novel '1984'?", correct: "George Orwell" },
        { question: "What was the name of the company Steve Jobs founded?", correct: "Apple" }
    ];

    // Initialize quiz variables
    var currentQuestion = 0;
    var score = 0;
    var timeLeft = 30;
    var timerInterval;
    var leaderboard = [];
    var storedLeaderboard = JSON.parse(localStorage.getItem("leaderboard")) || []; // Retrieve leaderboard from local storage

    // Function to start the quiz
    function startQuiz() {
        showQuestion(); // Display the first question
        startTimer(); // Start the quiz timer
        $("#restart-quiz").hide(); // Hide the restart button initially
        $("#submit-answer").show(); // Ensure the submit button is visible
    }

    // Function to display the current question
    function showQuestion() {
        var question = questions[currentQuestion];
        $("#question-text").text("Question " + (currentQuestion + 1) + ": " + question.question);
        $("#answer-input").val(""); // Clear the answer input field
        $("#submit-answer").removeClass("hidden"); // Show the submit button
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

    // Function to check the submitted answer
    function checkAnswer(answer) {
        var question = questions[currentQuestion];
        if (answer !== null && answer.toLowerCase() === question.correct.toLowerCase()) {
            score++; // Increment score if the answer is correct
        }
        clearInterval(timerInterval); // Stop the timer
        timeLeft = 30; // Reset the timer
        currentQuestion++; // Move to the next question
        if (currentQuestion >= questions.length) {
            showFinalScore(); // Display the final score
            showLeaderboard(); // Display the leaderboard
        } else {
            showQuestion(); // Show the next question
            startTimer(); // Restart the timer
        }
    }

    // Function to display the final score
    function showFinalScore() {
        var finalScore = "Your final score is: " + score + " out of " + questions.length;
        $("#question-text").text(finalScore); // Display the final score
        $("#timer").hide(); // Hide the timer
        $("#submit-answer").hide(); // Hide the submit button
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

    // Event listener for the submit button
    $("#submit-answer").click(function() {
        var answer = $("#answer-input").val(); // Get the submitted answer
        clearInterval(timerInterval); // Stop the timer
        checkAnswer(answer); // Check the submitted answer
    });

    // Event listener for the restart button
    $("#restart-quiz").click(function() {
        currentQuestion = 0; // Reset question index
        score = 0; // Reset score
        timeLeft = 30; // Reset timer
        startQuiz(); // Restart the quiz
    });

    // Event listener for the Enter key to submit the answer
    $("#answer-input").on('keydown', function(event) {
        if (event.keyCode === 13) { // Check if Enter key is pressed
            event.preventDefault(); // Prevent the default action
            $("#submit-answer").trigger('click'); // Trigger the click event on the submit button
        }
    });

    // Start the quiz when the document is ready
    startQuiz();
});