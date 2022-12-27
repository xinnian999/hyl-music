import { Banner, PlayList } from "@/components";
import { useBoolean, useMount } from "@/hooks";
import { request,scrollIntoView } from "@/utils";
import { Avatar, List, DotLoading, NavBar } from "antd-mobile";
import classNames from "classnames";
import {  useEffect, useState } from "react";

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
    on();
    window.scrollTo(0, 0)
    setCurrentArtist(item);
    setItemData([]);
    request("/artist/top/song", { params: { id: item.id } }).then((res) => {
      setItemData(res.songs);
    });
  };

  useEffect(()=>{
    if(!flag&&currentArtist.name) scrollIntoView(`.${currentArtist.name}`)
  },[flag])


  return (
    <div id="artistList">
      {!flag ? (
        <>
          <Banner title="歌手" />
          {data.length?<List>
            {data.map((item: any) => {
              return (
                <List.Item key={item.id} onClick={() => goArtist(item)} >
                  <div className={classNames("artist-item",item.name,{'artist-item-old':item.name===currentArtist.name}) }>
                    <Avatar src={item.img1v1Url} className="artist-avatar" />
                    <div>{item.name}</div>
                  </div>
                </List.Item>
              );
            })}
          </List>:<DotLoading color="primary" className="loading"/>}
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
