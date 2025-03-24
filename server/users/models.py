from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager

class CustomUserManager(BaseUserManager):    
    def create_user(self, user_name, email, password, **other_fields):
        if not user_name:
            raise ValueError('Users must have a username')
        if not email:
            raise ValueError('Users must have an email')
        
        email = self.normalize_email(email)

        user = self.model(email=email, user_name=user_name, **other_fields)
        user.set_password(password)

        user.save()
        return user 

class NewUser(AbstractBaseUser):
    user_name = models.CharField(max_length=50, unique=True)
    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=50, blank=True)
    last_name = models.CharField(max_length=50, blank=True)
    provider = models.CharField(max_length=50, blank=True)
    bio = models.TextField(max_length=200, blank=True)
    profile_pic = models.ImageField(upload_to='profile_pics', blank=True)

    friends = models.ManyToManyField('self', blank=True)

    objects = CustomUserManager()

    USERNAME_FIELD = 'user_name'
    REQUIRED_FIELDS = ['email']

    def __str__(self):
        return self.user_name 

class UserProfiles(models.Model):
    user = models.OneToOneField(NewUser, on_delete=models.CASCADE)

    codeforces = models.CharField(max_length=150, blank=True)
    codechef = models.CharField(max_length=150, blank=True)
    leetcode = models.CharField(max_length=150, blank=True)
    atcoder = models.CharField(max_length=150, blank=True)

    github = models.CharField(max_length=150, blank=True)
    linkedin = models.CharField(max_length=150, blank=True)
    website = models.CharField(max_length=150, blank=True)

    def __str__(self):
        return self.user.user_name
