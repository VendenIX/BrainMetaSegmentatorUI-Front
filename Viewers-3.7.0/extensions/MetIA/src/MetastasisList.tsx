import React, { useEffect, useState } from 'react';
import BarChart from './BarChart';

function MetastasisList({ study }) {
  const [metastases, setMetastases] = useState([]);

  useEffect(() => {
    if (study && study.id_study) {
      fetch(`http://localhost:5000/followup-metastases?idEtude=${study.id_study}`)
        .then(response => response.json())
        .then(setMetastases)
        .catch(console.error);
    }
  }, [study]);

  // Fonction pour convertir la chaîne de couleur en format RGB utilisable en CSS
  const formatColor = (colorString) => {
    const colorArray = colorString.replace(/\[|\]/g, '').trim().split(/\s+/);
    return `rgb(${colorArray.join(',')})`;
  };

  // Préparer les données pour le graphique en barres
  const barData = metastases.map(m => ({
    nom_metastase: m.nom_metastase,
    volume: m.volume,
    color: formatColor(m.Color)
  }));

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Métastases pour l'étude : {study.id_study}</h1>
      <BarChart data={barData} />
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.header}>Nom</th>
            <th style={styles.header}>Diamètre (mm)</th>
            <th style={styles.header}>Volume (cm³)</th>
            <th style={styles.header}>Slice de début</th>
            <th style={styles.header}>Slice de fin</th>
          </tr>
        </thead>
        <tbody>
          {metastases.map(metastase => (
            <tr key={metastase.idMetastase} style={styles.row}>
              <td style={{ ...styles.cell, color: formatColor(metastase.Color) }}>{metastase.nom_metastase}</td>
              <td style={styles.cell}>{metastase.diametre}</td>
              <td style={styles.cell}>{metastase.volume}</td>
              <td style={styles.cell}>{metastase.slice_Debut}</td>
              <td style={styles.cell}>{metastase.slice_Fin}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const styles = {
  container: {
    backgroundColor: '#1E1E1E', // un fond plus foncé
    color: '#CCCCCC', // texte gris clair pour contraste
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
    borderRadius: '8px', // bords arrondis
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)', // ombre légère pour du relief
    marginTop: '20px',
    overflowX: 'auto' // pour la gestion du débordement sur l'axe X
  },
  title: {
    color: '#58A6FF', // bleu clair
    textAlign: 'center',
    marginBottom: '20px' // espace sous le titre
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    color: '#CCCCCC' // texte de la table en gris clair
  },
  header: {
    backgroundColor: '#0D1117', // fond d'en-tête plus foncé
    padding: '10px',
    textAlign: 'left',
    color: '#58A6FF', // texte de l'en-tête en bleu
    borderBottom: '2px solid #30363D' // ligne de séparation
  },
  row: {
    backgroundColor: '#161B22', // alternance de couleur pour les rangées
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: '#30363D' // couleur au survol
    }
  },
  cell: {
    padding: '10px',
    borderBottom: '1px solid #30363D' // ligne de séparation plus subtile
  }
};

export default MetastasisList;
