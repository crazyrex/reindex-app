import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import NavigationMenu from 'material-ui/svg-icons/navigation/menu';
import Drawer from 'material-ui/Drawer';
import { browserHistory } from 'react-router';
import MenuItem from 'material-ui/MenuItem';
import config from 'ReindexConfig';
import IconButton from 'material-ui/IconButton';
import SearchIcon from 'material-ui/svg-icons/action/search';
import logo from 'assets/img/logo.png';
import beta from 'assets/img/logo.png';
import { detectmob } from 'utils/functions';
import { initSearch } from 'components/SearchBar/actions';


const styles = require('./HeaderSite.scss');

class HeaderSite extends React.Component {
    constructor(props) {
        super(props);
        this.state = { open: false };
    }

    handleToggle = () => this.setState({ open: !this.state.open });
    handleClose = () => this.setState({ open: false });
    render() {
        return (
            <div className="header-site">
                 <div className="header-content">
                    <div className="logo-wrapper">
                        <div className="logo" style={{ backgroundImage: `url(${logo})` }} onClick={() => { browserHistory.push('/'); this.props.initSearch(); }}></div>
                    </div>
                    <div className="header-searchIcon" onClick={() => browserHistory.push('/')}>
                    </div>
                    <div className="header-searchIcon" onClick={() => browserHistory.push('/')}>
                        <IconButton className="searchIcon" hoveredStyle={{ backgroundColor: '#ffd800' }} iconStyle={{ color: 'white', fontSize: 30 }} style={{ backgroundColor: '#1b1b1b' }}><SearchIcon /></IconButton>
                    </div>
                </div> 
            </div>
        );
    }
}

HeaderSite.propTypes = {
    logoClicked: PropTypes.func,
    initSearch: PropTypes.func,
};

export function mapStateToProps() {
    return {
    };
}

export function mapDispatchToProps(dispatch) {
    return {
        initSearch: () => {
            dispatch(initSearch());
        },
    };
}


export default connect(mapStateToProps, mapDispatchToProps)(HeaderSite);