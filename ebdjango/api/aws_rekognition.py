import boto3
from django.conf import settings

# Inicializar cliente Rekognition
rekognition = boto3.client(
    'rekognition'
)

s3 = boto3.client(
    's3'
)

COLLECTION_ID = 'primetech-users'

def create_collection():
    try:
        rekognition.create_collection(CollectionId=COLLECTION_ID)
        print(f"Collection '{COLLECTION_ID}' created.")
    except rekognition.exceptions.ResourceAlreadyExistsException:
        print(f"Collection '{COLLECTION_ID}' already exists.")
        
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