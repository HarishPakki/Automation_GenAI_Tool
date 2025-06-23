import React from 'react';
import { Pie } from 'react-chartjs-2';

function Report() {
  const data = {
    labels: ['Passed', 'Failed', 'Skipped'],
    datasets: [{
      data: [60, 30, 10],
      backgroundColor: ['green', 'red', 'orange']
    }]
  };

  return (
    <div>
      <h2>Test Execution Report</h2>
      <Pie data={data} />
    </div>
  );
}

export default Report;
