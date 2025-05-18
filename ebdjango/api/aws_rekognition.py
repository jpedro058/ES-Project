import boto3
from django.conf import settings

rekognition = boto3.client('rekognition', region_name='us-east-1')
s3 = boto3.resource('s3', region_name='us-east-1')

COLLECTION_ID = 'primetech-users'

s3 = boto3.resource(
    's3',
    aws_access_key_id='ASIA6PMWI3BIQUYKQMEI',
    aws_secret_access_key='FdDe4Qa7Y1bOXMicVM2NkvepXTi+jQhAPBPjHvQD',
    aws_session_token='IQoJb3JpZ2luX2VjEMH//////////wEaCXVzLXdlc3QtMiJHMEUCIQDcKV9uz7Ly83jsVLGLD0AFTIZH03hcFlUrrnOpVMq1IgIgPKd74Cvs6FCG8hGpAKa4yDv+TzaBbd+TJgDX4ZhZOsgqtAIIehAAGgw5OTUxMzY5NTI0MDEiDPTnn/UklPHRS8L5mCqRAjYcSC3Lu2SV0rlmyoMh2GmXktaNsAxAyd5r5U2bLisqQeug3E0aiUh4fI5pBNHV27rTkaDYC6HPdJ6gtrP1s4fkeyxrJvqL6K/QaHxXtOoWzX7zoft2clMXt93eEslztBR897iqu99WZ9udlGcP+y+s0ytFjqLGJVapxLlCTZ4QEDpAPULQ9i32wiFL7AMo8dZk0AyAf2LyvsptA0t5BrdAcJL//kxazHb4HKizrDtD4tL6Zg/K8IAS22EmQh51H73OQbTGtOzPb4Q8WnoP15eBFFoW8ulZ6x57cE1kontnJMJqIVt3x5zD33dJdEXx16OP8Augd5lgLohzVYECSwYRdHi/f9Eeo9ICOEitlae99DDjl6jBBjqdAZLK+yWecqtbejMNi64NdetfD4VeCXKpoBXOlcbuhrQDyfY4giWeBFXEY8Sg4A7lCRH3GEBfDGfHin/yhD44hAPmgPkA0nYHQaS3b+iW1Fy3XGn09jIL6F37mXGL6gQLwVOhEiz3lC6ZtxcoxkMxQyjhOCitBRqJbnH2VBK5j9WX/10C4tXIjBKokgrMqfQ57y582mPs9/FS+reWV4M=',
)

def create_collection():
    try:
        response = rekognition.create_collection(CollectionId=COLLECTION_ID)
        print("Collection created:", response)
    except rekognition.exceptions.ResourceAlreadyExistsException:
        print(f"Collection '{COLLECTION_ID}' already exists.")
    except Exception as e:
        print("Error creating collection:", e)

def create_collection():
    try:
        response = rekognition.create_collection(CollectionId=COLLECTION_ID)
        print("Collection created:", response)
    except rekognition.exceptions.ResourceAlreadyExistsException:
        print(f"Collection '{COLLECTION_ID}' already exists.")
        
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
