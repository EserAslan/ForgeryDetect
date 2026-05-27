import io
import cv2
from django.core.files.base import ContentFile
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.decorators import api_view, parser_classes
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.response import Response

from .models import UploadedImage, AnalysisResult
from .serializers import (
    UploadedImageSerializer,
    AnalysisResultSerializer,
    ClassicAnalyzeRequestSerializer,
    AIAnalyzeRequestSerializer,
)
from .services import classic, ai


@api_view(['POST'])
@parser_classes([MultiPartParser, FormParser])
def upload_image(request):
    serializer = UploadedImageSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    instance = serializer.save()
    return Response(UploadedImageSerializer(instance).data, status=status.HTTP_201_CREATED)


@api_view(['GET'])
def image_detail(request, image_id):
    instance = get_object_or_404(UploadedImage, pk=image_id)
    return Response(UploadedImageSerializer(instance).data)


@api_view(['POST'])
@parser_classes([JSONParser])
def analyze_classic(request):
    req = ClassicAnalyzeRequestSerializer(data=request.data)
    req.is_valid(raise_exception=True)
    image = get_object_or_404(UploadedImage, pk=req.validated_data['image_id'])
    algorithm = req.validated_data['algorithm']

    try:
        result = classic.detect_copy_move(image.image.path, algorithm)
    except ValueError as e:
        return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    # Çıktı görüntüsünü kaydet
    ok, buf = cv2.imencode('.jpg', result['output_image_bgr'])
    output_file = ContentFile(buf.tobytes(), name=f'{image.id}_{algorithm}.jpg') if ok else None

    obj = AnalysisResult.objects.create(
        image=image,
        kind=AnalysisResult.CLASSIC,
        algorithm=algorithm,
        is_fake=result['is_fake'],
        confidence=result['confidence'],
        metrics=result['metrics'],
        processing_ms=result['processing_ms'],
        output_image=output_file,
    )
    return Response(AnalysisResultSerializer(obj).data, status=status.HTTP_201_CREATED)


@api_view(['POST'])
@parser_classes([JSONParser])
def analyze_ai(request):
    req = AIAnalyzeRequestSerializer(data=request.data)
    req.is_valid(raise_exception=True)
    image = get_object_or_404(UploadedImage, pk=req.validated_data['image_id'])
    model_name = req.validated_data['model']

    try:
        result = ai.classify(image.image.path, model_name)
    except FileNotFoundError as e:
        return Response({'detail': str(e)}, status=status.HTTP_503_SERVICE_UNAVAILABLE)
    except ValueError as e:
        return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    obj = AnalysisResult.objects.create(
        image=image,
        kind=AnalysisResult.AI,
        algorithm=model_name,
        is_fake=result['is_fake'],
        confidence=result['confidence'],
        metrics=result['metrics'],
        processing_ms=result['processing_ms'],
    )
    return Response(AnalysisResultSerializer(obj).data, status=status.HTTP_201_CREATED)


@api_view(['GET'])
def list_results(request, image_id):
    image = get_object_or_404(UploadedImage, pk=image_id)
    qs = image.results.all()
    return Response(AnalysisResultSerializer(qs, many=True).data)
