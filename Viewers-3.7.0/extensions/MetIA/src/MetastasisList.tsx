import React, { useEffect, useState } from 'react';
import BarChart from './BarChart';
import ScatterChart from './ScatterChart';

function MetastasisList({ serie }) {
  const [metastases, setMetastases] = useState([]);

  useEffect(() => {
    console.log("j'arrive ici ? ");
    console.log("serie : ", serie);
    console.log("serie_instance_uid : ", serie.series_instance_uid);
    if (serie && serie.series_instance_uid) {
      console.log("requetage");
      fetch(`http://localhost:5000/followup-metastases?idSeries=${serie.series_instance_uid}`)
        .then(response => response.json())
        .then(data => {
          console.log("data reçue :", data);
          setMetastases(data);
          console.log("Métastases mises à jour : ", data);
        })
        .catch(console.error);
    }
  }, [serie]);

  // Fonction pour convertir la chaîne de couleur en format RGB utilisable en CSS
  const formatColor = (colorString) => {
    if (!colorString) return 'rgb(0,255,0)'; // Retourne noir par défaut si colorString est undefined
    const colorArray = colorString.replace(/\[|\]/g, '').trim().split(/\s+/);
    return `rgb(${colorArray.join(',')})`;
  };

  if (!serie) {
    return <div style={styles.container}>Sélectionnez une série pour voir les métastases</div>;
  }

  // Préparer les données pour les graphiques
  const barData = metastases.map(m => ({
    nom_metastase: m.nom_metastase,
    volume: m.volume,
    color: formatColor(m.color)
  }));

  const scatterData = metastases.map(m => ({
    name: m.nom_metastase,
    diameter: m.diametre,
    volume: m.volume,
    color: formatColor(m.color)
  }));

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Métastases pour la série : {serie.series_instance_uid}</h1>
      <div style={styles.chartContainer}>
        <div style={styles.chart}>
          <BarChart data={barData} />
        </div>
        <div style={styles.chart}>
          <ScatterChart data={scatterData} />
        </div>
      </div>
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
            <tr key={metastase.id} style={styles.row}>
              <td style={{ ...styles.cell, color: formatColor(metastase.color) }}>{metastase.nom_metastase}</td>
              <td style={styles.cell}>{metastase.diametre}</td>
              <td style={styles.cell}>{metastase.volume}</td>
              <td style={styles.cell}>{metastase.slice_debut}</td>
              <td style={styles.cell}>{metastase.slice_fin}</td>
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
  chartContainer: {
    display: 'flex',
    justifyContent: 'space-around',
    marginBottom: '20px'
  },
  chart: {
    width: '50%',
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
