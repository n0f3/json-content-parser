import React from 'react';
import PropTypes from 'prop-types';

const GoogleSheet = (props) => (
    (props.spreadsheetId &&
    props.isSignedIn) ?
    <div style={{display: 'inline-block'}}>
      <iframe 
        src={props.sheetUrl} 
        frameBorder="1" 
        headers={false} 
        title='gdoc'
        width={props.width}
        height={props.height}>
      </iframe>
    </div> :
    null
);

GoogleSheet.propTypes = {
  spreadsheetId: PropTypes.string,
  isSignedIn: PropTypes.bool.isRequired,
  width: PropTypes.string.isRequired,
  height: PropTypes.string.isRequired,
  sheetUrl: PropTypes.string,
};

export default GoogleSheet;
