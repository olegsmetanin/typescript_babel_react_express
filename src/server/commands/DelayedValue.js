var Command_1 = require('./../interfaces/Command');
class DelayedValue extends Command_1.default {
    constructor(value, wait) {
        super();
        this.wait = wait;
        this.value = value;
    }
    internalExecute() {
        return new Promise(resolve => setTimeout(() => resolve(this.value), this.wait));
    }
}
exports.DelayedValue = DelayedValue;
