import { List } from "antd-mobile";
import { request } from "@/utils";
import { useRedux } from "@/hooks";
import classnames from "classnames";
import "./index.less";
import { useEffect, useState } from "react";

type playListType = {
  dataSource: any[];
};

const audio = new Audio();

let index = 0;

function PlayList({ dataSource }: playListType) {
  const { store, dispatch } = useRedux();

  const { ing, play } = store;

  useEffect(() => {
    if (!play) return audio.pause();
    if (!audio.src) {
      audio.src = ing.src;
    }

    audio.play();
  }, [play]);

  const getArtist = (data: any[]) => {
    if (data.length < 2) return data[0].name;

    return data.reduce((item, str) => {
      return str.name + ` / ${item.name}`;
    });
  };

  const onPlay = async (item: any, i) => {
    index = i;
    dispatch({
      type: "CHANGE_ING",
      payload: { ...item, pic: item.al?.picUrl },
    });
    const res = await request.get("/song/url", { params: { id: item.id } });
    audio.src = res.data[0].url;
    dispatch({ type: "CHANGE_PlAY", payload: true });
    audio.play();
    // audio.currentTime = 180;
    audio.onended = () => {
      index++;
      dispatch({
        type: "CHANGE_ING",
        payload: { ...dataSource[index], pic: dataSource[index].al?.picUrl },
      });
      request
        .get("/song/url", { params: { id: dataSource[index].id } })
        .then((result: any) => {
          audio.src = result.data[0].url;
          dispatch({ type: "CHANGE_PlAY", payload: true });
          audio.play();
          // audio.currentTime = 240;
        });
    };
  };

  return (
    <List className="PlayList">
      {dataSource.map((item: any, i) => {
        return (
          <List.Item
            key={item.id}
            arrow={<span className="iconfont icon-androidgengduo"></span>}
            prefix={
              ing.id === item.id ? (
                <div className="voice-playing">
                  <div className="play1"></div>
                  <div className="play2"></div>
                  <div className="play3"></div>
                </div>
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
              {item.ar ? getArtist(item.ar) : getArtist(item.artists)} -{" "}
              {item.name}
            </div>
          </List.Item>
        );
      })}
    </List>
  );
}

export default PlayList;
