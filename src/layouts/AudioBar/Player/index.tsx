import { useMount, useRedux } from "@/hooks";
import { List, NavBar } from "antd-mobile";
import ReactDom from "react-dom";
import PlayBtn from "../PlayBtn";
import AlBum from "../AlBum";
import "./index.less";
import { Icon } from "@/components";
import { useEffect, useState } from "react";
import classNames from "classnames";
import { request } from "@/utils";
import parseLyric from "./parseLyric";

type PlayerType = {
  onBack: () => void;
  visible: boolean;
};

let timer: any;

export default function Player({ onBack, visible }: PlayerType) {
  const { store, dispatch } = useRedux();
  const { ing, play, audio, currentTime, list } = store;
  const duration = Math.floor(ing.time / 1000);

  useMount(() => {
    if (ing.url) {
      audio.src = ing.url;
    }
    console.log(ing.lrc);
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

      const index = list.map((item) => item.id).indexOf(ing.id);
      dispatch({
        type: "CHANGE_ING",
        payload: list[index + 1],
      });
      request
        .get("/song/url", { params: { id: list[index + 1].id } })
        .then((result: any) => {
          audio.src = result.data[0].url;
          dispatch({
            type: "CHANGE_ING",
            payload: {
              ...list[index + 1],
              ...result.data[0],
            },
          });
          audio.play();
          dispatch({ type: "CHANGE_PlAY", payload: true });
        });
    }

    const active_lrc: any = document.querySelectorAll(".lrc-item-active");

    for (const i of active_lrc) {
      i.classList.remove("lrc-item-current");
    }
    const current_active_lrc = active_lrc[active_lrc.length - 1];

    if (current_active_lrc) {
      current_active_lrc.classList.add("lrc-item-current");
      current_active_lrc?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
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

  const next = () => {
    dispatch({ type: "CHANGE_CURRENTTIME", payload: duration });
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

        {ing.lrc && (
          <div className="lrc">
            {parseLyric(ing.lrc).lrc.map(({ lyric, time }: any, index) => {
              const { m, s, ms } = time;
              const times = Number(ms) + s * 1000 + m * 60 * 1000;

              return (
                <div
                  className={classNames("lrc-item", {
                    "lrc-item-active": audio.currentTime * 1000 >= times,
                  })}
                  key={lyric + index}
                >
                  {lyric}
                </div>
              );
            })}
          </div>
        )}

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
            <Icon
              type="icon-xiayishou"
              className="control-btn2"
              onClick={next}
            />
          </div>
          <Icon type="icon-liebiao" className="control-btn3" />
        </div>
      </div>
    </div>,
    document.body
  );
}
