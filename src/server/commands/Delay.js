var Command_1 = require('./../interfaces/Command');
class Delay extends Command_1.default {
    constructor(wait) {
        super();
        this.wait = wait;
    }
    internalExecute() {
        return new Promise(resolve => setTimeout(resolve, this.wait));
    }
}
exports.Delay = Delay;
