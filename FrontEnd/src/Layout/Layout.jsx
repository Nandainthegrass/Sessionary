import "./Layout.css";
import src1 from "./icons/MinimizeButton_icon.ico";
import src2 from "./icons/Maximize_Window_icon.ico";
import src3 from "./icons/Close_Window_icon.ico";

const Layout = ({ mainContentChildren, navChildren }) => {
  return (
    <div style={{ fontFamily: "Pixel Perfect" }} class="body-container">
      <div class="Title-Bar">
        <div class="Title">Sessionary</div>
        <div class="Window-Buttons">
          <button class="each-button">
            <img src={src1} class="each-image" />
          </button>
          <button class="each-button">
            <img src={src2} class="each-image" />
          </button>
          <button class="each-button">
            <img src={src3} class="each-image" />
          </button>
        </div>
      </div>
      <div className="nav-bar">{navChildren}</div>
      <div class="inner-shadows">
        <div class="content">{mainContentChildren}</div>
      </div>
    </div>
  );
};
export default Layout;
