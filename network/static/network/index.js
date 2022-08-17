// Global state for pagination
let state = {
    "querySet": [],
    "page": 1,
    "rows": 5,
    };

/***************************************************************************************************/

document.addEventListener("DOMContentLoaded", function() {
 

    document.querySelector("#nav-network").addEventListener("click", function() {
        document.querySelector("#posts").innerHTML = "";
        load_div("network");
        fetch("/new_post")
        .then(response => response.json())
        .then(posts => {
        state.querySet = posts;
        state.page = 1;
        buildPosts();
    });
});

    document.querySelector("#nav-add-posts").addEventListener("click", function() {
        document.querySelector("#posts").innerHTML = "";
        load_div("add-post");
        fetch("/new_post")
        .then(response => response.json())
        .then(posts => {
        state.querySet = posts;
        state.page = 1;
        buildPosts();
    });
});

    document.querySelector("#nav-following").addEventListener("click", function() {
        document.querySelector("#posts").innerHTML = "";
        load_div("following");
        fetch("/following")
        .then(response => response.json())
        .then(posts => {
            state.querySet = posts;
            state.page = 1;
            buildPosts();
        });
    });

    // Send data for new post by POST method
    document.querySelector("#form-submit").addEventListener("click", function() {
        let content = document.querySelector("#form-content").value;
        fetch("/new_post", {
            method: "POST",
            body: JSON.stringify({
                content: content
            })
        })
        .then(response => response.json())
        .then(result => {    
        });
    });

    // Button disabled when textarea is blank.
    // Onkeyup-event handler, when user lift finger off of the key
    // If textarea is blank, disable button, else enable
    document.querySelector("#form-submit").disabled = true;
    document.querySelector("#form-content").onkeyup = () => {
        if (document.querySelector("#form-content").value.length > 0) {
            document.querySelector("#form-submit").disabled = false;
        } else {
            document.querySelector("#form-submit").disabled = true;
        };
    };
    
    // Default view
    load_div('network');
        fetch("/new_post")
        .then(response => response.json())
        .then(posts => {
        state.querySet = posts;
        buildPosts();
    });
});

/***************************************************************************************************/

function load_div(div) {
    if (div === "network") {
        document.querySelector("#profile-div").style.display = "none";
        document.querySelector("#post-form").style.display = "none";
        document.querySelector("#posts").style.display = "block";
        document.querySelector("h2").style.display = "block";
        document.querySelector("#h2").innerHTML = "All posts";
    } else if (div === "add-post") {
        document.querySelector("#profile-div").style.display = "none";
        document.querySelector("#posts").style.display = "block";
        document.querySelector("#post-form").style.display = "block";
        document.querySelector("h2").style.display = "block";
        document.querySelector("#h2").innerHTML = "All posts";
    } else if (div === "following") {
        document.querySelector("#posts").style.display = "block";
        document.querySelector("#profile-div").style.display = "none";
        document.querySelector("#post-form").style.display = "none";
        document.querySelector("h2").style.display = "block";
        document.querySelector("#h2").innerHTML = "Posts from users you are following";
    } else if (div === "profile") {
        document.querySelector("#posts").style.display = "block";
        document.querySelector("#profile-div").style.display = "block";
        document.querySelector("#post-form").style.display = "none";
        document.querySelector("#h2").style.display = "none";
    }
};

/***************************************************************************************************/

// Function for pagination
function pagination(querySet, page, rows) {
    // Starting and ending point of trimming data
    let trimStart = (page - 1) * rows;
    let trimEnd = trimStart + rows;

    // Trim data with start and end point
    let trimmedData = querySet.slice(trimStart, trimEnd);

    // How many pages our dataset will have  --round this up!--
    let pages = Math.ceil(querySet.length / rows);

    // Return trimmed dataset of posts with number of pages for whole dataset of posts
    return {
        "querySet": trimmedData,
        "pages": pages
        };
    };

// Function for creating page buttons 
function pageButtons(pages) {
    document.querySelector("#pagination").innerHTML = "";
    for (let page = 1; page <= pages; page++) {
        let button = document.createElement("button");
        button.innerHTML = `${page}`;
        button.setAttribute("class", "page btn btn-sm btn-info");
        button.value = `${page}`;
        button.addEventListener("click", function() {
            document.querySelector("#posts").innerHTML = "";
            state.page = this.value;
            buildPosts();
        });
    document.querySelector("#pagination").append(button);
    };
};

// Function for building posts
function buildPosts() {
    // Send current list of posts to pagination function
    let data = pagination(state.querySet, state.page, state.rows);
    // Set number of pages for current list of posts received from pagination function 
    state.pages = data.pages;
    // Take paginated list and loop through each post
    let dataSet = data.querySet;

    dataSet.forEach(function(post) {
        // Save data from post to variables
        const author = post.author;
        const content = post.content;
        const time = post.time;
        const likes = post.likes;
        const post_id = post.id;
        const loged_in = document.querySelector("#loged-in").innerHTML;

        // Create div for each post
        const element = document.createElement("div");
        element.classList.add("post-div");
        element.innerHTML =
            `<br>` +
            `${time}<br>`;
        // Content 
        const cont = document.createElement("p");
        cont.classList.add("content")
        cont.innerHTML = `${content}`
        element.insertBefore(cont, element.children[0]);
        // Likes counter
        const counter = document.createElement("p");
        counter.classList.add("like-counter");
        counter.innerHTML = `${likes}`
        element.insertBefore(counter, element.children[2]);

        // Button for like/unlike
        const like = document.createElement("a");
        like.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Pro 6.1.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M128 447.1V223.1c0-17.67-14.33-31.1-32-31.1H32c-17.67 0-32 14.33-32 31.1v223.1c0 17.67 14.33 31.1 32 31.1h64C113.7 479.1 128 465.6 128 447.1zM512 224.1c0-26.5-21.48-47.98-48-47.98h-146.5c22.77-37.91 34.52-80.88 34.52-96.02C352 56.52 333.5 32 302.5 32c-63.13 0-26.36 76.15-108.2 141.6L178 186.6C166.2 196.1 160.2 210 160.1 224c-.0234 .0234 0 0 0 0L160 384c0 15.1 7.113 29.33 19.2 38.39l34.14 25.59C241 468.8 274.7 480 309.3 480H368c26.52 0 48-21.47 48-47.98c0-3.635-.4805-7.143-1.246-10.55C434 415.2 448 397.4 448 376c0-9.148-2.697-17.61-7.139-24.88C463.1 347 480 327.5 480 304.1c0-12.5-4.893-23.78-12.72-32.32C492.2 270.1 512 249.5 512 224.1z"/></svg>';
        like.addEventListener("click", function() {
            fetch("/like_post", {
                method: "POST",
                body: JSON.stringify({
                    post_id: post_id
                })
            })
            // Check answer and increment or decrease value without refreshing the page
            .then(response => response.json())
            .then(answer => {
                const mess = answer.message
                if (mess === "-1 like") {
                    let count = counter.innerHTML;
                    count--;
                    counter.innerHTML = count;
                } else if (mess === "+1 like") {
                    let count = counter.innerHTML;
                    count++;
                    counter.innerHTML = count;
                };

            });
        });
        element.insertBefore(like, element.children[3]);

        // Link for user profile
        const profile = document.createElement("a");
        profile.innerHTML = `<b>${author}</b><br>`
        profile.classList.add("profile");
        profile.addEventListener("click", function() {
            document.querySelector("#posts").innerHTML = "";
            load_div("profile");
            fetch(`profile/${author}`)
                .then(response => response.json())
                .then(posts => {
                    console.log(posts);
                    state.querySet = posts;
                    state.page = 1;
                    buildPosts();
            });
            // Get data about followers
            fetch(`/follow/${author}`)
            .then(response => response.json())
            .then(answer => {
                const mess = answer.message;
                document.querySelector("#follow-button").innerHTML = mess;
                const followers = answer.followers;
                if (followers === 0) {
                    document.querySelector("#user_followers").innerHTML = `No one is following this user.`
                } else if (followers === 1) {
                    document.querySelector("#user_followers").innerHTML = `User has ${followers} follower.`
                } else {
                    document.querySelector("#user_followers").innerHTML = `User has ${followers} followers.`
                };
                const following = answer.following
                if (following === 0) {
                    document.querySelector("#user_following").innerHTML = `User doesn't follow anyone.`
                } else if (following === 1) {
                    document.querySelector("#user_following").innerHTML = `User follows ${following} person.`
                } else {
                    document.querySelector("#user_following").innerHTML = `User follows ${following} people.`
                };                  
            });
            // Profile user
            const prof_user = document.querySelector("#user");
            prof_user.innerHTML = `${author}`;
            // Follow button                
            if (loged_in === `${author}`) {
                document.querySelector("#follow-button").style.display = "none";
            } else {
                document.querySelector("#follow-button").style.display = "block";
                const follow = document.querySelector("#follow-button");
                    follow.addEventListener("click", function(e) {
                        e.stopImmediatePropagation();
                        profile_user = document.querySelector("#user").innerHTML;
                        fetch("/follow", {
                            method: "POST",
                            body: JSON.stringify({
                                loged_in: loged_in,
                                profile_user: profile_user
                            })
                        })
                        .then(response => response.json())
                        .then(answer => {
                            console.log(answer);
                            const mess = answer.message;
                            if (mess === "follow") {
                                let value = document.querySelector("#follow-button");
                                value.innerHTML = "Unfollow";
                            } else if (mess === "unfollow") {
                                let value = document.querySelector("#follow-button");
                                value.innerHTML = "Follow";
                            };
                            
                        });
                    });
            }
            
        });

        // Edit button
        const user = `${author}`
        if (loged_in === user) {
            const edit = document.createElement("a")
            edit.classList.add("edit-button")
            edit.innerHTML = "Edit"
            edit.addEventListener("click", function() {
                edit.style.display = "none"
                const textarea = document.createElement("textarea");
                cont.replaceWith(textarea);
                const submit = document.createElement("button")
                submit.innerHTML = "Save"
                submit.setAttribute("class", "save btn btn-sm btn-success");
                submit.addEventListener("click", function() {
                    let content = textarea.value;
                    if (content.length !== 0) {
                        fetch(`/edit_post`, {
                            method: "POST",
                            body: JSON.stringify({
                                content: content,
                                post_id: post_id
                            })
                        })
                        .then(response => response.json())
                        .then(answer => {
                            const mess = answer.message;
                            textarea.replaceWith(cont);
                            cont.innerHTML = mess;
                            submit.style.display = "none";
                            edit.style.display = "inline";
                        })};
                });
                element.insertBefore(submit, element.children[2]);
            })
            element.insertBefore(edit, element.children[4]);
        };
        element.insertBefore(profile, element.children[0]);
        document.querySelector("#posts").append(element);
    })
    pageButtons(state.pages);
};





