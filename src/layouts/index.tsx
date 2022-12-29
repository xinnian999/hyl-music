import { history, Outlet, useLocation } from "umi";
import { Provider } from "react-redux";
import { Button, TabBar } from "antd-mobile";
import { useEffect, useState } from "react";
import { store, persistor } from "@/store";
import { PersistGate } from "redux-persist/integration/react";
import { AudioBar } from "@/components";
import "animate.css";
import "./index.less";
import cookie from "js-cookie";

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

    //种植会员token
    if (!cookie.get("MUSIC_U")) {
      cookie.set(
        "MUSIC_U",
        "bd1ea5d40e983b3d8028bcff22f35610780b772014e079de7c5aec49dfbde313993166e004087dd394cae6c3eb6616fbf0faf199ca1046f30533926d55b6e50333aa127376130d47a0d2166338885bd7",
        { expires: 30 }
      );
    }
  }, [location.pathname]);

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
