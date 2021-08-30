import React, { useCallback, useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import axios from "axios";
import Bestseller from "./BestsellerList";
import LibraryRank from './LibraryRank';
import BookList from "./BookList";
import Mypage from "./Mypage";
import RegionCodeTranslate from './RegionCodeTranslate';
import Login from './Login';
import Logout from './Logout';
import "../style/Main.scss";

import RegionSelector from './RegionSelector';

const END_POINT = "/v1/search/book.json";
const Client_ID = "6kzLim7jrHaqIQQcyTyH";
const Client_PW = "TKnpNps3Gg";

function Main() {

    //const [search, setSearch] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [books, setBook] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPage, setTotalPage] = useState(0);
    const [display, setDisplay] = useState(10);
    const [searchState, setSearchState] = useState(false);
    // const [loginInfo, setLoginInfo] = useState({});
    // const [loginState, setLoginState] = useState(false);
    const [openMypage, setOpenMypage] = useState(false);
    const [openRegionSelector, setOpenRegionSelector] = useState(false);

    const loginState = useSelector(state => state.updateLoginState.login);
    const loginInfo = useSelector(state => state.updateLoginState.user);



    const getSearchBook = async () => {
        try{
            const res = await axios.get(END_POINT, {
                params: {
                    query: searchText,
                    display: display*10
                },
                headers: {
                    "X-Naver-Client-Id": Client_ID,
                    "X-Naver-Client-Secret": Client_PW
                }
            });
            //console.log(res.data);
            const booklist = res.data.items.map((item, index) => ({
                    id: index,
                    title: item.title.replace(/(<([^>]+)>)/ig,""),
                    image: item.image,
                    author: item.author.replace(/(<([^>]+)>)/ig,""),
                    isbn: item.isbn.replace(/(<([^>]+)>)/ig,""),
                    year: item.pubdate.replace(/(<([^>]+)>)/ig,""),
                    description: item.description.replace(/(<([^>]+)>)/ig,""),
                    publisher: item.publisher.replace(/(<([^>]+)>)/ig,""),
                    link: item.link
                })
            );
            
            let testlist = [];
            let totalpage = 0;
            
            for (let j = 0; j < display; j++) {
                let k = 0;
                let temp = [];
                for (let i = j*10; i < (j+1)*10; i++) {
                    if (typeof(booklist[i]) !== "undefined" && booklist[i] !== "undefined") {
                        //console.log('booklist[i]',booklist[i]);
                        //console.log(booklist[i].length);
                        temp[k] = booklist[i];
                        k++;
                    }
                }
                //console.log('temp', temp);

                if (temp.length !== 0) {
                    testlist[j] = temp;
                    totalpage++;
                }
            };

            //let final = testlist.filter((i) => i.filter(item => item !== "undefined") !== "undefined");
            //console.log("final list", final);
            //console.log("test list", testlist);

            
            //setBook({books: testlist, finish: true});
            setTotalPage(totalpage);
            setBook(testlist);
            setSearchState(true)

            //console.log("res.data",res.data);
            //console.log("testlist",testlist);
            //console.log('booklist', booklist);
            //console.log("books",books); // 콘솔에 undefined라고 찍힘
            
        } 
        catch (error) {
        console.log(error);
        }
    };
    
    const onSubmit = (e) => {
        e.preventDefault();
        console.log(searchText);
        setOpenMypage(false);
        setBook([]);
        setSearchState(false);
        setPage(1);
        getSearchBook();
        setTotalPage(0);
    }

    const onKeyUp = (e) => {
        if (e.keyCode === 13) {
            onSubmit(e);
        }
    }

    const onClickHomepage = () => {
        setOpenMypage(false);
        setBook([]);
        setSearchState(false);
        setPage(1);
        setTotalPage(0);
    }

    const renderSearchlist = () => {
        return (
            <div className="SearchList">
                {books[page-1].map((book, i) => <BookList key={book.id} book={book} i={i} />)}
            </div>
        )
    }

    const RenderPageButton = (props) => {
        return (
            <button className="SearchPageButton" onClick={() => setPage(props.i+1)}>{props.v}</button>
        )
    }

    const renderButton = useCallback(() => {
        let pagelist = [];
        for (let i = 0; i < totalPage; i++){
            pagelist.push(i+1);
        }
        console.log('maxpage',totalPage);
        if (totalPage > 1){
            return (
                <div className="SearchPager">  
                    {pagelist.map((v, i) => <RenderPageButton key={i} v={v} i={i} />)}
                </div>
            );
        }        
    },[totalPage])

    const onUserInfoClick = () => {
        setBook([]);
        setPage(1);
        setTotalPage(0);
        setSearchState(false);
        setOpenMypage(true);
    }

    const renderUserInfo = useCallback(() => {
        return(
            <div className="UserInfoBox" onClick={onUserInfoClick}>
                <img className='UserThumb' src={loginInfo.imgURL} alt='userThumb'></img>
                <div className='UserInfo'>
                    {loginInfo.name}님 환영합니다.
                </div>
                
            </div>
        )

    },[loginInfo.imgURL, loginInfo.name])

    const renderMypage = () => {
        return (
            <Mypage setOpenMypage={setOpenMypage} />
        )
    }

    const onClickOpReSel = () => {
        if (openRegionSelector) {
            setOpenRegionSelector(false);
        }
        else {
            setOpenRegionSelector(true);
        }
    }

    return (
            <div className="SiteFrame">
                <div className="SiteHead">
                    <div className="SiteName" onClick={onClickHomepage}>책 추천 사이트 테스트</div>
                    <div className="Input">
                        <input
                            className="InputBar"
                            type="text"       
                            value={searchText}                 
                            onKeyUp={onKeyUp}
                            onChange={e => setSearchText(e.target.value)}
                            autoFocus
                        />
                        <button
                            className="InputButton"
                            onClick={onSubmit}>검색</button>
                    </div>
                    <div className="SearchRegionSelector">
                        <span onClick={onClickOpReSel}>검색지역선택</span>
                        {openRegionSelector ? 
                        <RegionSelector changeLoginstate={false} setRegion={true}/> : null}
                    </div>
                        {loginState ? renderUserInfo() : <Login 
                        // setLoginInfo={setLoginInfo}
                        // setLoginState={setLoginState}
                        />}
                </div>
                <div className="SiteBody">
                    {openMypage ? renderMypage() : null}
                    {(searchState) ? renderSearchlist() : null}
                    {(searchState || openMypage) ? null : (loginState ? <LibraryRank /> : <Bestseller />)}
                    {(searchState) ? renderButton() : null}
                </div>
            </div>
    );
}

//<BookList books={books} page={page-1} <RenderMaps />/>

export default Main;