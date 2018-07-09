import React from 'react';
import AutoComplete from 'material-ui/AutoComplete';
import { detectmob } from 'utils/functions';
import { connect } from 'react-redux';
import { displayIcons } from 'containers/MainSearch/actions';

import './Autocomplete.scss';

class Autocomplete extends React.PureComponent {

  constructor(props) {
    super(props);
    this.detectmob = detectmob();
  }

  componentDidMount() {
   if (!this.detectmob || (this.detectmob && (!this.props.text || this.props.text === ''))) {
     this.refs.autocomplete.focus();
     let that = this;
     setTimeout(function(){ 
       if (window.innerHeight < window.test) {
        that.props.displayIcons(false);
       }
      }, 500);   
    } 
  }

  render() {
    return (
      <AutoComplete
        searchText={this.props.text || ''}
        hintText={this.props.hintText}
        filter={AutoComplete.noFilter}
        dataSource={this.props.dataSource}
        dataSourceConfig={this.props.dataSourceConfig}
        onUpdateInput={this.props.handleUpdateInput}
        onNewRequest={this.props.onNewRequest}
        className="autocomplete"
        ref="autocomplete"
        fullWidth={true}
      />
  );
  }
}

Autocomplete.propTypes = {
  dataSource: React.PropTypes.array,
  handleUpdateInput: React.PropTypes.func,
  onNewRequest: React.PropTypes.func,
  dataSourceConfig: React.PropTypes.object,
  hintText: React.PropTypes.string,
  text: React.PropTypes.string,
};


export function mapStateToProps(state) {
  return {

  };
}

export function mapDispatchToProps(dispatch) {
  return {
     displayIcons: (isDisplay) => {
      dispatch(displayIcons({ displayIcons: isDisplay }));
    },
  };
}


export default connect(mapStateToProps, mapDispatchToProps)(Autocomplete);



