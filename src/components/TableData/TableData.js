import React, { useState, useEffect, useRef } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import './TableData.css';

const TableData = ({ selectedTreeItem, initialData }) => {
  const [data, setData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [displayData, setDisplayData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingCell, setEditingCell] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [columnFilters, setColumnFilters] = useState({});
  const [showFilterDropdown, setShowFilterDropdown] = useState(null);
  const [changedCells, setChangedCells] = useState({});
  const [checkedRows, setCheckedRows] = useState({});
  const [draggedRow, setDraggedRow] = useState(null);
  const [filterSearchTerm, setFilterSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(100);
  const [showPageDropdown, setShowPageDropdown] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const dropdownRef = useRef(null);
  const pageDropdownRef = useRef(null);
  const [keyValueRows, setKeyValueRows] = useState([
    { key: 'Environment', value: 'Production' },
    { key: 'Version', value: '1.0.0' },
  ]);
  const [editingKVCell, setEditingKVCell] = useState(null);
  const [editKVValue, setEditKVValue] = useState('');
  const [showKeyValueTable, setShowKeyValueTable] = useState(false);


  useEffect(() => {
    if(!selectedTreeItem) {
      return;
    }

    if (initialData && initialData.length > 0) {
      const headersFromData = initialData[0].map((_, index) => `Column ${index + 1}`);
      setHeaders(['', ...headersFromData]);
      setData(initialData);
      setFilteredData(initialData);

      const filters = {};
      headersFromData.forEach((_, index) => {
        filters[index] = new Set();
      });
      setColumnFilters(filters);
    }
  }, [initialData]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowFilterDropdown(null);
      }
      if (pageDropdownRef.current && !pageDropdownRef.current.contains(event.target)) {
        setShowPageDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    let result = [...data];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(row => row.some(cell => String(cell).toLowerCase().includes(term)));
    }

    Object.entries(columnFilters).forEach(([colIndex, filterValues]) => {
      if (filterValues.size > 0) {
        result = result.filter(row => filterValues.has(String(row[colIndex])));
      }
    });

    setFilteredData(result);
    setCurrentPage(1);
  }, [data, searchTerm, columnFilters]);

  useEffect(() => {
    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    setDisplayData(filteredData.slice(indexOfFirstRecord, indexOfLastRecord));
  }, [filteredData, currentPage, recordsPerPage]);

  useEffect(() => {
    if(!selectedTreeItem) {
      return;
    }

    if (!initialData || initialData.length === 0) {
      const sampleData = [
        ['Project Alpha', 'Development', 'John Doe', '2023-01-15', 'In Progress', 'High'],
        ['Project Beta', 'Marketing', 'Jane Smith', '2023-02-20', 'Completed', 'Medium'],
        ['Project Gamma', 'Research', 'Mike Johnson', '2023-03-10', 'On Hold', 'High'],
        ['Project Delta', 'Development', 'Sarah Williams', '2023-04-05', 'In Progress', 'Low'],
        ['Project Epsilon', 'Testing', 'David Brown', '2023-05-12', 'Not Started', 'Medium'],
                ['Project Alpha', 'Development', 'John Doe', '2023-01-15', 'In Progress', 'High'],
        ['Project Beta', 'Marketing', 'Jane Smith', '2023-02-20', 'Completed', 'Medium'],
        ['Project Gamma', 'Research', 'Mike Johnson', '2023-03-10', 'On Hold', 'High'],
        ['Project Delta', 'Development', 'Sarah Williams', '2023-04-05', 'In Progress', 'Low'],
        ['Project Epsilon', 'Testing', 'David Brown', '2023-05-12', 'Not Started', 'Medium'],
                ['Project Alpha', 'Development', 'John Doe', '2023-01-15', 'In Progress', 'High'],
        ['Project Beta', 'Marketing', 'Jane Smith', '2023-02-20', 'Completed', 'Medium'],
        ['Project Gamma', 'Research', 'Mike Johnson', '2023-03-10', 'On Hold', 'High'],
        ['Project Delta', 'Development', 'Sarah Williams', '2023-04-05', 'In Progress', 'Low'],
        ['Project Epsilon', 'Testing', 'David Brown', '2023-05-12', 'Not Started', 'Medium'],
                ['Project Alpha', 'Development', 'John Doe', '2023-01-15', 'In Progress', 'High'],
        ['Project Beta', 'Marketing', 'Jane Smith', '2023-02-20', 'Completed', 'Medium'],
        ['Project Gamma', 'Research', 'Mike Johnson', '2023-03-10', 'On Hold', 'High'],
        ['Project Delta', 'Development', 'Sarah Williams', '2023-04-05', 'In Progress', 'Low'],
        ['Project Epsilon', 'Testing', 'David Brown', '2023-05-12', 'Not Started', 'Medium'],
                ['Project Alpha', 'Development', 'John Doe', '2023-01-15', 'In Progress', 'High'],
        ['Project Beta', 'Marketing', 'Jane Smith', '2023-02-20', 'Completed', 'Medium'],
        ['Project Gamma', 'Research', 'Mike Johnson', '2023-03-10', 'On Hold', 'High'],
        ['Project Delta', 'Development', 'Sarah Williams', '2023-04-05', 'In Progress', 'Low'],
        ['Project Epsilon', 'Testing', 'David Brown', '2023-05-12', 'Not Started', 'Medium'],
                ['Project Alpha', 'Development', 'John Doe', '2023-01-15', 'In Progress', 'High'],
        ['Project Beta', 'Marketing', 'Jane Smith', '2023-02-20', 'Completed', 'Medium'],
        ['Project Gamma', 'Research', 'Mike Johnson', '2023-03-10', 'On Hold', 'High'],
        ['Project Delta', 'Development', 'Sarah Williams', '2023-04-05', 'In Progress', 'Low'],
        ['Project Epsilon', 'Testing', 'David Brown', '2023-05-12', 'Not Started', 'Medium'],
                ['Project Alpha', 'Development', 'John Doe', '2023-01-15', 'In Progress', 'High'],
        ['Project Beta', 'Marketing', 'Jane Smith', '2023-02-20', 'Completed', 'Medium'],
        ['Project Gamma', 'Research', 'Mike Johnson', '2023-03-10', 'On Hold', 'High'],
        ['Project Delta', 'Development', 'Sarah Williams', '2023-04-05', 'In Progress', 'Low'],
        ['Project Epsilon', 'Testing', 'David Brown', '2023-05-12', 'Not Started', 'Medium'],
                ['Project Alpha', 'Development', 'John Doe', '2023-01-15', 'In Progress', 'High'],
        ['Project Beta', 'Marketing', 'Jane Smith', '2023-02-20', 'Completed', 'Medium'],
        ['Project Gamma', 'Research', 'Mike Johnson', '2023-03-10', 'On Hold', 'High'],
        ['Project Delta', 'Development', 'Sarah Williams', '2023-04-05', 'In Progress', 'Low'],
        ['Project Epsilon', 'Testing', 'David Brown', '2023-05-12', 'Not Started', 'Medium'],
        ['Project Alpha', 'Development', 'John Doe', '2023-01-15', 'In Progress', 'High'],
        ['Project Beta', 'Marketing', 'Jane Smith', '2023-02-20', 'Completed', 'Medium'],
        ['Project Gamma', 'Research', 'Mike Johnson', '2023-03-10', 'On Hold', 'High'],
        ['Project Delta', 'Development', 'Sarah Williams', '2023-04-05', 'In Progress', 'Low'],
        ['Project Epsilon', 'Testing', 'David Brown', '2023-05-12', 'Not Started', 'Medium'],
                ['Project Alpha', 'Development', 'John Doe', '2023-01-15', 'In Progress', 'High'],
        ['Project Beta', 'Marketing', 'Jane Smith', '2023-02-20', 'Completed', 'Medium'],
        ['Project Gamma', 'Research', 'Mike Johnson', '2023-03-10', 'On Hold', 'High'],
        ['Project Delta', 'Development', 'Sarah Williams', '2023-04-05', 'In Progress', 'Low'],
        ['Project Epsilon', 'Testing', 'David Brown', '2023-05-12', 'Not Started', 'Medium'],
                ['Project Alpha', 'Development', 'John Doe', '2023-01-15', 'In Progress', 'High'],
        ['Project Beta', 'Marketing', 'Jane Smith', '2023-02-20', 'Completed', 'Medium'],
        ['Project Gamma', 'Research', 'Mike Johnson', '2023-03-10', 'On Hold', 'High'],
        ['Project Delta', 'Development', 'Sarah Williams', '2023-04-05', 'In Progress', 'Low'],
        ['Project Epsilon', 'Testing', 'David Brown', '2023-05-12', 'Not Started', 'Medium'],
                ['Project Alpha', 'Development', 'John Doe', '2023-01-15', 'In Progress', 'High'],
        ['Project Beta', 'Marketing', 'Jane Smith', '2023-02-20', 'Completed', 'Medium'],
        ['Project Gamma', 'Research', 'Mike Johnson', '2023-03-10', 'On Hold', 'High'],
        ['Project Delta', 'Development', 'Sarah Williams', '2023-04-05', 'In Progress', 'Low'],
        ['Project Epsilon', 'Testing', 'David Brown', '2023-05-12', 'Not Started', 'Medium'],
                ['Project Alpha', 'Development', 'John Doe', '2023-01-15', 'In Progress', 'High'],
        ['Project Beta', 'Marketing', 'Jane Smith', '2023-02-20', 'Completed', 'Medium'],
        ['Project Gamma', 'Research', 'Mike Johnson', '2023-03-10', 'On Hold', 'High'],
        ['Project Delta', 'Development', 'Sarah Williams', '2023-04-05', 'In Progress', 'Low'],
        ['Project Epsilon', 'Testing', 'David Brown', '2023-05-12', 'Not Started', 'Medium'],
                ['Project Alpha', 'Development', 'John Doe', '2023-01-15', 'In Progress', 'High'],
        ['Project Beta', 'Marketing', 'Jane Smith', '2023-02-20', 'Completed', 'Medium'],
        ['Project Gamma', 'Research', 'Mike Johnson', '2023-03-10', 'On Hold', 'High'],
        ['Project Delta', 'Development', 'Sarah Williams', '2023-04-05', 'In Progress', 'Low'],
        ['Project Epsilon', 'Testing', 'David Brown', '2023-05-12', 'Not Started', 'Medium'],
                ['Project Alpha', 'Development', 'John Doe', '2023-01-15', 'In Progress', 'High'],
        ['Project Beta', 'Marketing', 'Jane Smith', '2023-02-20', 'Completed', 'Medium'],
        ['Project Gamma', 'Research', 'Mike Johnson', '2023-03-10', 'On Hold', 'High'],
        ['Project Delta', 'Development', 'Sarah Williams', '2023-04-05', 'In Progress', 'Low'],
        ['Project Epsilon', 'Testing', 'David Brown', '2023-05-12', 'Not Started', 'Medium'],
                ['Project Alpha', 'Development', 'John Doe', '2023-01-15', 'In Progress', 'High'],
        ['Project Beta', 'Marketing', 'Jane Smith', '2023-02-20', 'Completed', 'Medium'],
        ['Project Gamma', 'Research', 'Mike Johnson', '2023-03-10', 'On Hold', 'High'],
        ['Project Delta', 'Development', 'Sarah Williams', '2023-04-05', 'In Progress', 'Low'],
        ['Project Epsilon', 'Testing', 'David Brown', '2023-05-12', 'Not Started', 'Medium'],
        ['Project Alpha', 'Development', 'John Doe', '2023-01-15', 'In Progress', 'High'],
        ['Project Beta', 'Marketing', 'Jane Smith', '2023-02-20', 'Completed', 'Medium'],
        ['Project Gamma', 'Research', 'Mike Johnson', '2023-03-10', 'On Hold', 'High'],
        ['Project Delta', 'Development', 'Sarah Williams', '2023-04-05', 'In Progress', 'Low'],
        ['Project Epsilon', 'Testing', 'David Brown', '2023-05-12', 'Not Started', 'Medium'],
                ['Project Alpha', 'Development', 'John Doe', '2023-01-15', 'In Progress', 'High'],
        ['Project Beta', 'Marketing', 'Jane Smith', '2023-02-20', 'Completed', 'Medium'],
        ['Project Gamma', 'Research', 'Mike Johnson', '2023-03-10', 'On Hold', 'High'],
        ['Project Delta', 'Development', 'Sarah Williams', '2023-04-05', 'In Progress', 'Low'],
        ['Project Epsilon', 'Testing', 'David Brown', '2023-05-12', 'Not Started', 'Medium'],
                ['Project Alpha', 'Development', 'John Doe', '2023-01-15', 'In Progress', 'High'],
        ['Project Beta', 'Marketing', 'Jane Smith', '2023-02-20', 'Completed', 'Medium'],
        ['Project Gamma', 'Research', 'Mike Johnson', '2023-03-10', 'On Hold', 'High'],
        ['Project Delta', 'Development', 'Sarah Williams', '2023-04-05', 'In Progress', 'Low'],
        ['Project Epsilon', 'Testing', 'David Brown', '2023-05-12', 'Not Started', 'Medium'],
                ['Project Alpha', 'Development', 'John Doe', '2023-01-15', 'In Progress', 'High'],
        ['Project Beta', 'Marketing', 'Jane Smith', '2023-02-20', 'Completed', 'Medium'],
        ['Project Gamma', 'Research', 'Mike Johnson', '2023-03-10', 'On Hold', 'High'],
        ['Project Delta', 'Development', 'Sarah Williams', '2023-04-05', 'In Progress', 'Low'],
        ['Project Epsilon', 'Testing', 'David Brown', '2023-05-12', 'Not Started', 'Medium'],
                ['Project Alpha', 'Development', 'John Doe', '2023-01-15', 'In Progress', 'High'],
        ['Project Beta', 'Marketing', 'Jane Smith', '2023-02-20', 'Completed', 'Medium'],
        ['Project Gamma', 'Research', 'Mike Johnson', '2023-03-10', 'On Hold', 'High'],
        ['Project Delta', 'Development', 'Sarah Williams', '2023-04-05', 'In Progress', 'Low'],
        ['Project Epsilon', 'Testing', 'David Brown', '2023-05-12', 'Not Started', 'Medium'],
                ['Project Alpha', 'Development', 'John Doe', '2023-01-15', 'In Progress', 'High'],
        ['Project Beta', 'Marketing', 'Jane Smith', '2023-02-20', 'Completed', 'Medium'],
        ['Project Gamma', 'Research', 'Mike Johnson', '2023-03-10', 'On Hold', 'High'],
        ['Project Delta', 'Development', 'Sarah Williams', '2023-04-05', 'In Progress', 'Low'],
        ['Project Epsilon', 'Testing', 'David Brown', '2023-05-12', 'Not Started', 'Medium'],
                ['Project Alpha', 'Development', 'John Doe', '2023-01-15', 'In Progress', 'High'],
        ['Project Beta', 'Marketing', 'Jane Smith', '2023-02-20', 'Completed', 'Medium'],
        ['Project Gamma', 'Research', 'Mike Johnson', '2023-03-10', 'On Hold', 'High'],
        ['Project Delta', 'Development', 'Sarah Williams', '2023-04-05', 'In Progress', 'Low'],
        ['Project Epsilon', 'Testing', 'David Brown', '2023-05-12', 'Not Started', 'Medium'],
                ['Project Alpha', 'Development', 'John Doe', '2023-01-15', 'In Progress', 'High'],
        ['Project Beta', 'Marketing', 'Jane Smith', '2023-02-20', 'Completed', 'Medium'],
        ['Project Gamma', 'Research', 'Mike Johnson', '2023-03-10', 'On Hold', 'High'],
        ['Project Delta', 'Development', 'Sarah Williams', '2023-04-05', 'In Progress', 'Low'],
        ['Project Epsilon', 'Testing', 'David Brown', '2023-05-12', 'Not Started', 'Medium'],
        ['Project Alpha', 'Development', 'John Doe', '2023-01-15', 'In Progress', 'High'],
        ['Project Beta', 'Marketing', 'Jane Smith', '2023-02-20', 'Completed', 'Medium'],
        ['Project Gamma', 'Research', 'Mike Johnson', '2023-03-10', 'On Hold', 'High'],
        ['Project Delta', 'Development', 'Sarah Williams', '2023-04-05', 'In Progress', 'Low'],
        ['Project Epsilon', 'Testing', 'David Brown', '2023-05-12', 'Not Started', 'Medium'],
                ['Project Alpha', 'Development', 'John Doe', '2023-01-15', 'In Progress', 'High'],
        ['Project Beta', 'Marketing', 'Jane Smith', '2023-02-20', 'Completed', 'Medium'],
        ['Project Gamma', 'Research', 'Mike Johnson', '2023-03-10', 'On Hold', 'High'],
        ['Project Delta', 'Development', 'Sarah Williams', '2023-04-05', 'In Progress', 'Low'],
        ['Project Epsilon', 'Testing', 'David Brown', '2023-05-12', 'Not Started', 'Medium'],
                ['Project Alpha', 'Development', 'John Doe', '2023-01-15', 'In Progress', 'High'],
        ['Project Beta', 'Marketing', 'Jane Smith', '2023-02-20', 'Completed', 'Medium'],
        ['Project Gamma', 'Research', 'Mike Johnson', '2023-03-10', 'On Hold', 'High'],
        ['Project Delta', 'Development', 'Sarah Williams', '2023-04-05', 'In Progress', 'Low'],
        ['Project Epsilon', 'Testing', 'David Brown', '2023-05-12', 'Not Started', 'Medium'],
                ['Project Alpha', 'Development', 'John Doe', '2023-01-15', 'In Progress', 'High'],
        ['Project Beta', 'Marketing', 'Jane Smith', '2023-02-20', 'Completed', 'Medium'],
        ['Project Gamma', 'Research', 'Mike Johnson', '2023-03-10', 'On Hold', 'High'],
        ['Project Delta', 'Development', 'Sarah Williams', '2023-04-05', 'In Progress', 'Low'],
        ['Project Epsilon', 'Testing', 'David Brown', '2023-05-12', 'Not Started', 'Medium'],
                ['Project Alpha', 'Development', 'John Doe', '2023-01-15', 'In Progress', 'High'],
        ['Project Beta', 'Marketing', 'Jane Smith', '2023-02-20', 'Completed', 'Medium'],
        ['Project Gamma', 'Research', 'Mike Johnson', '2023-03-10', 'On Hold', 'High'],
        ['Project Delta', 'Development', 'Sarah Williams', '2023-04-05', 'In Progress', 'Low'],
        ['Project Epsilon', 'Testing', 'David Brown', '2023-05-12', 'Not Started', 'Medium'],
                ['Project Alpha', 'Development', 'John Doe', '2023-01-15', 'In Progress', 'High'],
        ['Project Beta', 'Marketing', 'Jane Smith', '2023-02-20', 'Completed', 'Medium'],
        ['Project Gamma', 'Research', 'Mike Johnson', '2023-03-10', 'On Hold', 'High'],
        ['Project Delta', 'Development', 'Sarah Williams', '2023-04-05', 'In Progress', 'Low'],
        ['Project Epsilon', 'Testing', 'David Brown', '2023-05-12', 'Not Started', 'Medium'],
                ['Project Alpha', 'Development', 'John Doe', '2023-01-15', 'In Progress', 'High'],
        ['Project Beta', 'Marketing', 'Jane Smith', '2023-02-20', 'Completed', 'Medium'],
        ['Project Gamma', 'Research', 'Mike Johnson', '2023-03-10', 'On Hold', 'High'],
        ['Project Delta', 'Development', 'Sarah Williams', '2023-04-05', 'In Progress', 'Low'],
        ['Project Epsilon', 'Testing', 'David Brown', '2023-05-12', 'Not Started', 'Medium'],
                ['Project Alpha', 'Development', 'John Doe', '2023-01-15', 'In Progress', 'High'],
        ['Project Beta', 'Marketing', 'Jane Smith', '2023-02-20', 'Completed', 'Medium'],
        ['Project Gamma', 'Research', 'Mike Johnson', '2023-03-10', 'On Hold', 'High'],
        ['Project Delta', 'Development', 'Sarah Williams', '2023-04-05', 'In Progress', 'Low'],
        ['Project Epsilon', 'Testing', 'David Brown', '2023-05-12', 'Not Started', 'Medium'],
        ['Project Alpha', 'Development', 'John Doe', '2023-01-15', 'In Progress', 'High'],
        ['Project Beta', 'Marketing', 'Jane Smith', '2023-02-20', 'Completed', 'Medium'],
        ['Project Gamma', 'Research', 'Mike Johnson', '2023-03-10', 'On Hold', 'High'],
        ['Project Delta', 'Development', 'Sarah Williams', '2023-04-05', 'In Progress', 'Low'],
        ['Project Epsilon', 'Testing', 'David Brown', '2023-05-12', 'Not Started', 'Medium'],
                ['Project Alpha', 'Development', 'John Doe', '2023-01-15', 'In Progress', 'High'],
        ['Project Beta', 'Marketing', 'Jane Smith', '2023-02-20', 'Completed', 'Medium'],
        ['Project Gamma', 'Research', 'Mike Johnson', '2023-03-10', 'On Hold', 'High'],
        ['Project Delta', 'Development', 'Sarah Williams', '2023-04-05', 'In Progress', 'Low'],
        ['Project Epsilon', 'Testing', 'David Brown', '2023-05-12', 'Not Started', 'Medium'],
                ['Project Alpha', 'Development', 'John Doe', '2023-01-15', 'In Progress', 'High'],
        ['Project Beta', 'Marketing', 'Jane Smith', '2023-02-20', 'Completed', 'Medium'],
        ['Project Gamma', 'Research', 'Mike Johnson', '2023-03-10', 'On Hold', 'High'],
        ['Project Delta', 'Development', 'Sarah Williams', '2023-04-05', 'In Progress', 'Low'],
        ['Project Epsilon', 'Testing', 'David Brown', '2023-05-12', 'Not Started', 'Medium'],
                ['Project Alpha', 'Development', 'John Doe', '2023-01-15', 'In Progress', 'High'],
        ['Project Beta', 'Marketing', 'Jane Smith', '2023-02-20', 'Completed', 'Medium'],
        ['Project Gamma', 'Research', 'Mike Johnson', '2023-03-10', 'On Hold', 'High'],
        ['Project Delta', 'Development', 'Sarah Williams', '2023-04-05', 'In Progress', 'Low'],
        ['Project Epsilon', 'Testing', 'David Brown', '2023-05-12', 'Not Started', 'Medium'],
                ['Project Alpha', 'Development', 'John Doe', '2023-01-15', 'In Progress', 'High'],
        ['Project Beta', 'Marketing', 'Jane Smith', '2023-02-20', 'Completed', 'Medium'],
        ['Project Gamma', 'Research', 'Mike Johnson', '2023-03-10', 'On Hold', 'High'],
        ['Project Delta', 'Development', 'Sarah Williams', '2023-04-05', 'In Progress', 'Low'],
        ['Project Epsilon', 'Testing', 'David Brown', '2023-05-12', 'Not Started', 'Medium'],
                ['Project Alpha', 'Development', 'John Doe', '2023-01-15', 'In Progress', 'High'],
        ['Project Beta', 'Marketing', 'Jane Smith', '2023-02-20', 'Completed', 'Medium'],
        ['Project Gamma', 'Research', 'Mike Johnson', '2023-03-10', 'On Hold', 'High'],
        ['Project Delta', 'Development', 'Sarah Williams', '2023-04-05', 'In Progress', 'Low'],
        ['Project Epsilon', 'Testing', 'David Brown', '2023-05-12', 'Not Started', 'Medium'],
                ['Project Alpha', 'Development', 'John Doe', '2023-01-15', 'In Progress', 'High'],
        ['Project Beta', 'Marketing', 'Jane Smith', '2023-02-20', 'Completed', 'Medium'],
        ['Project Gamma', 'Research', 'Mike Johnson', '2023-03-10', 'On Hold', 'High'],
        ['Project Delta', 'Development', 'Sarah Williams', '2023-04-05', 'In Progress', 'Low'],
        ['Project Epsilon', 'Testing', 'David Brown', '2023-05-12', 'Not Started', 'Medium'],
                ['Project Alpha', 'Development', 'John Doe', '2023-01-15', 'In Progress', 'High'],
        ['Project Beta', 'Marketing', 'Jane Smith', '2023-02-20', 'Completed', 'Medium'],
        ['Project Gamma', 'Research', 'Mike Johnson', '2023-03-10', 'On Hold', 'High'],
        ['Project Delta', 'Development', 'Sarah Williams', '2023-04-05', 'In Progress', 'Low'],
        ['Project Epsilon', 'Testing', 'David Brown', '2023-05-12', 'Not Started', 'Medium'],
        ['Project Alpha', 'Development', 'John Doe', '2023-01-15', 'In Progress', 'High'],
        ['Project Beta', 'Marketing', 'Jane Smith', '2023-02-20', 'Completed', 'Medium'],
        ['Project Gamma', 'Research', 'Mike Johnson', '2023-03-10', 'On Hold', 'High'],
        ['Project Delta', 'Development', 'Sarah Williams', '2023-04-05', 'In Progress', 'Low'],
        ['Project Epsilon', 'Testing', 'David Brown', '2023-05-12', 'Not Started', 'Medium'],
                ['Project Alpha', 'Development', 'John Doe', '2023-01-15', 'In Progress', 'High'],
        ['Project Beta', 'Marketing', 'Jane Smith', '2023-02-20', 'Completed', 'Medium'],
        ['Project Gamma', 'Research', 'Mike Johnson', '2023-03-10', 'On Hold', 'High'],
        ['Project Delta', 'Development', 'Sarah Williams', '2023-04-05', 'In Progress', 'Low'],
        ['Project Epsilon', 'Testing', 'David Brown', '2023-05-12', 'Not Started', 'Medium'],
                ['Project Alpha', 'Development', 'John Doe', '2023-01-15', 'In Progress', 'High'],
        ['Project Beta', 'Marketing', 'Jane Smith', '2023-02-20', 'Completed', 'Medium'],
        ['Project Gamma', 'Research', 'Mike Johnson', '2023-03-10', 'On Hold', 'High'],
        ['Project Delta', 'Development', 'Sarah Williams', '2023-04-05', 'In Progress', 'Low'],
        ['Project Epsilon', 'Testing', 'David Brown', '2023-05-12', 'Not Started', 'Medium'],
                ['Project Alpha', 'Development', 'John Doe', '2023-01-15', 'In Progress', 'High'],
        ['Project Beta', 'Marketing', 'Jane Smith', '2023-02-20', 'Completed', 'Medium'],
        ['Project Gamma', 'Research', 'Mike Johnson', '2023-03-10', 'On Hold', 'High'],
        ['Project Delta', 'Development', 'Sarah Williams', '2023-04-05', 'In Progress', 'Low'],
        ['Project Epsilon', 'Testing', 'David Brown', '2023-05-12', 'Not Started', 'Medium'],
                ['Project Alpha', 'Development', 'John Doe', '2023-01-15', 'In Progress', 'High'],
        ['Project Beta', 'Marketing', 'Jane Smith', '2023-02-20', 'Completed', 'Medium'],
        ['Project Gamma', 'Research', 'Mike Johnson', '2023-03-10', 'On Hold', 'High'],
        ['Project Delta', 'Development', 'Sarah Williams', '2023-04-05', 'In Progress', 'Low'],
        ['Project Epsilon', 'Testing', 'David Brown', '2023-05-12', 'Not Started', 'Medium'],
                ['Project Alpha', 'Development', 'John Doe', '2023-01-15', 'In Progress', 'High'],
        ['Project Beta', 'Marketing', 'Jane Smith', '2023-02-20', 'Completed', 'Medium'],
        ['Project Gamma', 'Research', 'Mike Johnson', '2023-03-10', 'On Hold', 'High'],
        ['Project Delta', 'Development', 'Sarah Williams', '2023-04-05', 'In Progress', 'Low'],
        ['Project Epsilon', 'Testing', 'David Brown', '2023-05-12', 'Not Started', 'Medium'],
                ['Project Alpha', 'Development', 'John Doe', '2023-01-15', 'In Progress', 'High'],
        ['Project Beta', 'Marketing', 'Jane Smith', '2023-02-20', 'Completed', 'Medium'],
        ['Project Gamma', 'Research', 'Mike Johnson', '2023-03-10', 'On Hold', 'High'],
        ['Project Delta', 'Development', 'Sarah Williams', '2023-04-05', 'In Progress', 'Low'],
        ['Project Epsilon', 'Testing', 'David Brown', '2023-05-12', 'Not Started', 'Medium'],
                ['Project Alpha', 'Development', 'John Doe', '2023-01-15', 'In Progress', 'High'],
        ['Project Beta', 'Marketing', 'Jane Smith', '2023-02-20', 'Completed', 'Medium'],
        ['Project Gamma', 'Research', 'Mike Johnson', '2023-03-10', 'On Hold', 'High'],
        ['Project Delta', 'Development', 'Sarah Williams', '2023-04-05', 'In Progress', 'Low'],
        ['Project Epsilon', 'Testing', 'David Brown', '2023-05-12', 'Not Started', 'Medium']

      ];
      setData(sampleData);
      setFilteredData(sampleData);
      setHeaders(['', 'Project Name', 'Department', 'Owner', 'Start Date', 'Status', 'Priority', 'Priority1', 'Priority']);

      const filters = {};
      sampleData[0].forEach((_, index) => {
        filters[index] = new Set();
      });
      setColumnFilters(filters);
    }
  }, [selectedTreeItem]);

  const handleSearch = (e) => setSearchTerm(e.target.value);

  const startEditing = (rowIndex, colIndex, value) => {
    setEditingCell({ rowIndex, colIndex });
    setEditValue(value);
  };

  const saveEdit = () => {
    if (editingCell) {
      const newData = [...data];
      newData[editingCell.rowIndex][editingCell.colIndex] = editValue;
      setData(newData);
      
      setChangedCells(prev => ({
        ...prev,
        [`${editingCell.rowIndex}-${editingCell.colIndex}`]: true
      }));
      
      setEditingCell(null);
    }
  };

  const toggleFilterDropdown = (colIndex, e) => {
    e.stopPropagation();
    setFilterSearchTerm('');
    setShowFilterDropdown(showFilterDropdown === colIndex ? null : colIndex);
  };

  const updateFilter = (colIndex, value) => {
    const newFilters = { ...columnFilters };
    if (newFilters[colIndex].has(value)) {
      newFilters[colIndex].delete(value);
    } else {
      newFilters[colIndex].add(value);
    }
    setColumnFilters(newFilters);
  };

  const getUniqueColumnValues = (colIndex) => {
    const values = new Set();
    data.forEach(row => values.add(String(row[colIndex])));
    return Array.from(values).sort();
  };

  const getFilteredColumnValues = (colIndex) => {
    const allValues = getUniqueColumnValues(colIndex);
    if (!filterSearchTerm) return allValues;
    
    const term = filterSearchTerm.toLowerCase();
    return allValues.filter(value => String(value).toLowerCase().includes(term));
  };

  const clearAllFilters = () => {
    const clearedFilters = {};
    Object.keys(columnFilters).forEach(colIndex => {
      clearedFilters[colIndex] = new Set();
    });
    setColumnFilters(clearedFilters);
    setSearchTerm('');
  };

  const toggleRowCheck = (rowIndex) => {
    setCheckedRows(prev => ({
      ...prev,
      [rowIndex]: !prev[rowIndex]
    }));
    setSelectedRows(prev => 
      prev.includes(rowIndex) 
        ? prev.filter(index => index !== rowIndex)
        : [...prev, rowIndex]
    );
  };

  const handleDragStart = (e, rowIndex) => {
    setDraggedRow(rowIndex);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/html", e.currentTarget);
  };

  const handleDragOver = (rowIndex) => {
    const draggedOverItem = rowIndex;
    if (draggedRow === draggedOverItem) return;

    let newData = [...filteredData];
    newData.splice(draggedOverItem, 0, newData.splice(draggedRow, 1)[0]);
    
    setFilteredData(newData);
    setDraggedRow(draggedOverItem);
  };

  const handleDrop = () => {
    setDraggedRow(null);
  };

  const handleSave = () => {
    console.log("Saving selected rows:", selectedRows);
    // Add your save logic here
  };

  const handleExecute = () => {
    console.log("Executing selected rows:", selectedRows);
    // Add your execute logic here
  };

    const startEditingKV = (rowIndex, field, value) => {
    setEditingKVCell({ rowIndex, field });
    setEditKVValue(value);
  };

  const saveEditKV = () => {
    if (editingKVCell) {
      const newRows = [...keyValueRows];
      newRows[editingKVCell.rowIndex][editingKVCell.field] = editKVValue;
      setKeyValueRows(newRows);
      setEditingKVCell(null);
    }
  };

  const addKVRow = () => {
    setKeyValueRows([...keyValueRows, { key: '', value: '' }]);
  };

  const deleteKVRow = (rowIndex) => {
    setKeyValueRows(keyValueRows.filter((_, idx) => idx !== rowIndex));
  };

  const hasSelectedRows = selectedRows.length > 0;

  if (!selectedTreeItem) {
    return <div className='no-table-data'>Select a test case to view the data.</div>;
  }

  return (
    <>
      <div className='table-data-wrapper'>
        <div className="table-controls">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search across all columns..."
              value={searchTerm}
              onChange={handleSearch}
              className="search-input"
            />
            <button className="clear-filters" onClick={clearAllFilters}>
              Clear All Filters
            </button>
          </div>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                {headers.map((header, colIndex) => (
                  <th key={colIndex}>
                    {colIndex === 0 ? (
                      <span>{header}</span>
                    ) : (
                      <div className="header-content">
                        <span title={header}>{header}</span>
                        <button
                          className={`filter-button ${columnFilters[colIndex - 1]?.size > 0 ? 'active' : ''}`}
                          onClick={(e) => toggleFilterDropdown(colIndex - 1, e)}
                        >
                          <svg viewBox="0 0 24 24" width="16" height="16">
                            <path d="M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z" />
                          </svg>
                        </button>
                      </div>
                    )}
                    {showFilterDropdown === colIndex - 1 && (
                      <div
                        className="filter-box"
                        ref={dropdownRef}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="filter-header">
                          <h4>Filter by {headers[colIndex]}</h4>
                          <button 
                            className="close-filter"
                            onClick={() => setShowFilterDropdown(null)}
                          >
                            ×
                          </button>
                        </div>
                        <div className="search-filter">
                          <input
                            type="text"
                            placeholder={`Search ${headers[colIndex]}`}
                            className="filter-search-input"
                            value={filterSearchTerm}
                            onChange={(e) => setFilterSearchTerm(e.target.value)}
                          />
                        </div>
                        <div className="filter-options-container">
                          {getFilteredColumnValues(colIndex - 1).map((value, i) => (
                            <label key={i} className="filter-option">
                              <input
                                type="checkbox"
                                checked={columnFilters[colIndex - 1]?.has(value) || false}
                                onChange={() => updateFilter(colIndex - 1, value)}
                              />
                              <span title={value}>{value}</span>
                              <span className="count-badge">
                                {data.filter(row => String(row[colIndex - 1]) === value).length}
                              </span>
                            </label>
                          ))}
                          {getFilteredColumnValues(colIndex - 1).length === 0 && (
                            <div className="no-results">No matching options</div>
                          )}
                        </div>
                        <div className="filter-actions">
                          <button 
                            className="apply-filter"
                            onClick={() => setShowFilterDropdown(null)}
                          >
                            Apply
                          </button>
                          <button 
                            className="clear-filter"
                            onClick={() => {
                              const newFilters = { ...columnFilters };
                              newFilters[colIndex - 1] = new Set();
                              setColumnFilters(newFilters);
                            }}
                          >
                            Clear
                          </button>
                        </div>
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {displayData.map((row, rowIndex) => (
                <tr 
                  key={rowIndex}
                  draggable
                  onDragStart={e => {
                    // Only start row drag if not dragging from key-value
                    if (!e.dataTransfer.types.includes('application/x-keyvalue')) {
                      handleDragStart(e, rowIndex);
                    }
                  }}
                  onDragOver={e => {
                    // Only allow row drag-over if not dragging from key-value
                    if (!e.dataTransfer.types.includes('application/x-keyvalue')) {
                      handleDragOver(rowIndex);
                    }
                    e.preventDefault();
                  }}
                  onDrop={e => {
                    // Only handle row drop if not dragging from key-value
                    if (!e.dataTransfer.types.includes('application/x-keyvalue')) {
                      handleDrop();
                    }
                  }}
                  className={`${draggedRow === rowIndex ? 'dragging' : ''} ${checkedRows[rowIndex] ? 'row-selected' : ''}`}
                >
                  <td>
                    <input
                      type="checkbox"
                      checked={!!checkedRows[rowIndex]}
                      onChange={() => toggleRowCheck(rowIndex)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </td>
                  {row.map((cell, colIndex) => (
                    <td
                      key={colIndex}
                      onClick={() => startEditing(rowIndex, colIndex, cell)}
                      title={String(cell)}
                      className={changedCells[`${rowIndex}-${colIndex}`] ? 'changed-cell' : ''}
                      onDragOver={e => e.preventDefault()}
                      onDrop={e => {
                        const droppedValue = e.dataTransfer.getData('application/x-keyvalue');
                        if (droppedValue) {
                          const newData = [...data];
                          newData[rowIndex][colIndex] = droppedValue;
                          setData(newData);
                          setChangedCells(prev => ({
                            ...prev,
                            [`${rowIndex}-${colIndex}`]: true
                          }));
                        }
                      }}
                    >
                      {editingCell?.rowIndex === rowIndex && editingCell?.colIndex === colIndex ? (
                        <input
                          type="text"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          onBlur={saveEdit}
                          onKeyDown={(e) => e.key === 'Enter' && saveEdit()}
                          autoFocus
                          className="edit-input"
                        />
                      ) : (
                        <span className="cell-content">{cell}</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="table-footer">
          <div className="pagination-controls">
            <div className="records-per-page">
              <span>Show</span>
              <select 
                value={recordsPerPage}
                onChange={(e) => {
                  setRecordsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="records-select"
              >
                {[10, 25, 50, 100, 250, 500].map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
              <span>entries</span>
            </div>
            
            <div className="pagination">
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="page-nav"
              >
                Previous
              </button>

              <div className="page-selector" ref={pageDropdownRef}>
                <button 
                  onClick={() => setShowPageDropdown(!showPageDropdown)}
                  className="page-display"
                >
                  Page {currentPage} of {Math.ceil(filteredData.length / recordsPerPage)}
                  <span className="dropdown-icon">▼</span>
                </button>
                
                {showPageDropdown && (
                  <div className="page-dropdown">
                    {Array.from(
                      { length: Math.ceil(filteredData.length / recordsPerPage) }, 
                      (_, i) => i + 1
                    ).map(page => (
                      <button
                        key={page}
                        onClick={() => {
                          setCurrentPage(page);
                          setShowPageDropdown(false);
                        }}
                        className={`page-option ${currentPage === page ? 'active' : ''}`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button 
                onClick={() => setCurrentPage(p => Math.min(p + 1, Math.ceil(filteredData.length / recordsPerPage)))}
                disabled={currentPage === Math.ceil(filteredData.length / recordsPerPage)}
                className="page-nav"
              >
                Next
              </button>
            </div>
          </div>

          <div className="record-count">
            Showing {(currentPage - 1) * recordsPerPage + 1} to {Math.min(currentPage * recordsPerPage, filteredData.length)} of {filteredData.length} entries
          </div>
        </div>

        {hasSelectedRows && (
          <div className="action-buttons">
            <button 
              onClick={handleSave}
              className="save-button"
            >
              Save Selected
            </button>
            <button 
              onClick={handleExecute}
              className="execute-button"
            >
              Execute Selected
            </button>
          </div>
        )}
      </div>
      <div>
        <button onClick={()=>setShowKeyValueTable(!showKeyValueTable)} className='toggle-key-value-table-btn'>
          {showKeyValueTable ? <ArrowRightIcon /> : <ArrowLeftIcon />}
        </button>
      </div>

      {
        showKeyValueTable && (
          <div className='key-value-table-container'>
            <table>
              <thead>
                <tr>
                  <th>Key</th>
                  <th>Value</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {keyValueRows.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    <td
                      onClick={() => startEditingKV(rowIndex, 'key', row.key)}
                      style={{ cursor: 'pointer' }}
                      draggable
                      onDragStart={e => {
                        e.dataTransfer.setData('application/x-keyvalue', row.value);
                        e.dataTransfer.effectAllowed = 'copy';
                      }}
                    >
                      {editingKVCell?.rowIndex === rowIndex && editingKVCell?.field === 'key' ? (
                        <input
                          type="text"
                          value={editKVValue}
                          onChange={e => setEditKVValue(e.target.value)}
                          onBlur={saveEditKV}
                          onKeyDown={e => e.key === 'Enter' && saveEditKV()}
                          autoFocus
                          className='edit-input'
                        />
                      ) : (
                        row.key
                      )}
                    </td>
                    <td
                      onClick={() => startEditingKV(rowIndex, 'value', row.value)}
                      style={{ cursor: 'pointer' }}
                    >
                      {editingKVCell?.rowIndex === rowIndex && editingKVCell?.field === 'value' ? (
                        <input
                          type="text"
                          value={editKVValue}
                          onChange={e => setEditKVValue(e.target.value)}
                          onBlur={saveEditKV}
                          onKeyDown={e => e.key === 'Enter' && saveEditKV()}
                          autoFocus
                          className='edit-input'
                        />
                      ) : (
                        row.value
                      )}
                    </td>
                    <td>
                      <button onClick={() => deleteKVRow(rowIndex)} title="Delete Row" className='delete-value-button'>
                        <DeleteIcon color='error'/>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button onClick={addKVRow} style={{ marginTop: 8 }}>Add Row</button>
          </div>
        )
      }
    </>
  );
};

export default TableData;