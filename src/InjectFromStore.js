import {connect} from 'redux-zero/react';

/*
This component connects to the store and provides selected state and dispatch to its children. Example:
<InjectFromStore select={(state)=>({message:state.snackbarMessage})}>
    { (props) => <Snackbar message={props.message}/> }
</InjectFromStore>
*/
const InjectFromStore = ({ children, state, dispatch }) => children(state, dispatch);

const defaultSelector = (state) => state; // pass the whole state íf no selector is given

export default connect(
  (state, { select = defaultSelector }) => ({ state: select(state) }),
  dispatch => ({ dispatch }),
)(InjectFromStore);

