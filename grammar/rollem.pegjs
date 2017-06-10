{
	let assert = (predicate, raiseText) => { if(!predicate) { throw raiseText; } };
	let assertType = (value, name, type) => assert(typeof value === type, 'RollemHooks.' + name + ' ' + type + ' must be provided.');
	let assertFunction = (value, name) => assertType(value, name, 'function');

	assert(typeof RollemHooks === 'object', 'RollemHooks object must be provided.');

	assertFunction(RollemHooks.rollEvaluator, 'rollEvaluator');
	assertFunction(RollemHooks.make.basicRoll, 'make.basicRoll');
	assertFunction(RollemHooks.make.simpleRoll, 'make.simpleRoll');
	assertFunction(RollemHooks.make.integer, 'make.integer');
	assertFunction(RollemHooks.make.string, 'make.string');
}

// The entry point.
start
	= result:SimpleRoll label:Label?{
		return {
			label: label,
			result: result
		};
	}


SimpleRoll
	= [dD] right:Integer {
		return RollemHooks.make.simpleRoll(right);
	}

// A basic XdY roll.
BasicRoll
	= left:Integer [dD] right:Integer {
		return RollemHooks.make.basicRoll(left, right);
	}

Label
 = [^]* {
 	return text();
 }

Integer "integer"
	= [0-9]+ {
		return RollemHooks.make.integer(text());
	}

_ "whitespace"
	= [	 \n\r]*

_____ "forced whitespace"
	= [	 \n\r]+
