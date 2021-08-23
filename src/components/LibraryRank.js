import React, { useState, useEffect } from "react";
//import { useSelector, useDispatch } from 'react-redux';
import BookList from "./BookList";
import axios from 'axios';
import "../style/BestsellerList.scss"

const END_POINT = "/v1/search/book.json";
const Client_ID = "6kzLim7jrHaqIQQcyTyH";
const Client_PW = "TKnpNps3Gg";

function LibraryRank() {

    const [loadingState, setLoadingState] = useState(false);
    //const [searchText, setSearchText] = useState("");
    const [books, setBook] = useState([]);
    //const [page, setPage] = useState(1);
    //const [totalPage, setTotalPage] = useState(0);
    const [display, setDisplay] = useState(10);
    //const [searchState, setSearchState] = useState(false);
    const [searchGenre, setSearchGenre] = useState("전체");

    //const loginInfo = useSelector(state => state.updateLoginState.user);

    const rankGenre = ["전체", "철학", "종교", "사회과학", "자연과학",
                        "기술과학", "예술", "언어", "문학", "역사"];
    
    const genreCode = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

    const getLibraryRank = async (props) => {
        setLoadingState(true);
        console.log("code", genreCode[rankGenre.indexOf(props.genre)]);
        try{
            const res = await axios.get(END_POINT, {
                params: {
                    query: props.genre,
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
                    title: (index+1+". ")+item.title.replace(/(<([^>]+)>)/ig,""),
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
            let k = 0;
            let temp = [];

            for (let i = 0; i < display * 10; i++) {
                if (typeof(booklist[i]) !== "undefined" && booklist[i] !== "undefined") {
                    //console.log('booklist[i]',booklist[i]);
                    //console.log(booklist[i].length);
                    temp[k] = booklist[i];
                    k++;
                }
            }

            if (temp.length !== 0) {
                testlist = temp;
                totalpage++;
            }
    
            //setTotalPage(1);
            setBook(testlist);
            //setSearchState(true);
            setLoadingState(false);

            //console.log("testlist",testlist);
        }
        catch (error) {
        console.log(error);
        }
    };

    const onClickGenre = (props) => {
        console.log('props.genre',props.genre);
        if (props.genre !== searchGenre){
            setBook([]);
            setSearchGenre(props.genre);
        }
        //getLibraryRank({genre: searchGenre})
    }

    const RenderGenre = (props) => {
        //console.log(props);
        return (
            <>
                <span onClick={() => onClickGenre(props)}>{props.genre}</span>
                {(props.i%11) < 10 ? <span>, </span> : <br></br>}
            </>
        )
    }

    const selectRankGenre = () => {
        return (
            <div className="BestsellerGenre">
                {rankGenre.map((genre, i) => <RenderGenre key={genre} genre={genre} i={i} />)}
            </div>
        )
    }

    useEffect(() => {getLibraryRank({genre: searchGenre});},[searchGenre]);

    return (
        <div className="BestsellerList">
            <h2>{searchGenre} 인기대출도서</h2>
            {selectRankGenre()}
            <h2 style={{textAlign: 'center'}}>{loadingState && books.length === 0 ? "Loading..." : null}</h2>
            {books.map((book, i) => <BookList key={book.id} book={book} i={i} />)}
        </div>
    )
}

export default LibraryRank;