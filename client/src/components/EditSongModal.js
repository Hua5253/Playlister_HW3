import React, { useContext } from 'react';
import { GlobalStoreContext } from '../store'

const EditSongModal = () => {
    const { store } = useContext(GlobalStoreContext);
    const {songKeyMarked: index, tempSong} = store;

    let currentList = store.currentList;
    if (!currentList) return null;

    let song = currentList.songs[index] === undefined ? {} : currentList.songs[index];
    let originSong = {title: song.title, artist: song.artist, youTubeId: song.youTubeId};
    console.log(originSong);

    return (
        <div 
            className="modal" 
            id="edit-song-modal" 
            data-animation="slideInOutLeft">
                <div className="modal-root" id='verify-edit-song-root'>
                    <div className="modal-north">
                        Edit Song?
                    </div>
                    <div className="modal-center">
                        <div className="modal-center-content">
                            <div className="edit-song-content">
                                Title: <span id="edit-title-span">
                                    <input type="text" name="title" id={"song-card-title-input"} 
                                    value={tempSong === undefined ? "" : tempSong.title} 
                                    onChange={store.handleSongChange}
                                        />
                                    </span>
                            </div>
                            <div className="edit-song-content">
                                Artist: <span id="edit-artist-span">
                                    <input type="text" name="artist" id={"song-card-artist-input"} 
                                    value={tempSong === undefined ? "" : tempSong.artist}  
                                    onChange={store.handleSongChange}
                                        />
                                    </span>
                            </div>
                            <div className="edit-song-content">
                                youTubeId: <span id="edit-ID-span">
                                    <input type="text" name="youTubeId" id={"song-card-title-input"} 
                                    value={tempSong === undefined ? "" : tempSong.youTubeId} 
                                    onChange={store.handleSongChange}
                                        />
                                    </span>
                            </div>
                        </div>
                    </div>
                    <div className="modal-south">
                        <input type="button" 
                            id="edit-song-confirm-button" 
                            className="modal-button" 
                            onClick={() => store.addEditSongTransaction(index, tempSong, originSong)}
                            value='Confirm' />
                        <input type="button" 
                            id="edit-song-cancel-button" 
                            className="modal-button" 
                            onClick={store.hideEditSongModal}
                            value='Cancel' />
                    </div>
                </div>
        </div>
    );
    
    
}

export default EditSongModal;