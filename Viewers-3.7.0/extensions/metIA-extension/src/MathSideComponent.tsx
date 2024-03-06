import React from 'react';

const data = [
  ["GTV_0", 1515.75, 120, 129, "vert"],
  ["GTV_1", 239.25, 123, 128, "rouge"],
  ["GTV_2", 157.5, 62, 66, "bleu"],
  ["GTV_3", 225.0, 112, 116, "vert"],
  ["GTV_4", 68.25, 153, 155, "bleu"],
  ["GTV_5", 560.25, 143, 151, "rouge"],
  ["GTV_6", 501.75, 73, 80, "vert"],
];

function MathSidePanelComponent() {
  const handleGenerateClick = () => {
    console.log("requete api");
  };

  const renderItem = (item, index) => {
    const backgroundColor = index % 2 === 0 ? 'lightblue' : 'darkblue';
    return (
      <div style={{ backgroundColor, color: 'white', padding: '10px', margin: '5px' }}>
        {item.map((data, dataIndex) => (
          <span key={dataIndex} style={{ marginRight: '10px' }}>
            {data}
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="text-white w-full text-center">
      {data.map((item, index) => renderItem(item, index))}
      <button
        onClick={handleGenerateClick}
        style={{ backgroundColor: 'lightblue', color: 'white', padding: '10px', margin: '20px 0', cursor: 'pointer' }}
      >
        Générer
      </button>
    </div>
  );
}

export default MathSidePanelComponent;
