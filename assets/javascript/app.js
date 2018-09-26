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
        .then(function(response) {
            console.log(response);

            let artistSearch = response;

            let artistCard = $(`<div class='card p-3'>`);
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
        .then(function(response) {
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
                $("#articles-div").append(articleCardBody);
                $("#articles-card").show()

            }

        }).catch(console.log);
}


$("#search-articles").on("click", function (event) {
    event.preventDefault();

    $("#articles-div").empty();

    var subject = $("#subject-input").val().trim();
    console.log(subject);

    searchNews(subject);

    $("#subject-input").val("");
});

// JS for NYTimes Article Search =======================================================================================


// JS for GIPHY API Search =============================================================================================