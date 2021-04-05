import React from 'react';

function Rank({ name, entries }) {
  return (
    <div>
      <div className="white f3">{`${name}, your submitted images count: `}</div>
      <div className="white f1">
        {entries >= 20 ? `${entries} (MAX)` : entries}
      </div>
      {entries >= 20 ? (
        <div style={{color: 'white'}}>
          You have reached the limit of requests. Thank you for trying DevBrain.
        </div>
      ) : null}
    </div>
  );
}

export default Rank;
