import React from 'react';
import PropTypes from 'prop-types';

const JsonObject = (props) => (
  props.jsonObj ?
  <div style={{textAlign: 'left', display: 'inline-block', marginLeft: '50px', marginRight: '50px'}}>
    <h3>Json Data</h3>
    <pre>
      { JSON.stringify(props.jsonObj, null, 2) }
    </pre>
  </div> :
  null
);

JsonObject.propTypes = {
  jsonObj: PropTypes.object,
};

export default JsonObject;
