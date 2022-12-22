import { Button, DotLoading, List, Popover } from "antd-mobile";
import { getArtist, httpTohttps, request, scrollIntoView } from "@/utils";
import { useRedux } from "@/hooks";
import classnames from "classnames";
import "./index.less";

type playListType = {
  dataSource: any[];
};

let index = 0;

function PlayList({ dataSource }: playListType) {
  const { store, dispatch } = useRedux();

  const { ing, play, audio } = store;

  const onPlay = async (item: any, i) => {
    index = i;
    const res = await request.get("/song/url", { params: { id: item.id } });
    const lrc = await request.get("/lyric", { params: { id: item.id } });
    audio.src = httpTohttps(res.data[0].url);

    dispatch({
      type: "CHANGE_ING",
      payload: { ...item, ...res.data[0], lrc: lrc.lrc.lyric },
    });
    dispatch({ type: "CHANGE_PlAY", payload: true });
    dispatch({ type: "CHANGE_CURRENTTIME", payload: 0 });
    dispatch({ type: "CHANGE_LIST", payload: dataSource });
    audio.play();
  };

  const downloadItem = async (item) => {
    const res = await request.get("/song/url", { params: { id: item.id } });

    fetch(httpTohttps(res.data[0].url)).then((res) =>
      res.blob().then((blob) => {
        let a = document.createElement("a");
        let url = window.URL.createObjectURL(blob);
        a.href = url;
        a.download = item.name;
        a.click();
        window.URL.revokeObjectURL(url);
      })
    );
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
  if (!dataSource.length)
    return <DotLoading color="primary" className="loading" />;
  return (
    <>
      <List className="PlayList">
        {dataSource.map((item: any, i) => {
          return (
            <List.Item
              key={item.id}
              arrow={
                <Popover
                  content={
                    <Button color="primary" onClick={() => downloadItem(item)}>
                      下载
                    </Button>
                  }
                  trigger="click"
                  placement="bottom"
                  stopPropagation={["click"]}
                >
                  <span
                    className="iconfont icon-androidgengduo"
                    onClick={(e) => e.stopPropagation()}
                  ></span>
                </Popover>
              }
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
      <span
        className="iconfont icon-dangqiandingwei"
        onClick={() => scrollIntoView(".ing")}
      ></span>
    </>
  );
}

export default PlayList;
