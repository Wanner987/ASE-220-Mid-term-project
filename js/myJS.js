let data = { "articles": [], "users": []};
const jsonBlobUrl = "https://jsonblob.com/api/1346852405614141440"; 
var user = null;

function loadArticles(contentLocation) {
    $(contentLocation).empty();

    data.articles.forEach(function(article) {
      const articleHtml = `
        <div class="blog-post-container grid-layout">
                <div class="blog-post-inner blog-post" data-id="${article.id}">
                    <div class="blog-post-image">
                        <a href="#"><img src="${article.image}"></a>                                                
                    </div>
                    <div class="blog-post-detail">
                        <h2 class="entry-title">
                            <a href="${article.url}" target="_blank">${article.title}</a>
                        </h2>
                        <div class="post-meta">
                            <ul>
                                <li class="entry-date published likeCount">Likes: <span>${article.likes}</span></li>
                                <li class="entry-date published">Posted Date: ${article.created}</li>
                                <li class="entry-date published">Posted by: ${article.created_by}</li>
                            </ul>
                        </div>
                        <div class="post-comments">
                            <ul>Comments:
                                ${article.comments.map(comment => `<li class="comment">${comment}</li>`).join('')}
                            </ul>
                        </div>
                        <input type="text" class="commentInput" placeholder="Write a comment...">
                        <button class="btn btn-light likeButton">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-hand-thumbs-up-fill" viewBox="0 0 16 16">
                                <path d="M6.956 1.745C7.021.81 7.908.087 8.864.325l.261.066c.463.116.874.456 1.012.965.22.816.533 2.511.062 4.51a10 10 0 0 1 .443-.051c.713-.065 1.669-.072 2.516.21.518.173.994.681 1.2 1.273.184.532.16 1.162-.234 1.733q.086.18.138.363c.077.27.113.567.113.856s-.036.586-.113.856c-.039.135-.09.273-.16.404.169.387.107.819-.003 1.148a3.2 3.2 0 0 1-.488.901c.054.152.076.312.076.465 0 .305-.089.625-.253.912C13.1 15.522 12.437 16 11.5 16H8c-.605 0-1.07-.081-1.466-.218a4.8 4.8 0 0 1-.97-.484l-.048-.03c-.504-.307-.999-.609-2.068-.722C2.682 14.464 2 13.846 2 13V9c0-.85.685-1.432 1.357-1.615.849-.232 1.574-.787 2.132-1.41.56-.627.914-1.28 1.039-1.639.199-.575.356-1.539.428-2.59z"/>
                            </svg>
                        </button>
                        <button class="btn btn-light comment-post-btn">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-envelope-fill" viewBox="0 0 16 16">
                                <path d="M.05 3.555A2 2 0 0 1 2 2h12a2 2 0 0 1 1.95 1.555L8 8.414zM0 4.697v7.104l5.803-3.558zM6.761 8.83l-6.57 4.027A2 2 0 0 0 2 14h12a2 2 0 0 0 1.808-1.144l-6.57-4.027L8 9.586zm3.436-.586L16 11.801V4.697z"/>
                            </svg>
                        </button>
                        <button class="btn btn-light delete-post-btn">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                                <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
      `;
      $(contentLocation).append(articleHtml);
    });
}

//grabs Data from JSON
function loadData(contentLocation) {
    $.ajax({
        url: jsonBlobUrl,
        type: 'GET',
        success: function(response) {
        data = response;
        loadArticles(contentLocation);
        findMostLikedArticle();
        },
        error: function(xhr, status, error) {
        console.error('Error loading data:', error);
        }
    });
}

function updateJSONBlob() {
    $.ajax({
      url: jsonBlobUrl,
      type: 'PUT',
      contentType: 'application/json',
      data: JSON.stringify(data),
      success: function(response) {
        console.log('Data successfully updated!');
      },
      error: function(xhr, status, error) {
        console.error('Error updating data:', error);
      }
    });
}


$("#submitArticle").click(function () {
    if (!currentUser) {
        alert("You must be logged in to add an article.");
        return;
    }

    const newArticle = {
        id: data.articles.length + 1,
        title: $("#articleTitle").val(),
        url: $("#articleUrl").val(),
        image: $("#articleImage").val(),
        short_description: $("#articleDescription").val(),
        created: new Date().toLocaleDateString(),
        created_by: currentUser.Username,
        comments: [],
        likes: 0
    };

    data.articles.push(newArticle);
    updateJSONBlob();
    loadData('#main-scrolling-content');
    alert("Article added successfully!");

    $("#newPostModal").modal("hide");
    $("#addArticleForm")[0].reset();
});

function updateLikeCount(articleId) {
    const article = data.articles.find(a => a.id === articleId);
    if (article) {
      $(`.article[data-id="${articleId}"] .likeCount`).text(article.likes);
    }
}

$(document).on('click', '.likeButton', function() {
    const articleId = $(this).closest('.blog-post').data('id');
    const article = data.articles.find(a => a.id === articleId);
    
    if (article) {
        article.likes++;
        $(this).siblings('.post-meta').find('.likeCount span').text(article.likes);
        updateJSONBlob();
        findMostLikedArticle()
    }
});

$(document).on('click', '.comment-post-btn', function() {
    const articleId = $(this).closest('.blog-post').data('id');
    const commentInput = $(this).siblings('.commentInput');
    const commentText = commentInput.val().trim();

    if (commentText) {
        const article = data.articles.find(a => a.id === articleId);
        if (article) {
            article.comments.push(commentText);
            $(this).siblings('.post-comments').find('ul').append(`<li>${commentText}</li>`);
            updateJSONBlob();
            loadData('#main-scrolling-content');
            commentInput.val('');
        }
    }
});


$(document).on("click", ".delete-post-btn", function () {
    if (!currentUser) {
        alert("You must be logged in to delete posts!");
        return;
    }

    const articleId = $(this).closest(".blog-post-container").find(".blog-post").data("id");
    const article = data.articles.find(a => a.id === articleId);

    if (article && article.created_by !== currentUser.Username) {
        alert("You can only delete your own posts!");
        return;
    }

    data.articles = data.articles.filter(a => a.id !== articleId);
    updateJSONBlob();
    loadData('#main-scrolling-content');
});



$("#register").submit(function (event) {
    event.preventDefault();

    const newUser = {
        firstName: $("#fName").val().trim(),
        lastName: $("#lName").val().trim(),
        Username: $("#rusername").val().trim(),
        password: $("#rpassword").val().trim()
    };

    data.users.push(newUser);
    updateJSONBlob();

    $("#register").modal("hide");
    
    const user = data.users.find(u => u.Username === username && u.password === password);

    if (user) {
        currentUser = user;
        alert(`Welcome, ${user.firstName}!`);
        $("#login").modal("hide");
    } else {
        alert("Invalid credentials! Try again.");
    }
});


$("#login").submit(function (event) {
    event.preventDefault();

    const username = $("#username").val().trim();
    const password = $("#password").val().trim();
    
    const user = data.users.find(u => u.Username === username && u.password === password);

    if (user) {
        currentUser = user;
        alert(`Welcome, ${user.firstName}!`);
        $("#login").modal("hide");
        $("#Logout").toggle();
    } else {
        alert("Invalid credentials! Try again.");
    }
});

function findMostLikedArticle(){
    var mostLikes = 0;
    let articlesHtml = ``;
    $("#right-aside-content").empty();
    

    const topArticles = data.articles
        .sort((a, b) => b.likes - a.likes)
        .slice(0, 3);
    
    topArticles.forEach(article => {
        articlesHtml += `
        <div class="blog-post-container grid-layout">
            <div class="blog-post-inner blog-post" data-id="${article.id}">
                <div class="blog-post-image">
                    <a href="#"><img src="${article.image}"></a>                                                
                </div>
                <div class="blog-post-detail">
                    <h2 class="entry-title">
                        <a href="${article.url}" target="_blank">${article.title}</a>
                    </h2>
                    <div class="post-meta">
                        <p>${article.short_description}</p>
                    </div>
                    <div class="post-meta">
                        <ul>
                            <li class="entry-date published likeCount">Likes: <span>${article.likes}</span></li>
                            <li class="entry-date published">Posted Date: ${article.created}</li>
                            <li class="entry-date published">Posted by: ${article.created_by}</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
  `;
    });
  $("#right-aside-content").append(articlesHtml);

    
    
}

$(document).ready(function() {
    loadData('#main-scrolling-content');
    $('.login-button').on('click', () => $('#login').modal('show'));
    findMostLikedArticle();
});

