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
	
	// iterating through possible next tstes after final token transition
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
}

