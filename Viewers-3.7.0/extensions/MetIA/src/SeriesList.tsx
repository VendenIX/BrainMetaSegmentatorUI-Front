import React, { useEffect, useState } from 'react';

function SeriesList({ onSelectedSeries, study }) {
  const [series, setSeries] = useState([]);

  useEffect(() => {
    if (study && study.id_study) {
      fetch(`http://localhost:5000/followup-series?idEtude=${study.id_study}`)
        .then(response => response.json())
        .then(data => {
          console.log("data reçue :", data);
          setSeries(data);
          console.log("Séries mises à jour : ", data);
        })
        .catch(console.error);
    }
  }, [study]);

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Séries pour l'étude : {study.id_study}</h1>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.header}>Series Instance UID</th>
          </tr>
        </thead>
        <tbody>
          {series.map(serie => (
            <tr key={serie.series_instance_uid} style={styles.row} onClick={() => onSelectedSeries(serie)}>
              <td style={styles.cell}>{serie.series_instance_uid}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const styles = {
  container: {
    backgroundColor: '#1E1E1E',
    color: '#CCCCCC',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    marginTop: '20px',
    overflowX: 'auto'
  },
  title: {
    color: '#58A6FF',
    textAlign: 'center',
    marginBottom: '20px'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    color: '#CCCCCC'
  },
  header: {
    backgroundColor: '#0D1117',
    padding: '10px',
    textAlign: 'left',
    color: '#58A6FF',
    borderBottom: '2px solid #30363D'
  },
  row: {
    backgroundColor: '#161B22',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: '#30363D'
    }
  },
  cell: {
    padding: '10px',
    borderBottom: '1px solid #30363D'
  }
};

export default SeriesList;
