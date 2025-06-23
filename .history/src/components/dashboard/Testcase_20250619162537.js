import React, { useState } from 'react';
import paginate from '../../services/pagination';

const sampleData = Array.from({ length: 100 }, (_, i) => `Testcase ${i + 1}`);

function Testcase() {
  const [page, setPage] = useState(1);
  const { data, totalPages } = paginate(sampleData, page, 10);

  return (
    <div>
      <h2>Testcase Management</h2>
      <ul>
        {data.map((item, idx) => (
          <li key={idx}>{item}</li>
        ))}
      </ul>
      <div className="pagination">
        {Array.from({ length: totalPages }, (_, i) => (
          <button key={i} onClick={() => setPage(i + 1)} className={page === i + 1 ? 'active' : ''}>
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}

export default Testcase;
