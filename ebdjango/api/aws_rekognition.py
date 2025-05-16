import boto3
import uuid

bucketname = 'ALLv2EN-US-LTI13-116869-a03aq000009LLQrAAO'
rekognition = boto3.client('rekognition', 
                           region_name='us-east-1',
                           aws_access_key_id = access_key_id,
                           aws_secret_access_key = secret_access_key,
                           aws_session_token = session_token)  # Muda a região se necessário
COLLECTION_ID = 'es-project-users'

my_bucket = rekognition.bucket(bucketname)

def create_collection():
    try:
        rekognition.create_collection(CollectionId=COLLECTION_ID)
    except rekognition.exceptions.ResourceAlreadyExistsException:
        pass

def delete_collection():
    try:
        rekognition.delete_collection(CollectionId=COLLECTION_ID)
    except rekognition.exceptions.ResourceNotFoundException:
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
        Image={
            'S3Object': {
                'Bucket': bucketname,
                'Name': 'todetect/' 
                }
            },
        MaxFaces=1,
    )
    face_matches = response.get('FaceMatches', [])
    if face_matches:
        return face_matches[0]['Face']['FaceId']
    return None