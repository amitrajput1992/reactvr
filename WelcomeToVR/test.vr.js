/* globals document */
import React  from 'react';
import ReactDOM  from 'react-dom';

class Test extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return(
      <div>testing here bruh!!!!!!!!!!!!!!!!!!!!!!!!!!!
      nothign impoortant hereeeeeee!!!!!!
      </div>
    );
  }
}

function init() {
  console.log("here");
  //ReactDOM.render(<Test/>, document.querySelector('#yolo'));
}
init();