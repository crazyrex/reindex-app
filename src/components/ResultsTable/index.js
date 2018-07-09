import React from 'react';
import ReactPaginate from 'react-paginate';
import Chip from 'material-ui/Chip';
import RecordSettings from 'components/RecordSettings';
import SortIcon from 'material-ui/svg-icons/action/swap-vert';
import InlineEdit from 'react-edit-inline';
import Table, {
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,} from 'material-ui@next/Table';
  import Checkbox from 'material-ui@next/Checkbox';
  import './ResultsTable.scss';

class ResultsTable extends React.Component {
  constructor(props) {
  super(props);
  this.state = { isAsc: false, sortHeader: null ,page:1, currentPage:1 ,changedOrder:false, selected: [],unSelected:[]};
  this.currentId = null;
}
 

 splitTags(tagsStr, catArr) {
  if (!tagsStr || !catArr)
    return;
  const arr = tagsStr ? tagsStr.split('|') : [];
  return (<div className="wrapper-tags">{arr.map((tag, key) =>
      tag !== ' ' ? <Chip key={key} backgroundColor="#3852a4" labelColor="#ffffff" onTouchTap={() => this.onTouchTap(tag)}>
       <abbr title={tag}>{tag}</abbr>
      </Chip> : ''
    )}{catArr.map((tag, key) =>
    tag !== ' ' ? <Chip key={key} backgroundColor="#FB6a65" labelColor="#ffffff" onTouchTap={() => this.onTouchTap(tag)}>
      <abbr title={tag}>{tag}</abbr>
    </Chip> : ''
    )}
  </div>);
}

  sortByColumn = (column,column1, data) => {
   let order = '';
   if(this.state.order == 'asc')
      order = 'desc'
    else order = 'asc' ;
    this.setState({
      order: order,
      changedOrder: true,
      currentPage: 1
    },function(){
       this.props.handleSortClick(0,true,order);
    });
  }


  handlePageClick = (page) => {
    this.setState({currentPage: page.selected +1})
    this.props.handlePageClick(page,this.props.isSort,this.state.order);
  }


  selectAllClick = (event, checked) => {
    this.props.handleSelectAllClick(checked);
  };


   handleClick = (event, id) => {
     this.props.handleCheckClick(id)
  };


  handleKeyDown = (event, id) => {
    if (keycode(event) === 'space') {
      this.handleClick(event, id);
    }
  };

  isSelected = (_id) => {
    return this.props.selected.indexOf(_id) !== -1
  };

   isUnSelected = (_id) => {
    return this.props.unSelected.indexOf(_id) !== -1
  };
  rendercol(val, key ,id){
    return <TableCell><InlineEdit
    activeClassName="editing"
    text={ val || ''}
    paramName={key}
    change={(e)=>{this.currentId = id;this.dataChanged(e)}}
    style={{
      backgroundColor: '#e7e7b8',
      minWidth: 150,
      display: 'inline-block',
      margin: 0,
      padding: 0,
      fontSize: 15,
      outline: 0,
      border: 0
    }}
  /></TableCell>
  }
  dataChanged(data) {
    var record;
    if (this.currentId) {
      this.props.data.forEach(e => {
      if(e._id == this.currentId) {
        record = e;
        return;
      }
    });
      if (record)  {
          if (Object.keys(data) == 'first_name') {
            var name = Object.values(data)[0];
            name = name.split(' ');
            record._source['first_name'] = name[0];
            record._source['last_name'] = name[1];
            if (name[2])
              record._source['last_name']+= ' '+name[2];
            if (name[3])
              record._source['last_name']+= ' '+name[3];
      }
      else record._source[Object.keys(data)] = Object.values(data)[0];
      record._source._id = this.currentId;
      this.props.handleUpdateRecord(record._source);  
      }
    }
  }



 render() {

  return (
    <div className="table">
     <Table>
      <TableHead>
        <TableRow>
            <TableCell checkbox style={{width: '50px'}}>
            <Checkbox
              indeterminate={this.props.selected === 'ALL' && this.props.unSelected.length}
              checked={this.props.selected == 'ALL'}
              onChange={this.selectAllClick}
            />
          </TableCell>
          <TableCell style={{width: '170px'}}>  
                <SortIcon onMouseUp={(e) => this.sortByColumn('_source','business_name', this.props.data) }/>
                  שם
             </TableCell>
             <TableCell style={{width: '120px'}}>רחוב</TableCell>
             <TableCell style={{width: '65px'}}>מספר בית</TableCell>
             <TableCell style={{width: '120px'}}>עיר</TableCell>
             <TableCell style={{width: '120px'}}>טלפון</TableCell>
             <TableCell style={{width: '120px'}}>נייד</TableCell>
             <TableCell style={{width: '120px'}}>תאור</TableCell>
             <TableCell style={{width: '120px'}}>אתר</TableCell>
             <TableCell style={{width: '120px'}}>דו"אל</TableCell>
             <TableCell style={{width: '170px'}}>תגים</TableCell>
             <TableCell style={{width: '120px'}}>פעולות</TableCell>
          </TableRow>
      </TableHead>
         <TableBody >
           {this.props.data.map(res => {
            const isSelected = this.isSelected(res._id);
            const isUnSelsected = this.isUnSelected(res._id);
             return <TableRow key={res._id}
                  hover
                  onClick={event => this.handleClick(event, res._id)}
                  role="checkbox"
                  aria-checked={true}
                  tabIndex={-1}
                  key={res._id}
                  selected={(isSelected || this.props.selected === 'ALL') && !isUnSelsected ? true:false} >
                  <TableCell checkbox>
                    <Checkbox  checked={(isSelected || this.props.selected === 'ALL') && !isUnSelsected ? true:false}/>
                  </TableCell>
                  {res._source.business_name ?
                    this.rendercol(res._source.business_name,'business_name',res._id) :
                    this.rendercol(`${res._source.first_name} ${res._source.last_name}`,'first_name',res._id)
                    }
                  {this.rendercol(res._source.address_street_name,'address_street_name',res._id)}
                  {this.rendercol(res._source.address_street_number,'address_street_number',res._id)}
                  {this.rendercol(res._source.address_city,'address_city',res._id)}
                  {this.rendercol(res._source.phone,'phone',res._id)}
                  {this.rendercol(res._source.phone_2,'phone_2',res._id)}
                  {this.rendercol(res._source.business_description,'business_description',res._id)}
                  {this.rendercol(res._source.website,'website',res._id)}
                  {this.rendercol(res._source.email,'email',res._id)}
               <TableCell style={{width: '170px'}}>{this.splitTags(res._source.tags, res._source.categories)}</TableCell>
               <TableCell style={{width: '120px'}}><div onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}><RecordSettings record={res} /></div></TableCell>
             </TableRow>
           
            })}
           
        </TableBody>
       </Table>
      <div>current page: {this.state.currentPage}</div>
      <ReactPaginate
        previousLabel={'previous'}
        nextLabel={'next'}
        breakLabel={<a href="">...</a>}
        breakClassName={'break-me'}
        pageCount={Math.ceil(this.props.total / this.props.limit)}
        marginPagesDisplayed={2}
        pageRangeDisplayed={5}
        onPageChange={this.handlePageClick}
        containerClassName={'pagination'}
        subContainerClassName={'pages pagination'}
        activeClassName={'active'}
      />
    </div>

  );
}

}

ResultsTable.propTypes = {
  data: React.PropTypes.array,
  handleRowSelection: React.PropTypes.func,
  total: React.PropTypes.number,
  limit: React.PropTypes.number,
  handlePageClick: React.PropTypes.func,
  handleCellClick: React.PropTypes.func,
  onSelectAllClick:React.PropTypes.func,
};


export default ResultsTable;
