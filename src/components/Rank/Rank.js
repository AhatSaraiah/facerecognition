import React from 'react';
//import './Rank.css';
import ParticlesBg from 'particles-bg'

const Rank = () => {
    return(
 <div>
    <div className="white f3">
       {'Ahat, your current rank is ...'}
    </div>
    <div className="white f1">
      {'#5'}
    </div>
    {/* <ParticlesBg type="cobweb" bg={true} /> */}
    <ParticlesBg className= "pracricles" color="#601250" num={200} type="cobweb" bg={true} />

  </div>
    );
}

export default Rank;