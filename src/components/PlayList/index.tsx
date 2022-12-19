import { List } from "antd-mobile";
import { request } from "@/utils";
import { useRedux } from "@/hooks";
import classnames from "classnames";
import "./index.less";
import { useEffect } from "react";

type playListType = {
  dataSource: any[];
};

const audio = new Audio();

let index = 0;

function PlayList({ dataSource }: playListType) {
  const { store, dispatch } = useRedux();

  const { ing, play } = store;
  console.log(ing);

  useEffect(() => {
    if (!play) {
      return audio.pause();
    }
    if (!audio.src) {
      audio.src = ing.url;
    }

    audio.play();
  }, [play]);

  const getArtist = (data: any[]) => {
    return data
      .map((item) => item.name)
      .reduce((item, str) => {
        return `${item} / ${str}`;
      });
  };

  const onPlay = async (item: any, i) => {
    index = i;
    const res = await request.get("/song/url", { params: { id: item.id } });
    audio.src = res.data[0].url;

    dispatch({
      type: "CHANGE_ING",
      payload: { ...item, ...res.data[0] },
    });
    dispatch({ type: "CHANGE_PlAY", payload: true });
    audio.play();
    // audio.currentTime = 180;
    audio.onended = () => {
      index++;
      dispatch({
        type: "CHANGE_ING",
        payload: dataSource[index],
      });
      request
        .get("/song/url", { params: { id: dataSource[index].id } })
        .then((result: any) => {
          audio.src = result.data[0].url;
          dispatch({
            type: "CHANGE_ING",
            payload: {
              ...dataSource[index],
              ...result.data[0],
            },
          });
          audio.play();
          dispatch({ type: "CHANGE_PlAY", payload: true });
          // audio.currentTime = 240;
        });
    };
  };

  const playingBar = (
    <div className="voice-playing">
      <div
        className={classnames("play1", {
          "animation-stop": !play,
        })}
      ></div>
      <div
        className={classnames("play2", {
          "animation-stop": !play,
        })}
      ></div>
      <div
        className={classnames("play3", {
          "animation-stop": !play,
        })}
      ></div>
    </div>
  );

  const goActive = () => {
    const goElement = document.querySelector(".ing");
    goElement?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <>
      <List className="PlayList">
        {dataSource.map((item: any, i) => {
          return (
            <List.Item
              key={item.id}
              arrow={<span className="iconfont icon-androidgengduo"></span>}
              prefix={
                ing.id === item.id ? (
                  playingBar
                ) : (
                  <div
                    className={classnames({
                      index: i + 1 >= 4,
                      top: i + 1 < 4,
                    })}
                  >
                    {i + 1 < 10 ? `0${i + 1}` : i + 1}
                  </div>
                )
              }
              onClick={() => onPlay(item, i)}
            >
              <div className={classnames({ ing: ing.id === item.id })}>
                {item.name}
              </div>
              <div className="artists">
                {getArtist(item.ar)} - {item.al.name}
              </div>
            </List.Item>
          );
        })}
      </List>
      <span className="iconfont icon-dangqiandingwei" onClick={goActive}></span>
    </>
  );
}

export default PlayList;
