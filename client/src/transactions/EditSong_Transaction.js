import jsTPS_Transaction from "../common/jsTPS";

export default class EditSong_Transaction extends jsTPS_Transaction {
    constructor(store, index, tempSong, originSong) {
        super();
        this.store = store;
        this.index = index;
        this.tempSong = tempSong;
        this.originSong = originSong;
    }

    doTransaction() {
        this.store.editSong(this.index, this.tempSong);
    }

    undoTransaction() {
        this.store.editSong(this.index, this.originSong);
    }
}