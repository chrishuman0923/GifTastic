//waits till DOM is ready before running any JS
$(document).ready(function() {
    var animalsArr = ["dog", "cat", "bird", "horse", "snake", "rabbit", "wolf", "otter"],
        $buttons = $('#buttons'),
        $gifs = $('#gifs'),
        $addBtn = $("#addBtn"),
        $input = $("#animalInput"),
        url = "https://api.giphy.com/v1/gifs/search?api_key=fzMl3W1ysk8S6fEQQBU0T8uvRN7cFFf8",
        lowerLimit,
        upperLimit,
        animalRef;

    function createBtns() {
        //sorts array alphabetically
        var arrSort = animalsArr.sort();

        //empty the div
        $buttons.empty();

        //loops through the array of animals
        for (var i = 0; i < arrSort.length; i++) {
            //creates a new button
            var newBtn = $("<button>");

            //adds attributes and text to the button
            newBtn.attr({
                "data-animal": arrSort[i],
                "class": "btn btn-success animalBtn"
            }).text(arrSort[i]);

            //appends the new button to the DOM
            $buttons.append(newBtn);
        }
    }

    function getGifs(animal) {
        //prevent page from refreshing
        event.preventDefault();

        //sets original lower and upper limits for API request
        lowerLimit = 0;
        upperLimit = 10;

        //sets request URL
        var requestURL = [
                url,
                '&q=',
                animal,
                "&limit=",
                upperLimit,
            ].join("");

        //sets variable so additional gifs can be added of the same animal
        animalRef = animal;

        //Makes additional gif button visible
        $addBtn.show();

        $.ajax({
            url: requestURL,
            method: "GET"
        }).then(function(resp) {
            //empty the div
            $gifs.empty();

            var data = resp.data;

            //Loops through the images returned
            for (var i = lowerLimit; i < data.length; i++) {
                //creates a new image
                var gif = data[i],
                    div = $("<div>"),
                    img = $("<img>"),
                    p = $("<p>"),
                    rating = $("<p>"),
                    title = gif.title.slice(0, -4); //trims off ' GIF' at end of title

                //sets attributes for the new image
                img.attr({
                    "src": gif.images.fixed_width_still.url,
                    "data-still": gif.images.fixed_width_still.url,
                    "data-active": gif.images.fixed_width.url,
                    "data-status": "still",
                    "class": "img-fluid animalGif"
                });

                //adds class and text to the new paragraphs
                rating.html('Rating: <span class="gifRating">' + 
                    gif.rating + "</span>").addClass("gifLabel");

                p.text(title).addClass("gifTitle");

                //appends image and paragraph to new div
                div.append(p, img, rating).addClass("col-lg-4 col-md-6 col-sm-12 gifDiv");

                //appends the image and the paragraph to the DOM
                $gifs.append(div);              
            }
        }).catch(function(err) {
            //catches the error returned by the ajax call and logs it
            console.log('Error: ' + err);
        });
    }

    function additionalGifs(animal) {
        //sets new lower and upper limits for API request
        lowerLimit += 10;
        upperLimit += 10;

        //Sets requested URL
        var requestURL = [
                url,
                '&q=',
                animal,
                "&limit=",
                upperLimit,
            ].join("");

        $.ajax({
            url: requestURL,
            method: "GET"
        }).then(function(resp) {
            //after a successful returned response
            var data = resp.data;

            //Loops through the images returned
            for (var i = lowerLimit; i < data.length; i++) {
                //creates a new image
                var gif = data[i],
                    div = $("<div>"),
                    img = $("<img>"),
                    p = $("<p>"),
                    rating = $("<p>"),
                    title = gif.title.slice(0, -4); //trims off default ' GIF' at end of every title 

                //sets attributes for the image
                img.attr({
                    "src": gif.images.fixed_width_still.url,
                    "data-still": gif.images.fixed_width_still.url,
                    "data-active": gif.images.fixed_width.url,
                    "data-status": "still",
                    "class": "img-fluid animalGif"
                });

                //adds class and text to the new paragraph
                rating.html('Rating: <span class="gifRating">' +
                    gif.rating + "</span>").addClass("gifLabel");

                p.text(title).addClass("gifTitle");

                //appends image and paragraph to new div
                div.append(p, img, rating).addClass("col-lg-4 col-md-6 col-sm-6 gifDiv");

                //appends the image and the paragraph to the DOM
                $gifs.prepend(div);             
            }
        }).catch(function(err) {
            //catches the error returned by the ajax call and logs it
            console.log('Error: ' + err);
        });
    }

    function animateGif() {
        //gets attributes of the gif that was clicked
        var gif = $(this),
            status = gif.attr("data-status"),
            still = gif.attr("data-still"),
            animated = gif.attr("data-active");

        //sets the image to animate or still based on current status
        if (status === "still") {
            gif.attr({
                "src": animated,
                "data-status": "active"
            });
        } else {
            gif.attr({
                "src": still,
                "data-status": "still"
            });
        }
    }

    function addAnimal() {
        //prevent page from refreshing
        event.preventDefault();

        //get input field and standardize
        var newAnimal = $input.val().trim().toLowerCase();

        //add value to array, if it hasn't been already
        if (animalsArr.indexOf(newAnimal) === -1 && newAnimal.length > 0) {
            animalsArr.push(newAnimal);
        }

        //Empty input field
        $input.val("");

        //re-create buttons
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
        additionalGifs(animalRef);
    });

    //hide 'Add Gif' button initially
    $addBtn.hide();

    //create animal buttons
    createBtns();
});