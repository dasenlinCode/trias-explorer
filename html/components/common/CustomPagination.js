import React from "react"
import $ from 'jquery';
import { Pagination } from 'react-bootstrap';   // import Pagination component
import {injectIntl, intlShape, FormattedMessage } from 'react-intl'; /* react-intl imports */
import DropdownList from "./DropdownList";     // import custom drop-down list component

/**
 * Custom pagination component.
 * Combined with pagenation component of React-Bootstrap.
 * Usage:
 * <CustomPagination
 *  from={(this.currentPage-1)*this.state.rowsPerPage}
 *  to={this.currentPage*this.state.rowsPerPage}
 *  totalItemsCount={this.state.totalItemsCount}
 *  totalPagesCount={this.state.pageCount}
 *  currentPage={this.currentPage}
 *  onChangeRowsPerPage={(num)=>this.setRowsPerPage(num)}
 *  onSelectPage={(e)=>this.handleSelectPage(e)}
 *  onPageInputKeyDown={(e)=>this.jumpPageKeyDown(e)}
 *  onClickJumpButton={()=>this.handleJumpPage()}
 *  pageNumInputId="logsPage"
 *  dropdownListId="rowsPerPageList"
 *  rowsPerPageRange={[{name: '50 项/页',value: 50},
 *      {name: '100 项/页',value: 100},
 *      {name: '150 项/页',value: 150},
 *      {name: '200 项/页',value: 200}]}
 * />
 * 
 * Attributes:
 * - from: index of first row in current page. 0 by default.
 * - to: index of last row in current page. 0 by default.
 * - totalItemsCount: total number of items. 0 by default.
 * - totalPagesCount: total number of pages. 0 by default.
 * - currentPage: current page number. 0 by default.
 * - onChangeRowsPerPage: handler for the change of maximum number of rows per page.
 * - onSelectPage: handler for the change of current page number by clicking buttons in the pagination.
 * - onPageInputKeyDown: event handler for the change event of the page number input area.
 * - onClickJumpButton: event handler for the keydown event of the page number input area.
 * (Optional:)
 * - pageNumInputId: id of the page number <input>, required when there are multiple CustomPaginations in a page. 'inputPageNum' by default.
 * - dropdownListId: id of the DropdownList, required when there are multiple CustomPaginations or DropdownLists in a page. 'rows-per-page-list' by default.
 * - rowsPerPageRange: options for the drop-down list of the maximum number of rows per page
 */
class CustomPagination extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            from:this.props.from || 0,  // index of first row in current page, 0 by default
            to:this.props.to || 0,      // index of last row in current page, 0 by default
            totalItemsCount: this.props.totalItemsCount || 0,   // total number of items, 0 by default
            totalPagesCount: this.props.totalPagesCount || 0,   // total number of pages, 0 by default
            currentPage: this.props.currentPage || 0,           // current page number, 0 by default
            pageNumInputId: this.props.pageNumInputId || "inputPageNum",        // id of the page number <input>, 'inputPageNum' by default
            dropdownListId: this.props.dropdownListId || "rows-per-page-list",  // id of the DropdownList, 'rows-per-page-list' by default
            // lang: this.props.intl.locale,    // current locale language
        }
    }

    /**
     * Before a mounted component receives new props, reset some state.
     * @param {Object} nextProps new props
     */
    componentWillReceiveProps (nextProps) {   
        this.setState({
            from: nextProps.from || 0,
            to: nextProps.to || 0,
            totalItemsCount: nextProps.totalItemsCount || 0, 
            totalPagesCount: nextProps.totalPagesCount || 0,
            currentPage: nextProps.currentPage || 0,
        })
        // if locale language will be changed, reset lang state
        // if(this.state.lang != nextProps.intl.locale){
        //     this.setState({
        //         lang: nextProps.intl.locale
        //     })
        // }       
    }

    /**
     * qhen input value of page number changed, check the format
     */
    onChangeInputPage(e) {
        var re = /^[0-9]+$/
        var pagenum = e.target.value      //get put in page num
        // the value should be positive interger, and not exceed the maximum number of pages
        if (pagenum != "" && (!re.test(pagenum) || pagenum == 0 || pagenum > this.state.totalPagesCount)) {
            $('#'+this.state.pageNumInputId).val('');   // clear the input
        }
    }

    render(){
        return (
            <div className="pagination-all clearfix">
                {/* select the maximum number of rows per page*/}
                <div className="rowsPerPage pc">
                    <DropdownList
                        listID={this.state.dropdownListId}
                        itemsToSelect={this.props.rowsPerPageRange || [
                            {
                                name: this.props.intl.locale==='zh'?'10 项/页':'10 / page',
                                value: 10      
                            }, {
                                name: this.props.intl.locale==='zh'?'20 项/页':'20 / page',
                                value: 20
                            }, {
                                name: this.props.intl.locale==='zh'?'30 项/页':'30 / page',
                                value: 30
                            }, {
                                name: this.props.intl.locale==='zh'?'40 项/页':'40 / page',
                                value: 40
                            }, {
                                name: this.props.intl.locale==='zh'?'50 项/页':'50 / page',
                                value: 50
                            }, 
                        ]}
                        onSelect={(item) => this.props.onChangeRowsPerPage(item)} />
                    <p className='itemsCount'>
                        <FormattedMessage id='paginationItemsCountP' values={{from: this.state.from, to: this.state.to, count: this.state.totalItemsCount}} />
                    </p>
                </div>
                <div className="pagination-right clearfix pc">
                    <Pagination
                        prev="Previous"
                        next="Next"
                        first={false}
                        last={false}
                        ellipsis={true}
                        boundaryLinks={true}
                        items={this.state.totalPagesCount}
                        maxButtons={3}
                        activePage={this.state.currentPage}
                        onSelect={this.props.onSelectPage.bind(this)} />
                </div>
                <div className="clearfix mobile">
                    <input type="button" 
                        disabled={this.state.currentPage<=1}
                        className="btn-prev" 
                        onClick={() => this.props.onSelectPage(this.state.currentPage-1)} 
                        value="Previous" />
                    {/* Use the key prop to force rendering of an entirely new input */}
                    <form action="javascript:return true;" id="pageNum" className="pageCount">
                        {/* disable refresh of  whole page */}
                        {/* <input type="text" name="test" style={{display:'none'}}/> */}
                        <input
                            className="pageNum"
                            id={this.state.pageNumInputId}
                            type="number"
                            key={this.state.currentPage}
                            defaultValue={this.state.currentPage}
                            onChange={this.onChangeInputPage.bind(this)}
                            onKeyDown={this.props.onPageInputKeyDown.bind(this)
                            }
                        />                       
                        <span className='totalPages'> of {this.state.totalPagesCount}</span>
                    </form>
                    <input type="button" 
                        disabled={this.state.currentPage>=this.state.totalPagesCount} 
                        className="btn-next" 
                        onClick={() => this.props.onSelectPage(this.state.currentPage+1)} 
                        value="Next"/>
                </div>                            
            </div>
        )
    }
}
/* Inject intl to NodeStatus props */
const propTypes = {
    intl: intlShape.isRequired,
};
CustomPagination.propTypes = propTypes
export default injectIntl(CustomPagination)