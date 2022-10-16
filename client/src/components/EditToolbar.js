import { useContext } from 'react'
import { GlobalStoreContext } from '../store'
import { useHistory } from 'react-router-dom'
/*
    This toolbar is a functional React component that
    manages the undo/redo/close buttons.
    
    @author McKilla Gorilla
*/
function EditToolbar() {
    const { store } = useContext(GlobalStoreContext);
    const history = useHistory();

    // let enabledButtonClass = "playlister-button";
    let addSongClass = "playlister-button";
    let undoClass = "playlister-button";
    let redoClass = "playlister-button";
    let closeClass = "playlister-button";

    function handleAddSong() {
        store.addAddSongTransaction();
    }

    function handleUndo() {
        store.undo();
    }

    function handleRedo() {
        store.redo();
    }

    function handleClose() {
        history.push("/");
        store.closeCurrentList();
    }
    
    let editStatus = false;
    let isListModalOpen = store.isListModalOpen
    let isRemoveSongModalOpen = store.isRemoveSongModalOpen;
    let isEditSongModalOpen = store.isEditSongModalOpen;
    const isModalOpen = (isListModalOpen || isRemoveSongModalOpen || isEditSongModalOpen);

    let canAddSong = store.currentList !== null;
    let canClose = store.currentList !== null;
    let canUndo = store.canUndo();
    let canRedo = store.canRedo();

    if (!store.currentList) {
        addSongClass += " disabled";
        undoClass += " disabled";
        redoClass += " disabled";
        closeClass += " disabled";
    }

    if (!canAddSong || isModalOpen) addSongClass += " disabled";
    if (!canUndo || isModalOpen) undoClass += " disabled";
    if (!canRedo || isModalOpen) redoClass += " disabled";
    if (!canClose || isModalOpen) closeClass += " disabled";

    if (store.listNameEditActive) {
        editStatus = true;
    }

    return (
        <span id="edit-toolbar">
            <input
                type="button"
                id='add-song-button'
                disabled={editStatus || isModalOpen || !canAddSong}
                value="+"
                className={addSongClass}
                onClick={handleAddSong}
            />
            <input
                type="button"
                id='undo-button'
                disabled={editStatus || isModalOpen || !canUndo}
                value="⟲"
                className={undoClass}
                onClick={handleUndo}
            />
            <input
                type="button"
                id='redo-button'
                disabled={editStatus || isModalOpen || !canRedo}
                value="⟳"
                className={redoClass}
                onClick={handleRedo}
            />
            <input
                type="button"
                id='close-button'
                disabled={editStatus || isModalOpen || !canClose}
                value="&#x2715;"
                className={closeClass}
                onClick={handleClose}
            />
        </span>);
}

export default EditToolbar;