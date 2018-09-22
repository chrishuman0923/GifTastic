$(document).ready(function() {
    var topics = ["dog", "cat", "bird", "horse", "snake", "rabbit", "wolf", "otter"],
        $elems = {
           btnDiv: $("#buttons"),
           gifsDiv: $("#gifs"),
           addBtn: $("#addBtn")
        },
        url = {
            addr: "https://api.giphy.com/v1/gifs/search?q=",
            apiKey: "fzMl3W1ysk8S6fEQQBU0T8uvRN7cFFf8",
            lowerLimit: 0,
            upperLimit: 10
        },
        additionalAnimal;

    function createBtns() {
        //sorts array alphabetically
        var topicsSort = topics.sort();

        //empty the div
        $elems.btnDiv.empty();

        //loops through the array of topics
        for (var i = 0; i < topicsSort.length; i++) {
            //creates a new button elem
            var newBtn = $("<button>"),
                animalText = topicsSort[i];

            //adds attributes and text to the button
            newBtn.attr({
                "data-animal": animalText,
                "class": "btn btn-success animalBtn"
            });
            newBtn.text(animalText);

            //appends the new button to the DOM
            $elems.btnDiv.append(newBtn);
        }
    }

    function getGifs(animal) {
        //sets original limit and new limit for API request and loop
        url.lowerLimit = 0;
        url.upperLimit = 10;

        //sets requested URL
        var giphyURL = [
                url.addr,
                animal,
                "&api_key=",
                url.apiKey,
                "&limit=",
                url.upperLimit
            ].join("");

        //sets variable so additional gifs can be added of the same animal
        additionalAnimal = animal;

        //Makes additional gif button visible
        if ($elems.addBtn.is(":hidden") == true) {
            $elems.addBtn.show();
        }

        $.ajax({
            url: giphyURL,
            method: "GET"
        }).then(function(response) {
            //response array
            var respGifs = response.data;

            //empty the div
            $elems.gifsDiv.empty();

            //Loops through the images returned
            for (var i = url.lowerLimit; i < respGifs.length; i++) {
                //creates a new image
                var newDiv = $("<div>"),
                    newGif = $("<img>"),
                    gifStill = respGifs[i].images.fixed_width_still.url,
                    gifActive = respGifs[i].images.fixed_width.url,
                    ratingP = $("<p>"),
                    titleP = $("<p>"),
                    title = respGifs[i].title.slice(0, -4); //trims off ' GIF' at end of every title

                //sets attributes to the new image
                newGif.attr({
                    "src": gifStill,
                    "data-still": gifStill,
                    "data-active": gifActive,
                    "data-status": "still",
                    "class": "img-fluid animalGif"
                });

                //adds class and text to the new paragraphs
                ratingP.html('Rating: <span class="gifRating">' +
                            respGifs[i].rating + "</span>");
                ratingP.addClass("gifLabel");
                titleP.text(title);
                titleP.addClass("gifTitle");

                //appends image and paragraph to new div
                newDiv.append(titleP, newGif, ratingP);
                newDiv.addClass("gifDiv");

                //appends the image and the paragraph to the DOM
                $elems.gifsDiv.append(newDiv);              
            }
        }).catch(function(error) {
            //catches the error returned by the ajax call and logs it
            console.log(`Error: ${error}`);
        });
    }

    function additionalGifs(animal) {
        //sets original limit and new limit for API request and loop
        url.lowerLimit += 10;
        url.upperLimit += 10;

        //Sets requested URL
        var giphyURL = [
                url.addr,
                animal,
                "&api_key=",
                url.apiKey,
                "&limit=",
                url.upperLimit
            ].join("");

        $.ajax({
            url: giphyURL,
            method: "GET"
        }).then(function(response) {
            //after a successful returned response
            var respGifs = response.data;

            //Loops through the images returned
            for (var i = url.lowerLimit; i < respGifs.length; i++) {
                //creates a new image
                var newDiv = $("<div>"),
                    newGif = $("<img>"),
                    gifStill = respGifs[i].images.fixed_width_still.url,
                    gifActive = respGifs[i].images.fixed_width.url,
                    ratingP = $("<p>"),
                    titleP = $("<p>"),
                    title = respGifs[i].title.slice(0, -4); //trims off default ' GIF' at end of every title 

                //sets attributes to the new image
                newGif.attr({
                    "src": gifStill,
                    "data-still": gifStill,
                    "data-active": gifActive,
                    "data-status": "still",
                    "class": "img-fluid animalGif"
                });

                //adds class and text to the new paragraph
                ratingP.html('Rating: <span class="gifRating">' +
                            respGifs[i].rating + "</span>");
                ratingP.addClass("gifLabel");
                titleP.text(title).addClass("gifTitle");

                //appends image and paragraph to new div
                newDiv.append(titleP, newGif, ratingP)
                newDiv.addClass("gifDiv");

                //appends the image and the paragraph to the DOM
                $elems.gifsDiv.prepend(newDiv);             
            }
        }).catch(function(error) {
            //catches the error returned by the ajax call and logs it
            console.log(`Error: ${error}`);
        });
    }

    function animateGif() {
        //gets attributes of the gif that was clicked
        var selectedGif = $(this),
            gifStatus = selectedGif.attr("data-status"),
            stillURL = selectedGif.attr("data-still"),
            activeURL = selectedGif.attr("data-active");

        //sets the image to animate or still based on current status
        if (gifStatus === "still") {
            selectedGif.attr({
                "src": activeURL,
                "data-status": "active"
            });
        } else {
            selectedGif.attr({
                "src": stillURL,
                "data-status": "still"
            });
        }
    }

    function addAnimal() {
        //prevent page from refreshing
        event.preventDefault();

        //get input field and standardize
        var newAnimal = $("#animalInput").val().trim().toLowerCase();

        //add value to array, if it hasn't been already
        if (topics.indexOf(newAnimal) === -1 && newAnimal.length() > 0) {
            topics.push(newAnimal);
        }

        //Empty input field
        $("#animalInput").val("");

        //re-create buttons array
        createBtns();
    }

    //Event delegation for buttons
    $(document).on("click", ".animalBtn", function() {
        //passes attribute value into function
        getGifs($(this).attr("data-animal"));
    });

    //Event delegation for animating gifs when clicked
    $(document).on("click", ".animalGif", animateGif);

    //Adds click handler to submit button
    $("#submitBtn").on("click", addAnimal);

    //Adds click handler to additional gifs button
    $(document).on("click", "#addBtn", function() {
        //passes attribute value into function
        additionalGifs(additionalAnimal);
    });

    //hide additional button initially
    $elems.addBtn.hide();

    //create buttons
    createBtns();
});