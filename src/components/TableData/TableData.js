import React from 'react';
import './TableData.css';

const TableData=({selectedTreeItem})=>{
    
    const [data, setData] = React.useState([]);
    
    React.useEffect(()=>{
        // call DB query API here and form data
    },[selectedTreeItem]);

    return (
        <div className='table-data'>
            <table>
                <thead>
                    <tr>
                        <th>Column1</th>
                        <th>Column2</th>
                        <th>Column3</th>
                        <th>Column4</th>
                        <th>Column5</th>
                        <th>Column6</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Test</td>
                        <td>Test</td>
                        <td>Test</td>
                        <td>Test</td>
                        <td>Test</td>
                        <td>Test</td>
                    </tr>
                    <tr>
                        <td>Test</td>
                        <td>Test</td>
                        <td>Test</td>
                        <td>Test</td>
                        <td>Test</td>
                        <td>Test</td>
                    </tr>
                    <tr>
                        <td>Test</td>
                        <td>Test</td>
                        <td>Test</td>
                        <td>Test</td>
                        <td>Test</td>
                        <td>Test</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default TableData;