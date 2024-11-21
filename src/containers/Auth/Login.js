import { useRef, useState, useEffect } from "react";
import { connect } from "react-redux";
import { push } from "connected-react-router";
import * as actions from "../../store/actions";
import "./Login.scss";
import { FormattedMessage } from "react-intl";
import { handleLoginApi } from "../../services/userService";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

export default function Login() {
  const [identifier, setIdentifier] = useState(""); // Thay username bằng identifier
  const [password, setPassword] = useState("");
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [errMessage, setErrMessage] = useState("");

  const { isLoggedIn, userInfo, language } = useSelector((state) => ({
    isLoggedIn: state.user.isLoggedIn,
    userInfo: state.user.userInfo,
    language: state.app.language,
  }));

  const dispatch = useDispatch();
  let history = useHistory();

  const handleOnChangeIdentifier = (event) => {
    setIdentifier(event.target.value);
  };

  const handleOnChangePassword = (event) => {
    setPassword(event.target.value);
  };

  const handleLogin = async () => {
    setErrMessage("");
    try {
      let data = await handleLoginApi(identifier, password); // Gửi identifier thay vì username
      if (data && data.errCode !== 0) {
        if (language === "vi") {
          setErrMessage(
            "Thông tin đăng nhập này không khớp với hồ sơ của chúng tôi."
          );
        } else {
          setErrMessage("These credentials do not match our records.");
        }
      }
      if (data && data.errCode === 0) {
        history.push("/home");
        dispatch(actions.userLoginSuccess(data.user));
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setErrMessage(error.response.data.message);
      }
    }
  };

  const handleShowHidePassword = () => {
    setIsShowPassword(!isShowPassword);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <div className="login-background">
      <div className="login-container">
        <div className="login-content row">
          <div className="col-12 text-login">
            <FormattedMessage id={"login.login"} />
          </div>
          <div className="col-12 form-group login-input">
            <label>
              <FormattedMessage id={"login.identifier"} />:
            </label>
            <input
              type="text"
              className="form-control"
              placeholder={
                language === "en"
                  ? "Enter your email or phone number"
                  : "Nhập email hoặc số điện thoại"
              }
              value={identifier}
              onChange={(event) => handleOnChangeIdentifier(event)}
            />
          </div>
          <div className="col-12 form-group login-input">
            <label>
              <FormattedMessage id={"login.password"} />:
            </label>
            <div className="custom-input-password">
              <input
                className="form-control"
                type={isShowPassword ? "text" : "password"}
                placeholder={
                  language === "en" ? "Enter your password" : "Nhập mật khẩu"
                }
                onChange={(event) => handleOnChangePassword(event)}
                onKeyDown={(event) => handleKeyDown(event)}
              />
              <span onClick={() => handleShowHidePassword()}>
                <i
                  className={
                    isShowPassword ? "far fa-eye" : "fas fa-eye-slash"
                  }
                ></i>
              </span>
            </div>
          </div>
          <div className="col-12" style={{ color: "red" }}>
            {errMessage}
          </div>
          <div className="col-12">
            <button
              className="btn-login"
              onClick={() => handleLogin()}
            >
              Login
            </button>
          </div>
          <div className="col-12 section-forgot-signup">
            <span
              className="forgot-password pointer"
              onClick={() => history.push("/forgot-password")}
            >
              <FormattedMessage id={"login.forgot-password"} />
            </span>
            <span
              className="sign-up"
              onClick={() => history.push("/sign-up")}
            >
              <FormattedMessage id={"login.sign-up"} />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = (state) => ({
  language: state.app.language,
});

const mapDispatchToProps = (dispatch) => ({
  userLoginSuccess: (userInfor) =>
    dispatch(actions.userLoginSuccess(userInfor)),
});
