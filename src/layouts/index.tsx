import { history, Outlet, useLocation } from "umi";
import { Provider } from "react-redux";
import { Button, TabBar } from "antd-mobile";
import { useEffect, useState } from "react";
import { store, persistor } from "@/store";
import { PersistGate } from "redux-persist/integration/react";
import { AudioBar } from "@/components";
import "animate.css";
import "./index.less";
import { cookie, ajax } from "hyl-utils";
import axios from "axios";
import { useMount } from "@/hooks";

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

  useEffect(() => {
    setActiveKey(location.pathname);
  }, [location.pathname]);

  useMount(() => {
    ajax.get("/hyl/globalConfig.json").then((res) => {
      cookie.set("MUSIC_U", res.response["wyy-vip"], { expires: 8640000 });
    });
  });

  return (
    <>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <TabBar
            className="navs"
            activeKey={activeKey}
            onChange={(key) => {
              history.push(key);
            }}
          >
            {tabs.map((item) => (
              <TabBar.Item key={item.key} title={item.title} />
            ))}
          </TabBar>

          <div className="main">
            <Outlet />
          </div>

          <AudioBar />
        </PersistGate>
      </Provider>
    </>
  );
}
