import { useMount, useRedux } from "@/hooks";
import { NavBar } from "antd-mobile";
import classnames from "classnames";
import ReactDom from "react-dom";
import "./index.less";

export default function Player({ onBack }) {
  const { store, dispatch } = useRedux();

  const { ing, play } = store;

  useMount(() => {
    document.body.style.overflow = "hidden";

    return () => (document.body.style.overflow = "auto");
  });

  return ReactDom.createPortal(
    <div className="player-contariner animate__animated  animate__bounceInUp ">
      <div className="bg"></div>
      <div className="player-main">
        <NavBar className="player-main-header" onBack={onBack}>
          {ing.name}
        </NavBar>

        <img
          className={classnames("avatar", {
            "animation-stop": !play,
          })}
          src={ing.al?.picUrl}
        />
      </div>
    </div>,
    document.body
  );
}
