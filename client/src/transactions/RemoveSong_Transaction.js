import jsTPS_Transaction from "../common/jsTPS";

export default class RemoveSong_Transaction extends jsTPS_Transaction {
    constructor(store, index) {
        super();
        this.store = store;
        this.index = index;
    }

    doTransaction() {
        this.store.removeSong(this.index);
    }

    undoTransaction() {
        this.store.redoRemoveSong(this.index);
    }
}