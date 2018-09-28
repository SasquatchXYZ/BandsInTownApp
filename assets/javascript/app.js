function searchBandsInTown(artist) {

    let apiKey = '';
    let queryURL = `https://rest.bandsintown.com/artists/${artist}?app_id=${apiKey}`;
    // Add code to query the bands in town api searching for the artist received as an argument to this function
    // Using jQuery, append the following to the #artist-div :
    // The artist's name
    // The artists thumbnail image
    // The number of fans tracking this artist
    // The number of upcoming events for this artist
    // A link to the bandsintown url for this artist
    // Note: Append actual HTML elements, not just text
    $.ajax({
        url: queryURL,
        method: "GET"
    })
        .then(function (response) {
            console.log(response);

            let artistSearch = response;

            let artistCard = $(`<div class='card'>`);
            let artistImage = $(`<img class='card-img-top' src=${artistSearch.thumb_url} alt=${artistSearch.name}>`);
            let artistCardBody = $(`<div class='card-body'>
                                    <h5 class="card-title">${artistSearch.name}</h5>
                                    <p class="card-text">Fans Tracking: ${artistSearch.tracker_count}</p>
                                    <p class="card-text">Upcoming Events: ${artistSearch.upcoming_event_count}</p>
                                    </div>`);
            let artistCardFooter = $(`<div class='card-footer'>
                                        <a href="${artistSearch.url}" target="_blank">${artistSearch.name}</a>
                                    </div>`);

            artistCard.append(artistImage, artistCardBody, artistCardFooter);

            $("#artist-div").append(artistCard);


        }).catch(console.log);
}

// Event handler for user clicking the select-artist button
$("#select-artist").on("click", function (event) {
    // Preventing the button from trying to submit the form
    event.preventDefault();
    // Storing the artist name
    var artist = $("#artist-input").val().trim();
    console.log(artist);
    // Running the searchBandsInTown function(passing in the artist as an argument)
    searchBandsInTown(artist);

    $("#artist-input").val("");
});

// JS for News API Search ==============================================================================================
function searchNews(subject) {

    let apiKey = '';
    let queryURL = `https://newsapi.org/v2/sources?language=en&category=${subject}&apiKey=${apiKey}`;

    $.ajax({
        url: queryURL,
        method: "GET"
    })
        .then(function (response) {
            console.log(response);

            let articleSearch = response.sources;
            for (var n = 0; n < articleSearch.length; n++) {

                let article = response.sources[n];
                let articleCardBody = $(`<div class='card-body'>
                                    <h5 class="card-title">${n + 1}.) ${article.name}</h5>
                                    <p class="card-text">${article.description}</p>
                                    <p class='card-text'>
                                        <a href="${article.url}" target="_blank">${article.name}</a>
                                    </p>
                                    </div>`);
                $("#articles-card").show()
                $("#news-articles-div").append(articleCardBody);

            }

        }).catch(console.log);
}


$("#search-newsapi").on("click", function (event) {
    event.preventDefault();

    $("#news-articles-div").empty();

    var subject = $("#subject-input").val().trim();
    if (subject === "") {
    } else{
        console.log(subject);

        searchNews(subject);

        $("#subject-input").val("");
    }

});

// JS for NYTimes Article Search =======================================================================================
function makeNYTQueryURL() {

    let queryURL = "https://api.nytimes.com/svc/search/vs/articlesearch.json?";
    let queryOptions = {'api-key': "1ec31beb44ea4bb8bfa0da466d0ac6e1"};

    queryOptions.q = $("#search-term-nytimes").val().trim();

    let start_year = $("#start-year-nytimes").val().trim();
    queryOptions.begin_date = moment(start_year).format("YYYYMMDD");

    let end_year = $("#end-year-nytimes").val().trim();
    queryOptions.end_date = moment(end_year).format("YYYYMMDD");
    console.log(queryOptions);

    console.log(queryURL + $.param(queryOptions));

    return queryURL + $.param(queryOptions);
}

function displayNYTResults(NYTResponse) {
    console.log(NYTResponse);

    let numArticles = $("#record-num-nytimes").val();

    for (var h = 0; h < numArticles; h++) {
        let article = NYTResponse.response.docs[h];

        let articleDisplayNumber = h + 1;

        let articleCardBody = $(`<div class='card-body'>`);

        let articleHeadline = article.headline;
        if (articleHeadline && articleHeadline.main) {
            articleCardBody.append($(`<h5 class='card-title'>${articleDisplayNumber}.) ${articleHeadline.main}</h5>`))
        }

        let articleByline = article.byline;
        if (articleByline && articleByline.original) {
            articleCardBody.append($(`<p class='card-text'>${articleByline.original}</p>`))
        }

        let articleSection = article.section_name;
        if (articleSection) {
            articleCardBody.append($(`<p class='card-text'>${articleSection}</p>`))
        }

        let articleDate = moment(article.pub_date).format("MM-DD-YYYY");
        if (articleDate) {
            articleCardBody.append($(`<p class='card-text'><small class='text-muted'>${articleDate}</small></p>`))
        }

        articleCardBody.append($(`<a href='${article.web - url}' target='_blank' class='card-link'>Article Link</a>`))

        $("#nytimes-articles-div").append(articleCardBody);
        $("#nytimes-articles-card").show()

    }
}

function clearNYTResults() {
    $("#nytimes-articles-div").empty();
    $("#nytimes-articles-card").hide();
}

$("#search-nytimes").on("click", function (event) {
    event.preventDefault();

    clearNYTResults();

    var queryURL = makeNYTQueryURL();
    console.log(queryURL);

    $.ajax({
        url: queryURL,
        method: "GET",
    }).then(displayNYTResults).catch(console.log);

});

$("#clear-nytimes").on("click", clearNYTResults);

// JS for GIPHY API Search =============================================================================================
let topicBtns = ["dog", "cat", "rabbit", "hamster", "skunk", "goldfish", "bird", "ferret", "turtle",
    "sugar glider", "chinchilla", "hedgehog", "hermit crab", "gerbil", "pygmy goat", "chicken", "capybara",
    "teacup pig", "serval", "ostrich", "salamander", "frog"];

let offsetNum = 0;

function renderButtons() {
    $("#button_container").empty()
        .html(
            topicBtns.map(function (topic) {
                return `<button type='button' class='btn btn-outline-success' id='topic-btn' 
                            data-topic=${topic} style="margin: 2px">${topic}</button>`
            })
                .join(``)
        )
}

function queryGiphy(topic) {

    let apiKey = '';
    let queryOffset = `&offset=${offsetNum}`;
    let queryURL = `https://api.giphy.com/v1/gifs/search?q=${topic}&api_key=${apiKey}&limit=10${queryOffset}`;

    $.ajax({
        url: queryURL,
        method: "GET"
    })
        .then(function(response) {
            let giffs = response.data;
            console.log(response.data);

            for (var m = 0; m < giffs.length; m++) {
                let gifCard = $(`<div class='card bg-dark text-white' id="gif-card"
                                style="height: ${giffs[m].images.fixed_height_still.height}px; width: ${giffs[m].images.fixed_height_still.width}px">`);

                let gifImage = $(`<img class='card-img'>`)
                    .attr("src", giffs[m].images.fixed_height_still.url)
                    .attr("height", giffs[m].images.fixed_height_still.height + "px")
                    .attr("width", giffs[m].images.fixed_height_still.width + "px")
                    .attr("data-still", giffs[m].images.fixed_height_still.url)
                    .attr("data-animate", giffs[m].images.fixed_height.url)
                    .attr("data-state", 'still')
                    .attr("id", 'gif');

                gifCard.append(gifImage);

                let rating = giffs[m].rating.toUpperCase();

                let p = $(`<div class="card-img-overlay"><p class='card-title'>Rating: ${rating}</p></div>`);

                let favBtn = $(`<button type='button' class='btn btn-outline-light btn-sm'>&#x2661</button>`)
                    .attr("data-fav", giffs[m].images.fixed_width.url)
                    .attr("data-fav-full", giffs[m].images.original.url)
                    .attr("data-object", giffs[m]);

                p.append(favBtn);
                gifCard.append(p);

                $("#gif_container").append(gifCard);
            }

        }).catch(console.log);

    $("#more-button").append($(`<button type='button' class='btn btn-warning btn-lg' id='show-more' 
                                data-topic=${topic} style="margin: 10px">Show More</button>`));
    offsetNum+=10;

}

$(document).on("click", "#topic-btn", function() {
    offsetNum = 0;
    $("#gif_container, #more-button").empty();

    let chosenTopic = $(this).attr('data-topic');
    queryGiphy(chosenTopic);

})
    .on("mouseover", ".card-img-overlay", function() {
        let testImage = $(this).siblings("img");
        console.log(testImage);
        const state = testImage.attr("data-state");

        if (state === 'animate') {
            const url = testImage.attr("data-still");
            testImage.attr("data-state", 'still');
            testImage.attr("src", url);
        } else {
            const url = testImage.attr("data-animate");
            testImage.attr("data-state", 'animate');
            testImage.attr("src", url);
        }
    })
    .on("click", "#show-more", function() {
        var chosenTopic = $(this).attr("data-topic");
        this.remove();
        queryGiphy(chosenTopic);
    })

$("#button_container").ready(function () {

    $("#add-gif-btn").on("click", function(event) {
        event.preventDefault();

        const newTopic = $("#giphy-input").val().trim();
        console.log(newTopic);
        if (newTopic === "") {
        } else {
            topicBtns.push(newTopic);
            $("#giphy-input").val("")
        }
        renderButtons();
    });
    renderButtons();
});