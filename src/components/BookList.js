import React, { useState, useEffect } from "react";
import Modal from "./Modal.js";
import "../style/BookList.scss";

const default_Thumbnail = "https://bookthumb-phinf.pstatic.net/cover/069/862/06986295.jpg?type=m1&udate=20180918"

const BookList = (props) => {

    const[modal, setModal] = useState(false);
    const[modalList, setList] = useState(1);

    const onClickfunc = (e) => {
        setList(e);
        setModal(true);
    };

    //console.log('props.bookslist',props.books);
    useEffect(() => {
        console.log("props.bookslist",props.books);
    }, [props.books]);

    //setTemp(props.books[page])
    //console.log('temp',temp);)
    if (typeof(props.books) !== "undefined" && props.books !== "undefined") {
        return (
            props.books.map((book, i) => {
                if (typeof(book) !== "undefined" && book !== "undefined") {
                    return (
                        <>
                            <div className="BookInfoBox" key={book.id} onClick={() => onClickfunc(i+1)}>
                                <table>
                                    <tbody>
                                        <tr>
                                            <td>
                                                <img className="BookImg" src={book.image ? book.image : default_Thumbnail} alt={book.title} />
                                            </td>                                                                
                                            <td>
                                                <li>
                                                    <span>{book.title}</span>
                                                </li>
                                                <li>
                                                    <span>{book.author}</span>
                                                    <span>ㅣ</span>
                                                    <span>{book.publisher}</span>
                                                    <span>ㅣ</span>
                                                    <span>{book.year}</span>
                                                </li>
                                            </td> 
                                        </tr>                               
                                    </tbody>
                                </table>
                            </div>
                            {modal && (modalList === (i+1)) ? 
                            <Modal setModal={setModal} 
                                title={book.title}
                                description={book.description}
                                clickoff={true}
                            /> : null}
                        </>
                    );
                }
            })
        );
    }   
};

export default BookList;
