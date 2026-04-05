import React, { useState } from 'react';

export default function DementiaSelector({ onChange }) {
  const [type, setType] = useState('general');

  const update = (e) => {
    const value = e.target.value;
    setType(value);
    onChange(value);
  };

  return (
    <div style={{ marginBottom: '10px' }}>
      <label>Dementia Support Mode: </label>
      <select value={type} onChange={update}>
        <option value='general'>General Dementia Care</option>
        <option value='alzheimers'>Alzheimer's</option>
        <option value='vascular'>Vascular Dementia</option>
        <option value='lewyBody'>Lewy Body Dementia</option>
        <option value='frontotemporal'>Frontotemporal Dementia</option>
      </select>
    </div>
  );
}
