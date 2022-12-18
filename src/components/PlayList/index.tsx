import { List } from "antd-mobile";
import { request } from "@/utils";
import classnames from "classnames";
import "./index.less";
import { useState } from "react";

type playListType = {
  dataSource: any[];
};

const audio = new Audio();

let index = 0;

function PlayList({ dataSource }: playListType) {
  const [ingItem, setIngItem] = useState({ id: 0, name: "" });

  const getArtist = (data: any[]) => {
    if (data.length < 2) return data[0].name;

    return data.reduce((item, str) => {
      return str.name + ` / ${item.name}`;
    });
  };

  const play = async (item: any, i) => {
    index = i;
    setIngItem(item);
    const res = await request.get("/song/url", { params: { id: item.id } });
    audio.src = res.data[0].url;
    audio.play();
    audio.onended = () => {
      index++;
      setIngItem(dataSource[index]);

      request
        .get("/song/url", { params: { id: dataSource[index].id } })
        .then((result: any) => {
          audio.src = result.data[0].url;
          audio.play();
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
              ingItem.id === item.id ? (
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
            onClick={() => play(item, i)}
          >
            <div className={classnames({ ing: ingItem.id === item.id })}>
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
