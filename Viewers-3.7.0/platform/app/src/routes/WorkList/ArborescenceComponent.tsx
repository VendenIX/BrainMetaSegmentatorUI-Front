import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ArborescenceComponent = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/arborescence?response_type=json');
        setPatients(response.data.patients);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!patients) return null;

  return (
    <div>
      <h1>Arborescence des patients</h1>
      {Object.entries(patients).map(([patientId, patient]) => (
        <div key={patientId}>
          <h2>{`Patient ID: ${patientId}`}</h2>
          <h3>Études :</h3>
          <ul>
            {patient.etudes.map((etude, index) => (
              <li key={`${patientId}-etude-${index}`}>{etude[2]}</li>
            ))}
          </ul>
          <h3>Sessions :</h3>
          <ul>
            {Object.values(patient.sessions).map(session => (
              <li key={session.session.dateObservation}>{session.session.dateObservation}</li>
            ))}
          </ul>
          <h3>Métastases :</h3>
          <ul>
            {Object.values(patient.sessions).map(session =>
              session.metastases.map((metastase, index) => (
                <li key={`${session.session.id}-metastase-${index}`}>{metastase[5]}</li>
              ))
            )}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default ArborescenceComponent;