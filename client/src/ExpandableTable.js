import React from "react";
import { Component } from "react";

//Component to create any arbitrary expandable table
//props: rowItems is an array of row data to put in the table
//       columns is a description of the column display names and their
//keys in the rowItem array
//       expansion is a React component that with by loaded with each row data as its property to display when the row is expanded
class ExpandedTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            expandedRows: []
        };
    }

    //Takes a row item and toggles its expansion
    handleExpand = (rowItem) => {
        let newExpandedRows = [...this.state.expandedRows];
        let indexFound = newExpandedRows.findIndex(id => {
            return id === rowItem.id;
        });

        if (indexFound > -1) {
            //Collapse given row, remove from expanded list
            newExpandedRows.splice(indexFound, 1);
        } else {
            //Expand given row, add to expanded list
            newExpandedRows.push(rowItem.id);
        }

        this.setState({ expandedRows: [...newExpandedRows] });
    };

    //Returns true if the given rowItem is expanded
    isExpanded = (rowItem) => {
        const index = this.state.expandedRows.find(id => {
            return id === rowItem.id;
        });

        return index > -1;
    };

    //Expands all unexpanded rows. If all are expanded, collapses all
    expandAll = (rowItems) => {
        if (this.state.expandedRows.length === rowItems.length) {
            //All are expanded, so collapse all
            let newExpandedRows = [];
            this.setState({ expandedRows: [...newExpandedRows] });
        } else {
            //Add all rows to list of expanded
            let newExpandedRows = rowItems.map(rowItem => rowItem.id);
            this.setState({ expandedRows: [...newExpandedRows] });
        }
    };

    //Returns row showing row item information. If the row is expanded,
    //also returns the expansion row below
    getRows = (rowItem) => {
        let rows = [];

        const firstRow = (
            <tr key={rowItem.id}>
                {this.props.columns.map((column) => {
                    return <td key={column.key}>{rowItem[column.key]}</td>
                })}
                <td>
                    <button onClick={() => this.handleExpand(rowItem)}>
                        {this.isExpanded(rowItem) ? "-" : "+"}
                    </button>
                </td>
            </tr>
        );

        rows.push(firstRow);

        if (this.isExpanded(rowItem)) {
            const expansionRow =
                <tr key={rowItem.id + "-expand"} className="row-expansion">
                    <td className="row-expansion" />
                    <td colSpan="100%" className="row-expansion">
                        <br />
                            {this.props.children}
                        <br />
                    </td>
                </tr>
                ;
            rows.push(expansionRow);
        }

        return rows;
    };

    getTable = rowItems => {
        //Creates an array of all the rows included expanded expansions
        const allRows = rowItems.map(rowItem => {
            return this.getRows(rowItem);
        });

        return (
            <table className="my-table">
                <thead>
                    <tr>
                        {this.props.columns.map((column) => {
                            return <th key={column.key}>{column.display}</th>
                        })}
                        <th onClick={() => this.expandAll(rowItems)}>
                            <button>
                                {rowItems.length === this.state.expandedRows.length ? "-" : "+"}
                            </button>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {allRows}
                </tbody>
            </table>
        );
    };

    render() {
        return <div>{this.getTable(this.props.rowItems)}</div>;
    }
}

export default ExpandedTable;
