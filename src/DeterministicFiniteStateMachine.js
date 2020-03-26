export default class DeterministicFiniteStateMachine {

  /**
   */
  constructor({ transitions, startState, acceptStates }) {
    this.transitions = transitions;
    this.startState = startState;
    this.acceptStates = acceptStates;
  }

  alphabet() {
    const alphabet = new Set();
    
    for(const [state, desc] of Object.entries(this.transitions)) {
      for(const symbol of Object.keys(desc)) {
        alphabet.add(symbol);
      }
    }

    return alphabet.values();
  }

  states() {
    return new Set(Object.keys(this.transitions));
  }

  stateAccepted(state) {
    return this.acceptStates.includes(state);
  }

  /**
   *
   * @returns a string state name
   */
  transition(state, symbol) {
    if(!this.transitions[state]) return;
    return this.transitions[state][symbol];
  }

  accepts(string, state = this.startState) {
    const nextState = this.transition(state, string.charAt(0));
    return (string.length === 0) ? this.stateAccepted(state) :
                                   this.accepts(string.substr(1), nextState);
  }

}

/**
 *
 */
export function cross(dfa1, dfa2, accepts = (dfa1State, dfa2State) => true) {
  const acceptStates = [];
  const transitions = {};
  const alphabet = new Set([...dfa1.alphabet(), ...dfa2.alphabet()]);

  // A function which returns a state name for a state in machine 1 and a state in machine 2 
  const stateName = (state1, state2) => `m1:${state1}xm2:${state2}`;

  const startState = stateName(dfa1.startState, dfa2.startState);
  const unresolvedStates = [{ state: startState, state1: dfa1.startState, state2: dfa2.startState }];

  while(unresolvedStates.length > 0) {
    const { state1, state2, state } = unresolvedStates.pop();

    transitions[state] = {};
    if(accepts(state1, state2)) acceptStates.push(state);

    for(const symbol of alphabet) {
      const nextState1 = dfa1.transition(state1, symbol);
      const nextState2 = dfa2.transition(state2, symbol);

      const nextState = stateName(nextState1, nextState2);
      transitions[state][symbol] = nextState;

      if(!transitions[nextState]) {
        // recording that we need to process this state
        unresolvedStates.push({ state: nextState, state1: nextState1, state2: nextState2 });
      }
    }
  } 

  return new DeterministicFiniteStateMachine({
    acceptStates,
    startState,
    transitions
  });
}

export function union(dfa1, dfa2) {
  return cross(dfa1, dfa2, 
    (state1, state2) => dfa1.stateAccepted(state1) || dfa2.stateAccepted(state2));
}

export function intersection(dfa1, dfa2) {
  return cross(dfa1, dfa2, 
    (state1, state2) => dfa1.stateAccepted(state1) && dfa2.stateAccepted(state2));
}

export function minus(dfa1, dfa2) {
  return cross(dfa1, dfa2, 
    (state1, state2) => dfa1.stateAccepted(state1) && !dfa2.stateAccepted(state2));
}

export function minimize(dfa, groups = [ [...dfa.states()] ]) {
	const behaviors = {};
	
	const findgroup = state => {
		for(const group of groups){
			if(group.includes(state)) return group;
		}
	};
	
	const behaviorkey = state =>{
		let behaviorstring = `accepted=${dfa.stateAccepted(state)}`;
		for (const symbol of dfa.alphabet()){
			const nextState = dfa.transition(state, symbol);
			const group = findgroup(nextState)
			behaviorstring = `${behaviorstring},${symbol}=${group.join('-')}`;
		}
		return behaviorstring
	};
	
	for (const state of dfa.states()){
		const key = behaviorkey(state);
		
		if(!behaviors[key]) behaviors[key] = [];
		behaviors[key].push(state);
	}
	
	const newgroups = Object.values(behaviors);
	if(newgroups.length === groups.length){
		const transitions = {};
		const acceptStates = [];
		
		const needstransitions = [findgroup(dfa.startState)];
		
		while(needstransitions.length > 0){
			const group = needstransitions.pop();
			
			const state = group.join('-');
			
			if(dfa.stateAccepted(group[0])) acceptStates.push(state);
			
			transitions[state] = {};
			
			for(const symbol of dfa.alphabet()){
				const nextState = dfa.transition(group[0], symbol);
				const nextstategroup = findgroup(nextState);
				
				const newnextstate = nextstategroup.join('-');
				
				transitions[state][symbol] = newnextstate;
				
				if(!transitions[newnextstate]) needstransitions.push(nextstategroup);
				
			}
		}
		const startState = findgroup(dfa.startState).join('-');
		
		return new DeterministicFiniteStateMachine({transitions, startState, acceptStates});
	} else {
		return minimize(dfa, newgroups)
	}
}