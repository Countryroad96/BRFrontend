import React, { useState } from 'react';
import { GoogleLogout } from 'react-google-login';
import Modal from "./Modal.js";

const clientId = "323793340670-isvcim8icgebo1juvq01iimrqohprd97.apps.googleusercontent.com"


function Logout(props) {

    const[modal, setModal] = useState(false);

    const onSuccess = () => {

        props.setLoginInfo({});
        props.setLoginState(false);

        setModal(true);
    };

    return (
        <>
            <GoogleLogout
                clientId={clientId}
                buttonText="Logout"
                onLogoutSuccess={onSuccess} //성공시 실행
            ></GoogleLogout>
            {modal ? <Modal setModal={setModal} 
                            title="Logout Success"
                            description="Logout Success"
                            clickoff={true}
            /> : null}
        </>
    );
}

export default Logout;