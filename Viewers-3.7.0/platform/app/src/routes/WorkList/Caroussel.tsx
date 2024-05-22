import React, { useState } from 'react';
import '../../../public/style/style.css';

function Caroussel() {
  const [activeImage, setActiveImage] = useState("im1");

  const handleClick = (imageId) => {
    if (activeImage === imageId) {
      setActiveImage(null); // Désactive l'image si elle était active
    } else {
      setActiveImage(imageId); // Active l'image
    }
  };


  return (
    <div className="Caroussel-aff">


      <div className="buttons">

        <button
          className="caroussel"
          onClick={() => handleClick('im1')}
          autoFocus
        >
          Chargement des images
        </button>

        <button className="caroussel" onClick={() => handleClick('im2')}>
          Segmentation automatique
        </button>

        <button className="caroussel" onClick={() => handleClick('im3')}>
          Annotations manuelles
        </button>

        <button className="caroussel" onClick={() => handleClick('im4')}>
          Exportation des données
        </button>

        <button className='caroussel' onClick={() => handleClick('im5')}>
          Suivi des patients
        </button>

      </div>

      <div className="images">
        {activeImage === 'im1' && (
          <div className='demo'>
            <p className='ex'> Pour charger une étude dans MetIA, vous pouvez utiliser l'outil <b className='mono'>Ajouter des études</b> et importer vos images.</p>
            <img 
              id="im1" 
              src="img_demo/interface_ajout.png" 
              alt="Chargement des images demo" 
            />
          </div>
          
        )}

        {activeImage === 'im2' && (
          <div className='demo'>
            <p className='ex'> Pour segmenter une image, vous pouvez utiliser l'outil <b className='mono'>Perform MetIA Segmentation</b> se trouvant à gauche dans l'interface de visualisation d'une étude avec le <b className='mono'>Basic Viewer</b>. </p>
            <img 
              id="im2" 
              src="img_demo/interface_perform_model.png" 
              alt="Segmentation demo" 
            />
          </div>
          
        )}

        {activeImage === 'im3' && (
          <div className='demo'>
            <p className='ex'> Pour annoter manuellement vos images, vous pouvez utiliser l'outil <b className='mono'>Annotation</b> se trouvant dans la barre d'outils de l'interface de visualisation. </p>
            <img 
              id="im3" 
              src="img_demo/interface_annotation3.png" 
              alt="Anotations demo" 
            />
          </div>
          
        )}

        {activeImage === 'im4' && (
          <div className='demo'>
            <p className='ex'> Pour exporter vos résultats, vous pouvez utiliser l'outil <b className='mono'>Download</b> se trouvant dans le menu <img src="img_demo/menu_icon.svg" alt="Icone du menu" style={{width:'1em', height:'auto', verticalAlign:"middle", display:"inline"}}/> dans la partie droite de l'interface de visualisation. </p>
            <img
              id="im4"
              src="img_demo/interface_export.png"
              alt="Exportation des données demo"
            />
          </div>
          
        )}

        {activeImage === 'im5' && (
          <div className='demo'>
            <p className='ex'> Pour afficher le suivi des patients, vous pouvez vous rendre sur l'onglet <b className='mono'>Suivi des patients</b> où la liste des patients vous sera affichée. Un clic sur un patient permet de détailler les études réalisées à son sujet.</p>
            <img 
              id="im5" 
              src="img_demo/interface_liste_patients.png" 
              alt="Suivi des patients demo" 
            />
          </div>
          
        )}

      </div>
    </div>
  );
}

export default Caroussel;
