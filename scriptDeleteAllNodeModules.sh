#!/bin/bash

# Chemin vers le répertoire de départ
# Assure-toi de remplacer "/chemin/vers/ton/projet" par le chemin réel de ton répertoire
start_directory="./"

# Recherche récursive des dossiers 'node_modules' et suppression
find "$start_directory" -name 'node_modules' -type d -prune -exec rm -rf '{}' +

echo "Tous les dossiers 'node_modules' ont été supprimés."
