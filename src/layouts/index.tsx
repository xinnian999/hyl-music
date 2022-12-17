import { history, Outlet } from "umi";
import { Badge, TabBar } from "antd-mobile";
import {
  AppOutline,
  MessageOutline,
  MessageFill,
  UnorderedListOutline,
  UserOutline,
} from "antd-mobile-icons";
import styles from "./index.less";
import { useState } from "react";

const tabs = [
  {
    key: "/hot",
    title: "热门歌曲",
    icon: <AppOutline />,
  },
  {
    key: "/search",
    title: "搜索",
    icon: <UnorderedListOutline />,
  },
];

export default function Layout() {
  const [activeKey, setActiveKey] = useState("todo");

  return (
    <div>
      {/* <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/docs">Docs</Link>
        </li>
        <li>
          <a href="https://github.com/umijs/umi">Github</a>
        </li>
      </ul> */}
      <Outlet />

      <TabBar
        className={styles.navs}
        onChange={(key) => {
          history.push(key);
        }}
      >
        {tabs.map((item) => (
          <TabBar.Item key={item.key} icon={item.icon} title={item.title} />
        ))}
      </TabBar>
    </div>
  );
}
