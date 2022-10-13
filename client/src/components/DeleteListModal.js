import React, { useContext } from 'react';
import { GlobalStoreContext } from '../store'

const DeleteListModal = () => {
    const { store } = useContext(GlobalStoreContext);
    let idNamePair = store.listKeyPairMarkedForDeletion;
    let name = "";
    let id = "";
    if (idNamePair) {
        name = idNamePair.name;
        id = idNamePair._id;
    }

    return (
        <div 
            className="modal" 
            id="delete-list-modal" 
            data-animation="slideInOutLeft">
                <div className="modal-root" id='verify-delete-list-root'>
                    <div className="modal-north">
                        Delete playlist?
                    </div>
                    <div className="modal-center">
                        <div className="modal-center-content">
                            Are you sure you wish to permanently delete the {name} playlist?
                        </div>
                    </div>
                    <div className="modal-south">
                        <input type="button" 
                            id="delete-list-confirm-button" 
                            className="modal-button" 
                            onClick={() => store.deleteList(id)}
                            value='Confirm' />
                        <input type="button" 
                            id="delete-list-cancel-button" 
                            className="modal-button" 
                            onClick={store.hideDeleteListModal}
                            value='Cancel' />
                    </div>
                </div>
        </div>
    );
}

export default DeleteListModal;