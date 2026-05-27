from django.db import models


class UploadedImage(models.Model):
    image = models.ImageField(upload_to='uploads/')
    original_name = models.CharField(max_length=255)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'#{self.id} {self.original_name}'


class AnalysisResult(models.Model):
    CLASSIC = 'classic'
    AI = 'ai'
    KIND_CHOICES = [(CLASSIC, 'Classic CV'), (AI, 'AI Model')]

    image = models.ForeignKey(UploadedImage, on_delete=models.CASCADE, related_name='results')
    kind = models.CharField(max_length=10, choices=KIND_CHOICES)
    algorithm = models.CharField(max_length=20)  # sift|surf|akaze|orb|vit|swin
    is_fake = models.BooleanField()
    confidence = models.FloatField()
    metrics = models.JSONField(default=dict)      # keypoint sayısı, eşleşme sayısı vb.
    output_image = models.ImageField(upload_to='results/', null=True, blank=True)
    processing_ms = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
