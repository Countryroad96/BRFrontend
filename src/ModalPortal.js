import ReactDOM from "react-dom"

const ModalPortal = ({ children }) =>{
    const el = document.getElementById("modalPortal");
    return ReactDOM.createPortal(children, el);
};

export default ModalPortal;