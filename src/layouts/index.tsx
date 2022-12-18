import { history, Outlet, useLocation } from "umi";
import { TabBar } from "antd-mobile";
import "./index.less";
import { useState } from "react";

const tabs = [
  {
    key: "/hot",
    title: "热门",
  },
  {
    key: "/artist",
    title: "歌手",
  },
  {
    key: "/search",
    title: "搜索",
  },
];

export default function Layout() {
  const location = useLocation();
  const [activeKey, setActiveKey] = useState(location.pathname);

  return (
    <>
      <TabBar
        className="navs"
        activeKey={activeKey}
        onChange={(key) => {
          history.push(key);
          setActiveKey(key);
        }}
      >
        {tabs.map((item) => (
          <TabBar.Item key={item.key} title={item.title} />
        ))}
      </TabBar>
      <div className="main">
        <Outlet />
      </div>
    </>
  );
}
