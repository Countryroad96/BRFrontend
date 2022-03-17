import React, { useCallback, useState, useEffect } from "react";
import { useSelector } from 'react-redux';
import BookList from './BookList';
import Button from 'react-bootstrap/Button';
import "../style/SearchHistory.scss"

function SearchHistory(props) {
    
    const loginInfo = useSelector(state => state.updateLoginState.user);
    const [page, setPage] = useState(1);
    const [totalPage, setTotalPage] = useState(1);

    useEffect(() => {
        if (loginInfo.history.length > 0){
            let temp = parseInt(loginInfo.history.length / 10);

            if (loginInfo.history.length % 10 > 0) {
                temp += 1;
            }
            setTotalPage(temp);
        }
        else{
            setTotalPage(0)
        }
    },[loginInfo]);

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

    const renderHistory = useCallback(() => {
        let tempHistory = [];
        let count = 0;
        let temp = [];

        for (let i = 0; i < loginInfo.history.length; i++){
            if (count >= 10){
                count = 0;
                tempHistory.push(temp);
                temp = [];
            }
            if (i === loginInfo.history.length - 1){
                tempHistory.push(temp);
            }
            temp.push(loginInfo.history[i]);
            count += 1;
        }

        if (loginInfo.history.length > 0) {
            return (
                <>
                    {tempHistory[page-1].map((book, i) => <BookList key={book.bookId} book={book} i={i} frommypage={true}/>)}
                    {renderButton()}
                </>
            )
        } else{
            return(
                <h4 style={{textAlign: "center"}}>비어있음</h4>
            )
        }
    },[loginInfo, page, renderButton]);

    return(
        <div className="SearchHistory">
            <h2 style={{width: "1200px", marginBottom: "50px"}}>{loginInfo.name}님의 검색이력</h2>
            {renderHistory()}
        </div>
    );
}

export default SearchHistory;