import { useContext, useEffect } from "react";
import { UserContext } from "../contexts/User.context";
import { useNavigate } from "react-router-dom";
import { toast } from './ToastContainer';

function Logout() {

    const {clear} = useContext(UserContext);
    const navigate = useNavigate();

    useEffect(() => {
        clear();

        toast.success('✅ Logout successful!');
        navigate('/');
    }, []);

    return (
        <></>
    );
}

export default Logout;