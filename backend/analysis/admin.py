from django.contrib import admin
from .models import UploadedImage, AnalysisResult

admin.site.register(UploadedImage)
admin.site.register(AnalysisResult)
