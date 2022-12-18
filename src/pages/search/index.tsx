import { request, debounce } from "@/utils";
import { List, SearchBar } from "antd-mobile";
import { useCallback, useEffect, useRef, useState } from "react";
import { PlayList } from "@/components";
import { SearchOutline, ClockCircleFill } from "antd-mobile-icons";
import "./index.less";

let historySearch: any[] = [];

export default function Search() {
  const [data, setData] = useState([]);
  const [suggestdata, setSuggestdata] = useState([]);
  const [hotSearch, setHotSearch] = useState([]);
  const [flag, setFlag] = useState(1);
  const [value, setValue] = useState("");

  const keywords = useRef("");

  useEffect(() => {
    request.get("/search/hot").then((res: any) => {
      setHotSearch(res.result.hots);
    });

    const history = localStorage.getItem("historySearch");
    if (history) {
      historySearch = JSON.parse(history);
    }
  }, []);

  const getSuggest = useCallback(
    debounce(() => {
      request
        .get("/search/suggest", {
          params: { keywords: keywords.current, type: "mobile" },
        })
        .then((res: any) => {
          if (res.code === 200 && res.result?.allMatch) {
            setSuggestdata(res.result.allMatch);
          } else {
            setSuggestdata([]);
          }
        });
    }, 500),
    []
  );

  const onChange = (val: string) => {
    setValue(val);
    if (!val) return setFlag(1);

    setFlag(2);
    keywords.current = val;
    getSuggest();
  };

  const onSearch = () => {
    if (!keywords.current) return setFlag(1);
    request
      .get("/cloudsearch", { params: { keywords: keywords.current } })
      .then((res: any) => {
        if (res.code === 200) {
          setFlag(3);
          setData(res.result.songs);
          historySearch = historySearch.concat([keywords.current]);
          localStorage.setItem("historySearch", JSON.stringify(historySearch));
        }
      });
  };

  const onClear = () => {
    setFlag(1);
  };

  return (
    <div>
      <div className="searchBox">
        <SearchBar
          placeholder="搜索歌曲、歌手、专辑"
          onChange={onChange}
          onSearch={onSearch}
          value={value}
          onClear={onClear}
        />
      </div>
      {flag === 1 && (
        <>
          <div className="hotSearch">
            <div>热门搜索</div>
            <div className="hotSearch-main">
              {hotSearch.map((item: any) => {
                return (
                  <div
                    className="hotSearch-item"
                    key={item.first}
                    onClick={() => {
                      keywords.current = item.first;
                      onSearch();
                      setValue(item.first);
                    }}
                  >
                    {item.first}
                  </div>
                );
              })}
            </div>
          </div>
          <List>
            {[...new Set(historySearch)].reverse().map((item: any) => {
              return (
                <List.Item
                  key={item}
                  prefix={<ClockCircleFill />}
                  onClick={() => {
                    keywords.current = item;
                    onSearch();
                    setValue(item);
                  }}
                >
                  {item}
                </List.Item>
              );
            })}
          </List>
        </>
      )}
      {flag === 2 && (
        <List header={`搜索“${value}”`}>
          {suggestdata.map((item: any) => {
            return (
              <List.Item
                prefix={<SearchOutline />}
                onClick={() => {
                  keywords.current = item.keyword;
                  onSearch();
                  setValue(item.keyword);
                }}
              >
                {item.keyword}
              </List.Item>
            );
          })}
        </List>
      )}
      {flag === 3 && <PlayList dataSource={data} />}
    </div>
  );
}
