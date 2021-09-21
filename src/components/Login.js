import axios from 'axios';
import React, { useCallback, useState } from "react";
//import axios from 'axios';
import { GoogleLogin } from 'react-google-login';
import { useDispatch, useSelector } from 'react-redux';
import updateLoginState, { updateLogin } from '../modules/LoginState';
import { selectRegion } from '../modules/SelectedRegionCode';
import Modal from "./Modal.js";

const clientId = "323793340670-isvcim8icgebo1juvq01iimrqohprd97.apps.googleusercontent.com"
const END_POINT = "http://ec2-3-19-120-63.us-east-2.compute.amazonaws.com:8080";
// 113948232183335871665

function Login(props) {

    const dispatch = useDispatch();

    const[modal, setModal] = useState(false);
    const[modalInfo, setModalInfo] = useState({});
    const [loadingState, setLoadingState] = useState(false);
    
    const onSuccess = async (googleRes) => {
        setLoadingState(true);
        try {
            const res = await axios.post(`${END_POINT}/login`, JSON.stringify({username: String(googleRes.profileObj.googleId)}), {
                headers: {
                    "Content-Type": `application/json`,
                },
            });
            console.log("loginstate",res.data);

            let userInfo = {};

            if (res.data.message === "registered") {
                userInfo = {name: googleRes.profileObj.name, 
                    gender: res.data.info.gender,
                    age: res.data.info.age,
                    region: (res.data.info.region === "" ? "11" : res.data.info.region),
                    subregion: (res.data.info.subregion === "" ? "010" : res.data.info.subregion),
                    imgURL: googleRes.profileObj.imageUrl, 
                    username: String(googleRes.profileObj.googleId),
                    history: res.data.info.history,
                    status: "registered"
                };

                console.log("Login Info",userInfo);
                
                //props.setLoginInfo(userInfo);
        
                // setModalInfo({
                //     title: "Login Success",
                //     description: `Welcome ${userInfo.name}`,
                //     clickoff: true,
                //     callback: props.setLoginState(true)
                // });
                // setModal(true);
        
                
        
                dispatch(updateLogin(userInfo));
                dispatch(selectRegion({
                    region: userInfo.region,
                    subregion: userInfo.subregion,
                }));
                setLoadingState(false);
            }
            else if (res.data.message === "new") {
                userInfo = {
                    name: googleRes.profileObj.name, 
                    gender: '2',
                    age: "-1",
                    region: "11",
                    subregion: "010",
                    imgURL: googleRes.profileObj.imageUrl, 
                    username: String(googleRes.profileObj.googleId),
                    history: [],
                    status: "new"
                };
                console.log("Login Info",userInfo);

                alert("신규회원입니다. 회원정보를 입력해주세요.");

                setLoadingState(false);
                // setModalInfo({
                //     title: "신규가입회원",
                //     description: "회원정보를 등록해주세요!",
                //     clickoff: false,
                //     callback: dispatch(updateLogin(userInfo))
                // });
                // setModal(true);
                dispatch(updateLogin(userInfo))
                //props.setLoginState(true);
                
            }
            else {
                console.log('error, res:', res);
            };
            
        }
        catch (error) {
            console.log(error);
        }
    };

    // const loginCallback = () => {
    //     dispatch(updateLogin(userInfo));
    //     //props.setLoginState(true)
    // }
    
    //로그인 실패시 실행
    const onFailure = (res) => {
        console.log("login fail",res)

        setModalInfo({
            title: "Login Fail",
            description: res.error,
            clickoff: true,
            callback: null
        });
        setModal(true);
    }

    

    return (
        <div className='GoogleLoginButton'>
            <GoogleLogin
                clientId={clientId}
                buttonText="Login with Google"
                onSuccess={onSuccess} // 성공시 실행
                onFailure={onFailure} // 실패시 실행
                cookiePolicy={'single_host_origin'}
                />
            {modal ? <Modal
                setModal={setModal} 
                title={modalInfo.title}
                description={modalInfo.description}
                clickoff={modalInfo.clickoff}
                callback={modalInfo.callback}
                setOpenMypage={props.setOpenMypage}
                setShowRankBest={props.setShowRankBest}
                dispatch={dispatch}
            /> : null}
            {loadingState ? null : null}
        </div>
    );
}

export default Login;