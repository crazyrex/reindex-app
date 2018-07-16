import React from 'react';
import PropTypes from 'prop-types';
import ReactPaginate from 'react-paginate';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';


function HistoryTable(props) {
  return (
      <div>
    <Table selectable={false}>
      <TableHeader displaySelectAll={false} enableSelectAll={false}>
        <TableRow>
          <TableHeaderColumn>טאב</TableHeaderColumn>
          <TableHeaderColumn>טקסט</TableHeaderColumn>
          <TableHeaderColumn>עיר</TableHeaderColumn>
          <TableHeaderColumn>מס' תוצאות</TableHeaderColumn>
          <TableHeaderColumn>תאריך</TableHeaderColumn>
        </TableRow>
      </TableHeader>
      <TableBody displayRowCheckbox={false}>
        {props.data.map((record, key) =>
            <TableRow key={key}>
              <TableRowColumn>{record._source.tab}</TableRowColumn>
              <TableRowColumn>{record._source.value}</TableRowColumn>
              <TableRowColumn>{record._source.city}</TableRowColumn>
              <TableRowColumn>{record._source.totalCount}</TableRowColumn>
               <TableRowColumn>{record._source.created ?
                   new Date(record._source.created).toLocaleString()
                    : ''}</TableRowColumn>
            </TableRow>
        )}
      </TableBody>
    </Table>
     <ReactPaginate
          previousLabel={'previous'}
          nextLabel={'next'}
          breakLabel={<a href="">...</a>}
          breakClassName={'break-me'}
          pageCount={Math.ceil(props.total / props.limit)}
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
          onPageChange={props.handlePageClick}
          containerClassName={'pagination'}
          subContainerClassName={'pages pagination'}
          activeClassName={'active'}
        />
    </div>
  );
}

HistoryTable.propTypes = {
  data: PropTypes.array,
  total: PropTypes.number,
  limit: PropTypes.number,
  handlePageClick: PropTypes.func,
};


export default HistoryTable;
