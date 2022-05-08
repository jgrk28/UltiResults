import React from "react";

//Test component to make sure the ExpandableTable can work with an arbitrary expansion component
//Data from the expanded row will be passed as the parentData prop
class Test extends React.Component {
    render() {
        return (
            <div className="testing">
                {this.props.parentData.name}
            </div>
        )
    }
};

export default Test;