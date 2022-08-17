
from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("new_post", views.new_post, name="new_post"),
    path("following", views.following, name="following"),
    path("like_post", views.like_post, name="like_post"),
    path("edit_post", views.edit_post, name="edit_post"),
    path("follow/<str:pk>", views.get_follow, name="get_follow"),
    path("follow", views.follow, name="follow"),
    path("profile/<str:pk>", views.profile, name="profile"),
]
