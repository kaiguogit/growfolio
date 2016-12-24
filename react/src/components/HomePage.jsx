import React from 'react';
import {Link} from 'react-router';

import { Table } from 'react-bootstrap';

// import WebAPI from '../services/web-api.js';
import transactions from '../services/web-api.js';
console.log(transactions);
const COLUMNS = ['symbol', 'type', 'price', 'shares', 'commission', 'date'];
// var api = new WebAPI();

// var transactions = api.getTransactionList();

const HomePage = () => {
  return (
    <div>
        <Table bordered hover>
            <thead>
                <tr>
                    {COLUMNS.map(columnName => {
                        return <th key={columnName}>{columnName}</th>
                    })}
                </tr>
            </thead>
            <tbody>
                {transactions.map(trsc => {
                    return (
                    <tr key={trsc.id}>
                        {COLUMNS.map(columnName => {
                            return <td key={columnName}>{trsc[columnName]}</td>
                        })}
                    </tr>
                    )
                })}
            </tbody>
        </Table>
    </div>
  );
};

export default HomePage;
