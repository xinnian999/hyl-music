import { useBoolean, useMount, useRedux } from "@/hooks";
import { List, NavBar, Popup } from "antd-mobile";
import ReactDom from "react-dom";
import PlayBtn from "../PlayBtn";
import AlBum from "../AlBum";
import "./index.less";
import { Icon } from "@/components";
import { useEffect, useState } from "react";
import classNames from "classnames";
import {
  getArtist,
  request,
  scrollIntoView,
  getRandom,
  httpTohttps,
} from "@/utils";
import parseLyric from "./parseLyric";
import classnames from "classnames";
import $ from "jquery";

type PlayerType = {
  onBack: () => void;
  visible: boolean;
};

let timer: any;

export default function Player({ onBack, visible }: PlayerType) {
  const { store, dispatch } = useRedux();
  const { ing, play, audio, currentTime, list } = store;
  const duration = Math.floor(ing.time / 1000);
  const [playType, setPlayType] = useState(0);

  const [pop, onPop, offPop] = useBoolean(false);

  useMount(() => {
    if (ing.url) {
      audio.src = httpTohttps(ing.url);
      audio.autoplay = true;
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
    }, 500);
    audio.play();
  }, [play]);

  useEffect(() => {
    //播放完成时，根据播放type切换
    if (currentTime >= duration) {
      dispatch({ type: "CHANGE_CURRENTTIME", payload: 0 });
      next();
    }

    golrc()
  }, [currentTime]);

  useEffect(() => {
    if (!ing.url) {
      request.get("/song/url", { params: { id: ing.id } }).then((res) => {
        if (!res.data[0].url) return next();
        dispatch({
          type: "CHANGE_ING",
          payload: { ...ing, ...res.data[0] },
        });
        audio.src = httpTohttps(res.data[0].url);
        if (play) {
          dispatch({ type: "CHANGE_PlAY", payload: true });
        }
      });
    }
    if (!ing.lrc) {
      request.get("/lyric", { params: { id: ing.id } }).then((res) => {
        dispatch({
          type: "CHANGE_ING",
          payload: { ...ing, lrc: res.lrc.lyric },
        });
      });
    }
  }, [ing]);

  useEffect(() => {
    if (visible) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [visible]);

  const golrc=()=>{
    const active_lrc: any = document.querySelectorAll(".lrc-item-active");

    for (const i of active_lrc) {
      i.classList.remove("lrc-item-current");
    }
    const current_active_lrc = active_lrc[active_lrc.length - 1];

    if (current_active_lrc) {
      current_active_lrc.classList.add("lrc-item-current");

      $(".lrc").stop().animate(
        {
          scrollTop: current_active_lrc.offsetTop - $(".lrc").height() / 2,
        },
        500
      );
    }
  }

  const goProgress = (e) => {
    const progressBodyEl: any = document.querySelector(".progress-body");
    const time = Math.floor(
      (e.nativeEvent.offsetX / progressBodyEl.clientWidth) * duration
    );

    audio.currentTime = time;
    dispatch({ type: "CHANGE_CURRENTTIME", payload: time });
  };

  const next = () => {
    const index = list.map((item) => item.id).indexOf(ing.id);

    if (playType === 0) {
      dispatch({
        type: "CHANGE_ING",
        payload: list[index + 1],
      });
    }

    if (playType === 1) {
      const random = getRandom(0, list.length, [index]);
      dispatch({
        type: "CHANGE_ING",
        payload: list[random],
      });
    }
    if (playType === 2) {
      audio.src = httpTohttps(ing.url);
      audio.play();
    }
  };

  const last = () => {
    const index = list.map((item) => item.id).indexOf(ing.id);
    if (playType === 0) {
      dispatch({
        type: "CHANGE_ING",
        payload: list[index - 1],
      });
    }

    if (playType === 1) {
      const random = getRandom(0, list.length, [index]);
      dispatch({
        type: "CHANGE_ING",
        payload: list[random],
      });
    }
    if (playType === 2) {
      audio.src = httpTohttps(ing.url);
      audio.play();
    }
  };

  const changePlayType = (type: number) => {
    setPlayType(type);
  };

  return ReactDom.createPortal(
    <div
      className={classNames(
        "player-contariner",
        "animate__animated  animate__fadeInUp",
        {
          visible,
        }
      )}
    >
      <div
        className="bg"
        style={{ backgroundImage: `url(${ing.al?.picUrl})` }}
      ></div>
      <div className="player-main">
        <NavBar className="player-main-header" onBack={onBack}>
          {ing.name}
        </NavBar>
        <p className="artist">{getArtist(ing.ar)}</p>
        <AlBum className="player-avatar" />

        <div className="lrc">
          {ing.lrc &&
            parseLyric(ing.lrc).lrc.map(({ lyric, time }: any, index) => {
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

        <div className="control">
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
              0{parseInt(String(duration / 60)) || 0}:
              {parseInt(String(duration / 10)) % 6 || 0}
              {duration % 10 || 0}
            </span>
          </div>

          <div className="control-botton">
            {playType === 0 && (
              <Icon
                type="icon-liebiaoxunhuan"
                className="control-btn3"
                onClick={() => changePlayType(1)}
              />
            )}
            {playType === 1 && (
              <Icon
                type="icon-suijibofang"
                className="control-btn3"
                onClick={() => changePlayType(2)}
              />
            )}
            {playType === 2 && (
              <Icon
                type="icon-danquxunhuan"
                className="control-btn3"
                onClick={() => changePlayType(0)}
              />
            )}
            <div className="control-center">
              <Icon
                type="icon-shangyishou"
                className="control-btn2"
                onClick={last}
              />
              <PlayBtn className="control-btn" />
              <Icon
                type="icon-xiayishou"
                className="control-btn2"
                onClick={next}
              />
            </div>
            <Icon
              type="icon-liebiao"
              className="control-btn3"
              onClick={onPop}
            />
          </div>
        </div>
        <Popup
          visible={pop}
          onMaskClick={offPop}
          bodyStyle={{
            borderTopLeftRadius: "8px",
            borderTopRightRadius: "8px",
            maxHeight: "40vh",
            zIndex: 99999,
            overflowY: "scroll",
          }}
          afterShow={() => scrollIntoView(".pop-list-itemActive")}
        >
          <List>
            {list.map((item: any, i) => {
              return (
                <List.Item
                  key={item.id}
                  onClick={() =>
                    dispatch({
                      type: "CHANGE_ING",
                      payload: item,
                    })
                  }
                >
                  <div
                    className={classnames("pop-list-item", {
                      "pop-list-itemActive": ing.id === item.id,
                    })}
                  >
                    {item.name} -{" "}
                    <span className="artist">{getArtist(item.ar)}</span>
                  </div>
                </List.Item>
              );
            })}
          </List>
        </Popup>
      </div>
    </div>,
    document.body
  );
}
