import boto3
from django.conf import settings

# Inicializar cliente Rekognition
rekognition = boto3.client(
    'rekognition',
    region_name='us-east-1',
    aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
    aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
    aws_session_token=settings.AWS_SESSION_TOKEN  # se necessário
)

s3 = boto3.resource(
    's3',
    region_name='us-east-1',
    aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
    aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
    aws_session_token=settings.AWS_SESSION_TOKEN
)

COLLECTION_ID = 'primetech-users'

def index_face(bucket_name, image_key):
    response = rekognition.index_faces(
        CollectionId=COLLECTION_ID,
        Image={
            'S3Object': {
                'Bucket': bucket_name,
                'Name': image_key,
            }
        },
        ExternalImageId=image_key,
        DetectionAttributes=['DEFAULT']
    )
    return response

def search_face(bucket_name, image_key):
    response = rekognition.search_faces_by_image(
        CollectionId=COLLECTION_ID,
        Image={
            'S3Object': {
                'Bucket': bucket_name,
                'Name': image_key,
            }
        },
        MaxFaces=1,
        FaceMatchThreshold=85
    )
    return response