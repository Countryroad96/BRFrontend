import React, { useCallback, useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import axios from "axios";
import Bestseller from "./BestsellerList";
import LibraryRank from './LibraryRank';
import BookList from "./BookList";
import Mypage from "./Mypage";
import SearchHistory from './SearchHistory';
import RegionCodeTranslate from './RegionCodeTranslate';
import Login from './Login';
import InputGroup from 'react-bootstrap/InputGroup'
import Button from 'react-bootstrap/Button';
import FormControl from 'react-bootstrap/FormControl';
import PuffLoader from 'react-spinners/PuffLoader';
import RegionSelector from './RegionSelector';
import { selectRegion } from '../modules/SelectedRegionCode';
import "../style/Main.scss";

const END_POINT = `${process.env.REACT_APP_END_POINT}`;

function Main() {

    const [searchText, setSearchText] = useState("");
    const [books, setBook] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPage, setTotalPage] = useState(0);
    const [display] = useState(10);
    const [searchState, setSearchState] = useState(false);
    const [openMypage, setOpenMypage] = useState(false);
    const [showRankBest, setShowRankBest] = useState(true);
    const [openRegionSelector, setOpenRegionSelector] = useState(false);
    const [loadingState, setLoadingState] = useState(false);
    const [isMouseOverUserInfo, setIsMouseOverUserInfo] = useState(false);

    const loginState = useSelector(state => state.updateLoginState.login);
    const loginInfo = useSelector(state => state.updateLoginState.user);

    const selectedRegionCode = useSelector(state => state.selectedRegion);
    const region = RegionCodeTranslate({code: `${selectedRegionCode.region + selectedRegionCode.subregion}`});

    const dispatch = useDispatch();

    useEffect(() => {
        if (loginInfo.status === "new") {
            setOpenMypage(true);
            setShowRankBest(false);
        }
    },[loginInfo]);


    const getSearchBook = async () => {
        setLoadingState(true);
        try{
            const res = await axios.get(`${END_POINT}/search`, {
                params: {
                    query: searchText,
                },

            });

            const booklist = res.data.info.result.map((item, index) => ({
                id: index,
                title: item.title.replace(/(<([^>]+)>)/ig,""),
                image: item.image,
                author: item.author.replace(/(<([^>]+)>)/ig,""),
                isbn: item.isbn.replace(/(<([^>]+)>)/ig,""),
                year: item.year.replace(/(<([^>]+)>)/ig,""),
                description: item.description.replace(/(<([^>]+)>)/ig,""),
                publisher: item.publisher.replace(/(<([^>]+)>)/ig,""),
            })
            );
            
            let testlist = [];
            let totalpage = 0;
            
            for (let j = 0; j < display; j++) {
                let k = 0;
                let temp = [];
                for (let i = j*10; i < (j+1)*10; i++) {
                    if (typeof(booklist[i]) !== "undefined" && booklist[i] !== "undefined") {
                        temp[k] = booklist[i];
                        k++;
                    }
                }

                if (temp.length !== 0) {
                    testlist[j] = temp;
                    totalpage++;
                }
            };
            setTotalPage(totalpage);
            setBook(testlist);
            setSearchState(true);
            setLoadingState(false);
            
        } 
        catch (error) {
        console.log(error);
        setLoadingState(false);
        }
    };
    
    const onSubmit = (e) => {
        if (searchText === ""){
            alert("검색어를 입력해주세요.");
            return;
        }
        e.preventDefault();
        setOpenMypage(false);
        setBook([]);
        setSearchState(false);
        setShowRankBest(false);
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
        setSearchText("");
        setOpenMypage(false);
        setBook([]);
        setSearchState(false);
        setShowRankBest(true);
        setPage(1);
        setTotalPage(0);
    }

    const renderSearchlist = () => {
        if(typeof books == "undefined" || books == null || books.length === 0)
        {
            return (
                <div className="SearchList">
                    <h1>검색 결과</h1>
                    <br/>
                    검색 결과가 없습니다. 검색어를 확인해 주세요.
                </div>
            )
        }
        return (
            <div className="SearchList">
                <h1>검색 결과</h1>
                {books[page-1].map((book, i) => <BookList key={book.id} book={book} i={i} frommypage={false}/>)}
                {renderButton()}
            </div>
        )
    }

    const RenderPageButton = (props) => {
        return (
            <Button variant="secondary" className="SearchPageButton" onClick={() => setPage(props.i+1)}>{props.v}</Button>
        )
    }

    const renderButton = useCallback(() => {
        let pagelist = [];
        for (let i = 0; i < totalPage; i++){
            pagelist.push(i+1);
        }
        if (totalPage > 1){
            return (
                <div className="SearchPager">  
                    {pagelist.map((v, i) => <RenderPageButton key={v} v={v} i={i} />)}
                </div>
            );
        }        
    },[totalPage])

    const onUserInfoClick = () => {
        setBook([]);
        setPage(1);
        setTotalPage(0);
        setSearchState(false);
        setShowRankBest(false);
        setOpenMypage(true);
    }

    const onUserInfoMouseEnter = () => {
        setIsMouseOverUserInfo(true);
    }

    const onUserInfoMouseLeave = () => {
        setIsMouseOverUserInfo(false);
    }

    const renderUserInfo = useCallback(() => {
        return(
            <>
                <div className="UserInfoBox" onClick={onUserInfoMouseEnter} onMouseEnter={null} onMouseLeave={null}>
                    <img className='UserThumb' src={loginInfo.imgURL} alt='userThumb'></img>
                    <div className='UserInfo'>
                        {loginInfo.name}님 환영합니다.
                    </div>
                </div>
                {isMouseOverUserInfo ?
                <>
                    <div className="UserInfoMenuWrap" onClick={onUserInfoMouseLeave}></div>
                        <Mypage setOpenMypage={setOpenMypage} setShowRankBest={setShowRankBest} onUserInfoClick={onUserInfoClick} />
                </>
                : null}
            </>
        )

    },[loginInfo.imgURL, loginInfo.name, isMouseOverUserInfo])

    const renderMypage = () => {
        return (
            <SearchHistory/>
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

    const onClickRegionReset = () => {
        if (loginState) {
            dispatch(selectRegion({
                region: loginInfo.region,
                subregion: loginInfo.subregion,
            }));
        }
        else{
            dispatch(selectRegion({
                region: "11",
                subregion: "010",
            }));
        }
        alert("지역 정보가 기존 설정으로 초기화 되었습니다.");
    }

    return (
        <div className="SiteFrame">
            <div className="SiteHeadWrap">
                <div className="SiteHead">
                    <div className="SiteName" onClick={onClickHomepage}>
                        <img className="SiteIcon" src="../favicon512.png" alt="BookRecommendIcon" />
                        <span>Book Recommend</span>
                    </div>
                    <div className="Input">
                        <span>현재검색지역 : {region.fullName}</span>
                            <InputGroup className="InputBar mb-3">
                                <FormControl
                                aria-label="Recipient's username"
                                aria-describedby="basic-addon2"
                                placeholder="제목, 저자, ISBN"
                                value={searchText}                 
                                onKeyUp={onKeyUp}
                                onChange={e => setSearchText(e.target.value)}
                                />
                                <Button variant="secondary" id="button-addon2" onClick={onSubmit} >
                                검색
                                </Button>
                            </InputGroup>
                        <div className="SearchRegionSelector">
                            <span onClick={onClickOpReSel}>도서관검색지역선택 {openRegionSelector? "▲" : "▼"}</span><br/>
                            {openRegionSelector ? 
                                <>
                                    <RegionSelector changeLoginstate={false} setRegion={true} onClickRegionReset={onClickRegionReset}/>
                                </>: null}
                        </div>
                    </div>
                        {loginState ? renderUserInfo() : <Login setOpenMypage={setOpenMypage} />}
                </div>
            </div>
            
            <div className="SiteBodyWrap">
                <div className="SiteBody">
                {loadingState ? 
                    <>
                        <h5 style={{marginTop: "20px", textAlign: "center"}}>검색중입니다</h5>
                        <PuffLoader color={"#00ACFD"} loading={true} css={{display: "block", height: "100px", margin: "auto", marginTop: "20px"}} size={80} />
                    </> : null}
                {openMypage ? renderMypage() : null}
                {(searchState) ? renderSearchlist() : null}
                {showRankBest ? (<><Bestseller /><LibraryRank /></>) : null}
                </div>
            </div>

            <div className="SiteFooterWrap">
                <div className="SiteFooter">
                    <span>이 서비스에는 네이버에서 제공한 나눔글꼴이 적용되어 있습니다.</span>
                </div>
            </div>
        </div>
    );
}

export default Main;