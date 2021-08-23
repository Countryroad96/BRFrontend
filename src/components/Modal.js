import React, { useRef, useEffect } from "react";
import ModalPortal from '../ModalPortal';
import RenderMaps from "./Map";
import "../style/Map.scss";
import "../style/Modal.scss";

const Modal = (props) => {

    const modalEl = useRef();

    const handleClickOutside = e => {
        // console.log('e : ', e);
        // console.log('target :', e.target);
        // console.log('modalElement.current:', modalEl.current);
        // console.log('!modalEl', !modalEl.current.contains(e.target))
        if (modalEl.current && !modalEl.current.contains(e.target)){
            console.log("modal close click");
        }
    };
    useEffect(() => {
        window.addEventListener("click", handleClickOutside);
        document.body.style.cssText = `overflow: hidden;`
            return () => {
                window.removeEventListener("click", handleClickOutside);
                document.body.style.cssText = `overflow: ""; overflow-y: overlay;`
            }
    },[]);

    return (
        <ModalPortal>
            <div className="CloseCheckBox" onClick={props.clickoff ? () => props.setModal(false) : null}></div>
            <div className="ModalBox">
                <div className="content" ref={modalEl}>
                    <h3>{props.title}</h3>
                    <p>내용입니다.</p>
                    <p>{props.description}</p>
                    <div>
                        <button onClick={() => {props.setModal(false);}} >닫기</button>
                    </div>
                </div>
            </div>
        </ModalPortal>  
    );
};
/*  */
export default Modal;