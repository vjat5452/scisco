import pytest 
from django.test import TestCase
from django.urls import reverse

from rest_framework import status
from rest_framework.test import APIClient

from ..models import NewUser

class TestViews(TestCase):

    def setUp(self):
        self.client = APIClient()
        self.test_user_name = "test"
        self.test_user_email = "test@gmail.com"
        self.testUser = NewUser.objects.create_user(user_name=self.test_user_name, email=self.test_user_email, password="test")

    def test_user_list_create_get(self):
        url = "%s?user_name=%s" % (reverse('list_create_user'), "test")
        response = self.client.get(url)
        assert response.status_code == status.HTTP_200_OK
    
    def test_user_list_create_post(self):
        url = reverse('list_create_user')
        data = {
            "user_name": "test2",
            "email": "test2@gmail.com",
            "password": "test1234"
        }
        response = self.client.post(url, data, format='json')
        print(response.status_code)
        assert response.status_code == status.HTTP_201_CREATED

    def test_user_update_put(self):
        url = reverse('update_user')
        data = {
            "first_name": "test_first_name",
            "last_name": "test_last_name",
            "bio": "test bio"
        }

        self.client.force_authenticate(user=self.testUser)
        response = self.client.put(url, data, format='json')
        print(response.data)
        assert response.status_code == status.HTTP_200_OK
        assert response.data == {"user_name" : self.test_user_name, "first_name": "test_first_name",
                                 "last_name": "test_last_name",
                                 "bio": "test bio",
                                 "profile_pic" : None
                                }


    