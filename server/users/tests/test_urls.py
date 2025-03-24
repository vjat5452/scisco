from django.test import SimpleTestCase
from django.urls import reverse, resolve
from users.views import ListCreateUserView, UpdateUserView, LogoutUserView, UserProfilesView, AddFriendView, RemoveFriendView, ListFriendsView

class TestUrls(SimpleTestCase):
    def test_list_create_user_url_is_resolved(self):
        assert 1 == 1
        url = reverse('list_create_user')
        self.assertEquals(resolve(url).func.view_class, ListCreateUserView)

    def test_update_user_url_is_resolved(self):
        url = reverse('update_user')
        self.assertEquals(resolve(url).func.view_class, UpdateUserView)

    def test_logout_user_url_is_resolved(self):
        url = reverse('logout')
        self.assertEquals(resolve(url).func.view_class, LogoutUserView)

    def test_user_profiles_url_is_resolved(self):
        url = reverse('user_profiles')
        self.assertEquals(resolve(url).func.view_class, UserProfilesView)

    def test_add_friend_url_is_resolved(self):
        url = reverse('add_friend')
        self.assertEquals(resolve(url).func.view_class, AddFriendView)

    def test_remove_friend_url_is_resolved(self):
        url = reverse('remove_friend')
        self.assertEquals(resolve(url).func.view_class, RemoveFriendView)

    def test_list_friends_url_is_resolved(self):
        url = reverse('list_friends')
        self.assertEquals(resolve(url).func.view_class, ListFriendsView)
