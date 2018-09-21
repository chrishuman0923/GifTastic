$(document).ready(function() {
    var topics = ["dog", "cat", "bird", "horse", "snake", "frog", "rabbit", "wolf", "pig", "cow"],
        $buttonDiv = $("#buttons");

    function createBtns() {
        for (var i = 0; i < topics.length; i++) {
            var newBtn = $("<button>");

            newBtn.addClass("animalBtn").attr("data-animal", topics[i]).text(topics[i]);

            $buttonDiv.append(newBtn);
        }
    }

    function getGifs() {
        var apiKey = "fzMl3W1ysk8S6fEQQBU0T8uvRN7cFFf8";
    }

    createBtns();
});