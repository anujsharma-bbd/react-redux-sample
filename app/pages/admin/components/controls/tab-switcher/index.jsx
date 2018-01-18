import React from "react"; 
/**
 * Component to create swith control
 */
class TabSwitchControl extends React.Component
{
   constructor(props){
       super(props);
       this.tabClick = this.tabClick.bind(this);
   }
   /**
    * fire tab click event
    */
  tabClick(tabObj){
      if(this.props.onTabChange)
        this.props.onTabChange(tabObj);
  }
  /**
   * render html
   */
 render(){

    const DEFAULTTABS=[{text:"Tab1",key:1,isSelected:true},{text:"Tab2",key:2,isSelected:false}];
    this.tabs=this.props.tabs || DEFAULTTABS;
    return (       
            <div className="tab-switch-control">
            {
                this.tabs.map((tab,index)=>{
                    return (
                        <div className={tab.isSelected?"tab-switch selected":"tab-switch"} onClick={()=>this.tabClick(tab)} key={"tab-id-"+index} >
                            {tab.text}
                        </div>
                    );
                })                
            }
               <div className="clear"></div>
            </div> 
    );
 }
} 
export default TabSwitchControl; 