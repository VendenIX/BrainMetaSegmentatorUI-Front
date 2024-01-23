lancement :

sudo docker network create pacs
sudo docker-compose -f docker-compose.yml up -d

dans Viewers-3.7.0
yarn install
yarn start

ohif : 
http://localhost:3000/

orthanc :
http://localhost:8042


arret : 

sudo docker-compose down
sudo docker network rm pacs
