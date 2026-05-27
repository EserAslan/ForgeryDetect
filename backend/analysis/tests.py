from django.test import TestCase
from django.core.files.uploadedfile import SimpleUploadedFile
from rest_framework.test import APIClient
from PIL import Image
import io

from .models import UploadedImage


def make_test_image_bytes():
    buf = io.BytesIO()
    Image.new('RGB', (256, 256), 'gray').save(buf, format='JPEG')
    return buf.getvalue()


class UploadFlowTests(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_upload_image(self):
        img = SimpleUploadedFile('test.jpg', make_test_image_bytes(), content_type='image/jpeg')
        response = self.client.post('/api/images/', {'image': img}, format='multipart')
        self.assertEqual(response.status_code, 201)
        self.assertIn('id', response.json())
        self.assertEqual(UploadedImage.objects.count(), 1)

    def test_classic_analyze_sift(self):
        img = SimpleUploadedFile('test.jpg', make_test_image_bytes(), content_type='image/jpeg')
        upload = self.client.post('/api/images/', {'image': img}, format='multipart').json()
        response = self.client.post(
            '/api/analyze/classic/',
            {'image_id': upload['id'], 'algorithm': 'sift'},
            format='json',
        )
        self.assertEqual(response.status_code, 201)
        data = response.json()
        self.assertEqual(data['algorithm'], 'sift')
        self.assertIn('keypoints', data['metrics'])
