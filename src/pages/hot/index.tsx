import { Banner, PlayList } from "@/components";
import { useMount } from "@/hooks";
import { request } from "@/utils";
import { useState } from "react";
import "./index.less";

const DocsPage = () => {
  const [data, setData] = useState([]);

  useMount(() => {
    request
      .get("/playlist/detail", { params: { id: 3778678 } })
      .then((res: any) => {
        setData(res.playlist.tracks);
      });
  });

  return (
    <div id="hot">
      <Banner title="热门歌曲" />
      <PlayList dataSource={data} />
    </div>
  );
};

export default DocsPage;
