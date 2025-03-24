from django.test import SimpleTestCase
from django.urls import reverse, resolve
from api.views import PlatformView

class TestUrls(SimpleTestCase):

    def test_platform_view_url_is_resolved(self):
        url = reverse('platform_view', args=['codeforces', 'test'])
        self.assertEquals(resolve(url).func.view_class, PlatformView)