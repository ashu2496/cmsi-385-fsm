import DeterministicFiniteStateMachine from './DeterministicFiniteStateMachine';

export const LAMBDA = '';

export default class NonDeterministicFiniteStateMachine extends DeterministicFiniteStateMachine {

  /**
   */
  constructor(description) {
    super(description);
  }


  /**
   *
   * @returns a string state name
   */
  transition(state, symbol) {
    if(!this.transitions[state]) return [];
    return this.transitions[state][symbol] || [];
  }

  accepts(string, state = this.startState) {
    let nextstates = [];
	nextstates.push(state);
	let token = string.charAt(0);
	
	//loop for iterating through each token of string
	for (let i = 0; i < (string.length) ; i++){
		
		token = string.charAt(i);
		
		//loop for adding possble states after lamda transition
		let j = 0;
		while(j < (nextstates.length)){
			if(this.transition(nextstates[j],[[LAMBDA]])!= undefined){
				for (let k = 0; k < (this.transition(nextstates[j],[[LAMBDA]])).length ; k++ ){
					if (!nextstates.includes(this .transition(nextstates[j],[[LAMBDA]])[k])){
						nextstates.push(this.transition(nextstates[j],[[LAMBDA]])[k])
					}
				}
			}
			j = j + 1;
		}
		
		//loop for finding possible next states with token transition
		let newnextstates = [];
		for (let j = 0; j < (nextstates.length); j++){
			if((this.transition(nextstates[j],token)) != undefined){
				for (let k = 0; k < (this.transition(nextstates[j],token)).length ; k++ ){
					newnextstates.push(this.transition(nextstates[j],token)[k])
				}	
			}
		}
		nextstates = newnextstates;
	}
	let accepted = 0;
	
	// iterating through possible next states after final token transition
	for (let  i = 0; i < nextstates.length ;i++){
		
		// adding lamda transition possible states
		let j = 0;
		while(j < (nextstates.length)){
			if(this.transition(nextstates[j],[[LAMBDA]])!= undefined){
				for (let k = 0; k < (this.transition(nextstates[j],[[LAMBDA]])).length ; k++ ){
					if (!nextstates.includes(this .transition(nextstates[j],[[LAMBDA]])[k])){
						nextstates.push(this.transition(nextstates[j],[[LAMBDA]])[k])
					}
				}
			}
			j = j + 1;
		}
		
		//checking whether any state is in accpt states
		if (this.acceptStates.includes(nextstates[i])){
			accepted = 1;
		}
	}
	if (accepted == 0){
		return "false";
	}
	else{
		return "true";
	}
  }
  reachableByLambda(state){
	  let states = [state];
	  let j = 0;
		while(j < (states.length)){
			if(this.transition(states[j],[[LAMBDA]])!= undefined){
				for (let k = 0; k < (this.transition(states[j],[[LAMBDA]])).length ; k++ ){
					if (!states.includes(this .transition(states[j],[[LAMBDA]])[k])){
						states.push(this.transition(states[j],[[LAMBDA]])[k])
					}
				}
			}
			j = j + 1;
		}
		return states;
  }
  getAcceptStates(){
	  return this.acceptStates;
  }
  possibleNextStates(state,symbol){
	 let states = [state];
	 let nextstates = [];
	 //console.log(states);
	 let j = 0;
	while(j < (states.length)){
		if(this.transition(states[j],[[LAMBDA]])!= undefined){
			for (let k = 0; k < (this.transition(states[j],[[LAMBDA]])).length ; k++ ){
				if (!states.includes(this .transition(states[j],[[LAMBDA]])[k])){
					states.push(this.transition(states[j],[[LAMBDA]])[k])
				}
			}
		}
		j = j + 1;
	}
	 j=0;
	 while(j<states.length)
	 {
		 if((this.transition(states[j],symbol)) != undefined){
				for (let k = 0; k < (this.transition(states[j],symbol)).length ; k++ ){
					if(!nextstates.includes(this.transition(states[j],symbol)[k]))
					{
						nextstates.push(this.transition(states[j],symbol)[k]);
					}
				}	
			}
		 j=j+1;
	 }
	 j = 0;
	while(j < (nextstates.length)){
		if(this.transition(nextstates[j],[[LAMBDA]])!= undefined){
			for (let k = 0; k < (this.transition(nextstates[j],[[LAMBDA]])).length ; k++ ){
				if (!nextstates.includes(this .transition(nextstates[j],[[LAMBDA]])[k])){
					nextstates.push(this.transition(nextstates[j],[[LAMBDA]])[k])
				}
			}
		}
		j = j + 1;
	}
	 return nextstates;
  }
  
  toDFA(nfa){
	  let deadFlag = 0;
	  let startState = this.reachableByLambda(this.startState).join();
	  const acceptStates = [];
	  const alphabet = new Set([...this.alphabet()]); alphabet.delete(LAMBDA);
	  const unresolvedStates = [{state : startState}];
	  const transitions = {};
	  while(unresolvedStates.length>0){
		  const {state} = unresolvedStates.pop();
		  transitions[state.split(',').sort().join("")] = {};
		  for(const acceptState of this.getAcceptStates()){
			  if(state.includes(acceptState)){
				  acceptStates.push(state.split(',').sort().join(""));
			  }
		  }
		  for(const symbol of alphabet){
			  let nextState = '';
			  for(const singleState of state.split(',')){
				  if(this.possibleNextStates(singleState, symbol).size != 0){
					  const partialNext = [...this.possibleNextStates(singleState, symbol)];
					  if(nextState==''){
						nextState = partialNext.sort().join(",");
					  }
					  else
					  {
						  if(!nextState.includes(partialNext.sort().join(","))){
							  nextState = nextState + ',' + partialNext.sort().join(",");
						  }
					  }
				  }	
			  }
			  if(nextState == ''){
				  transitions[state.split(',').sort().join("")][symbol] = ['DEAD'];
				  deadFlag = 1;
			  }
			  else{
				  transitions[state.split(',').sort().join("")][symbol]=[nextState.split(',').sort().join("")];
				  if(!transitions[nextState.split(',').sort().join("")]){
					  unresolvedStates.push({state:nextState});
				  }
			  }
		  }
	  }
	  if (deadFlag == 1)
	  {
		  transitions['DEAD'] = {};
		  for(const symbol of alphabet)
		  {
			  transitions['DEAD'][symbol] = ["DEAD"]
		  }
	  }
	  startState = startState.split(',').sort().join("");
	  return new DeterministicFiniteStateMachine({
		  transitions,
		  startState,
		  acceptStates
	  });
	}
}