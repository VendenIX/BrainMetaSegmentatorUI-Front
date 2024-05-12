import React, { useEffect, useState } from 'react';

function PatientList({ onSelectPatient }) {
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/followup-patients')
      .then(response => response.json())
      .then(setPatients)
      .catch(console.error);
  }, []);

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Patient List</h1>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.header}>Nom</th>
            <th style={styles.header}>Date de Naissance</th>
            <th style={styles.header}>Sexe</th>
          </tr>
        </thead>
        <tbody>
          {patients.map(patient => (
            <tr key={patient.idPatient} style={styles.row} onClick={() => {
              console.log("Patient sélectionné :", patient);
              onSelectPatient(patient);
            }}>

              <td style={styles.cell}>{patient.name}</td>
              <td style={styles.cell}>{formatDate(patient.date)}</td>
              <td style={styles.cell}>{patient.sexe}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function formatDate(dateString) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
}

const styles = {
  container: {
    backgroundColor: '#1E1E1E', // un fond plus foncé
    color: '#CCCCCC', // texte gris clair pour contraste
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
    borderRadius: '8px', // Bords arrondis
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


export default PatientList;
