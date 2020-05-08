import NonDeterministicFiniteStateMachine, { LAMBDA } from './NonDeterministicFiniteStateMachine';
import DeterministicFiniteStateMachine from './DeterministicFiniteStateMachine';
const tests = {
  divisibleBy4: {
    description: {
      transitions: {
        start: {
          [LAMBDA]: ['zero', 'startWith1'],
        },
        startWith1: {
          0: ['startWith1', 'div2'],
          1: ['startWith1'],
        },
        div2: {
          0: ['div4'],
        },
        zero: {
          0: ['zero'],
        },
      },
      startState: 'start',
      acceptStates: ['div4', 'zero'],
    },

    tests: {
      accepts: [
        '0100',
        '01000',
        '0100',
        '0',
        '',
      ],
      rejects: [
        '10',
        '11',
        '1001011',
      ],
    }
  },
  divisibleBy4InfiniteLambda: {
    description: {
      transitions: {
        start: {
          [LAMBDA]: ['zero', 'startWith1'],
        },
        startWith1: {
          0: ['startWith1', 'div2'],
          1: ['startWith1'],
        },
        div2: {
          [LAMBDA]: ['startWith1'],
          0: ['div4'],
        },
        zero: {
          [LAMBDA]: ['start'],
          0: ['zero'],
        },
      },
      startState: 'start',
      acceptStates: ['div4', 'zero'],
    },
    tests: {
      accepts: [
        '0100',
        '01000',
        '0100',
        '0',
        '',
      ],
      rejects: [
        '10',
        '11',
        '1001011'
      ],
    }
  },
};

describe('examples', () => {
  for (const [key, desc] of Object.entries(tests)) {
    describe(key, () => {
      test('transition', () => {
        const { description } = desc;

        const fsm = new NonDeterministicFiniteStateMachine(description);
        for (const [state, stateTransitions] of Object.entries(description.transitions)) {
          for (const [symbol, nextState] of Object.entries(stateTransitions)) {
            expect(fsm.transition(state, symbol)).toEqual(nextState);
          }
        }
      });
      test('accepts / rejects', () => {
        const { description, tests: { accepts, rejects } } = desc;
        const fsm = new NonDeterministicFiniteStateMachine(description);
        for (const string of accepts) {
          expect(`${string}: ${fsm.accepts(string)}`).toEqual(`${string}: true`);
        }

        for (const string of rejects) {
debugger
          expect(`${string}: ${fsm.accepts(string)}`).toEqual(`${string}: false`);
        }
      });
	  
	  test('NFA to DFA', () => {
        const { description, tests: { accepts, rejects } } = desc;
		const fsm = new NonDeterministicFiniteStateMachine(description);
		const dfa = new DeterministicFiniteStateMachine(fsm.toDFA(fsm));
		for(const string of accepts){
			expect(`${string}: ${dfa.accepts(string)}`).toEqual(`${string}: true`);
		}
		for(const string of rejects){
			expect(`${string}: ${dfa.accepts(string)}`).toEqual(`${string}: false`);
		}
	  });
    });
  }
});

