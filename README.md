Pour lancer la partie front-end, il faut se placer dans le dossier front-end et lancer la commande suivante:

```
sudo docker network create pacs
sudo docker-compose up -d
```

Vous pouvez ensuite accéder à l'application via l'url suivante: http://localhost:3000/ et http://localhost:8042

Login : mapdr
Password : changestrongpassword

Pour eteindre l'application, il faut lancer la commande suivante:

```
sudo docker-compose down
sudo docker network rm pacs # si vous voulez supprimer le réseau
```

Clean - up:

```
rm -rf ./orthanc-db/*
```
