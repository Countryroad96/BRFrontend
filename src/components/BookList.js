import React, { useState, useCallback } from "react";
import { useDispatch, useSelector } from 'react-redux';
import axios from "axios";
import RegionCodeTranslate from './RegionCodeTranslate';
import RenderMaps from "./Map";
import { updateUserInfo } from '../modules/LoginState';
import PuffLoader from 'react-spinners/PuffLoader';
import "../style/BookList.scss";
import Accordion from 'react-bootstrap/Accordion'
import Button from 'react-bootstrap/Button';

const default_Thumbnail = `${process.env.REACT_APP_DEFAULT_THUMBNAIL}`;
const END_POINT = `${process.env.REACT_APP_END_POINT}`;

function leftPad(value) { if (value >= 10) { return value; } return `0${value}`; }

const BookList = (props) => {
    
    const selectedRegion = useSelector(state => state.selectedRegion);
    const loginState = useSelector(state=> state.updateLoginState.login);
    const loginInfo = useSelector(state=> state.updateLoginState.user);

    const { book, i, frommypage } = props;

    let deftoday = new Date();
    let today = `${deftoday.getFullYear()}-${leftPad(deftoday.getMonth() + 1)}-${leftPad(deftoday.getDate())}`;

    const dispatch = useDispatch();
    const[showDetail, setShowDetail] = useState(false);
    const[bookDetail, setBookDetail] = useState({});
    const[loadingState, setLoadingState] = useState(false);

    let isDelete = false;


    const getBookDetail =  useCallback(async () => {
        setLoadingState(true);
        try{
            const res = await axios.post(`${END_POINT}/result`,
                JSON.stringify({
                    isbn: book.isbn,
                    title: book.title,
                    region: selectedRegion.region,
                    subregion: selectedRegion.subregion,
                    username: (loginState ? loginInfo.username : null),
                    date: today,
                    author: book.author,
                    publisher: book.publisher,
                    frommypage: (loginState ? frommypage === true ? true : false : true)
                }), {
                headers: {
                    "Content-Type": `application/json`,
                    },
            });
            
            if(res.data.message === "success"){
                setBookDetail(res.data);
                if (res.data.info.bookId > 0){
                    let temp = loginInfo.history;
                
                    temp.push({
                        bookId: res.data.info.bookId,
                        title: book.title,
                        date: today,
                        author: book.author,
                        publisher: book.publisher,
                        isbn: book.isbn,
                    });
                    dispatch(updateUserInfo({
                        ...loginInfo,
                        history: temp,
                    }));
                    
                }
            }
            else {
                setBookDetail({info:{price: "0", stock: ""} ,message: "failure"});
            }
            
        }
        
        catch (error) {
        console.log(error);
        alert("도서관 보유정보를 가져오는데 실패하였습니다.")
        }

        setLoadingState(false);
    },[book, dispatch, frommypage, loginInfo, loginState, selectedRegion.region, selectedRegion.subregion, today]);

    const deleteSearchList = async () => {
        isDelete = true;
        try{
            const res = await axios({
                method: 'DELETE',
                url: `${END_POINT}/member/history`,
                data: {
                    bookId: book.bookId
                }
            });

            if (res.data.message === "success") {
                alert("삭제 성공");
                let temp = loginInfo.history;
                temp.splice(i, 1);
                dispatch(updateUserInfo({
                    ...loginInfo,
                    history: temp,
                }));
            }
            else {
                alert("삭제 실패");
            }
        }
        catch (error) {
            console.log(error);
            alert("삭제 실패");
        }
    }

    const onClickfunc = useCallback( (props) => {
        
        if(props.showDtl === true){
            setShowDetail(false);
        }
        else{
            if (isDelete) {
                return;
            }
            getBookDetail();
            setShowDetail(true);
        }
        
    },[getBookDetail, isDelete]);


    const RenderLiblist = useCallback(() => {
        if (bookDetail.message === 'success') {
            if (bookDetail.info.libraries.length === 0) {
                return(
                    <p>검색 결과가 없습니다.</p>
                )
            }
            else {
                return(
                    <>
                        <p>해당 도서를 구비중인 도서관 목록</p>
                        <div className="LibraryList">
                            <Accordion alwaysOpen>
                                {bookDetail.info.libraries.map((lib, i) =><LibraryDetail key={lib.name} lib={lib} i={i} j={book.isbn} />)}
                            </Accordion>
                            
                        </div>
                    </>
                )
            }
        }
        else {
            return(
                <p>현재 해당 도서의 정보가 제공되지 않습니다.</p>
            )
        }

        
    },[bookDetail, book]);

    const LibraryDetail = useCallback((props) => {

        const { lib, i } = props;

        return(
            <>
                <div className="LibraryInfo">
                    <Accordion.Item eventKey={i}>
                        <Accordion.Header>{lib.name}</Accordion.Header>
                        <Accordion.Body>
                            <div className="Library">
                                    <div>
                                        <br/>
                                        <span className={"LibAddress"}>주&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;소 : {lib.address}</span><br/><br/>
                                        <span>대출상태 : {lib.available === 'Y' ? "대출가능" : "대출중"}</span>
                                    </div>
                                    <RenderMaps location={{
                                            longitude: lib.longitude,
                                            latitude: lib.latitude
                                        }} i={i} />
                            </div>
                        </Accordion.Body>
                    </Accordion.Item>
                </div>
            </>
        )
    },[])

    const renderDetail = useCallback((book) => {

        let temp = RegionCodeTranslate({code: selectedRegion.region + selectedRegion.subregion});

        return (
            <>
                <tr style={{backgroundColor: "#ffffff"}}>
                    <td colSpan="2">
                        <div className="BookDetailInfo">
                            <h4>책 정보</h4>
                            <span>{(book.description) ? book.description : "책 소개말이 없습니다."}</span><br/><br/>
                            <span>가격 : {bookDetail.info.price}원</span><br/>
                            <span>재고 : {bookDetail.info.stock === "available" ? "재고 있음" : "재고 없음"}</span><br/><br/>
                            <div className="LibraryInfo">
                                <h4>도서관 소장 정보</h4>
                                <div className="LibraryDetailInfo">
                                    <p>선택된 지역 : {temp.fullName}</p>
                                    <RenderLiblist bookDetail={bookDetail}/>
                                </div>
                                {}
                            </div>            
                        </div>               
                    </td>
                </tr>
                <tr style={{backgroundColor: "#ffffff"}}>
                    <td colSpan="2">
                        <div style={{textAlign: "center"}}>
                            <Button variant="secondary" className="CloseDetailButton" onClick={() => setShowDetail(false)}>
                                닫기
                            </Button>
                        </div>
                    </td>
                </tr>
            </>
        )
    },[selectedRegion, bookDetail])

    const handleImgError = (e) => {
        e.target.src = default_Thumbnail;
    }

    const renderLoading = () => {
        return(
            <tr style={{backgroundColor: "#ffffff"}}>
                <td style={{textAlign: "center"}}>
                    <h5>검색중입니다</h5>
                    <PuffLoader color={"#00ACFD"} loading={true} css={{display: "block", height: "100px", margin: "auto", marginTop: "20px"}} size={80} />
                </td>
            </tr>
        )
    }
    
    return (
        <div className="BookInfoBox" >
            <table style={{width: "100%"}}>
                <tbody>
                    <tr onClick={() => onClickfunc(props={e: i+1, showDtl: showDetail})} style={{display: "flex", alignItems: "center", justifyContent: "space-between", minHeight: "125px", marginTop: "10px", backgroundColor: "#ffffff"}}>
                        <td className="BookImgTable">
                            <table>
                                <tbody>
                                    <tr>
                                        <td>
                                            <img className="BookImg" src={book.image ? book.image : default_Thumbnail} onError={handleImgError} alt={book.title} /> 
                                        </td>
                                        <td>
                                            <span>{typeof(book.rank) !== 'undefined' && book.rank+". "}{book.title}</span>
                                            <br></br>
                                            <span>{book.author}</span>
                                            <span>ㅣ</span>
                                            <span>{book.publisher}</span>
                                            <span>ㅣ</span>
                                            <span>{book.isbn}</span>
                                            <span>ㅣ</span>
                                            <span>{frommypage ? book.date : book.year}</span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </td>                                                                
                        <td>
                            {frommypage ?
                            <Button variant="light" className="DeleteSearchListButton" style={{marginBottom: "85px"}}  onClick={() => deleteSearchList()}>
                                X
                            </Button> : null}
                        </td>
                    </tr>                                    
                    {showDetail ?
                    (loadingState ? renderLoading() : renderDetail(book))
                    : null}
                </tbody>
            </table>
            
        </div>
    );
};


export default BookList;
