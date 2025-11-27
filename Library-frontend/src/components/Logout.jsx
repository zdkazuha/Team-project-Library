import { useContext, useEffect } from "react";
import { UserContext } from "../contexts/User.context";
import { useNavigate } from "react-router-dom";

function Logout() {

    const {clear} = useContext(UserContext);
    const navigate = useNavigate();

    useEffect(() => {
        clear();
        navigate('/');
    }, []);

    return (
        <></>
    );
}

export default Logout;