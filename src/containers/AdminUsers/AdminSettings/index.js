import React from 'react';
import { Checkbox, RadioButton, RadioButtonGroup } from 'material-ui';

import './AdminSettings.scss';
class AdminSettings extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activeMapTab: false,
            activeSearchTab: true,
            defaultTab: 'Map tab'
        };

    }
    render() {
        let { activeSearchTab, activeMapTab } = this.state;
        return (
            <div id="settings" className="admin-settings">
                <span>Pסדשגשדגages</span>
                <br />
                <span>Check which tabs to show:</span>
                <Checkbox
                    label="Search"
                    onCheck={() => this.setState({ activeSearchTab: !activeSearchTab })}
                    checked={activeSearchTab}
                />
                <Checkbox
                    label="Map"
                    onCheck={() => this.setState({ activeMapTab: !activeMapTab })}
                    checked={activeMapTab}
                />

                {activeSearchTab && activeMapTab ?
                    <div>
                        <br />
                        <span>Select default tab:</span>
                        <div className="change">
                            <input type="radio" name='Search tab' value="1" checked={this.state.defaultTab === 'Search tab'}
                                onClick={(event) => {
                                    this.setState({ defaultTab: 'Search tab' });
                                }} />
                            <label>Search tab</label>
                        </div>
                        <div className="change">
                            <input type="radio" name='Map tab' value="2" checked={this.state.defaultTab === 'Map tab'}
                                onClick={(event) => {
                                    this.setState({ defaultTab: 'Map tab' })
                                }} />
                            <label>Map tab</label>
                        </div>
                    </div> : ''}
            </div>
        );
    }
}
export default AdminSettings;











