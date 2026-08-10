import { useEffect } from "react";
import api from "../config/axios";
import { useSelector, useDispatch } from "react-redux";
import { setUser, setLoading } from "../Redux/Slices/userSlice";

const useCurrentUser = () => {
  const { user } = useSelector((state) => state.user);
  console.log(user);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        dispatch(setLoading(true));
        const res = await api.get("/api/user/current-user");
        dispatch(setUser(res.data.user));
      } catch (error) {
        dispatch(setUser(null));
        console.log(error.response?.data);
        console.log(error.response?.status);
        console.log(error.message);
      } finally {
        dispatch(setLoading(false));
      }
    };
    fetchUser();
  }, []);
};

export default useCurrentUser;
