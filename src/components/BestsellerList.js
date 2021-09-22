import React, { useState, useEffect, useCallback, useMemo } from "react";
//import { useSelector, useDispatch } from 'react-redux';
import BookList from "./BookList";
import axios from 'axios';
import "../style/BestsellerList.scss"

//const END_POINT = "/v1/search/book.json";
const END_POINT = `${process.env.REACT_APP_END_POINT}`;

// const Client_ID = "6kzLim7jrHaqIQQcyTyH";
// const Client_PW = "TKnpNps3Gg";

function Bestseller() {

    const [loadingState, setLoadingState] = useState(false);
    //const [searchText, setSearchText] = useState("");
    const [books, setBook] = useState([]);
    //const [page, setPage] = useState(1);
    //const [totalPage, setTotalPage] = useState(0);
    const [display] = useState(10);
    //const [searchState, setSearchState] = useState(false);
    const [searchGenre, setSearchGenre] = useState("종합");

    //const loginInfo = useSelector(state => state.updateLoginState.user);

    const bestsellerGenre = useMemo(() => ["종합", "가정/요리/뷰티", "건강/취미/레저", "경제경영", "고전", "과학", "만화",
                            "사회과학", "소설/시/희곡", "어린이", "에세이", "여행", "역사", "예술/대중문화",
                            "유아", "인문학", "자기계발", "장르소설", "종교/역학", "좋은부모", "청소년"],[]);
    
    const genreCode = useMemo(()=> [0, 1230, 55890, 170, 2105, 987, 2551, 798, 1, 1108, 55889, 1196, 74, 517, 13789, 656,
                        336, 112011, 1237, 2030, 1137],[]);

    const getBestseller = useCallback( async (props) => {
        setBook([]);
        setLoadingState(true);
        //console.log("code", genreCode[bestsellerGenre.indexOf(props.genre)]);
        try{
            const res = await axios.get(`${END_POINT}/bestseller`, {
                params: {
                    //query: props.genre,
                    //display: display*10
                    code: genreCode[bestsellerGenre.indexOf(props.genre)],
                },
                // headers: {
                //     "X-Naver-Client-Id": Client_ID,
                //     "X-Naver-Client-Secret": Client_PW
                // }
            });
            //console.log(res.data);
            const booklist = res.data.info.bookList.map((item, index) => ({
                    id: index,
                    rank: item.rank,
                    title: item.title.replace(/(<([^>]+)>)/ig,""),
                    image: item.image,
                    author: item.author.replace(/(<([^>]+)>)/ig,""),
                    isbn: item.isbn.replace(/(<([^>]+)>)/ig,""),
                    //year: item.pubdate.replace(/(<([^>]+)>)/ig,""),
                    //description: item.description.replace(/(<([^>]+)>)/ig,""),
                    publisher: item.publisher.replace(/(<([^>]+)>)/ig,""),
                    //link: item.link
                    
                })
            );
            
            let testlist = [];
            //let totalpage = 0;
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
                //totalpage++;
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
    },[bestsellerGenre, display, genreCode]);

    const onClickGenre = (props) => {
        //console.log('props.genre',props.genre);
        if (props.genre !== searchGenre){
            setBook([]);
            setSearchGenre(props.genre);
        }
        //getBestseller({genre: searchGenre})
    }

    const RenderGenre = (props) => {
        //console.log(props);
        if (searchGenre === props.genre) {
            return (
                <>
                    <span className="GenreSelected" onClick={() => onClickGenre(props)}>{props.genre}</span>
                    {(props.i%11) < 10 ? <span>, </span> : <br></br>}
                </>
            );
        }
        else {
            return (
                <>
                    <span onClick={() => onClickGenre(props)}>{props.genre}</span>
                    {(props.i%11) < 10 ? <span>, </span> : <br></br>}
                </>
            );
        }
        
    }

    const selectBestsellerGenre = () => {
        return (
            <div className="BestsellerGenre">
                {bestsellerGenre.map((genre, i) => <RenderGenre key={genre} genre={genre} i={i} />)}
            </div>
        )
    }

    useEffect(() => {getBestseller({genre: searchGenre});},[searchGenre, getBestseller]);

    return (
        <div className="BestsellerList">
            <h2>{searchGenre} 베스트 셀러</h2>
            {selectBestsellerGenre()}
            <h2 style={{textAlign: 'center'}}>{loadingState && books.length === 0 ? "Loading..." : null}</h2>
            {books.map((book, i) => <BookList key={book.id} book={book} i={i} frommypage={false}/>)}
        </div>
    )
}

export default Bestseller;