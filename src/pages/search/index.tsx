import { request } from "@/utils";
import { SearchBar } from "antd-mobile";
import { useState } from "react";
import { PlayList } from "@/components";
import "./index.less";

export default function Search() {
  const [data, setData] = useState([]);
  const [keywords, setKeywords] = useState("");

  const onChange = (val: string) => {
    setKeywords(val);
  };

  const onSearch = () => {
    request.get("/cloudsearch", { params: { keywords } }).then((res: any) => {
      setData(res.result.songs);
    });
  };

  return (
    <div>
      <div className="searchBox">
        <SearchBar
          placeholder="搜索歌曲、歌手、专辑"
          onChange={onChange}
          onSearch={onSearch}
        />
      </div>

      <PlayList dataSource={data} />
    </div>
  );
}
