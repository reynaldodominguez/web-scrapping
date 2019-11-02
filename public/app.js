var data;

$("#scrappingBtn").on("click", function () {
    $.getJSON("/scrape", function (res) {
        data = res;
        $("#articles").empty();
        for (var i = 0; i < res.length; i++) {
            var articleLinkDiv = $('<a href="' + res[i].link.trim() + '" class="list-group-item list-group-item-action">')
            var articleImg = $('<img src="' + res[i].img.trim() + '" width="165" height="106">"')
            var articleDiv = $('<div class="d-flex w-100 justify-content-between">')
            var articleCompleteInfo = $('<div class="articlecomplete">');
            var articleDate = $('<small id="articleDate">' + res[i].date.trim() + '</small>')
            var articleTitle = $('<h5 class="mb-1" id="articleTitle">' + res[i].title.trim() + '</h5>')
            var articleResume = $('<p class="mb-1" id="articleResume">' + res[i].resume.trim() + '</p>')
            var articleLink = $('<small id="articleLink">' + res[i].link.trim() + '</small>')
            var saveArticle = $('<button data-id="' + i + '" type="button" class="btn btn-outline-primary btn-lg saveArticleBtn">Save Article</button>')
            var divButtons = $('<div>');

            // console.log(res[i].title.trim());
            // console.log(res[i].link.trim());
            // console.log(res[i].resume.trim());
            // console.log(res[i].date.trim());

            articleDiv.append(articleTitle, articleDate);
            articleCompleteInfo.append(articleDiv, articleResume, articleLink)
            articleLinkDiv.append(articleImg, articleCompleteInfo)
            divButtons.append(saveArticle)


            $("#articles").append(articleLinkDiv, divButtons);

        }
    });
})

$("#savedArticles").on("click", function () {
    showSaved();

})

$(document).on("click", ".saveArticleBtn", function () {
    var id = $(this).attr("data-id");
    //   console.log(data[id]);
    $.ajax({
        method: "POST",
        url: "/articles",
        data: {
            title: data[id].title,
            link: data[id].link,
            date: data[id].date,
            resume: data[id].resume,
            img: data[id].img
        }
    }).then(function (data) {
        $("#modalArtSaved").text("");
        $("#saveModal").modal("show");
        var modalArtSaved = $('<p class="mb-1" id="asdddss">' + data.title + '</p>');
        $("#modalArtSaved").append(modalArtSaved);
        //console.log(data);
    });

})

$(document).on("click", ".removeArticleBtn", function () {
    var id = $(this).attr("data-id");
    $.ajax({
        method: "DELETE",
        url: "/articles/" + id,
    })
        .then(function (response) {
            showSaved();

            $("#removeModal").modal("show");
        });
})

$(document).on("click", ".addCommentBtn", function () {
    var id = $(this).attr("data-id");
    $("#saveBtn").attr("data-id", id)
    $("#commentModal").modal("show");


})

$(document).on("click", "#saveBtn", function () {

    var id = $(this).attr("data-id");
    var note = {
        author: $("#recipient-name").val().trim(),
        body: $("#message-text").val().trim()
    }

    if (note.author && note.body) {
        $.ajax({
            method: "POST",
            url: "/articles/" + id,
            data: note

        }).then(function (data) {
            console.log("Create Note " + data);
            showSaved();
            $("#recipient-name").val("");
            $("#message-text").val("");
            $("#commentModal").modal("hide");
        });
    


    } else {
        console.log("No Data");
    }

})


$(document).on("click", ".saveBtn", function () {
    $("#commentModal").modal("show");

})


function showSaved() {

    $.ajax({
        method: "GET",
        url: "/savedarticles"
    })
        .then(function (data) {
            //console.log(data);

            $("#articles").empty();
            if (data.length === 0) {
                var noSaved = $('<p id="noSaved">No saved articles</p>')
                $("#articles").append(noSaved);
            } else {
                for (var i = 0; i < data.length; i++) {
                    var articleLinkDiv = $('<a href="' + data[i].link.trim() + '" class="list-group-item list-group-item-action">')
                    var articleImg = $('<img src="' + data[i].img.trim() + '" width="165" height="106">"')
                    var articleDiv = $('<div class="d-flex w-100 justify-content-between">')
                    var articleCompleteInfo = $('<div class="articlecomplete">');
                    var articleDate = $('<small id="articleDate">' + data[i].date.trim() + '</small>')
                    var articleTitle = $('<h5 class="mb-1" id="articleTitle">' + data[i].title.trim() + '</h5>')
                    var articleResume = $('<p class="mb-1" id="articleResume">' + data[i].resume.trim() + '</p>')
                    var articleLink = $('<small id="articleLink">' + data[i].link.trim() + '</small>')
                    var removeArticle = $('<button data-id="' + data[i]._id + '" type="button" class="btn btn-outline-primary btn-lg removeArticleBtn">Remove Article</button>')
                    var addComment = $('<button data-id="' + data[i]._id + '" type="button" class="btn btn-outline-primary btn-lg addCommentBtn">Add Comment</button>')

                    var divButtons = $('<div class="btnDiv"></div>');
                    var divComments = $('<div class="divComment" data-id="' + data[i]._id + '"></div>');

                    divComments.append($('<p class="commentTitle">Comments:</p>'))
                    // console.log(data[i].title.trim());
                    // console.log(data[i].link.trim());
                    // console.log(data[i].resume.trim());
                    // console.log(data[i].date.trim());
                    $.ajax({
                        method: "GET",
                        url: "/articles/" + data[i]._id
                    })
                        .then(function (response) {
                            
                            
                            console.log(response);
                            
                            console.log(response._id);
                            if (response.note.length === 0) {
                                $(`.divComment[data-id="${response._id}"]`).append($('<p class="comments">No Comments</p>'))
                            } else {
                                
                                
                                for (var j = 0; j < response.note.length; j++) {
                                    console.log(response._id[j] );
                                    console.log(response.note[j].body, j );
                                    $(`.divComment[data-id="${response._id}"]`).append($('<p class="comments">' + response.note[j].author + '  -  ' + response.note[j].body + '</p > '))
                                }

                            }
                        })


                    articleDiv.append(articleTitle, articleDate);
                    articleCompleteInfo.append(articleDiv, articleResume, articleLink)
                    articleLinkDiv.append(articleImg, articleCompleteInfo)
                    divButtons.append(addComment, divComments, removeArticle)


                    $("#articles").append(articleLinkDiv, divButtons);
                }
            }
        })
}