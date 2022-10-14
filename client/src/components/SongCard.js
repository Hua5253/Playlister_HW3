import React, { useContext, useState } from 'react'
import { GlobalStoreContext } from '../store'

function SongCard(props) {
    const { store } = useContext(GlobalStoreContext);
    const [isDragging, setIsDragging] = useState(false);
    const [draggedTo, setDraggedTo] = useState(false);

    const { song, index } = props;

    function handleDragStart(event) {
        event.dataTransfer.setData("song", event.target.id);
        setIsDragging(true);
        setDraggedTo(draggedTo);
    }

    function handleDragOver(event) {
        event.preventDefault();
        setIsDragging(isDragging);
        setDraggedTo(true);
    }

    function handleDragEnter(event) {
        event.preventDefault();
        setIsDragging(isDragging);
        setDraggedTo(true);
    }

    function handleDragLeave(event) {
        event.preventDefault();
        setIsDragging(isDragging);
        setDraggedTo(false);
    }

    function handleDrop(event) {
        event.preventDefault();

        let target = event.target;
        let targetId = target.id;
        targetId = targetId.substring(target.id.indexOf("-") + 1);
        let sourceId = event.dataTransfer.getData("song");
        sourceId = sourceId.substring(sourceId.indexOf("-") + 1);
        
        setIsDragging(false);
        setDraggedTo(false);

        store.addMoveSongTransaction(parseInt(sourceId), parseInt(targetId));       
    }

    function handleRemoveSong(event) {
        // console.log(index);
        event.stopPropagation();
        store.markSongForRemove(index);
        store.showRemoveSongModal();
    }

    function handleEditSong() {
        let tempSong = {title: song.title, artist: song.artist, youTubeId: song.youTubeId};
        store.markSongForEdit(index, tempSong);
    }

    let cardClass = "list-card unselected-list-card";
    return (
        <div
            key={index}
            id={'song-' + index}
            className={cardClass}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            draggable="true"
            onDoubleClick={handleEditSong}
        >
            {index + 1}.
            <a
                id={'song-' + index + '-link'}
                className="song-link"
                href={"https://www.youtube.com/watch?v=" + song.youTubeId}>
                {song.title} by {song.artist}
            </a>
            <input
                type="button"
                id={"remove-song-" + index}
                className="list-card-button"
                value={"\u2715"}
                onClick={handleRemoveSong}
            />
        </div>
    );
}

export default SongCard;