import { createStore } from "redux";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { pick } from "lodash";

export type isStore = {
  ing: any;
  play: boolean;
  audio: HTMLAudioElement;
};

//在localStorge中生成key为root的值
const persistConfig = {
  key: "root",
  storage,
  blacklist: ["play"], //设置某个reducer数据不持久化，
};

const reducer = (
  state: isStore = {
    ing: { id: 0, name: "", ar: [], pic: "" },
    play: false,
    audio: new Audio(),
  },
  { type, payload }: any
) => {
  switch (type) {
    case "CHANGE_ING":
      return {
        ...state,
        ing: pick(payload, ["id", "name", "url", "al", "ar", "time"]),
      };
    case "CHANGE_PlAY":
      return { ...state, play: payload };
    case "CHANGE_AUDIO":
      return { ...state, audio: payload };
    default:
      return state;
  }
};

const myPersistReducer = persistReducer(persistConfig, reducer);

const store = createStore(myPersistReducer);

const persistor = persistStore(store);

export { store, persistor };
