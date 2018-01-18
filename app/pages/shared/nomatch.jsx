import React from 'react';

class NoMatch extends React.Component {
   constructor(props) {
       super(props);
   }

   render() {
      return (
            <div id="content" className="content"> 
            <div className="nopage-found-container">
              <h1 className="nopage-found">404, Page not Found!!!</h1>
            </div>
           </div>
      );
  }


}

export default NoMatch;
