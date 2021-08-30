import React, { useState, useEffect } from "react";
import { useSelector } from 'react-redux';
import RegionCodeTranslate from './RegionCodeTranslate';
import RenderMaps from "./Map";
import "../style/BookList.scss";

const default_Thumbnail = "https://bookthumb-phinf.pstatic.net/cover/069/862/06986295.jpg?type=m1&udate=20180918"

const BookList = (props) => {
    
    const selectedRegion = useSelector(state => state.selectedRegion);

    const { book, i } = props;

    // const[modal, setModal] = useState(false);
    // const[modalList, setList] = useState(1);
    const[clickList, setClickList] = useState(1);
    const[showDetail, setShowDetail] = useState(false);
    const[currentRegion, setCurrentRegion] = useState({});

    const onClickfunc = (e) => {
        //setList(e);
        //setModal(true);
        if(showDetail){
            if(clickList === e) {
                setShowDetail(false);
            }
            else{
                setClickList(e);
            }                
        }
        else{
            setClickList(e);
            setShowDetail(true);
        }
        
    };

    //console.log('props.bookslist', book);
    // useEffect(() => {
    //     console.log("redux selRegion", selectedRegion.region, selectedRegion.subregion);
        
        
    // }, []);

    const renderDetail = (book) => {
        
        let temp = RegionCodeTranslate({code: selectedRegion.region + selectedRegion.subregion});
        console.log(RegionCodeTranslate({code: selectedRegion.region + selectedRegion.subregion}))

        return (
            <>
                <tr>
                    <td colSpan="2">
                        <div className="BookDetailInfo">
                            <span>{book.description}</span>
                            <div className="LibraryInfo">
                                <div className="LibraryDetailInfo">
                                    <p>선택된 지역 : {temp.fullName}</p>
                                    <p>도서관 이름</p>
                                    <p>서울도서관</p>
                                    <p>도서관 정보</p>
                                    <p>서울 중구 세종대로 110 서울특별시청</p>
                                </div>
                                <RenderMaps location={{
                                    longitude: 126.9777500,
                                    latitude: 37.566300
                                }} />
                            </div>            
                        </div>               
                    </td>
                </tr>
                <tr>
                    <td colSpan="2">
                        <div style={{textAlign: "center"}}>
                            <button className="CloseDetailButton" onClick={() => setShowDetail(false)}>
                                접기
                            </button>
                        </div>
                    </td>
                </tr>
            </>
        )
    }

    //setTemp(props.books[page])
    //console.log('temp',temp);)
    //if (typeof(book) !== "undefined" && book !== "undefined") {

    const handleImgError = (e) => {
        e.target.src = default_Thumbnail;
    }
    
    return (
        <div className="BookInfoBox" >
            <table style={{width: "100%"}}>
                <tbody>
                    <tr onClick={() => onClickfunc(i+1)} style={{display: "flex",alignItems: "center" , minHeight: "125px"}}>
                        <td className="BookImgTable">
                            <img className="BookImg" src={book.image ? book.image : default_Thumbnail} onError={handleImgError} alt={book.title} />
                        </td>                                                                
                        <td>
                            <span>{book.title}</span>
                            <br></br>
                            <span>{book.author}</span>
                            <span>ㅣ</span>
                            <span>{book.publisher}</span>
                            <span>ㅣ</span>
                            <span>{book.year}</span>                                                
                        </td>                                         
                    </tr>                                    
                    {showDetail && (clickList === (i+1)) ?
                    renderDetail(book)
                    : null}
                </tbody>
            </table>
        </div>
    );
    //}
    // else{
    //     return "No result";
    // }
    

    // return (
    //     props.books.map((book, i) => {
    //         //if (typeof(book) !== "undefined" && book !== "undefined") {
    //         //}

            
    //     })
    // ); 
};

{/* {modal && (modalList === (i+1)) ? 
                            <Modal setModal={setModal} 
                                title={book.title}
                                description={book.description}
                                clickoff={true}
                            /> : null} */}

export default BookList;
