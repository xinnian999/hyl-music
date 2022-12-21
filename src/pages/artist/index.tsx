import { Banner, PlayList } from "@/components";
import { useBoolean, useMount } from "@/hooks";
import { request } from "@/utils";
import { Avatar, List, NavBar } from "antd-mobile";
import { useState } from "react";

import "./index.less";

const DocsPage = () => {
  const [data, setData] = useState([]);
  const [itemData, setItemData] = useState([]);
  const [currentArtist, setCurrentArtist] = useState({ name: "" });

  const [flag, on, off] = useBoolean(false);

  useMount(() => {
    request("/toplist/artist").then((res) => {
      setData(res.list.artists);
    });
  });

  const goArtist = (item) => {
    setCurrentArtist(item);
    request("/artist/songs", { params: { id: item.id } }).then((res) => {
      setItemData(res.songs);
      on();
    });
  };

  return (
    <div id="artistList">
      <Banner title="歌手" />
      {!flag ? (
        <List>
          {data.map((item: any, i) => {
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
      ) : (
        <>
          <NavBar onBack={off}>{currentArtist.name}</NavBar>
          <PlayList dataSource={itemData} />
        </>
      )}
    </div>
  );
};

export default DocsPage;
