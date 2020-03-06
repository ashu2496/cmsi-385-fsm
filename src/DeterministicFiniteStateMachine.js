export default class DeterministicFiniteStateMachine {

  /**
   */
  constructor({ transitions, startState, acceptStates }) {
    this._transitions = transitions;
    this._startState  = startState;
    this._acceptStates = acceptStates;
  }
  /**
   *
   * @returns a string state name
   */
  transition(state, symbol) {
    return this._transitions[state][symbol];
  }

  accepts(string, state = this._startState) {
    let i;
	let currentstate = state;
	let token = string.charAt(0);
	for (i = 0; i < (string.length); i++)
	{
		token = string.charAt(i);
		currentstate = this.transition(currentstate,token);
	}
	return this._acceptStates.includes(currentstate)
	
	}

}
