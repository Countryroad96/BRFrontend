import React, { useCallback, useState } from "react";
import axios from "axios";
import BookList from "./BookList";
import Login from './Login';
import Logout from './Logout';
import "../style/Main.scss";

const END_POINT = "/v1/search/book.json";
const Client_ID = "6kzLim7jrHaqIQQcyTyH";
const Client_PW = "TKnpNps3Gg";

function Main() {

    //const [search, setSearch] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [books, setBook] = useState([]);
    const [page, setPage] = useState(1);
    const [display, setDisplay] = useState(10);
    const [searchState, setSearchState] = useState(false);
    const [loginInfo, setLoginInfo] = useState({});
    const [loginState, setLoginState] = useState(false);


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
            
            for (let j = 0; j < display; j++) {
                let k = 0;
                let temp = [];
                for (let i = j*10; i < (j+1)*10; i++) {
                        temp[k] = booklist[i];
                        k++;
                }
                testlist[j] = temp;
            };

            let final = testlist.filter((i) => i.filter(item => item !== "undefined") !== "undefined");
            console.log("final list", final);
            console.log("test list", testlist);

            
            setBook(testlist);
            setSearchState(true);

            //console.log("res.data",res.data);
            console.log("testlist",testlist);
            //console.log("books",books); // 콘솔에 undefined라고 찍힘
            
        } 
        catch (error) {
        console.log(error);
        }
    };
    
    const onSubmit = (e) => {
        e.preventDefault();
        console.log(searchText);
        setBook([]);
        setSearchState(false);
        setPage(1);
        getSearchBook();
    }

    const onKeyUp = (e) => {
        if (e.keyCode === 13) {
            onSubmit(e);
        }
    }

    const renderButton = () => {
        let pagelist = [1,2,3,4,5,6,7,8,9,10];
        return (
            pagelist.map((v, i) => {
                return (
                <button className="SearchPageButton" onClick={() => setPage(i+1)}>{v}</button>
                )
            })
        );
    }

    const renderUserInfo = useCallback(() => {
        return(
            <div className="UserInfoBox">
                <img className='UserThumb' src={loginInfo.imgURL} alt='userThumb'></img>
                <div className='UserInfo'>
                    {loginInfo.name}님 환영합니다.
                </div>
                <Logout setLoginInfo={setLoginInfo} setLoginState={setLoginState}/>
            </div>
        )

    },[loginInfo])

    return (
            <div className="SiteFrame">
                <div className="SiteHead">
                    <div className="SiteName">책 추천 사이트 테스트</div>
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
                        {loginState ? renderUserInfo() : <Login setLoginInfo={setLoginInfo} setLoginState={setLoginState} />}
                </div>
                <div className="SearchList">
                    {(searchState && books.length > 0) ? <BookList books={books[page-1]} /> : null}
                    <div className="SearchPager">  
                    {(searchState && books.length > 0) ? renderButton() : null}
                    </div>
                </div>
            </div>
    );
}

//<BookList books={books} page={page-1} <RenderMaps />/>

export default Main;