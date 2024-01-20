import "./Layout.css";
import src1 from "./icons/MinimizeButton_icon.ico";
import src2 from "./icons/Maximize_Window_icon.ico";
import src3 from "./icons/Close_Window_icon.ico";

const Layout = ({ mainContentChildren, navChildren }) => {
  return (
    <div style={{ fontFamily: "Pixel Perfect" }} className="body-container">
      <div className="Title-Bar">
        <div className="Title">Sessionary</div>
        <div className="Window-Buttons">
          <button className="each-button">
            <img src={src1} className="each-image" />
          </button>
          <button className="each-button">
            <img src={src2} className="each-image" />
          </button>
          <button className="each-button">
            <img src={src3} className="each-image" />
          </button>
        </div>
      </div>
      <div className="nav-bar">{navChildren}</div>
      <div className="inner-shadows">
        <div className="content">{mainContentChildren}</div>
      </div>
    </div>
  );
};
export default Layout;
