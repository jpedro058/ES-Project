import boto3
import uuid

rekognition = boto3.client('rekognition', region_name='us-east-1')  # Muda a região se necessário
COLLECTION_ID = 'es-project-users'

def create_collection():
    try:
        rekognition.create_collection(CollectionId=COLLECTION_ID)
    except rekognition.exceptions.ResourceAlreadyExistsException:
        pass

def index_face(image_bytes):
    response = rekognition.index_faces(
        CollectionId=COLLECTION_ID,
        Image={'Bytes': image_bytes},
        ExternalImageId=str(uuid.uuid4()),
        DetectionAttributes=['DEFAULT']
    )
    face_records = response.get('FaceRecords', [])
    if face_records:
        return face_records[0]['Face']['FaceId']
    return None

def search_face(image_bytes):
    response = rekognition.search_faces_by_image(
        CollectionId=COLLECTION_ID,
        Image={'Bytes': image_bytes},
        MaxFaces=1,
        FaceMatchThreshold=90
    )
    face_matches = response.get('FaceMatches', [])
    if face_matches:
        return face_matches[0]['Face']['FaceId']
    return None