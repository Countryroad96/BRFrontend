import React from 'react';
import { useDispatch } from 'react-redux';
import updateLoginState, { updateLogout } from '../modules/LoginState';
import { GoogleLogout } from 'react-google-login';

const clientId = "323793340670-isvcim8icgebo1juvq01iimrqohprd97.apps.googleusercontent.com"


function Logout(props) {

    const dispatch = useDispatch();


    const onSuccess = () => {

        // props.setLoginInfo({});
        // props.setLoginState(false);
        props.setOpenMypage(false);
        dispatch(updateLogout());

    };

    return (
        <>
            <GoogleLogout
                clientId={clientId}
                buttonText="Logout"
                onLogoutSuccess={onSuccess} //성공시 실행
            ></GoogleLogout>
        </>
    );
}

export default Logout;