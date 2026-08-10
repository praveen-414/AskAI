import React from "react";
import styles from "./Signup.module.css";
import authImg from "../../assets/authImg.png";
import { FaRegUser } from "react-icons/fa";
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


const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { theme } = useSelector((state) => state.theme);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    if (
      !name.trim() ||
      !email.trim() ||
      !password.trim() ||
      !confirmPassword.trim()
    ) {
      return toast.error("All fields are required!");
    }
    if (password !== confirmPassword) {
      return toast.error("Passwords doesn't match!");
    }
    setLoading(true);
    try {
      const res = await api.post("/api/auth/signup", {
        name,
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
      <div className={styles.signupContainer}>
        {/* left  */}
        <div className={styles.left}>
          <img src={theme === "light" ? authImg : darkAuthImg} alt="" />
        </div>
        {/* right  */}
        <div className={styles.right}>
          <div className={styles.headings}>
            <h1>Create your account</h1>
            <p>
              Join <span>AskAi</span> and start your ai journey
            </p>
          </div>
          <form onSubmit={handleSignup}>
            {/* name  */}
            <div>
              <FaRegUser size={17} className={styles.icons}/>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                type="text"
                placeholder="Enter your name"
              />
            </div>
            {/* email  */}
            <div>
              <MdOutlineMail size={17} className={styles.icons}/>

              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="Enter your email"
              />
            </div>
            {/* password  */}
            <div>
              <TbLockPassword size={17} className={styles.icons}/>

              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder="Enter your password"
              />
            </div>
            {/* confrim password  */}
            <div>
              <TbLockPassword size={17} className={styles.icons}/>

              <input
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                type="password"
                placeholder="Confirm password"
              />
            </div>
            <p>
              Already have an account <Link to="/login">Login</Link>
            </p>
            <Button
              disabled={loading}
              type="submit"
              text={loading ? "Signing..." : "Signup"}
            />
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
