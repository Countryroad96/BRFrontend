import React, { useState, useEffect } from "react";
import { useSelector } from 'react-redux';
import axios from "axios";
import RegionCodeTranslate from './RegionCodeTranslate';
import RenderMaps from "./Map";
import "../style/BookList.scss";
import { selectRegion } from '../modules/SelectedRegionCode';

const default_Thumbnail = "https://bookthumb-phinf.pstatic.net/cover/069/862/06986295.jpg?type=m1&udate=20180918"
const END_POINT = "/v1/search/book.json";
const Client_ID = "6kzLim7jrHaqIQQcyTyH";
const Client_PW = "TKnpNps3Gg";

const BookList = (props) => {
    
    const selectedRegion = useSelector(state => state.selectedRegion);

    const { book, i } = props;

    // const[modal, setModal] = useState(false);
    // const[modalList, setList] = useState(1);
    const[clickList, setClickList] = useState(1);
    const[showDetail, setShowDetail] = useState(false);
    const[currentRegion, setCurrentRegion] = useState({});
    const[bookDetail, setBookDetail] = useState({});

    const getBookDetail = async () => {
        try{
            const res = await axios.get(END_POINT, {
                params: {
                    ISBN: book.isbn,
                    region: selectedRegion.region,
                    subregion: selectedRegion.subregion,
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
            
            // for (let j = 0; j < display; j++) {
            //     let k = 0;
            //     let temp = [];
            //     for (let i = j*10; i < (j+1)*10; i++) {
            //         if (typeof(booklist[i]) !== "undefined" && booklist[i] !== "undefined") {
            //             //console.log('booklist[i]',booklist[i]);
            //             //console.log(booklist[i].length);
            //             temp[k] = booklist[i];
            //             k++;
            //         }
            //     }
            //     //console.log('temp', temp);

            //     if (temp.length !== 0) {
            //         testlist[j] = temp;
            //         totalpage++;
            //     }
            // };

            //let final = testlist.filter((i) => i.filter(item => item !== "undefined") !== "undefined");
            //console.log("final list", final);
            //console.log("test list", testlist);

            
            //setBook({books: testlist, finish: true});
            //setTotalPage(totalpage);
            //setBook(testlist);
            //setSearchState(true)

            //console.log("res.data",res.data);
            //console.log("testlist",testlist);
            //console.log('booklist', booklist);
            //console.log("books",books); // 콘솔에 undefined라고 찍힘
            
        } 
        catch (error) {
        console.log(error);
        }
    };

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
                            <span>{book.description}</span><br/>
                            <span>{book.isbn}</span>
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
