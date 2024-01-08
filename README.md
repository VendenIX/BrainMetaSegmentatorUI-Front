Pour lancer la partie front-end, il faut se placer dans le dossier front-end et lancer la commande suivante:

```
docker network create pacs
docker-compose -f docker-compose.yml up -d
```
```
#Se placer dans le répertoire Viewers-3.7.0
npm i
npm start
```

Vous pouvez ensuite accéder à l'application via l'url suivante: http://localhost:3000/ et http://localhost:8042

Login : mapdr Password : changestrongpassword

Pour eteindre l'application, il faut lancer la commande suivante:

```
docker-compose down
docker network rm pacs # si vous voulez supprimer le réseau
```

Clean - up:

```
rm -rf ./orthanc-db/*
```
