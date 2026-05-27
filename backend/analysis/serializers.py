from rest_framework import serializers
from .models import UploadedImage, AnalysisResult


class UploadedImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = UploadedImage
        fields = ['id', 'image', 'original_name', 'uploaded_at']
        read_only_fields = ['id', 'original_name', 'uploaded_at']

    def create(self, validated_data):
        file = validated_data['image']
        return UploadedImage.objects.create(
            image=file,
            original_name=file.name,
        )


class AnalysisResultSerializer(serializers.ModelSerializer):
    class Meta:
        model = AnalysisResult
        fields = [
            'id', 'image', 'kind', 'algorithm', 'is_fake', 'confidence',
            'metrics', 'output_image', 'processing_ms', 'created_at',
        ]
        read_only_fields = fields


class ClassicAnalyzeRequestSerializer(serializers.Serializer):
    image_id = serializers.IntegerField()
    algorithm = serializers.ChoiceField(choices=['sift', 'surf', 'akaze', 'orb'])


class AIAnalyzeRequestSerializer(serializers.Serializer):
    image_id = serializers.IntegerField()
    model = serializers.ChoiceField(choices=['vit', 'swin'])
