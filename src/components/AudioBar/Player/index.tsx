import { List, NavBar, Popup } from "antd-mobile";
import { useEffect, useState } from "react";
import $ from "jquery";
import classnames from "classnames";
import ReactDom from "react-dom";
import { useBoolean, useMount, useRedux } from "@/hooks";
import { Icon } from "@/components";
import {
  getArtist,
  request,
  scrollIntoView,
  getRandom,
  httpTohttps,
} from "@/utils";
import PlayBtn from "../PlayBtn";
import AlBum from "../AlBum";
import "./index.less";
import parseLyric from "./parseLyric";
import { Url } from "hyl-utils";

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
    }

    const { playId } = Url.getParams();

    if (playId) {
      (async () => {
        const detail = await request.get("/song/detail", {
          params: { ids: playId },
        });
        dispatch({
          type: "CHANGE_ING",
          payload: detail.songs[0],
        });
        Url.setParams({}, { async: true, url: window.location.origin });
      })();
    }
  });

  //移动端进度条拖拽事件
  const onTouchProgressMouseDown = (e: any) => {
    e.stopPropagation();
    const pbWidth = $(".progress-body").width()!;
    let progressX: number;

    clearInterval(timer);

    progressX = e.targetTouches[0].pageX - 75;

    $(".current-progress").css("width", progressX);
    renderCurrentTime(Math.floor((progressX / pbWidth) * duration));

    document.ontouchmove = (e: any) => {
      progressX = e.targetTouches[0].pageX - 75;

      if (progressX <= 0) {
        progressX = 0;
      }

      if (progressX >= pbWidth) {
        progressX = pbWidth;
      }

      $(".current-progress").css("width", progressX);

      renderCurrentTime(Math.floor((progressX / pbWidth) * duration));
    };

    document.ontouchend = () => {
      audio.currentTime = Math.floor((progressX / pbWidth) * duration);

      timer = setInterval(() => {
        dispatch({ type: "CHANGE_CURRENTTIME", payload: audio.currentTime });
        renderCurrentTime(audio.currentTime);
      }, 500);

      dispatch({ type: "CHANGE_PlAY", payload: true });

      document.ontouchmove = null;
      document.ontouchend = null;
    };
  };

  //pc端进度条拖拽事件
  const onDragProgressMouseDown = (e: any) => {
    e.stopPropagation();
    console.log("pc");

    const pbWidth = $(".progress-body").width()!;
    let progressX: number;

    document.onselectstart = () => false;
    document.ondragstart = () => false;
    clearInterval(timer);

    progressX = e.clientX - 75;

    $(".current-progress").css("width", progressX);
    renderCurrentTime(Math.floor((progressX / pbWidth) * duration));

    document.onmousemove = (event) => {
      event = event || window.event;

      progressX = event.clientX - 75;

      if (progressX <= 0) {
        progressX = 0;
      }

      if (progressX >= pbWidth) {
        progressX = pbWidth - 1;
      }

      $(".current-progress").css("width", progressX);

      renderCurrentTime(Math.floor((progressX / pbWidth) * duration));
    };

    document.onmouseup = function (event) {
      event = event || window.event;
      document.onselectstart = null;
      document.ondragstart = null;

      audio.currentTime = Math.floor((progressX / pbWidth) * duration);

      timer = setInterval(() => {
        dispatch({ type: "CHANGE_CURRENTTIME", payload: audio.currentTime });
        renderCurrentTime(audio.currentTime);
      }, 500);

      dispatch({ type: "CHANGE_PlAY", payload: true });

      // 取消鼠标移动事件
      document.onmousemove = null;
      // 取消鼠标抬起事件
      document.onmouseup = null;

      return false;
    };
  };

  useEffect(() => {
    if (!play) {
      clearInterval(timer);
      timer = null;
      audio.autoplay = false;

      audio.pause();
      return;
    }

    if (!timer)
      timer = setInterval(() => {
        dispatch({ type: "CHANGE_CURRENTTIME", payload: audio.currentTime });
        renderCurrentTime(audio.currentTime);
      }, 500);

    audio.play();
    audio.autoplay = true;
  }, [play]);

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
    document.title = `${ing.name} - 小琳音乐站`;
  }, [ing]);

  useEffect(() => {
    //播放完成时，切换下一曲
    if (currentTime >= duration) {
      dispatch({ type: "CHANGE_CURRENTTIME", payload: 0 });
      next();
    }

    const active_lrc: any = document.querySelectorAll(".lrc-item-active");

    for (const i of active_lrc) {
      i.classList.remove("lrc-item-current");
    }
    const current_active_lrc = active_lrc[active_lrc.length - 1];

    if (current_active_lrc) {
      current_active_lrc.classList.add("lrc-item-current");

      $(".lrc")
        .stop()
        .animate(
          {
            scrollTop: current_active_lrc.offsetTop - $(".lrc").height() / 2,
          },
          500
        );
    }
  }, [currentTime]);

  useEffect(() => {
    if (visible) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [visible]);

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

  const renderCurrentTime = (time: number) =>
    $(".progress-currentTime").text(
      `0${parseInt(String(time / 60))}:${
        parseInt(String(time / 10)) % 6
      }${parseInt(String(time % 10))}`
    );

  return ReactDom.createPortal(
    <div
      className={classnames(
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
                  className={classnames("lrc-item", {
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
            <span className="progress-currentTime">00:00</span>
            <div
              className="progress-main"
              onTouchStart={onTouchProgressMouseDown}
              onMouseDown={onDragProgressMouseDown}
            >
              <div className="progress-body">
                <div
                  className="current-progress"
                  style={{ width: `${(currentTime / duration) * 100}%` }}
                >
                  <span className="current-progress-head"></span>
                </div>
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
