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
	for (let i = 0; i < (string.length) ; i++){
		
		token = string.charAt(i);
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
	for (let  i = 0; i < nextstates.length ;i++){
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

