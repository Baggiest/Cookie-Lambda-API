const keyCollection = require('../keys.json')

module.exports = class verifier {

    async verifySecretKey(inputKey) {

        for (let keys of keyCollection) {

            let sussy = keys.key // no one is reading this anyway

            if (sussy === inputKey) return true;
        }
        return false;
    }

    // verifyInput(obj) {

    // }
}
