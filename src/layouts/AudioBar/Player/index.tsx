import { useMount, useRedux } from "@/hooks";
import { NavBar } from "antd-mobile";
import ReactDom from "react-dom";
import PlayBtn from "../PlayBtn";
import AlBum from "../AlBum";
import "./index.less";
import { Icon } from "@/components";
import { useEffect, useState } from "react";
import classNames from "classnames";

type PlayerType = {
  onBack: () => void;
  visible: boolean;
};

let timer: any;

export default function Player({ onBack, visible }: PlayerType) {
  const { store, dispatch } = useRedux();
  const [current, setCurrent] = useState(0);
  const { ing, play, audio } = store;
  const duration = Math.floor(ing.time / 1000);

  useMount(() => {
    // document.body.style.overflow = "hidden";

    if (play) {
      timer = setInterval(() => {
        setCurrent((current) => {
          return current + 1;
        });
      }, 1000);
    }

    return () => {
      clearInterval(timer);
      document.body.style.overflow = "auto";
    };
  });

  useEffect(() => {
    if (!play) {
      clearInterval(timer);
      return audio.pause();
    }
    if (!audio.src) {
      audio.src = ing.url;
    }
    timer = setInterval(() => {
      setCurrent((current) => {
        return current + 1;
      });
    }, 1000);
    audio.play();
  }, [play]);

  useEffect(() => {
    if (current === duration) {
      clearInterval(timer);
      setCurrent(0);
      dispatch({ type: "CHANGE_PlAY", payload: false });
    }
  }, [current]);

  return ReactDom.createPortal(
    <div
      className={classNames("player-contariner", {
        visible,
      })}
    >
      <div
        className="bg"
        style={{ backgroundImage: `url(${ing.al?.picUrl})` }}
      ></div>
      <div className="player-main">
        <NavBar className="player-main-header" onBack={onBack}>
          {ing.name}
        </NavBar>

        <AlBum className="player-avatar" />

        <div className="progress">
          <span className="current">
            0{parseInt(String(current / 60))}:
            {parseInt(String(current / 10)) % 6}
            {current % 10}
          </span>
          <div className="body">
            <div
              className="current-progress"
              style={{ width: `${(current / duration) * 100}%` }}
            ></div>
          </div>
          <span className="duration">
            0{parseInt(String(duration / 60))}:
            {parseInt(String(duration / 10)) % 6}
            {duration % 10}
          </span>
        </div>

        <div className="control">
          <Icon type="icon-liebiaoxunhuan" className="control-btn3" />
          <div className="control-center">
            <Icon type="icon-shangyishou" className="control-btn2" />
            <PlayBtn className="control-btn" />
            <Icon type="icon-xiayishou" className="control-btn2" />
          </div>
          <Icon type="icon-liebiao" className="control-btn3" />
        </div>
      </div>
    </div>,
    document.body
  );
}
