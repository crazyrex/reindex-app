import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ImageMapper from 'react-image-mapper';
import { loadLandscapes, landscapesLoaded } from './actions';
import { getSetting } from './../../components/Settings/actions';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import  './style.css';

class Landscape extends React.PureComponent {
    constructor(props) {
        super(props);
        this.onMouseEnter = this.onMouseEnter.bind(this);
        this.onMouseLeave = this.onMouseLeave.bind(this); 
        this.onClick = this.onClick.bind(this); 
        this.state = {
            display: 'none',
            width: 1407,
            height: 796
        };
        this.props.loadLandscape(); 
    }

    onClick(area, index, event) {
        location.href = 'biz/' + area.recordId + '/' + area.business_name;
    }

    onMouseEnter(area, index, event) {
        this.setState({top: (parseInt(area.coords[1])-30)+'px',
         left: area.coords[0]+'px',
         display:'block',
         business_name:area.business_name,
         description: area.business_description,
         founder:area.founder
        });
    }

    onMouseLeave(area, index, event) {
        this.setState({display:'none'});
    }

    componentDidMount() {
        this.props.loadImage();
    }
    
    render() {
        return (
            <div>
                <div className="tooltip" style={{display: this.state.display, top:this.state.top, left:this.state.left}}>
                <h1>{this.state.business_name}</h1>
                {this.state.description}<br/>
                founded: {this.state.founder}
                </div>
                {this.props.settings.landscapeImage ? 
                    <ImageMapper src={this.props.settings.landscapeImage}
                        onMouseEnter={this.onMouseEnter}
                        onMouseLeave={this.onMouseLeave}
                        onClick={this.onClick}
                        map={{"name": "my-map","areas": this.props.data.landscapes}}
                        width={this.state.width}/> :
                    <div>loading...</div> 
                }
                
            </div>
        )
    }
}

Landscape.propTypes = {
    loadLandscapes: PropTypes.func,
    loadImage: PropTypes.func
};

export function mapStateToProps(state) {
    return {
        data: state.landscapes,
        settings: state.settings.setting 
    };
}

export function mapDispatchToProps(dispatch) {
    return {
        loadLandscape: () => {
            dispatch(loadLandscapes());
        },
        loadImage: () => {
            dispatch(getSetting('landscapeImage'));
        }
    };
}
export default connect(mapStateToProps, mapDispatchToProps)(Landscape);