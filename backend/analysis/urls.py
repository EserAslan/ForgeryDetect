from django.urls import path
from . import views

urlpatterns = [
    path('images/', views.upload_image, name='upload-image'),
    path('images/<int:image_id>/', views.image_detail, name='image-detail'),
    path('analyze/classic/', views.analyze_classic, name='analyze-classic'),
    path('analyze/ai/', views.analyze_ai, name='analyze-ai'),
    path('analyze/results/<int:image_id>/', views.list_results, name='list-results'),
]
