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
  const { ing, play, audio, currentTime } = store;
  const duration = Math.floor(ing.time / 1000);

  useMount(() => {
    if (ing.url) {
      audio.src = ing.url;
    }
  });

  useEffect(() => {
    if (!play) {
      clearInterval(timer);
      audio.pause();
      return;
    }

    timer = setInterval(() => {
      dispatch({ type: "CHANGE_CURRENTTIME", payload: audio.currentTime });
    }, 1000);
    audio.play();
  }, [play]);

  useEffect(() => {
    if (currentTime >= duration) {
      dispatch({ type: "CHANGE_CURRENTTIME", payload: 0 });
      dispatch({ type: "CHANGE_PlAY", payload: false });
      clearInterval(timer);
    }
  }, [currentTime]);

  useEffect(() => {
    if (visible) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [visible]);

  const goProgress = (e) => {
    const progressBodyEl: any = document.querySelector(".progress-body");
    const time = Math.floor(
      (e.nativeEvent.offsetX / progressBodyEl.clientWidth) * duration
    );

    audio.currentTime = time;
    dispatch({ type: "CHANGE_CURRENTTIME", payload: time });
  };

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
          <span className="progress-currentTime">
            0{parseInt(String(currentTime / 60))}:
            {parseInt(String(currentTime / 10)) % 6}
            {parseInt(String(currentTime % 10))}
          </span>
          <div className="progress-body" onClick={goProgress}>
            <div
              className="current-progress"
              style={{ width: `${(currentTime / duration) * 100}%` }}
            >
              <span className="current-progress-head"></span>
            </div>
          </div>
          <span className="progress-durationTime">
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
