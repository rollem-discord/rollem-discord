@preprocessor typescript
@builtin "number.ne"
@{% import { makeInteger } from "./evaluators"; %}

expression -> number "+" number {%
    function(data: (number | string)[]) {
        return {
            operator: "sum",
            leftOperand:  data[0] as string,
            rightOperand: data[2] // data[1] is "+"
        };
    }
%}
expression -> number "-" number
expression -> number "*" number
expression -> number "/" number
number -> [0-9]:+ {% d => makeInteger(d[0].join("")) %}