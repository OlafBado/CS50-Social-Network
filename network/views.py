import json
from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse
from django.http import JsonResponse
from itertools import chain


from .models import User, Post, FollowersCount, LikePost


def index(request):

    if request.user.is_authenticated:

        return render(request, "network/index.html")
    else:
        return HttpResponseRedirect(reverse("login"))


def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "network/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "network/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "network/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "network/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "network/register.html")

def new_post(request):
    
    # Get all posts
    if request.method == "GET":
        posts = Post.objects.all()
        # Return posts in chronological order
        posts = posts.order_by("-time").all()
        return JsonResponse([post.serialize() for post in posts], safe=False)
    
    if request.method == "POST":
        # Get data
        data = json.loads(request.body)
        content = data.get("content")

        # Create post
        post = Post(author=request.user, content=content)
        post.save()
        return JsonResponse({"message": "Post submitted successfully."}, status=201)

def following(request):

    # List for all the users, that logged in user is following
    user_following_list = []
    # All posts from users, that logged in user is following
    feed = []
    
    user_following = FollowersCount.objects.filter(follower=request.user.username)

    # Append the names of the users the loged in user is following
    for users in user_following:
        user_following_list.append(users.user)
            
    for usernames in user_following_list:
        feed_lists = Post.objects.filter(author=usernames)
        feed.append(feed_lists)

    # Convert query set to the list
    feed_list = list(chain(*feed))
    return JsonResponse([post.serialize() for post in feed_list], safe=False)

def like_post(request):

    username = request.user.username
    data = json.loads(request.body)
    post_id = data.get("post_id")
    
    # Get object of particular post
    post = Post.objects.get(id=post_id)

    # Check if user like post already
    like_filter = LikePost.objects.filter(post_id=post_id, username=username).first()
    if like_filter == None:
        # If not, create new LikePost object and increment likes value of particular post
        new_like = LikePost.objects.create(post_id=post_id, username=username)
        new_like.save()
        post.likes = post.likes+1
        post.save()
        return JsonResponse({"message": "+1 like"})
    else:
        # If yes, delete object and decrease value of likes by 1 
        like_filter.delete()
        post.likes = post.likes-1
        post.save()
        return JsonResponse({"message": "-1 like"})

def edit_post(request):
    
    if request.method == "POST":
        
        data = json.loads(request.body)
        post_id = data.get("post_id")
        content = data.get("content")
        post = Post.objects.get(id=post_id)
        if content is not None:
            post.content = content
            post.save()
            return JsonResponse({"message": content}, status=201)

def get_follow(request, pk):

    if request.method == "GET":
        follower = request.user.username
        user = pk
        # How many followers the user of the profile has
        followers = len(FollowersCount.objects.filter(user=user))
        # How many people the user follows
        following = len(FollowersCount.objects.filter(follower=user))
        if FollowersCount.objects.filter(follower=follower, user=user).first():
            return JsonResponse({"message": "Unfollow",
                                    "followers": followers,
                                        "following": following}, status=201)
        else:
            return JsonResponse({"message": "Follow",
                                    "followers": followers,
                                        "following": following}, status=201)

def follow(request):

    if request.method == "POST":
        # Save data from request
        data = json.loads(request.body)
        follower = data.get("loged_in")
        user = data.get("profile_user")
        # If object exists, delete and send message, if object doesn't exist create one and send message 
        if FollowersCount.objects.filter(follower=follower, user=user).first():
            delete_follower = FollowersCount.objects.get(follower=follower, user=user)
            delete_follower.delete()
            return JsonResponse({"message": "unfollow"}, status=201)
            
        else:
            new_follower = FollowersCount.objects.create(follower=follower, user=user)
            new_follower.save()
            return JsonResponse({"message": "follow"}, status=201)

def profile(request, pk):

    user_object = User.objects.get(username=pk)
    user_posts = Post.objects.filter(author=pk)
    return JsonResponse([post.serialize() for post in user_posts], safe=False)