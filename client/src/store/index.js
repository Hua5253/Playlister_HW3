import { createContext, useState } from 'react'
import jsTPS from '../common/jsTPS'
import api from '../api/index'
import AddSong_Transaction from '../transactions/AddSong_Transaction';
import RemoveSong_Transaction from '../transactions/RemoveSong_Transaction';
import MoveSong_Transaction from '../transactions/MoveSong_Transaction';
import EditSong_Transaction from '../transactions/EditSong_Transaction';

export const GlobalStoreContext = createContext({});
/*
    This is our global data store. Note that it uses the Flux design pattern,
    which makes use of things like actions and reducers. 
    
    @author McKilla Gorilla
*/

// THESE ARE ALL THE TYPES OF UPDATES TO OUR GLOBAL
// DATA STORE STATE THAT CAN BE PROCESSED
export const GlobalStoreActionType = {
    CHANGE_LIST_NAME: "CHANGE_LIST_NAME",
    CLOSE_CURRENT_LIST: "CLOSE_CURRENT_LIST",
    CREATE_NEW_LIST: "CREATE_NEW_LIST",
    DELETE_LIST: "DELETE_LIST",
    LOAD_ID_NAME_PAIRS: "LOAD_ID_NAME_PAIRS",
    SET_CURRENT_LIST: "SET_CURRENT_LIST",
    SET_LIST_NAME_EDIT_ACTIVE: "SET_LIST_NAME_EDIT_ACTIVE",
    MARK_LIST_FOR_DELETION: "MARK_LIST_FOR_DELETION",
    UPDATE_CURRENT_LIST: "UPDATE_CURRENT_LIST",
    MARK_SONG_FOR_CHANGE: "MARK_SONG_FOR_CHANGE",
    SONG_CHANGE: "SONG_CHANGE",
    LIST_MODAL_OPEN: "LIST_MODAL_OPEN",  // for fooproof design
    LIST_MODAL_CLOSE: "LIST_MODAL_CLOSE",
    REMOVE_SONG_MODAL_OPEN: "REMOVE_SONG_MODAL_OPEN",
    REMOVE_SONG_MODAL_CLOSE: "REMOVE_SONG_MODAL_CLOSE",
    EDIT_SONG_MODAL_OPEN: "EDIT_SONG_MODAL_OPEN",
    EDIT_SONG_MODAL_CLOSE: "EDIT_SONG_MODAL_CLOSE"
}

// WE'LL NEED THIS TO PROCESS TRANSACTIONS
const tps = new jsTPS();

const removedSongs = [];  // for redo remove song

let modal_open_status = false;  // for foolproof design

// WITH THIS WE'RE MAKING OUR GLOBAL DATA STORE
// AVAILABLE TO THE REST OF THE APPLICATION
export const useGlobalStore = () => {
    // THESE ARE ALL THE THINGS OUR DATA STORE WILL MANAGE
    const [store, setStore] = useState({
        idNamePairs: [],
        currentList: null,
        newListCounter: 0,
        listNameEditActive: false,
        listKeyPairMarkedForDeletion: null,
        songKeyMarked: 0,     
        tempSong: {title: "", artist: "", youTubeId: ""},
        isListModalOpen: false,
        isRemoveSongModalOpen: false,
        isEditSongModalOpen: false
    });

    // HERE'S THE DATA STORE'S REDUCER, IT MUST
    // HANDLE EVERY TYPE OF STATE CHANGE
    const storeReducer = (action) => {
        const { type, payload } = action;
        console.log(type);
        console.log(payload);
        switch (type) {
            // LIST UPDATE OF ITS NAME
            case GlobalStoreActionType.CHANGE_LIST_NAME: {
                return setStore({
                    idNamePairs: payload.idNamePairs,
                    currentList: null,
                    newListCounter: store.newListCounter,
                    listNameEditActive: false,
                    listKeyPairMarkedForDeletion: null,
                    songKeyMarked: 0,
                    tempSong: {title: "", artist: "", youTubeId: ""}
                });
            }

            // STOP EDITING THE CURRENT LIST
            case GlobalStoreActionType.CLOSE_CURRENT_LIST: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: null,
                    newListCounter: store.newListCounter - 1,
                    listNameEditActive: false,
                    listKeyPairMarkedForDeletion: null,
                    songKeyMarked: 0,
                    tempSong: {title: "", artist: "", youTubeId: ""}
                })
            }

            // CREATE A NEW LIST
            case GlobalStoreActionType.CREATE_NEW_LIST: {
                return setStore({
                    idNamePairs: payload.idNamePairs,
                    currentList: null,
                    newListCounter: store.newListCounter + 1,
                    listNameEditActive: false,
                    listKeyPairMarkedForDeletion: null,
                    songKeyMarked: 0,
                    tempSong: {title: "", artist: "", youTubeId: ""}
                })
            }

            // DELETE A PLAYLIST ->
            case GlobalStoreActionType.DELETE_LIST: {
                return setStore({
                    idNamePairs: payload,
                    currentList: null,
                    newListCounter: store.newListCounter,
                    listNameEditActive: false,
                    listKeyPairMarkedForDeletion: null,
                    songKeyMarked: 0,
                    tempSong: {title: "", artist: "", youTubeId: ""}
                })
            }

            // GET ALL THE LISTS SO WE CAN PRESENT THEM
            case GlobalStoreActionType.LOAD_ID_NAME_PAIRS: {
                return setStore({
                    idNamePairs: payload,
                    currentList: null,
                    newListCounter: store.newListCounter,
                    listNameEditActive: false,
                    listKeyPairMarkedForDeletion: null,
                    songKeyMarked: 0,
                    tempSong: {title: "", artist: "", youTubeId: ""}
                });
            }

            // PREPARE TO DELETE A LIST
            case GlobalStoreActionType.MARK_LIST_FOR_DELETION: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    newListCounter: store.newListCounter,
                    listNameEditActive: false,
                    listKeyPairMarkedForDeletion: payload,
                    songKeyMarked: 0,
                    tempSong: {title: "", artist: "", youTubeId: ""}
                });
            }

            // UPDATE A LIST
            case GlobalStoreActionType.SET_CURRENT_LIST: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    newListCounter: store.newListCounter,
                    listNameEditActive: false,
                    listKeyPairMarkedForDeletion: null,
                    songKeyMarked: 0,
                    tempSong: {title: "", artist: "", youTubeId: ""}
                });
            }

            // START EDITING A LIST NAME
            case GlobalStoreActionType.SET_LIST_NAME_EDIT_ACTIVE: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    newListCounter: store.newListCounter,
                    listNameEditActive: true,
                    listKeyPairMarkedForDeletion: null,
                    songKeyMarked: 0,
                    tempSong: {title: "", artist: "", youTubeId: ""}
                });
            }

            // ADD A NEW SONG TO THE PLAYLIST ->
            case GlobalStoreActionType.UPDATE_CURRENT_LIST: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    newListCounter: store.newListCounter,
                    listNameEditActive: false,
                    listKeyPairMarkedForDeletion: null,
                    songKeyMarked: 0,
                    tempSong: {title: "", artist: "", youTubeId: ""}
                })
            }

            case GlobalStoreActionType.MARK_SONG_FOR_CHANGE: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    newListCounter: store.newListCounter,
                    listNameEditActive: false,
                    listKeyPairMarkedForDeletion: null,
                    songKeyMarked: payload.index,
                    tempSong: payload.song
                })
            }

            case GlobalStoreActionType.SONG_CHANGE: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    newListCounter: store.newListCounter,
                    listNameEditActive: false,
                    listKeyPairMarkedForDeletion: null,
                    songKeyMarked: store.songKeyMarked,
                    tempSong: payload,
                    isEditSongModalOpen: true
                })
            }

            case GlobalStoreActionType.LIST_MODAL_OPEN: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    newListCounter: store.newListCounter,
                    listNameEditActive: store.listNameEditActive,
                    listKeyPairMarkedForDeletion: payload,
                    songKeyMarked: store.songKeyMarked,
                    tempSong: store.tempSong,
                    isListModalOpen: true
                })
            }

            case GlobalStoreActionType.LIST_MODAL_CLOSE: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    newListCounter: store.newListCounter,
                    listNameEditActive: store.listNameEditActive,
                    listKeyPairMarkedForDeletion: null,
                    songKeyMarked: store.songKeyMarked,
                    tempSong: store.tempSong,
                    isListModalOpen: false
                })
            }

            case GlobalStoreActionType.REMOVE_SONG_MODAL_OPEN: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    newListCounter: store.newListCounter,
                    listNameEditActive: store.listNameEditActive,
                    listKeyPairMarkedForDeletion: null,
                    songKeyMarked: payload.index,
                    tempSong: payload.song,
                    isRemoveSongModalOpen: true
                })
            }

            case GlobalStoreActionType.REMOVE_SONG_MODAL_CLOSE: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    newListCounter: store.newListCounter,
                    listNameEditActive: store.listNameEditActive,
                    listKeyPairMarkedForDeletion: null,
                    songKeyMarked: store.songKeyMarked,
                    tempSong: store.tempSong,
                    isRemoveSongModalOpen: false
                })
            }

            case GlobalStoreActionType.EDIT_SONG_MODAL_OPEN: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    newListCounter: store.newListCounter,
                    listNameEditActive: store.listNameEditActive,
                    listKeyPairMarkedForDeletion: null,
                    songKeyMarked: payload.index,
                    tempSong: payload.song,
                    isEditSongModalOpen: true
                })
            }

            case GlobalStoreActionType.EDIT_SONG_MODAL_CLOSE: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    newListCounter: store.newListCounter,
                    listNameEditActive: store.listNameEditActive,
                    listKeyPairMarkedForDeletion: null,
                    songKeyMarked: store.songKeyMarked,
                    tempSong: store.tempSong,
                    isEditSongModalOpen: false
                })
            }

            default:
                return store;
        }
    }
    // THESE ARE THE FUNCTIONS THAT WILL UPDATE OUR STORE AND
    // DRIVE THE STATE OF THE APPLICATION. WE'LL CALL THESE IN 
    // RESPONSE TO EVENTS INSIDE OUR COMPONENTS.

    // THIS FUNCTION PROCESSES CHANGING A LIST NAME
    store.changeListName = function (id, newName) {
        // GET THE LIST
        async function asyncChangeListName(id) {
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                let playlist = response.data.playlist;
                playlist.name = newName;
                async function updateList(playlist) {
                    response = await api.updatePlaylistById(playlist._id, playlist);
                    if (response.data.success) {
                        async function getListPairs(playlist) {
                            response = await api.getPlaylistPairs();
                            if (response.data.success) {
                                let pairsArray = response.data.idNamePairs;
                                storeReducer({
                                    type: GlobalStoreActionType.CHANGE_LIST_NAME,
                                    payload: {
                                        idNamePairs: pairsArray,
                                        playlist: playlist
                                    }
                                });
                            }
                        }
                        getListPairs(playlist);
                    }
                }
                updateList(playlist);
            }
        }
        asyncChangeListName(id);
    }

    // This function processes creating a new list ->
    store.createNewList = function () {
        let newList = {
            name: "untitled",
            songs: [],
        };
        async function asyncCreateNewList() {
            let response = await api.postPlaylist(newList);
            if (response.data.success) {
                let playlist = response.data.playlist;
                let result = await api.getPlaylistPairs();
                if (result.data.success) {
                    let pairsArray = result.data.idNamePairs;
                    storeReducer({
                        type: GlobalStoreActionType.CREATE_NEW_LIST,
                        payload: {
                            idNamePairs: pairsArray,
                            playlist: playlist
                        }
                    })
                }

                store.setCurrentList(playlist._id);
            }
        }
        asyncCreateNewList();
    }

    store.deleteList = (id) => {
        async function asyncDeletePlaylist() {
            const response = await api.deletePlaylistById(id);
            if (response.data.success) {
                let result = await api.getPlaylistPairs();
                if (result.data.success) {
                    let pairsArray = result.data.idNamePairs;
                    storeReducer({
                        type: GlobalStoreActionType.DELETE_LIST,
                        payload: pairsArray,
                    })
                }
            }
        };

        asyncDeletePlaylist();
        store.hideDeleteListModal();
    }

    // This function mark playlist for deletion. ->
    store.markListForDeletion = (idNamePair) => {
        storeReducer({
            type: GlobalStoreActionType.MARK_LIST_FOR_DELETION,
            payload: idNamePair
        })
    }

    store.showDeleteListModal = (idNamePair) => {
        let modal = document.getElementById("delete-list-modal");
        modal.classList.add("is-visible");
        storeReducer({
            type: GlobalStoreActionType.LIST_MODAL_OPEN,
            payload: idNamePair
        })
        // modal_open_status = true;
    }

    store.hideDeleteListModal = () => {
        let modal = document.getElementById("delete-list-modal");
        modal.classList.remove("is-visible");
        storeReducer({
            type: GlobalStoreActionType.LIST_MODAL_CLOSE,
            payload: null
        })
        // modal_open_status = false;
    }

    // THIS FUNCTION PROCESSES CLOSING THE CURRENTLY LOADED LIST
    store.closeCurrentList = function () {
        storeReducer({
            type: GlobalStoreActionType.CLOSE_CURRENT_LIST,
            payload: {}
        });
        tps.clearAllTransactions();
    }

    // THIS FUNCTION LOADS ALL THE ID, NAME PAIRS SO WE CAN LIST ALL THE LISTS
    store.loadIdNamePairs = function () {
        async function asyncLoadIdNamePairs() {
            const response = await api.getPlaylistPairs();
            if (response.data.success) {
                let pairsArray = response.data.idNamePairs;
                storeReducer({
                    type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
                    payload: pairsArray
                });
            }
            else {
                console.log("API FAILED TO GET THE LIST PAIRS");
            }
        }
        asyncLoadIdNamePairs();
    }

    store.setCurrentList = function (id) {
        async function asyncSetCurrentList(id) {
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                let playlist = response.data.playlist;

                if (response.data.success) {
                    storeReducer({
                        type: GlobalStoreActionType.SET_CURRENT_LIST,
                        payload: playlist
                    });
                    store.history.push("/playlist/" + playlist._id);
                }
            }
        }
        asyncSetCurrentList(id);
    }

    store.getPlaylistSize = function() {
        return store.currentList.songs.length;
    }

    // Create a new song in the playlist ->
    store.addSong = () => {
        let current_list = store.currentList;
        let newSong = {
            title: "untitled",
            artist: "unknown",
            youTubeId: "dQw4w9WgXcQ"
        };
        current_list.songs.push(newSong);
        console.log(current_list);

        store.update_current_list(current_list);
    }

    store.redoAddSong = () => {
        let list = store.currentList;

        list.songs.pop();
        store.update_current_list(list);
    }

    // Move song -> 
    store.moveSong = (start, end) => {
        let list = store.currentList;

        if (start < end) {
            let temp = list.songs[start];
            for (let i = start; i < end; i++) {
                list.songs[i] = list.songs[i + 1];
            }
            list.songs[end] = temp;
        }
        else if (start > end) {
            let temp = list.songs[start];
            for (let i = start; i > end; i--) {
                list.songs[i] = list.songs[i - 1];
            }
            list.songs[end] = temp;
        }
        
        store.update_current_list(list);
    }

    store.markSongForRemove = (index) => {
        storeReducer({
            type: GlobalStoreActionType.MARK_SONG_FOR_CHANGE,
            payload: {index: index}
        })
    }

    store.removeSong = (index) => {
        let list = store.currentList;
        removedSongs.push(list.songs[index]);

        if (list != null) 
            list.songs.splice(index, 1);

        store.update_current_list(list);
        store.hideRemoveSongModal();
    }

    store.redoRemoveSong = (index) => {
        let list = store.currentList;

        let song = removedSongs.pop();
        list.songs.splice(index, 0, song);
        store.update_current_list(list);
    }

    store.showRemoveSongModal = (index) => {
        let modal = document.getElementById("remove-song-modal");
        modal.classList.add("is-visible");

        storeReducer({
            type: GlobalStoreActionType.REMOVE_SONG_MODAL_OPEN,
            payload: {index: index}
        })
    }

    store.hideRemoveSongModal = () => {
        let modal = document.getElementById("remove-song-modal");
        modal.classList.remove("is-visible");
        storeReducer({
            type: GlobalStoreActionType.REMOVE_SONG_MODAL_CLOSE,
            payload: null
        })
    }

    store.editSong = (key, song) => {
        let list = store.currentList;

        if (list != null) {
            let songToBeEdit = list.songs[key];

            if (song.title === "") {
                songToBeEdit.title = "untitled";
            } else {
                songToBeEdit.title = song.title;
            }
            if (song.artist === "") {
                songToBeEdit.artist = "unknown";
            } else {
                songToBeEdit.artist = song.artist;
            }
            if (song.youTubeId === "") {
                songToBeEdit.youTubeId = "dQw4w9WgXcQ";
            } else {
                songToBeEdit.youTubeId = song.youTubeId;
            }
        }

        store.update_current_list(list);
        store.hideEditSongModal();
    }

    store.markSongForEdit = (index, song) => {
        storeReducer({
            type: GlobalStoreActionType.MARK_SONG_FOR_CHANGE,
            payload: {
                index: index,
                song: song
            }
        })
    }

    store.showEditSongModal = (index, song) => {
        let modal = document.getElementById("edit-song-modal");
        modal.classList.add("is-visible");

        storeReducer({
            type: GlobalStoreActionType.EDIT_SONG_MODAL_OPEN,
            payload: {
                index: index,
                song: song
            }
        })
    }

    store.hideEditSongModal = () => {
        let modal = document.getElementById("edit-song-modal");
        modal.classList.remove("is-visible");

        storeReducer({
            type: GlobalStoreActionType.EDIT_SONG_MODAL_CLOSE,
            payload: null
        })
    }

    store.handleSongChange = (e) => {
        const tempSong = {...store.tempSong};
        tempSong[e.currentTarget.name] = e.currentTarget.value;
        // this.setState({tempSong});
        storeReducer({
            type: GlobalStoreActionType.SONG_CHANGE,
            payload: tempSong
        })
    }

    store.addAddSongTransaction = () => {
        let transaction = new AddSong_Transaction(store);
        tps.addTransaction(transaction);
    }

    store.addRemoveSongTransaction = (index) => {
        let transaction = new RemoveSong_Transaction(store, index);
        tps.addTransaction(transaction);
    }

    store.addMoveSongTransaction = (start, end) => {
        let transaction = new MoveSong_Transaction(store, start, end);
        tps.addTransaction(transaction);
    }

    store.addEditSongTransaction = (index, tempSong, originSong) => {
        let transaction = new EditSong_Transaction(store, index, tempSong, originSong);
        tps.addTransaction(transaction);
    }

    store.undo = function () {
        if (tps.hasTransactionToUndo()) {
            tps.undoTransaction();
        }
    }

    store.redo = function () {
        if (tps.hasTransactionToRedo()) {
            tps.doTransaction();
        }
    }

    // THIS FUNCTION ENABLES THE PROCESS OF EDITING A LIST NAME
    store.setListNameEditActive = function () {
        storeReducer({
            type: GlobalStoreActionType.SET_LIST_NAME_EDIT_ACTIVE,
            payload: null
        });
    }

    store.update_current_list = async (playlist) => {
        const response = await api.updatePlaylistById(playlist._id, playlist);
        console.log(response);
        if (response.data.success) {
            storeReducer({
                type: GlobalStoreActionType.UPDATE_CURRENT_LIST,
                payload: playlist
            })
        }        
    }

    store.canUndo = function () {
        return tps.hasTransactionToUndo();
    }

    store.canRedo = function () {
        return tps.hasTransactionToRedo();
    }

    // THIS GIVES OUR STORE AND ITS REDUCER TO ANY COMPONENT THAT NEEDS IT
    return { store, storeReducer };
}