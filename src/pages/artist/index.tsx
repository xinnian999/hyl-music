import { Banner, PlayList } from "@/components";
import { useBoolean, useMount } from "@/hooks";
import { request } from "@/utils";
import { Avatar, List, NavBar } from "antd-mobile";
import { useState } from "react";

import "./index.less";

const DocsPage = () => {
  const [data, setData] = useState([]);
  const [itemData, setItemData] = useState([]);
  const [currentArtist, setCurrentArtist] = useState({
    name: "",
    picUrl: "",
  });

  const [flag, on, off] = useBoolean(false);

  useMount(() => {
    request("/toplist/artist").then((res) => {
      setData(res.list.artists);
    });
  });

  const goArtist = (item) => {
    setCurrentArtist(item);
    request("/artist/top/song", { params: { id: item.id } }).then((res) => {
      setItemData(res.songs);
      on();
      window.scrollTo(0, 0);
    });
  };

  return (
    <div id="artistList">
      {!flag ? (
        <>
          <Banner title="歌手" />
          <List>
            {data.map((item: any) => {
              return (
                <List.Item key={item.id} onClick={() => goArtist(item)}>
                  <div className="artist-item">
                    <Avatar src={item.img1v1Url} className="artist-avatar" />
                    <div>{item.name}</div>
                  </div>
                </List.Item>
              );
            })}
          </List>
        </>
      ) : (
        <>
          <div
            className="artist-banner"
            style={{ backgroundImage: `url(${currentArtist.picUrl})` }}
          ></div>
          <NavBar onBack={off}>{currentArtist.name}</NavBar>

          <PlayList dataSource={itemData} />
        </>
      )}
    </div>
  );
};

export default DocsPage;
