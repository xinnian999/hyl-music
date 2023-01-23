import { Button, DotLoading, List, Popover, Space, Toast } from "antd-mobile";
import { getArtist, httpTohttps, request, scrollIntoView } from "@/utils";
import { useRedux } from "@/hooks";
import classnames from "classnames";
import { copy, Url } from "hyl-utils";
import "./index.less";

type playListType = {
  dataSource: any[];
};

// console.log(
//   Url.getParams("https://hyl999.co:85/hot?playId=1974443814&audio=0")
// );

function PlayList({ dataSource }: playListType) {
  const { store, dispatchAll } = useRedux();

  const { ing, play, audio } = store;

  const onPlay = async (item: any) => {
    const res = await request.get("/song/url", { params: { id: item.id } });
    const lrc = await request.get("/lyric", { params: { id: item.id } });
    audio.src = httpTohttps(res.data[0].url);

    dispatchAll([
      {
        type: "CHANGE_ING",
        payload: { ...item, ...res.data[0], lrc: lrc.lrc.lyric },
      },
      { type: "CHANGE_PlAY", payload: true },
      { type: "CHANGE_CURRENTTIME", payload: 0 },
      { type: "CHANGE_LIST", payload: dataSource },
    ]);
  };

  const downloadItem = async (item) => {
    const res = await request.get("/song/url", { params: { id: item.id } });
    Toast.show({
      content: "下载中，请稍后在下载列表查看",
    });
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

  const share = (item) => {
    Toast.show({
      content: "已复制分享链接到剪切板",
      afterClose: () => {},
    });
    // copy(`https://hyl999.co:85/hot?playId=${item.id}&audio=0`);
    copy(
      `https://hyl999.co:85/hot?${Url.spliceParams({
        playId: item.id,
        audio: 0,
      })}`
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
                    <Space direction="vertical">
                      <Button
                        color="primary"
                        onClick={() => downloadItem(item)}
                      >
                        下载
                      </Button>
                      <Button color="primary" onClick={() => share(item)}>
                        分享
                      </Button>
                    </Space>
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
