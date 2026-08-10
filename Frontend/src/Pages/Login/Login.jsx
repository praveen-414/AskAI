import React from "react";
import styles from "./Login.module.css";
import authImg from "../../assets/authImg.png";
import { MdOutlineMail } from "react-icons/md";
import { TbLockPassword } from "react-icons/tb";
import { Link } from "react-router-dom";
import Button from "../../components/Button/Button";
import { useState } from "react";
import api from "../../config/axios";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../../Redux/Slices/userSlice";
import { useNavigate } from "react-router-dom";
import darkAuthImg from "../../assets/darkauthImg.png";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { theme } = useSelector((state) => state.theme);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      return toast.error("All fields are required!");
    }
    setLoading(true);
    try {
      const res = await api.post("/api/auth/login", {
        email,
        password,
      });

      dispatch(setUser(res.data.userData));
      toast.success(res.data.message);
      navigate("/");
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.loginContainer}>
        {/* left  */}
        <div className={styles.left}>
          <img src={theme === "light" ? authImg : darkAuthImg} alt="" />
        </div>
        {/* right  */}
        <div className={styles.right}>
          <div className={styles.headings}>
            <h1>Welcom back! Login</h1>
            <p>
              Join <span>AskAi</span> and start your ai journey
            </p>
          </div>
          <form onSubmit={handleLogin}>
            {/* email  */}
            <div>
              <MdOutlineMail size={17} className={styles.icons} />

              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="Enter your email"
              />
            </div>
            {/* password  */}
            <div>
              <TbLockPassword size={17} className={styles.icons} />

              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder="Enter your password"
              />
            </div>

            <p>
              Don't have an account? <Link to="/signup">Signup</Link>
            </p>
            <Button
              disabled={loading}
              type="submit"
              text={loading ? "Logging..." : "Login"}
            />
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
