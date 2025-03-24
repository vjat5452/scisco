from django.urls import path
from rest_framework_simplejwt.views import (TokenObtainPairView, TokenRefreshView)
from .views import ListCreateUserView, UpdateUserView, LogoutUserView, UserProfilesView, AddFriendView, RemoveFriendView, ListFriendsView
urlpatterns = [
    path('', ListCreateUserView.as_view(), name='list_create_user'),
    path('update/', UpdateUserView.as_view(), name='update_user'),
    path('logout/',LogoutUserView.as_view(),name="logout"),
    path('login/', TokenObtainPairView.as_view(), name='login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('profiles/', UserProfilesView.as_view(), name='user_profiles'),
    path('friends/add/', AddFriendView.as_view(), name='add_friend'),
    path('friends/remove/', RemoveFriendView.as_view(), name='remove_friend'),
    path('friends/list/', ListFriendsView.as_view(), name='list_friends')
]