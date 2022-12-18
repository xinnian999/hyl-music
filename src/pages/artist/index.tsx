import { Banner, PlayList } from "@/components";
import { List } from "antd-mobile";
import { useMount } from "@/hooks";
import { request } from "@/utils";
import { useState } from "react";
import classnames from "classnames";
import "./index.less";

const audio = new Audio();

const DocsPage = () => {
  const [data, setData] = useState([]);
  useMount(() => {
    request
      .get("/playlist/detail", { params: { id: 3778678 } })
      .then((res: any) => {
        setData(res.playlist.tracks);
      });
  });

  const getArtist = (data) => {
    if (data.length < 2) return data[0].name;

    return data.reduce((item, str) => {
      return str.name + ` / ${item.name}`;
    });
  };

  const play = async (id: number) => {
    const res = await request.get("/song/url", { params: { id } });
    audio.src = res.data[0].url;
    audio.play();
  };

  return (
    <div id="hot">
      <Banner title="歌手" />
    </div>
  );
};

export default DocsPage;
