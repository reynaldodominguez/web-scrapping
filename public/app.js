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

            console.log(res[i].title.trim());
            console.log(res[i].link.trim());
            console.log(res[i].resume.trim());
            console.log(res[i].date.trim());

            articleDiv.append(articleTitle, articleDate);
            articleCompleteInfo.append(articleDiv, articleResume, articleLink)
            articleLinkDiv.append(articleImg, articleCompleteInfo)
            divButtons.append(saveArticle)


            $("#articles").append(articleLinkDiv, divButtons);

        }
    });
})

$("#savedArticles").on("click", function () {
    $("#articles").empty();

    // $.getJSON("/scrape", function(res) {

    //     for(var i=0; i < res.length-5;i++){
    //         var articleLinkDiv = $('<a href="' +res[i].link.trim() + '" class="list-group-item list-group-item-action">')
    //         var articleImg = $('<img src="' +res[i].img.trim() + '" width="165" height="106">"')
    //         var articleDiv = $('<div class="d-flex w-100 justify-content-between">')
    //         var articleCompleteInfo = $('<div class="col-11">');
    //         var articleDate = $('<small id="articleDate">' +res[i].date.trim() + '</small>')
    //         var articleTitle = $('<h5 class="mb-1" id="articleTitle">' +res[i].title.trim() + '</h5>')
    //         var articleResume = $('<p class="mb-1" id="articleResume">' +res[i].resume.trim() + '</p>')
    //         var articleLink = $('<small id="articleLink">' +res[i].link.trim() + '</small>')

    //         console.log(res[i].title.trim());  
    //         console.log(res[i].link.trim());  
    //         console.log(res[i].resume.trim());
    //         console.log(res[i].date.trim());  

    //         articleDiv.append(articleTitle, articleDate);
    //         articleCompleteInfo.append(articleDiv, articleResume, articleLink)
    //         articleLinkDiv.append(articleImg, articleCompleteInfo)

    //         $("#articles").append(articleLinkDiv);

    //     }
    //   });
})

$(document).on("click", ".saveArticleBtn", function () {
    var id = $(this).attr("data-id");
    console.log(data[id]);
    $.ajax({
        method: "POST",
        url: "/articles",
        data:{
            title: data[id].title,
            link: data[id].link,
            date: data[id].date,
            resume: data[id].resume,
        }
    }).then(function (data) {
        console.log(data);
    })
})