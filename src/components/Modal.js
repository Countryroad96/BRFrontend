import React, { useRef, useEffect, useCallback } from "react";
import ModalPortal from '../ModalPortal';
import Button from 'react-bootstrap/Button';
import "../style/Modal.scss";

const Modal = (props) => {

    const modalEl = useRef();

    const handleClickOutside = e => {
        if (modalEl.current && !modalEl.current.contains(e.target)){
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

    const onClickYes = useCallback(() => {
        
        if(props.callback !== null) {
            props.callback();
        }
        props.setModal(false);
    }, [props]);

    const onClickNo = useCallback(() => {
        props.setModal(false);
    },[props])

    return (
        <ModalPortal>
            <div className="CloseCheckBox" onClick={props.clickoff ? onClickNo : null}></div>
            <div className="ModalBox">
                <div className="content" ref={modalEl}>
                    <h3>{props.title}</h3>
                    <p></p>
                    <p>{props.description}</p>
                    <div>
                        <Button variant="secondary" onClick={onClickYes} >{props.yesButtonText}</Button>
                        {props.activateNo ? <Button variant="secondary" onClick={onClickNo} >아니오</Button> : null}
                    </div>
                </div>
            </div>
        </ModalPortal>  
    );
};
export default Modal;