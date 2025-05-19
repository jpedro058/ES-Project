import boto3
from django.conf import settings

# Inicializar cliente Rekognition
rekognition = boto3.client(
    'rekognition',
    region_name='us-east-1'
)

s3 = boto3.resource(
    's3',
    region_name='us-east-1'
)

COLLECTION_ID = 'primetech-users'

def create_collection():
    try:
        response = rekognition.create_collection(CollectionId=COLLECTION_ID)
        print("Collection created:", response)
    except rekognition.exceptions.ResourceAlreadyExistsException:
        print(f"Collection '{COLLECTION_ID}' already exists.")
    except Exception as e:
        print("Error creating collection:", e)

def index_face(bucket_name, image_key):
    try:
        # Remove o prefixo "toindex/" ou "todetect/" do ExternalImageId
        external_image_id = image_key.split('/')[-1]  # Pega apenas o nome do arquivo
        
        response = rekognition.index_faces(
            CollectionId=COLLECTION_ID,
            Image={'S3Object': {'Bucket': bucket_name, 'Name': image_key}},
            ExternalImageId=external_image_id,  # Agora só tem o nome do arquivo (ex: "andy_portrait_resized.jpg")
            DetectionAttributes=['DEFAULT']
        )
        return response
    except Exception as e:
        raise Exception(f"Erro ao indexar rosto: {e}")
    
def search_face(bucket_name, image_key):
    response = rekognition.search_faces_by_image(
        CollectionId=COLLECTION_ID,
        Image={
            'S3Object': {
                'Bucket': bucket_name,
                'Name': image_key,
            }
        },
        MaxFaces=123,
    )
    return response