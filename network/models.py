from django.contrib.auth.models import AbstractUser
from django.db import models
import uuid
from datetime import datetime


class User(AbstractUser):
    pass

class Post(models.Model):
    #unique ID for each post
    id = models.UUIDField(primary_key=True, default=uuid.uuid4)
    author = models.CharField(max_length=100)
    content = models.TextField(blank=True)
    time = models.DateTimeField(default=datetime.now)
    likes = models.IntegerField(default=0)

    def __str__(self):
        return self.author
    # Convert data to native Python to easily convert to JSON
    def serialize(self):
        return {
            "author": self.author,
            "content": self.content,
            "time": self.time.strftime("%b %d %Y, %I:%M %p"),
            "likes": self.likes,
            "id": self.id
        }

class FollowersCount(models.Model):
    # Person that is following another user
    follower = models.CharField(max_length=100)
    # Person that is being followed
    user = models.CharField(max_length=100)

    def __str__(self):
        return self.user

class LikePost(models.Model):
    post_id = models.CharField(max_length=500)
    username = models.CharField(max_length=100)

    def __str__(self):
        return self.username