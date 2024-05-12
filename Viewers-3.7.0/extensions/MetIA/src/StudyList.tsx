import React, { useEffect, useState } from 'react';

function StudyList({ onSelectedStudy ,patient }) {
  const [studies, setStudies] = useState([]);

  useEffect(() => {
    if (patient && patient.id) {
      fetch(`http://localhost:5000/followup-etudes?idPatient=${patient.id}`)
        .then(response => response.json())
        .then(setStudies)
        .catch(console.error);
    }
  }, [patient]);

  return (
    <div style={styles.container}>
      {console.log("iCICICICICIi", studies)}
      <h1 style={styles.title}>Études de {patient.name}</h1>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.header}>SOP</th>
            <th style={styles.header}>Date de l'Étude</th>
          </tr>
        </thead>
        <tbody>
          {studies.map(study => (
            <tr key={study.id} style={styles.row} onClick={() => onSelectedStudy(study)}>
              <td style={styles.cell}>{study.id_SOP}</td>
              <td style={styles.cell}>{study.date}</td>
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


export default StudyList;
