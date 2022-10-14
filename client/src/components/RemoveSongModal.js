import React, { useContext } from 'react';
import { GlobalStoreContext } from '../store'

const RemoveSongModal = () => {
    const { store } = useContext(GlobalStoreContext);
    let currentList = store.currentList;

    if (!currentList) return null;

    let index = store.songKeyMarked;
    let title = index === undefined ? "" : currentList.songs[index].title;

    return (
        <div 
            className="modal" 
            id="remove-song-modal" 
            data-animation="slideInOutLeft">
                <div className="modal-root" id='verify-remove-song-root'>
                    <div className="modal-north">
                        Remove Song?
                    </div>
                    <div className="modal-center">
                        <div className="modal-center-content">
                            Are you sure you wish to permanently remove {title} from the playlist?
                        </div>
                    </div>
                    <div className="modal-south">
                        <input type="button" 
                            id="remove-song-confirm-button" 
                            className="modal-button" 
                            onClick={() => store.removeSong(index)}
                            value='Confirm' />
                        <input type="button" 
                            id="remove-song-cancel-button" 
                            className="modal-button" 
                            onClick={store.hideRemoveSongModal}
                            value='Cancel' />
                    </div>
                </div>
        </div>
    );
}

export default RemoveSongModal;