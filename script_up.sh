sudo docker network create pacs
sudo docker-compose -f docker-compose.yml up -d

cd Viewers-3.7.0/
yarn install
yarn start
