import React, { useCallback, useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { updateUserInfo } from '../modules/LoginState';
import RegionSelector from './RegionSelector';
import RegionCodeTranslate from './RegionCodeTranslate';
import Logout from './Logout';

function Mypage(props) {
    
    const loginInfo = useSelector(state => state.updateLoginState.user);
    //const dispatch = useDispatch();

    const sex = ["남성", "여성", "미상"];
    const age = {
        "0": "영유아(0~5세)",
        "6": "유아(6~7세)",
        "8": "초등(8~13세)",
        "14": "청소년(14~19세)",
        "20": "20대",
        "30": "30대",
        "40": "40대",
        "50": "50대",
        "60": "60세 이상",
        "-1": "미상",
    };
//
    return(
        <div className="Mypage">
            <h2>{loginInfo.name}님의 마이페이지</h2>
            <div>
                <span>성별 : {sex[loginInfo.sex]}</span><br/>
                <span>나이 : {age[loginInfo.age]}</span><br/>
                <span>지역 : </span><RegionCodeTranslate code={loginInfo.region
                                                            + loginInfo.subregion} />
                

            </div>
            <div>
                {/* <button onClick={() => RegionSelector()}>테스트</button> */}
                <RegionSelector onSubmit={updateUserInfo}/>
            </div>

            <div>
                <Logout 
                    // setLoginInfo={setLoginInfo}
                    // setLoginState={setLoginState}
                    setOpenMypage={props.setOpenMypage}
                />
            </div>
        </div>
    );

    // useEffect(() => {
    //     RegionSelector();
    // }, []);

}

export default Mypage;