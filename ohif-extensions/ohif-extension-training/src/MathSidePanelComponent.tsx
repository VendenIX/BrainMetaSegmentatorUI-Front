import React from 'react' ;

function MathSidePanelComponent() {
    return (
        <div className="text-white text-center" style={{backgroundColor: "aqua"}}>
            {`This is a test`}
            <button onclick='console.log("click !")' style={{color: "red", padding: '1em'}}>click here!</button>
            
        </div>

        
    )
}

export default MathSidePanelComponent;